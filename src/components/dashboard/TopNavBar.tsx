/**
 * AUTO PULSE — TopNavBar Component
 * Fixed top navigation bar with backdrop blur
 * From stitch/stitch/auto_pulse_dashboard/code.html
 */

export function TopNavBar() {
  return (
    <nav className="fixed top-0 w-full z-50 bg-background/80 backdrop-blur-xl shadow-[0_0_40px_rgba(255,176,0,0.1)] flex justify-between items-center px-8 h-16">
      <div className="flex items-center gap-8">
        <span className="text-xl font-black tracking-tighter text-on-surface uppercase font-headline">
          Auto Pulse
        </span>
        <div className="hidden md:flex gap-6 items-center">
          <a
            className="text-primary-container border-b-2 border-primary-container font-headline font-bold tracking-tight py-1 hover:text-primary-container transition-colors duration-300"
            href="#"
          >
            Home
          </a>
          <a
            className="text-on-surface/60 font-headline font-bold tracking-tight hover:text-primary-container transition-colors duration-300"
            href="#"
          >
            Inventory
          </a>
          <a
            className="text-on-surface/60 font-headline font-bold tracking-tight hover:text-primary-container transition-colors duration-300"
            href="#"
          >
            Intelligence
          </a>
        </div>
      </div>
      <div className="flex items-center gap-4">
        <button className="p-2 text-on-surface/60 hover:text-primary-container transition-colors active:scale-95 duration-200">
          <span className="material-symbols-outlined" data-icon="notifications">
            notifications
          </span>
        </button>
        <button className="p-2 text-on-surface/60 hover:text-primary-container transition-colors active:scale-95 duration-200">
          <span className="material-symbols-outlined" data-icon="account_circle">
            account_circle
          </span>
        </button>
      </div>
    </nav>
  );
}
