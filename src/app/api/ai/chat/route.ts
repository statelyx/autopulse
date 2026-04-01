import { NextRequest, NextResponse } from 'next/server';

import { HuggingFaceProvider } from '@/lib/ai/providers/huggingface';
import {
  CHAT_QUOTA_COOKIE,
  MEMBERSHIP_COOKIE,
  buildQuotaSnapshot,
  consumeQuota,
  parseQuotaCookie,
} from '@/lib/ai/chat-quota';
import { buildCatalogSummary, getCatalogData } from '@/lib/data/catalog';

function buildFallbackAnswer(message: string, vehicles: Awaited<ReturnType<typeof getCatalogData>>['vehicles']) {
  const summary = buildCatalogSummary(vehicles);
  const topMatches = vehicles
    .slice(0, 3)
    .map((vehicle) => `${vehicle.brand} ${vehicle.model} ${vehicle.year}`)
    .join(', ');

  return [
    `${message || 'Araç seçimi'} için ${vehicles.length} ilgili kayıt buldum.`,
    topMatches ? `Öne çıkan eşleşmeler: ${topMatches}.` : 'Doğrudan eşleşme bulamadım, daha net bir marka veya model adı deneyebilirsin.',
    `${summary.electricCount} elektrikli, ${summary.performanceCount} yüksek performanslı ve ${summary.suvCount} SUV kayıt öne çıkıyor.`,
    'İstersen bütçe, yakıt tipi, kasa tipi veya kronik sorun odağıyla aramayı daraltabilirim.',
  ].join(' ');
}

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => ({}));
  const message = String(body?.message ?? '').trim();

  if (!message) {
    return NextResponse.json({ error: 'Mesaj boş olamaz.' }, { status: 400 });
  }

  const now = Date.now();
  const isPremium = request.cookies.get(MEMBERSHIP_COOKIE)?.value === 'pro';
  const currentQuota = parseQuotaCookie(request.cookies.get(CHAT_QUOTA_COOKIE)?.value, now);
  const currentSnapshot = buildQuotaSnapshot(currentQuota, isPremium, now);

  if (currentSnapshot.blocked) {
    return NextResponse.json({
      blocked: true,
      answer: 'Ücretsiz kullanım sınırına ulaştın. 3 saat sonra yeni 3 soru hakkın açılır veya üyelikle sınırsız devam edebilirsin.',
      quota: currentSnapshot,
      suggestedAction: {
        href: '/membership',
        label: 'Aylık üyeliğe geç',
      },
    });
  }

  const catalog = await getCatalogData({
    q: message,
    limit: 6,
  });
  const provider = new HuggingFaceProvider();
  const fallbackAnswer = buildFallbackAnswer(message, catalog.vehicles);

  let answer = fallbackAnswer;

  try {
    const prompt = [
      'Sen Auto Pulse içinde çalışan bir otomotiv danışmanısın.',
      `Kullanıcı sorusu: ${message}`,
      `İlgili araçlar: ${catalog.vehicles.slice(0, 5).map((vehicle) => `${vehicle.brand} ${vehicle.model} ${vehicle.year}, ${vehicle.fuelType}, ${vehicle.bodyType}, ${vehicle.horsepower} hp, $${vehicle.price}`).join(' | ') || 'eşleşme yok'}`,
      'Görev: Türkçe, net ve kısa cevap ver. Önce öneriyi ver, sonra kısa gerekçe ekle.',
    ].join('\n');

    answer = await provider.generateSummary(prompt);
  } catch {
    answer = fallbackAnswer;
  }

  const nextQuota = consumeQuota(currentQuota, isPremium);
  const response = NextResponse.json({
    blocked: false,
    answer,
    vehicles: catalog.vehicles.slice(0, 4).map((vehicle) => ({
      id: vehicle.id,
      brand: vehicle.brand,
      model: vehicle.model,
      year: vehicle.year,
      price: vehicle.price,
      fuelType: vehicle.fuelType,
      bodyType: vehicle.bodyType,
      horsepower: vehicle.horsepower,
    })),
    quota: buildQuotaSnapshot(nextQuota, isPremium, now),
    suggestedAction: nextQuota.used >= 2 && !isPremium
      ? {
          href: '/membership',
          label: 'Aylık üyeliği incele',
        }
      : null,
  });

  response.cookies.set(CHAT_QUOTA_COOKIE, JSON.stringify(nextQuota), {
    httpOnly: true,
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 30,
  });

  return response;
}
