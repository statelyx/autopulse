/**
 * AUTO PULSE — BentoGridInsights Component
 * Featured insight card and trending AI scores
 * From stitch/stitch/auto_pulse_dashboard/code.html
 */

const trendingScores = [
  { rank: 1, name: 'Model 3 Highland', category: 'Efficiency Rating', score: 9.8 },
  { rank: 2, name: '911 GT3 (992)', category: 'Retained Value', score: 9.4 },
  { rank: 3, name: 'Lucid Air Sapphire', category: 'Thermal Profile', score: 8.9 },
];

export function BentoGridInsights() {
  return (
    <section className="max-w-7xl mx-auto px-8 py-24">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* Large Featured Insight */}
        <div className="md:col-span-8 bg-surface-container-low rounded-3xl overflow-hidden relative group h-[450px]">
          <img
            className="absolute inset-0 w-full h-full object-cover brightness-50 group-hover:scale-105 transition-transform duration-700"
            alt="a silver classic porsche 911 parked on a mountain road at sunrise with cinematic side lighting and misty atmosphere"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuCjQv1-Lcs1y3CmNDW013CcS4MupeA-4SYYeV2H_rFJJqtXVtCJRHyZp4kGzoVpOIm41YGlRfgYPE35i7f7BzcTCsikCO6ax8jYg4OGS0WbxMVWO0CF19ioVrMJ7fbkIy1QFEJLDfq148qZNwqyYkYfqlnv4NcpR75ozppZanLfA47-FuZTV7DhbHGCY6KW6DZjjAiD4l-k_E-8lbPCe3YDOomN1Bbzr7Ve0bp4-R7dQQJKPVVcXjKqUO4AVhb37ssvFXETYDgM6GI"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
          <div className="absolute bottom-0 left-0 p-12 w-full">
            <div className="flex items-center gap-2 text-primary-container mb-4">
              <span className="font-label text-[10px] uppercase tracking-widest font-bold">
                Featured Insight
              </span>
              <span className="w-1 h-1 rounded-full bg-primary-container" />
              <span className="font-label text-[10px] uppercase tracking-widest font-bold">
                12m ago
              </span>
            </div>
            <h2 className="font-headline text-4xl font-black text-on-surface uppercase mb-6 leading-none">
              The Resurgence of <br /> Analog Dynamics.
            </h2>
            <p className="font-body text-on-surface-variant max-w-lg mb-8 text-sm">
              Synthetic telemetry confirms a 14% uptick in market value for
              non-assisted steering configurations across the 2010-2020 epoch.
            </p>
            <button className="flex items-center gap-2 group/btn">
              <span className="font-label text-[10px] uppercase tracking-widest font-bold text-on-surface group-hover/btn:text-primary transition-colors">
                Decode Analytics
              </span>
              <span className="material-symbols-outlined text-sm text-primary" data-icon="arrow_forward">
                arrow_forward
              </span>
            </button>
          </div>
        </div>

        {/* Trending AI Scores */}
        <div className="md:col-span-4 bg-surface-container-high/40 backdrop-blur-xl rounded-3xl p-8 border border-outline-variant/5">
          <h3 className="font-headline text-xl font-bold uppercase tracking-tight mb-8">
            Trending AI Scores
          </h3>

          <div className="space-y-6">
            {trendingScores.map((item) => (
              <div key={item.rank} className="flex items-center justify-between p-4 bg-surface-container-lowest rounded-xl">
                <div className="flex items-center gap-4">
                  <div className="w-8 h-8 flex items-center justify-center text-primary-container font-headline font-bold">
                    {String(item.rank).padStart(2, '0')}
                  </div>
                  <div>
                    <div className="text-xs font-bold font-headline uppercase">{item.name}</div>
                    <div className="text-[10px] text-on-surface-variant/40">{item.category}</div>
                  </div>
                </div>
                <div className="text-secondary-fixed-dim font-headline font-black text-xl">
                  {item.score}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 pt-8 border-t border-outline-variant/10 text-center">
            <button className="font-label text-[10px] uppercase tracking-[0.2em] text-on-surface-variant hover:text-primary transition-colors">
              View All Metrics
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
