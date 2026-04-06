import { buildVehicleVisualQueries, type VehicleVisualId } from '@/lib/data/vehicle-visuals';

type VehicleImageProvider = 'wikimedia' | 'openverse' | 'serpapi' | 'fallback';

type ResolveVehicleImageInput = {
  brand: string;
  model: string;
  year: number;
  packageName?: string;
  visualId: VehicleVisualId;
};

export type ResolvedVehicleImage = {
  id: VehicleVisualId;
  imageUrl: string | null;
  sourcePageUrl: string | null;
  provider: VehicleImageProvider;
  query: string;
};

type ImageCandidate = {
  imageUrl: string;
  sourcePageUrl?: string;
  title?: string;
  width?: number;
  height?: number;
  provider: Exclude<VehicleImageProvider, 'fallback'>;
  query: string;
};

type CandidateScoreInput = {
  brand: string;
  model: string;
  year: number;
  visualId: VehicleVisualId;
  provider: Exclude<VehicleImageProvider, 'fallback'>;
};

const NEGATIVE_TERMS = [
  'logo',
  'badge',
  'emblem',
  'icon',
  'vector',
  'svg',
  'transparent',
  'wallpaper',
  'dealership',
  'brochure',
  'render',
  'concept',
  'lego',
  'toy',
];

const DETAIL_TOKEN_BOOST: Record<VehicleVisualId, string[]> = {
  front: ['front', 'exterior', 'fascia', 'grille'],
  rear: ['rear', 'back', 'taillight', 'exterior'],
  interior: ['interior', 'cockpit', 'dashboard', 'cabin'],
  detail: ['detail', 'wheel', 'headlight', 'close', 'grille'],
};

async function fetchJson<T>(url: string, init?: RequestInit): Promise<T | null> {
  try {
    const response = await fetch(url, {
      ...init,
      signal: AbortSignal.timeout(9000),
      next: { revalidate: 60 * 60 * 12 },
    });

    if (!response.ok) {
      return null;
    }

    return (await response.json()) as T;
  } catch {
    return null;
  }
}

