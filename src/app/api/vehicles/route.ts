import { NextRequest, NextResponse } from 'next/server';

import { getCatalogData, getVehicleById } from '@/lib/data/catalog';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id') ?? undefined;
  const brand = searchParams.get('brand') ?? undefined;
  const model = searchParams.get('model') ?? undefined;
  const q = searchParams.get('q') ?? undefined;
  const yearParam = searchParams.get('year');
  const limitParam = searchParams.get('limit');
  const year = yearParam ? Number(yearParam) : undefined;
  const limit = limitParam ? Number(limitParam) : undefined;

  if (id) {
    const vehicle = await getVehicleById(id);

    if (!vehicle) {
      return NextResponse.json(
        { error: 'Araç bulunamadı.' },
        { status: 404 },
      );
    }

    return NextResponse.json({
      vehicle,
      source: 'catalog',
    });
  }

  const data = await getCatalogData({
    brand,
    model,
    q,
    year: Number.isFinite(year) ? year : undefined,
    limit: Number.isFinite(limit) ? limit : undefined,
  });

  return NextResponse.json(data);
}
