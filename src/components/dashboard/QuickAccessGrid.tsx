/**
 * AUTO PULSE — QuickAccessGrid Component
 * Market Clusters grid with category icons
 * From stitch/stitch/auto_pulse_dashboard/code.html
 */

const clusters = [
  { name: 'Performance', icon: 'category' },
  { name: 'Electric', icon: 'electric_car' },
  { name: 'GT-Classic', icon: 'precision_manufacturing' },
  { name: 'Hyper-Track', icon: 'speed' },
  { name: 'Executive', icon: 'commute' },
  { name: 'Prototype', icon: 'radar' },
];

export function QuickAccessGrid() {
  return (
    <div className="mt-24">
      <div className="flex items-center justify-between mb-8">
        <h2 className="font-headline text-2xl font-bold uppercase tracking-tighter">
          Market Clusters
        </h2>
        <a
          className="text-secondary-fixed-dim font-label text-[10px] uppercase tracking-widest hover:underline underline-offset-8 transition-all"
          href="#"
        >
          Expand Taxonomy
        </a>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
        {clusters.map((cluster) => (
          <div key={cluster.name} className="group cursor-pointer">
            <div className="h-24 bg-surface-container rounded-xl flex items-center justify-center border border-outline-variant/5 group-hover:bg-surface-container-high group-hover:border-primary-container/20 transition-all duration-300 relative overflow-hidden">
              <div className="absolute inset-0 bg-primary-container/5 opacity-0 group-hover:opacity-100 transition-opacity" />
              <span
                className="material-symbols-outlined text-4xl text-on-surface-variant group-hover:text-primary transition-colors"
                data-icon={cluster.icon}
              >
                {cluster.icon}
              </span>
            </div>
            <p className="text-center font-label text-[10px] uppercase tracking-widest mt-3 text-on-surface-variant group-hover:text-on-surface transition-colors">
              {cluster.name}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
