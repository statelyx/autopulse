import { NextRequest, NextResponse } from 'next/server';

import { HuggingFaceProvider } from '@/lib/ai/providers/huggingface';
import { buildCatalogSummary, getCatalogData } from '@/lib/data/catalog';
import { formatTryPrice } from '@/lib/formatters/currency';

function buildFallbackSummary(query: string, vehicles: Awaited<ReturnType<typeof getCatalogData>>['vehicles']) {
  const summary = buildCatalogSummary(vehicles);
  const topVehicles = vehicles
    .slice(0, 3)
    .map((vehicle) => `${vehicle.brand} ${vehicle.model} ${vehicle.year}`)
    .join(', ');

  return {
    summaryText: `${query || 'Katalog'} için ${vehicles.length} araç eşleşti. Elektrikli oranı ${summary.electricCount}, performans odağı ${summary.performanceCount}, SUV yoğunluğu ${summary.suvCount}. Öne çıkan araçlar: ${topVehicles || 'eşleşme bulunamadı'}.`,
    insights: [
      `${summary.electricCount} araç elektrikli altyapı ile listeleniyor.`,
      `${summary.performanceCount} araç 450 hp ve üzeri performans bandında.`,
      `${summary.premiumCount} araç premium marka kümesinde yer alıyor.`,
    ],
    recommendations: vehicles.length > 0
      ? [
          'Karşılaştırma modunda ilk 3 aracı yan yana değerlendir.',
          'VIN sorgusuyla gerçek araç eşleşmesini doğrula.',
          'Fiyat ve güven skorlarını birlikte incele.',
        ]
      : [
          'Daha geniş bir marka veya model adıyla tekrar dene.',
          'Tür filtrelerini kaldırarak kataloğu genişlet.',
        ],
  };
}

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => ({}));
  const query = String(body?.query ?? '').trim();
  const vehicleIds = Array.isArray(body?.vehicleIds) ? body.vehicleIds.map(String) : [];

  const catalog = await getCatalogData({
    limit: 180,
  });

  const queryMatchedVehicles = query
    ? catalog.vehicles.filter((vehicle) => {
        const haystack = `${vehicle.brand} ${vehicle.model} ${vehicle.segment} ${vehicle.fuelType}`.toLowerCase();
        return haystack.includes(query.toLowerCase());
      })
    : catalog.vehicles;

  const selectedVehicles = vehicleIds.length > 0
    ? catalog.vehicles.filter((vehicle) => vehicleIds.includes(vehicle.id))
    : [];

  const vehicles = selectedVehicles.length > 0
    ? selectedVehicles
    : queryMatchedVehicles.slice(0, 24);
  const fallback = buildFallbackSummary(query, vehicles);

  const provider = new HuggingFaceProvider();
  let summaryText = fallback.summaryText;

  try {
    const prompt = [
      `Sorgu: ${query || 'Genel katalog özeti'}`,
      `Araçlar: ${vehicles.slice(0, 10).map((vehicle) => `${vehicle.brand} ${vehicle.model} ${vehicle.year}, ${vehicle.fuelType}, ${formatTryPrice(vehicle.price)}`).join(' | ')}`,
      'Görev: kısa, Türkçe ve net bir otomotiv analizi özeti üret.',
    ].join('\n');

    summaryText = await provider.generateChatCompletion([
      {
        role: 'system',
        content: 'Sen kısa ve net Türkçe otomotiv özetleri üreten bir asistansın. Promptu tekrar etme.',
      },
      {
        role: 'user',
        content: prompt,
      },
    ]);
  } catch {
    summaryText = fallback.summaryText;
  }

  return NextResponse.json({
    summary: summaryText,
    insights: fallback.insights,
    recommendations: fallback.recommendations,
    matchedVehicles: vehicles.slice(0, 6),
    source: provider.isConfigured() ? 'huggingface+catalog' : 'catalog-fallback',
  });
}