function isUsableImageUrl(url: string | undefined | null) {
  if (!url) return false;
  if (!/^https?:\/\//i.test(url)) return false;
  return !url.endsWith('.svg');
}

function normalizeText(value: string | undefined) {
  return (value ?? '').toLowerCase();
}

function extractNormalizedTokens(value: string) {
  return normalizeText(value)
    .split(/[^a-z0-9]+/g)
    .map((token) => token.trim())
    .filter((token) => token.length > 1);
}

function scoreCandidate(candidate: ImageCandidate, query: string, input: CandidateScoreInput) {
  const haystack = normalizeText(
    [candidate.title, candidate.sourcePageUrl, candidate.imageUrl, query].filter(Boolean).join(' '),
  );
  const queryTokens = extractNormalizedTokens(query);
  const brandTokens = extractNormalizedTokens(input.brand);
  const modelTokens = extractNormalizedTokens(input.model).filter((token) => !['series', 'class'].includes(token));

  let score = 0;

  for (const token of queryTokens) {
    if (haystack.includes(token)) {
      score += 4;
    }
  }

  for (const negativeTerm of NEGATIVE_TERMS) {
    if (haystack.includes(negativeTerm)) {
      score -= 12;
    }
  }

  for (const slotToken of DETAIL_TOKEN_BOOST[input.visualId]) {
    if (haystack.includes(slotToken)) {
      score += 7;
    }
  }

  if (!brandTokens.every((token) => haystack.includes(token))) {
    score -= 30;
  } else {
    score += 10;
  }

  if (modelTokens.length > 0) {
    const matchedModelTokens = modelTokens.filter((token) => haystack.includes(token)).length;
    if (matchedModelTokens === 0) {
      score -= 35;
    } else {
      score += matchedModelTokens * 8;
    }
  }

  const yearMatches = Array.from(haystack.matchAll(/\b(19|20)\d{2}\b/g)).map((match) => Number(match[0]));
  if (yearMatches.length > 0) {
    if (yearMatches.includes(input.year)) {
      score += 16;
    } else {
      const nearestYearDistance = Math.min(...yearMatches.map((year) => Math.abs(year - input.year)));
      score -= nearestYearDistance >= 3 ? 18 : 6;
    }
  } else if (input.year >= new Date().getFullYear() - 1 && input.provider !== 'serpapi') {
    score -= 10;
  }

  if ((candidate.width ?? 0) >= 1200 || (candidate.height ?? 0) >= 900) {
    score += 8;
  }

  if ((candidate.width ?? 0) >= 800 || (candidate.height ?? 0) >= 600) {
    score += 4;
  }

  return score;
}

function pickBestCandidate(
  candidates: ImageCandidate[],
  queries: string[],
  input: CandidateScoreInput,
) {
  const scored = candidates
    .filter((candidate) => isUsableImageUrl(candidate.imageUrl))
    .map((candidate) => ({
      candidate,
      score: Math.max(...queries.map((query) => scoreCandidate(candidate, query, input))),
    }))
    .sort((left, right) => right.score - left.score);

  const best = scored[0];
  const minimumScore = input.provider === 'serpapi' ? 14 : 24;
  if (!best || best.score < minimumScore) {
    return null;
  }

  return best.candidate;
}

type WikimediaResponse = {
  query?: {
    pages?: Record<
      string,
      {
        title?: string;
        imageinfo?: Array<{
          url?: string;
          descriptionurl?: string;
          width?: number;
          height?: number;
        }>;
      }
    >;
  };
};

async function searchWikimedia(query: string, input: Omit<CandidateScoreInput, 'provider'>) {
  const url = new URL('https://commons.wikimedia.org/w/api.php');
  url.searchParams.set('action', 'query');
  url.searchParams.set('format', 'json');
  url.searchParams.set('origin', '*');
  url.searchParams.set('generator', 'search');
  url.searchParams.set('gsrnamespace', '6');
  url.searchParams.set('gsrsearch', query);
  url.searchParams.set('gsrlimit', '8');
  url.searchParams.set('prop', 'imageinfo');
  url.searchParams.set('iiprop', 'url|size');

  const data = await fetchJson<WikimediaResponse>(url.toString(), {
    headers: {
      'User-Agent': 'AutoPulse/1.0 vehicle image resolver',
    },
  });

  const pages = Object.values(data?.query?.pages ?? {});
  const candidates: ImageCandidate[] = [];
  for (const page of pages) {
    const image = page.imageinfo?.[0];
    if (!image?.url) continue;

    candidates.push({
        imageUrl: image.url,
        sourcePageUrl: image.descriptionurl,
        title: page.title,
        width: image.width,
        height: image.height,
        provider: 'wikimedia' as const,
        query,
      });
  }

  return pickBestCandidate(candidates, [query], { ...input, provider: 'wikimedia' });
}

type OpenverseResponse = {
  results?: Array<{
    title?: string;
    url?: string;
    foreign_landing_url?: string;
    width?: number;
    height?: number;
  }>;
};

async function searchOpenverse(query: string, input: Omit<CandidateScoreInput, 'provider'>) {
  const url = new URL('https://api.openverse.org/v1/images/');
  url.searchParams.set('q', query);
  url.searchParams.set('page_size', '8');
  url.searchParams.set('license_type', 'commercial');

  const data = await fetchJson<OpenverseResponse>(url.toString(), {
    headers: {
      'User-Agent': 'AutoPulse/1.0 vehicle image resolver',
    },
  });

  const candidates: ImageCandidate[] = [];
  for (const item of data?.results ?? []) {
    if (!item.url) continue;

    candidates.push({
        imageUrl: item.url,
        sourcePageUrl: item.foreign_landing_url,
        title: item.title,
        width: item.width,
        height: item.height,
        provider: 'openverse' as const,
        query,
      });
  }

  return pickBestCandidate(candidates, [query], { ...input, provider: 'openverse' });
}

type SerpApiResponse = {
  images_results?: Array<{
    original?: string;
    thumbnail?: string;
    title?: string;
    link?: string;
    source?: string;
    original_width?: number;
    original_height?: number;
  }>;
};

async function searchSerpApi(query: string, input: Omit<CandidateScoreInput, 'provider'>) {
  const apiKey = process.env.SERPAPI_KEY;
  if (!apiKey) {
    return null;
  }

  const url = new URL('https://serpapi.com/search.json');
  url.searchParams.set('engine', 'google_images');
  url.searchParams.set('q', query);
  url.searchParams.set('api_key', apiKey);
  url.searchParams.set('safe', 'active');
  url.searchParams.set('ijn', '0');

  const data = await fetchJson<SerpApiResponse>(url.toString(), {
    headers: {
      'User-Agent': 'AutoPulse/1.0 vehicle image resolver',
    },
  });

  const candidates: ImageCandidate[] = [];
  for (const item of data?.images_results ?? []) {
    const imageUrl = item.original ?? item.thumbnail;
    if (!imageUrl) continue;

    candidates.push({
        imageUrl,
        sourcePageUrl: item.link,
        title: [item.title, item.source].filter(Boolean).join(' '),
        width: item.original_width,
        height: item.original_height,
        provider: 'serpapi' as const,
        query,
      });
  }

  return pickBestCandidate(candidates, [query], { ...input, provider: 'serpapi' });
}

export async function resolveVehicleImage(input: ResolveVehicleImageInput): Promise<ResolvedVehicleImage> {
  const queries = buildVehicleVisualQueries(
    {
      brand: input.brand,
      model: input.model,
      year: input.year,
      packageName: input.packageName,
    },
    input.visualId,
  );

  for (const query of queries) {
    const wikimediaCandidate = await searchWikimedia(query, input);
    if (wikimediaCandidate) {
      return {
        id: input.visualId,
        imageUrl: wikimediaCandidate.imageUrl,
        sourcePageUrl: wikimediaCandidate.sourcePageUrl ?? null,
        provider: wikimediaCandidate.provider,
        query,
      };
    }
  }

  for (const query of queries) {
    const openverseCandidate = await searchOpenverse(query, input);
    if (openverseCandidate) {
      return {
        id: input.visualId,
        imageUrl: openverseCandidate.imageUrl,
        sourcePageUrl: openverseCandidate.sourcePageUrl ?? null,
        provider: openverseCandidate.provider,
        query,
      };
    }
  }

  for (const query of queries) {
    const serpApiCandidate = await searchSerpApi(query, input);
    if (serpApiCandidate) {
      return {
        id: input.visualId,
        imageUrl: serpApiCandidate.imageUrl,
        sourcePageUrl: serpApiCandidate.sourcePageUrl ?? null,
        provider: serpApiCandidate.provider,
        query,
      };
    }
  }

  return {
    id: input.visualId,
    imageUrl: null,
    sourcePageUrl: null,
    provider: 'fallback',
    query: queries[0] ?? `${input.brand} ${input.model} ${input.year}`,
  };
}
