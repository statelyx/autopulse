import { NextRequest, NextResponse } from 'next/server';

import { aiService } from '@/lib/ai';
import { buildFallbackIssueCandidates, getCatalogData } from '@/lib/data/catalog';

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => ({}));
  const query = String(body?.query ?? '').trim();
  const limit = Math.max(1, Math.min(Number(body?.limit ?? 6), 8));

  const { vehicles } = await getCatalogData({
    q: query || undefined,
    limit: limit + 4,
  });

  const candidates = buildFallbackIssueCandidates(vehicles).slice(0, limit);
  const analyses = await Promise.all(
    candidates.map(async (candidate) => {
      const analysis = await aiService.analyzeIssue({
        title: candidate.title,
        description: candidate.description,
        category: candidate.category,
      });

      return {
        ...candidate,
        analysis,
      };
    }),
  );

  return NextResponse.json({
    issues: analyses,
    source: aiService.isConfigured() ? 'huggingface+catalog' : 'catalog-fallback',
  });
}
