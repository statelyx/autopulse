import Link from 'next/link';

import { SideNavBar, TopNavBar } from '@/components/dashboard';

export default function MembershipPage() {
  return (
    <>
      <TopNavBar />
      <SideNavBar />

      <main className="min-h-screen pt-16 md:ml-64">
        <div className="mx-auto max-w-6xl px-6 py-12 md:px-8">
          <div className="rounded-[32px] border border-white/10 bg-[radial-gradient(circle_at_top,#3a2a0e_0%,#16110b_35%,#0c0a08_100%)] p-8 md:p-10">
            <div className="max-w-3xl">
              <div className="text-xs uppercase tracking-[0.35em] text-amber-200/70">Üyelik</div>
              <h1 className="mt-4 text-4xl font-black uppercase tracking-tight text-white md:text-5xl">
                AI danışmanı için aylık erişim
              </h1>
              <p className="mt-4 max-w-2xl text-base text-stone-300 md:text-lg">
                Ücretsiz kullanım 3 saatte 3 soruyla sınırlı. Aylık üyelikle daha uzun sohbet, daha fazla araç karşılaştırması ve kesintisiz öneri akışı açılır.
              </p>
            </div>

            <div className="mt-10 grid gap-6 md:grid-cols-[1.2fr_0.8fr]">
              <div className="rounded-[28px] border border-white/10 bg-black/20 p-6">
                <div className="flex items-end justify-between gap-4 border-b border-white/10 pb-5">
                  <div>
                    <div className="text-xs uppercase tracking-[0.35em] text-stone-500">Premium</div>
                    <div className="mt-2 text-3xl font-black text-white">$9.99<span className="ml-1 text-base font-medium text-stone-400">/ ay</span></div>
                  </div>
                  <span className="rounded-full border border-emerald-400/25 bg-emerald-400/10 px-3 py-1 text-xs uppercase tracking-[0.25em] text-emerald-200">
                    Önerilen
                  </span>
                </div>

                <div className="mt-6 grid gap-3 text-sm text-stone-300">
                  <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3">Sınırsız AI soru hakkı</div>
                  <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3">Araç bazlı hızlı öneri akışı</div>
                  <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3">Karşılaştırma ve sorun analizi için öncelikli erişim</div>
                </div>

                <div className="mt-6 rounded-2xl border border-amber-400/20 bg-amber-400/10 px-4 py-4 text-sm text-amber-100">
                  Ödeme entegrasyonu henüz bağlı değil. Bu ekran, premium kapısını ve ürün akışını göstermek için hazırlandı.
                </div>
              </div>

              <div className="rounded-[28px] border border-white/10 bg-white/5 p-6">
                <div className="text-xs uppercase tracking-[0.35em] text-stone-500">Ücretsiz plan</div>
                <div className="mt-2 text-2xl font-black text-white">3 soru / 3 saat</div>
                <p className="mt-4 text-sm text-stone-400">
                  İlk deneme için yeterli. Soruların bittiğinde pencere resetlenir veya üyelik ekranına yönlendirilirsin.
                </p>

                <div className="mt-8 grid gap-3">
                  <Link
                    href="/inventory"
                    className="rounded-2xl bg-amber-400 px-4 py-3 text-center text-sm font-semibold text-[#241907] transition hover:brightness-105"
                  >
                    Araç kataloğuna dön
                  </Link>
                  <Link
                    href="/compare"
                    className="rounded-2xl border border-white/10 px-4 py-3 text-center text-sm text-stone-300 transition hover:bg-white/5"
                  >
                    Karşılaştırmayı aç
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
