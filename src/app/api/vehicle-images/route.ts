import { NextRequest, NextResponse } from 'next/server';

import { resolveVehicleImage } from '@/lib/server/vehicle-image-service';
import { VISUAL_PRESETS, inferVehiclePackageName, type VehicleVisualId } from '@/lib/data/vehicle-visuals';

type VehicleImagesRequestBody = {
  brand?: string;
  model?: string;
  year?: number;
  packageName?: string;
  visualIds?: VehicleVisualId[];
};

export async function POST(request: NextRequest) {
  const body = (await request.json().catch(() => ({}))) as VehicleImagesRequestBody;
  const brand = String(body.brand ?? '').trim();
  const model = String(body.model ?? '').trim();
  const year = Number(body.year);
  const packageName = String(body.packageName ?? '').trim() || inferVehiclePackageName(model);

  if (!brand || !model || !Number.isFinite(year)) {
    return NextResponse.json({ error: 'Invalid vehicle image payload' }, { status: 400 });
  }

  const allowedVisualIds = new Set(VISUAL_PRESETS.map((preset) => preset.id));
  const visualIds = (Array.isArray(body.visualIds) ? body.visualIds : VISUAL_PRESETS.map((preset) => preset.id)).filter(
    (visualId): visualId is VehicleVisualId => allowedVisualIds.has(visualId),
  );

  const images = await Promise.all(
    visualIds.map((visualId) =>
      resolveVehicleImage({
        brand,
        model,
        year,
        packageName,
        visualId,
      }),
    ),
  );

  return NextResponse.json({
    images,
    packageName: packageName || null,
  });
}
