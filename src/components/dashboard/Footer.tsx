/**
 * AUTO PULSE — Footer Component
 * Footer with network links and core load indicator
 * From stitch/stitch/auto_pulse_dashboard/code.html
 */

export function Footer() {
  return (
    <footer className="w-full py-12 bg-background border-t border-outline-variant/15 mt-24">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center px-12 max-w-full gap-8">
        <div className="space-y-4">
          <div className="text-sm font-bold text-on-surface uppercase tracking-tighter font-headline">
            Auto Pulse Intelligence
          </div>
          <p className="font-body text-[10px] uppercase tracking-widest text-on-surface/40 leading-relaxed">
            © 2024 Auto Pulse Intelligence. All data points synchronized.
            <br />
            Autonomous monitoring in effect.
          </p>
        </div>

        <div className="flex flex-wrap gap-8">
          <div className="flex flex-col gap-2">
            <span className="text-secondary-container font-body text-[10px] uppercase tracking-widest font-bold mb-2">
              Network
            </span>
            <a
              className="text-on-surface/40 font-body text-[10px] uppercase tracking-widest hover:text-secondary-container transition-opacity"
              href="#"
            >
              Data Sources
            </a>
            <a
              className="text-on-surface/40 font-body text-[10px] uppercase tracking-widest hover:text-secondary-container transition-opacity"
              href="#"
            >
              System Status
            </a>
          </div>
          <div className="flex flex-col gap-2">
            <span className="text-secondary-container font-body text-[10px] uppercase tracking-widest font-bold mb-2">
              Legal
            </span>
            <a
              className="text-on-surface/40 font-body text-[10px] uppercase tracking-widest hover:text-secondary-container transition-opacity"
              href="#"
            >
              Privacy Protocol
            </a>
            <a
              className="text-on-surface/40 font-body text-[10px] uppercase tracking-widest hover:text-secondary-container transition-opacity"
              href="#"
            >
              Terms
            </a>
          </div>
        </div>

        <div className="bg-surface-container p-4 rounded-lg flex items-center gap-4">
          <div className="text-right">
            <div className="text-[10px] uppercase tracking-widest text-on-surface/40">Core Load</div>
            <div className="text-xs font-headline font-bold text-primary-container">0.042 ms</div>
          </div>
          <span className="material-symbols-outlined text-secondary-container" data-icon="terminal">
            terminal
          </span>
        </div>
      </div>
    </footer>
  );
}
