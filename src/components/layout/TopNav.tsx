/**
 * AUTO PULSE — Top Navigation Bileşeni
 */

import Link from 'next/link';

export function TopNav() {
  return (
    <header className="fixed left-64 right-0 top-0 h-16 bg-[#0A0A0A] border-b border-[#2D2D2D] flex items-center justify-between px-6 z-10">
      {/* Sol - Breadcrumb / Başlık */}
      <div className="flex items-center gap-4">
        <h1 className="text-white font-medium">
          Auto Pulse
        </h1>
      </div>

      {/* Sağ - Aksiyonlar */}
      <div className="flex items-center gap-3">
        <Link
          href="/search"
          className="px-4 py-2 text-sm text-[#9CA3AF] hover:text-white transition-colors"
        >
          Araç Ara
        </Link>
        <Link
          href="/compare"
          className="px-4 py-2 text-sm bg-[#FFBF00] text-[#0A0A0A] rounded-lg font-medium hover:bg-[#FFD700] transition-colors"
        >
          Karşılaştır
        </Link>
      </div>
    </header>
  );
}
