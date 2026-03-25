/**
 * AUTO PULSE — About Page
 * Project information and details
 */

import { TopNavBar, SideNavBar } from '@/components/dashboard';
import Link from 'next/link';

export default function AboutPage() {
  const techStack = [
    { name: 'Next.js', version: '16.2.1', description: 'React Framework with App Router' },
    { name: 'TypeScript', version: '5.x', description: 'Type-safe development' },
    { name: 'Tailwind CSS', version: '3.4', description: 'Utility-first styling' },
    { name: 'Supabase', version: '2.x', description: 'Backend & Auth' },
    { name: 'Hugging Face', version: 'API', description: 'AI Integration' },
  ];

  const phases = [
    { faz: 1, name: 'Repo İskeleti', status: 'completed' },
    { faz: 2, name: 'Vercel Hazırlığı', status: 'completed' },
    { faz: 3, name: 'Backend İskeleti', status: 'completed' },
    { faz: 4, name: 'Premium Shell', status: 'completed' },
    { faz: 5, name: 'Supabase Auth', status: 'completed' },
    { faz: 6, name: 'Veri Normalization', status: 'completed' },
    { faz: 7, name: 'Etkileşim & Route', status: 'active' },
  ];

  return (
    <>
      <TopNavBar />
      <SideNavBar />

      <main className="md:ml-64 pt-16 min-h-screen">
        <div className="max-w-4xl mx-auto px-8 py-12">
          <div className="mb-12">
            <h1 className="font-headline text-5xl font-black text-on-surface uppercase tracking-tighter mb-4">
              About Auto Pulse
            </h1>
            <p className="font-body text-on-surface-variant text-xl leading-relaxed">
              Premium Otomotiv Intelligence Platformu — teknik araç verileri, gerçek kullanıcı yorumları
              ve yapay zeka analizlerini bir araya getiren next-generation araç bilgi platformu.
            </p>
          </div>

          {/* Vision */}
          <div className="mb-12 bg-surface-container-low rounded-2xl p-8 border border-primary-container/20">
            <h2 className="font-headline text-2xl font-bold text-primary-container uppercase mb-4">
              Vizyon
            </h2>
            <p className="font-body text-on-surface-variant text-lg leading-relaxed">
              Apple, Porsche ve Lucid estetiğini, Fintech dashboard fonksiyonelliği ile birleştirerek
              kullanıcılara benzersiz bir otomotiv intelligence deneyimi sunuyoruz.
            </p>
          </div>

          {/* Tech Stack */}
          <div className="mb-12">
            <h2 className="font-headline text-2xl font-bold text-on-surface uppercase mb-6">
              Teknoloji Yığını
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {techStack.map((tech) => (
                <div
                  key={tech.name}
                  className="bg-surface-container-low rounded-xl p-6 border border-outline-variant/10"
                >
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

          {/* Development Phases */}
          <div className="mb-12">
            <h2 className="font-headline text-2xl font-bold text-on-surface uppercase mb-6">
              Geliştirme Fazları
            </h2>
            <div className="space-y-3">
              {phases.map((phase) => (
                <div
                  key={phase.faz}
                  className="flex items-center gap-4 p-4 bg-surface-container-low rounded-xl border border-outline-variant/10"
                >
                  <div
                    className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                      phase.status === 'completed'
                        ? 'bg-secondary-container/10'
                        : phase.status === 'active'
                        ? 'bg-primary-container/10'
                        : 'bg-surface-container-highest'
                    }`}
                  >
                    <span
                      className={`font-headline text-sm font-bold ${
                        phase.status === 'completed'
                          ? 'text-secondary-container'
                          : phase.status === 'active'
                          ? 'text-primary-container'
                          : 'text-on-surface-variant'
                      }`}
                    >
                      {phase.faz}
                    </span>
                  </div>
                  <div className="flex-1">
                    <h3 className="font-headline text-sm font-bold text-on-surface uppercase">
                      {phase.name}
                    </h3>
                  </div>
                  <div>
                    {phase.status === 'completed' && (
                      <span className="px-3 py-1 bg-secondary-container/10 text-secondary-container rounded-full text-[10px] font-bold uppercase tracking-widest">
                        Completed
                      </span>
                    )}
                    {phase.status === 'active' && (
                      <span className="px-3 py-1 bg-primary-container/10 text-primary-container rounded-full text-[10px] font-bold uppercase tracking-widest animate-pulse">
                        Active
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Links */}
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
                    GitHub Repository
                  </h3>
                  <p className="font-body text-xs text-on-surface-variant">
                    View source code
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
                    Start Exploring
                  </h3>
                  <p className="font-body text-xs text-on-surface-variant">
                    Browse vehicles
                  </p>
                </div>
              </div>
            </Link>
          </div>

          {/* Footer Info */}
          <div className="mt-12 text-center">
            <p className="font-body text-sm text-on-surface-variant mb-2">
              © 2024 Auto Pulse Intelligence. All rights reserved.
            </p>
            <p className="font-body text-xs text-on-surface-variant/60">
              Version 1.0.0 — Developed by statelyx
            </p>
          </div>
        </div>
      </main>
    </>
  );
}
