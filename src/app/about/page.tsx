import Link from 'next/link';

import { SideNavBar, TopNavBar } from '@/components/dashboard';

export default function AboutPage() {
  const techStack = [
    { name: 'Next.js', version: '16.2.1', description: 'App Router tabanlı arayüz katmanı' },
    { name: 'TypeScript', version: '5.x', description: 'Tip güvenli geliştirme' },
    { name: 'Tailwind CSS', version: '3.4', description: 'Tasarım sistemi ve stil katmanı' },
    { name: 'Supabase', version: '2.x', description: 'Veri kaynağı ve opsiyonel senkron katmanı' },
    { name: 'Hugging Face', version: 'API', description: 'Özetleme, sınıflandırma ve issue analizi' },
  ];

  const focusAreas = [
    'Araç kataloğu: vehiclesdata.txt + canonical türetim modeli',
    'VIN servisi: vPIC öncelikli, WMI fallback destekli',
    'AI özeti: sunucu tarafı Hugging Face route yapısı',
    'Logo eşleme: yerel logo seti + alias resolver',
  ];

  return (
    <>
      <TopNavBar />
      <SideNavBar />

      <main className="md:ml-64 pt-16 min-h-screen">
        <div className="max-w-4xl mx-auto px-8 py-12">
          <div className="mb-12">
            <h1 className="font-headline text-5xl font-black text-on-surface uppercase tracking-tighter mb-4">
              Auto Pulse Hakkında
            </h1>
            <p className="font-body text-on-surface-variant text-xl leading-relaxed">
              Auto Pulse, otomotiv katalog verisini, VIN çözümlemeyi ve yapay zeka özetlerini tek bir kullanıcı deneyiminde birleştiren analiz platformudur.
            </p>
          </div>

          <div className="mb-12 bg-surface-container-low rounded-2xl p-8 border border-primary-container/20">
            <h2 className="font-headline text-2xl font-bold text-primary-container uppercase mb-4">
              Odak Alanları
            </h2>
            <div className="space-y-3">
              {focusAreas.map((item) => (
                <div key={item} className="font-body text-on-surface-variant text-lg leading-relaxed">
                  • {item}
                </div>
              ))}
            </div>
          </div>

          <div className="mb-12">
            <h2 className="font-headline text-2xl font-bold text-on-surface uppercase mb-6">
              Teknoloji Yığını
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {techStack.map((tech) => (
                <div key={tech.name} className="bg-surface-container-low rounded-xl p-6 border border-outline-variant/10">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-headline text-lg font-bold text-on-surface">{tech.name}</h3>
                    <span className="px-2 py-1 bg-surface-container-highest rounded text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">
                      {tech.version}
                    </span>
                  </div>
                  <p className="font-body text-sm text-on-surface-variant">{tech.description}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Link
              href="https://github.com/statelyx/autopulse"
              target="_blank"
              rel="noopener noreferrer"
              className="p-6 bg-surface-container-low rounded-xl border border-outline-variant/10 hover:border-primary-container/20 transition-all group"
            >
              <div className="flex items-center gap-4">
                <span className="material-symbols-outlined text-3xl text-on-surface-variant group-hover:text-primary transition-colors">
                  code
                </span>
                <div>
                  <h3 className="font-headline text-sm font-bold text-on-surface uppercase mb-1">
                    GitHub Deposu
                  </h3>
                  <p className="font-body text-xs text-on-surface-variant">
                    Kaynak kodunu görüntüle
                  </p>
                </div>
              </div>
            </Link>

            <Link
              href="/discover"
              className="p-6 bg-surface-container-low rounded-xl border border-outline-variant/10 hover:border-primary-container/20 transition-all group"
            >
              <div className="flex items-center gap-4">
                <span className="material-symbols-outlined text-3xl text-on-surface-variant group-hover:text-primary transition-colors">
                  directions_car
                </span>
                <div>
                  <h3 className="font-headline text-sm font-bold text-on-surface uppercase mb-1">
                    Kataloğu Aç
                  </h3>
                  <p className="font-body text-xs text-on-surface-variant">
                    Marka ve modelleri gez
                  </p>
                </div>
              </div>
            </Link>
          </div>
        </div>
      </main>
    </>
  );
}
