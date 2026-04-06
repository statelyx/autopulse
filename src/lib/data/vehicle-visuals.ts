import type { CatalogVehicle } from './catalog';

export const VISUAL_PRESETS = [
  { id: 'front', title: 'Ön Tasarım', suffix: 'front exterior', accent: 'from-amber-500/20 via-orange-500/10 to-transparent' },
  { id: 'rear', title: 'Arka Tasarım', suffix: 'rear exterior', accent: 'from-sky-500/20 via-cyan-500/10 to-transparent' },
  { id: 'interior', title: 'İç Mekan', suffix: 'interior cockpit', accent: 'from-emerald-500/20 via-lime-500/10 to-transparent' },
  { id: 'detail', title: 'Detaylar', suffix: 'wheel headlights detail', accent: 'from-fuchsia-500/20 via-rose-500/10 to-transparent' },
] as const;

export type VehicleVisualId = (typeof VISUAL_PRESETS)[number]['id'];

export type VehicleImageQueryInput = Pick<CatalogVehicle, 'brand' | 'model' | 'year'> & {
  packageName?: string;
};

export type VehicleVisualReference = {
  id: VehicleVisualId;
  title: string;
  query: string;
  href: string;
  accent: string;
};

function joinQueryParts(parts: Array<string | number | null | undefined>) {
  return parts
    .map((part) => String(part ?? '').trim())
    .filter(Boolean)
    .join(' ');
}

export function inferVehiclePackageName(model: string) {
  const normalizedModel = model.trim();
  if (!normalizedModel) return undefined;

  const separators = [' Launch Edition', ' Performance', ' Competition', ' Premium', ' AMG', ' M Sport', ' GT', ' RS'];
  const matchedSeparator = separators.find((separator) => normalizedModel.includes(separator));

  if (!matchedSeparator) {
    return undefined;
  }

  return normalizedModel.slice(normalizedModel.indexOf(matchedSeparator)).trim();
}

export function buildVehicleVisualQuery(
  vehicle: VehicleImageQueryInput,
  visualId: VehicleVisualId,
) {
  const preset = VISUAL_PRESETS.find((item) => item.id === visualId);
  if (!preset) {
    return joinQueryParts([vehicle.brand, vehicle.model, vehicle.year]);
  }

  return joinQueryParts([vehicle.brand, vehicle.model, vehicle.year, vehicle.packageName, preset.suffix]);
}

export function buildVehicleVisualQueries(
  vehicle: VehicleImageQueryInput,
  visualId: VehicleVisualId,
) {
  const preset = VISUAL_PRESETS.find((item) => item.id === visualId);
  if (!preset) {
    return [joinQueryParts([vehicle.brand, vehicle.model, vehicle.year, vehicle.packageName])];
  }

  const compactModel = vehicle.model.replace(/\s+/g, ' ').trim();
  const packageName = vehicle.packageName?.trim();
  const altSuffix =
    visualId === 'detail'
      ? 'headlights wheels close up'
      : visualId === 'interior'
        ? 'interior dashboard cabin'
        : `${preset.suffix} photo`;

  return Array.from(
    new Set(
      [
        joinQueryParts([vehicle.brand, compactModel, vehicle.year, packageName, preset.suffix]),
        joinQueryParts([vehicle.brand, compactModel, packageName, preset.suffix]),
        joinQueryParts([vehicle.brand, compactModel, vehicle.year, altSuffix]),
        joinQueryParts([vehicle.brand, compactModel, preset.suffix]),
      ].filter(Boolean),
    ),
  );
}

export function buildVehicleVisualReferences(vehicle: VehicleImageQueryInput): VehicleVisualReference[] {
  return VISUAL_PRESETS.map((preset) => {
    const query = buildVehicleVisualQuery(vehicle, preset.id);

    return {
      id: preset.id,
      title: preset.title,
      query,
      href: `https://www.google.com/search?tbm=isch&q=${encodeURIComponent(query)}`,
      accent: preset.accent,
    };
  });
}
