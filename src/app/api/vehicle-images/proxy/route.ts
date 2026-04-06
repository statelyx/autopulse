import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const rawUrl = request.nextUrl.searchParams.get('url');
  if (!rawUrl) {
    return new NextResponse('Missing url', { status: 400 });
  }

  let targetUrl: URL;
  try {
    targetUrl = new URL(rawUrl);
  } catch {
    return new NextResponse('Invalid url', { status: 400 });
  }

  if (!['http:', 'https:'].includes(targetUrl.protocol)) {
    return new NextResponse('Unsupported protocol', { status: 400 });
  }

  try {
    const upstream = await fetch(targetUrl.toString(), {
      headers: {
        'User-Agent': 'AutoPulse/1.0 vehicle image proxy',
        Accept: 'image/*,*/*;q=0.8',
      },
      signal: AbortSignal.timeout(12000),
      next: { revalidate: 60 * 60 * 12 },
    });

    if (!upstream.ok) {
      return new NextResponse('Upstream fetch failed', { status: 502 });
    }

    const contentType = upstream.headers.get('content-type') ?? 'application/octet-stream';
    if (!contentType.startsWith('image/')) {
      return new NextResponse('Upstream is not an image', { status: 415 });
    }

    const body = await upstream.arrayBuffer();

    return new NextResponse(body, {
      status: 200,
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, s-maxage=43200, stale-while-revalidate=86400',
      },
    });
  } catch {
    return new NextResponse('Proxy fetch failed', { status: 502 });
  }
}
