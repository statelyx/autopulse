import type { CatalogVehicle } from './catalog';

export type VehicleVisualReference = {
  id: string;
  title: string;
  query: string;
  href: string;
  accent: string;
};

const VISUAL_PRESETS = [
  { id: 'front', title: 'Ön Tasarım', suffix: 'front exterior', accent: 'from-amber-500/20 via-orange-500/10 to-transparent' },
  { id: 'rear', title: 'Arka Tasarım', suffix: 'rear exterior', accent: 'from-sky-500/20 via-cyan-500/10 to-transparent' },
  { id: 'interior', title: 'İç Mekan', suffix: 'interior cockpit', accent: 'from-emerald-500/20 via-lime-500/10 to-transparent' },
  { id: 'detail', title: 'Detaylar', suffix: 'wheel headlights detail', accent: 'from-fuchsia-500/20 via-rose-500/10 to-transparent' },
] as const;

export function buildVehicleVisualReferences(vehicle: Pick<CatalogVehicle, 'brand' | 'model' | 'year'>): VehicleVisualReference[] {
  return VISUAL_PRESETS.map((preset) => {
    const query = `${vehicle.brand} ${vehicle.model} ${vehicle.year} ${preset.suffix}`;

    return {
      id: preset.id,
      title: preset.title,
      query,
      href: `https://www.google.com/search?tbm=isch&q=${encodeURIComponent(query)}`,
      accent: preset.accent,
    };
  });
}
