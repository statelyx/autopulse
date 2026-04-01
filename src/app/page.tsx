import Link from 'next/link';

import { SideNavBar, TopNavBar } from '@/components/dashboard';
import { getCatalogData } from '@/lib/data/catalog';

export default async function HomePage() {
  const { featuredVehicles, stats, brands } = await getCatalogData({ limit: 12 });
  const spotlightBrands = brands.slice(0, 6);

  return (
    <>
      <TopNavBar />
      <SideNavBar />

      <main className="min-h-screen pt-16 md:ml-64">
        <section className="relative overflow-hidden border-b border-white/10">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,176,0,0.18),transparent_30%),radial-gradient(circle_at_left,rgba(45,212,191,0.12),transparent_22%)]" />
          <div className="relative mx-auto max-w-7xl px-6 py-14 md:px-8 md:py-20">
            <div className="grid items-end gap-10 lg:grid-cols-[1.15fr_0.85fr]">
              <div>
                <div className="inline-flex rounded-full border border-amber-400/25 bg-amber-400/10 px-4 py-2 text-xs uppercase tracking-[0.32em] text-amber-100">
                  Otomotiv keşfi + sabit AI asistan
                </div>
                <h1 className="mt-6 max-w-4xl text-5xl font-black uppercase tracking-tight text-white md:text-7xl">
                  Marka seç, model aç, AI ile karar ver.
                </h1>
                <p className="mt-6 max-w-2xl text-base leading-7 text-stone-300 md:text-lg">
                  Auto Pulse artık araç katalogu, karşılaştırma ve üyelikle sınırlanan AI danışmanı tek akışta topluyor. Kullanıcı her sayfada sabit asistanla araç sorusu sorabilir.
                </p>
                <div className="mt-8 flex flex-wrap gap-3">
                  <Link href="/discover" className="rounded-full bg-amber-400 px-6 py-3 text-sm font-semibold uppercase tracking-[0.2em] text-[#241907] transition hover:brightness-105">
                    Markaları keşfet
                  </Link>
                  <Link href="/inventory" className="rounded-full border border-white/10 px-6 py-3 text-sm font-semibold uppercase tracking-[0.2em] text-stone-200 transition hover:bg-white/5">
                    Envanteri aç
                  </Link>
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                {[
                  { label: 'Katalog kaydı', value: stats.totalVehicles },
                  { label: 'Toplam marka', value: stats.totalBrands },
                  { label: 'Elektrikli araç', value: stats.electricVehicles },
                  { label: 'Premium araç', value: stats.premiumVehicles },
                ].map((item) => (
                  <div key={item.label} className="rounded-[28px] border border-white/10 bg-black/20 p-5 backdrop-blur">
                    <div className="text-xs uppercase tracking-[0.3em] text-stone-500">{item.label}</div>
                    <div className="mt-3 text-4xl font-black text-white">{item.value}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-6 py-12 md:px-8">
          <div className="flex items-center justify-between gap-4">
            <div>
              <div className="text-xs uppercase tracking-[0.32em] text-stone-500">Öne çıkan araçlar</div>
              <h2 className="mt-2 text-3xl font-black uppercase tracking-tight text-white">Hızlı başlangıç vitrini</h2>
            </div>
            <Link href="/compare" className="text-sm text-amber-100 transition hover:text-white">Karşılaştırmaya git</Link>
          </div>

          <div className="mt-8 grid gap-5 lg:grid-cols-3">
            {featuredVehicles.slice(0, 6).map((vehicle) => (
              <Link
                key={vehicle.id}
                href={`/vehicle/${vehicle.id}`}
                className="group rounded-[30px] border border-white/10 bg-[#14110f] p-6 transition hover:border-amber-400/30 hover:bg-[#191511]"
              >
                <div className="flex items-center justify-between">
                  <span className="rounded-full border border-white/10 px-3 py-1 text-[11px] uppercase tracking-[0.3em] text-stone-500">
                    {vehicle.year}
                  </span>
                  <span className="text-sm text-stone-500">{vehicle.bodyType}</span>
                </div>
                <h3 className="mt-8 text-2xl font-black uppercase tracking-tight text-white">
                  {vehicle.brand}
                </h3>
                <p className="mt-1 text-base text-stone-300">{vehicle.model}</p>
                <div className="mt-6 grid grid-cols-3 gap-3 text-sm text-stone-400">
                  <div>
                    <div className="text-[10px] uppercase tracking-[0.25em] text-stone-500">Güç</div>
                    <div className="mt-1 text-white">{vehicle.horsepower} hp</div>
                  </div>
                  <div>
                    <div className="text-[10px] uppercase tracking-[0.25em] text-stone-500">0-100</div>
                    <div className="mt-1 text-white">{vehicle.acceleration}s</div>
                  </div>
                  <div>
                    <div className="text-[10px] uppercase tracking-[0.25em] text-stone-500">Yakıt</div>
                    <div className="mt-1 text-white">{vehicle.fuelType}</div>
                  </div>
                </div>
                <div className="mt-8 flex items-center justify-between border-t border-white/10 pt-5">
                  <span className="text-2xl font-black text-amber-100">${vehicle.price.toLocaleString()}</span>
                  <span className="text-xs uppercase tracking-[0.25em] text-stone-500">Detaya geç</span>
                </div>
              </Link>
            ))}
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-6 pb-14 md:px-8">
          <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
            <div className="rounded-[32px] border border-white/10 bg-white/5 p-6">
              <div className="text-xs uppercase tracking-[0.32em] text-stone-500">Üyelik akışı</div>
              <h2 className="mt-3 text-3xl font-black uppercase tracking-tight text-white">Ücretsiz deneme mantığı hazır</h2>
              <p className="mt-4 text-base leading-7 text-stone-300">
                Sabit AI chat her kullanıcıya 3 saatte 3 ücretsiz soru açar. Limit bitince üyelik ekranı çağrılır.
              </p>
              <Link href="/membership" className="mt-6 inline-flex rounded-full bg-amber-400 px-6 py-3 text-sm font-semibold uppercase tracking-[0.2em] text-[#241907]">
                Üyelik ekranını gör
              </Link>
            </div>

            <div className="rounded-[32px] border border-white/10 bg-[#14110f] p-6">
              <div className="text-xs uppercase tracking-[0.32em] text-stone-500">Marka kümeleri</div>
              <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                {spotlightBrands.map((brand) => (
                  <Link
                    key={brand.slug}
                    href={`/inventory?brand=${brand.slug}`}
                    className="rounded-[24px] border border-white/10 bg-black/20 p-5 transition hover:border-amber-400/20"
                  >
                    <div className="text-lg font-bold text-white">{brand.name}</div>
                    <div className="mt-2 text-sm text-stone-400">{brand.country}</div>
                    <div className="mt-4 text-xs uppercase tracking-[0.24em] text-stone-500">{brand.models.slice(0, 3).join(' · ')}</div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
