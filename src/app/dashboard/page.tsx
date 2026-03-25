'use client';

import Link from 'next/link';

import { SideNavBar, TopNavBar } from '@/components/dashboard';
import { useCatalog } from '@/hooks/useCatalog';
import { useCompareVehicles, useSavedVehicles } from '@/hooks/useLocalStorage';

export default function DashboardPage() {
  const { vehicles, stats } = useCatalog({ limit: 24 });
  const [savedVehicles] = useSavedVehicles();
  const [compareVehicles] = useCompareVehicles();

  const recentActivity = [
    { type: 'view', label: 'Katalog son yenilemesi tamamlandı', time: 'Şimdi' },
    { type: 'compare', label: `${compareVehicles.length} araç karşılaştırma kuyruğunda`, time: 'Bu oturum' },
    { type: 'save', label: `${savedVehicles.length} araç kayıt altında`, time: 'Bu oturum' },
    { type: 'search', label: `${vehicles.length} araç AI özetine hazır`, time: 'Canlı' },
  ];

  const statsGrid = [
    { label: 'Katalog kaydı', value: vehicles.length, change: `+${stats?.totalBrands ?? 0} marka` },
    { label: 'Karşılaştırma', value: compareVehicles.length, change: 'Canlı liste' },
    { label: 'Kaydedilen', value: savedVehicles.length, change: 'Yerel koleksiyon' },
    { label: 'Elektrikli', value: stats?.electricVehicles ?? 0, change: 'Katalog filtresi' },
  ];

  return (
    <>
      <TopNavBar />
      <SideNavBar />

      <main className="md:ml-64 pt-16 min-h-screen">
        <div className="max-w-7xl mx-auto px-8 py-12">
          <div className="mb-8">
            <h1 className="font-headline text-4xl font-black text-on-surface uppercase tracking-tighter mb-4">
              Gösterge Paneli
            </h1>
            <p className="font-body text-on-surface-variant text-lg">
              Katalog, kayıtlar ve AI akışının kısa özeti.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {statsGrid.map((stat) => (
              <div key={stat.label} className="bg-surface-container-low rounded-xl p-6 border border-outline-variant/10">
                <div className="flex items-center justify-between mb-4">
                  <span className="font-body text-[10px] uppercase tracking-widest text-on-surface-variant">
                    {stat.label}
                  </span>
                  <span className="px-2 py-1 rounded text-[10px] font-bold uppercase tracking-widest bg-secondary-container/10 text-secondary-container">
                    {stat.change}
                  </span>
                </div>
                <div className="font-headline text-4xl font-black text-on-surface">
                  {stat.value}
                </div>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <div className="bg-surface-container-low rounded-xl p-6 border border-outline-variant/10">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="font-headline text-xl font-bold text-on-surface uppercase">
                    Son Aktivite
                  </h2>
                  <Link href="/saved" className="font-label text-[10px] uppercase tracking-widest text-primary hover:underline transition-all">
                    Koleksiyon
                  </Link>
                </div>

                <div className="space-y-4">
                  {recentActivity.map((activity) => (
                    <div
                      key={activity.label}
                      className="flex items-center gap-4 p-4 bg-surface-container-highest rounded-lg hover:bg-surface-container transition-colors"
                    >
                      <span className="material-symbols-outlined text-primary">
                        {activity.type === 'compare'
                          ? 'compare_arrows'
                          : activity.type === 'save'
                            ? 'bookmark'
                            : activity.type === 'search'
                              ? 'psychology'
                              : 'visibility'}
                      </span>
                      <div className="flex-1">
                        <p className="font-body text-sm text-on-surface">{activity.label}</p>
                        <p className="font-body text-[10px] text-on-surface-variant/60">
                          {activity.time}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div>
              <div className="bg-surface-container-low rounded-xl p-6 border border-outline-variant/10">
                <h2 className="font-headline text-xl font-bold text-on-surface uppercase mb-6">
                  Hızlı İşlemler
                </h2>

                <div className="space-y-3">
                  {[
                    { href: '/compare', icon: 'compare_arrows', title: 'Yeni karşılaştırma', text: 'Araçları yan yana kıyasla' },
                    { href: '/discover', icon: 'explore', title: 'Keşfet', text: 'Marka ve modelleri tara' },
                    { href: '/ai-insights', icon: 'psychology', title: 'AI Analizleri', text: 'Özet ve öneri oluştur' },
                  ].map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      className="flex items-center gap-3 p-4 bg-surface-container-highest rounded-lg hover:bg-surface-container transition-colors group"
                    >
                      <span className="material-symbols-outlined text-primary group-hover:scale-110 transition-transform">
                        {item.icon}
                      </span>
                      <div className="flex-1 text-left">
                        <p className="font-headline text-xs font-bold text-on-surface uppercase">{item.title}</p>
                        <p className="font-body text-[10px] text-on-surface-variant">{item.text}</p>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
