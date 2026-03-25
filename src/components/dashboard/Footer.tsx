export function Footer() {
  return (
    <footer className="w-full py-12 bg-background border-t border-outline-variant/15 mt-24">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center px-12 max-w-full gap-8">
        <div className="space-y-4">
          <div className="text-sm font-bold text-on-surface uppercase tracking-tighter font-headline">
            Auto Pulse
          </div>
          <p className="font-body text-[10px] uppercase tracking-widest text-on-surface/40 leading-relaxed">
            © 2026 Auto Pulse. Katalog ve AI katmanı senkronize çalışır.
            <br />
            Sürekli izleme aktif.
          </p>
        </div>

        <div className="flex flex-wrap gap-8">
          <div className="flex flex-col gap-2">
            <span className="text-secondary-container font-body text-[10px] uppercase tracking-widest font-bold mb-2">
              Ağ
            </span>
            <a
              className="text-on-surface/40 font-body text-[10px] uppercase tracking-widest hover:text-secondary-container transition-opacity"
              href="/discover"
            >
              Veri Kaynakları
            </a>
            <a
              className="text-on-surface/40 font-body text-[10px] uppercase tracking-widest hover:text-secondary-container transition-opacity"
              href="/intelligence"
            >
              Sistem Durumu
            </a>
          </div>
          <div className="flex flex-col gap-2">
            <span className="text-secondary-container font-body text-[10px] uppercase tracking-widest font-bold mb-2">
              Platform
            </span>
            <a
              className="text-on-surface/40 font-body text-[10px] uppercase tracking-widest hover:text-secondary-container transition-opacity"
              href="/about"
            >
              Hakkında
            </a>
            <a
              className="text-on-surface/40 font-body text-[10px] uppercase tracking-widest hover:text-secondary-container transition-opacity"
              href="/vin"
            >
              VIN Servisi
            </a>
          </div>
        </div>

        <div className="bg-surface-container p-4 rounded-lg flex items-center gap-4">
          <div className="text-right">
            <div className="text-[10px] uppercase tracking-widest text-on-surface/40">Çekirdek Yük</div>
            <div className="text-xs font-headline font-bold text-primary-container">0.042 ms</div>
          </div>
          <span className="material-symbols-outlined text-secondary-container">terminal</span>
        </div>
      </div>
    </footer>
  );
}
