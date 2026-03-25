/**
 * AUTO PULSE — Sidebar Bileşeni
 * Premium dark tema, Obsidian Black + Neon Amber
 */

import Link from 'next/link';

const navItems = [
  { href: '/', label: 'Ana Sayfa', icon: '🏠' },
  { href: '/dashboard', label: 'Dashboard', icon: '📊' },
  { href: '/discover', label: 'Keşfet', icon: '🔍' },
  { href: '/search', label: 'Arama', icon: '🔎' },
  { href: '/compare', label: 'Karşılaştır', icon: '⚖️' },
  { href: '/issues', label: 'Sorunlar', icon: '⚠️' },
  { href: '/saved', label: 'Kayıtlı', icon: '🔖' },
  { href: '/vin', label: 'VIN Sorgu', icon: '🔢' },
  { href: '/about', label: 'Hakkında', icon: 'ℹ️' },
];

const authItems = [
  { href: '/auth/login', label: 'Giriş', icon: '🔑' },
  { href: '/auth/register', label: 'Kayıt', icon: '📝' },
];

interface SidebarProps {
  currentPath?: string;
}

export function Sidebar({ currentPath = '/' }: SidebarProps) {
  return (
    <aside className="fixed left-0 top-0 h-screen w-64 bg-[#0A0A0A] border-r border-[#2D2D2D] flex flex-col">
      {/* Logo */}
      <div className="h-16 flex items-center px-6 border-b border-[#2D2D2D]">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded bg-[#FFBF00] flex items-center justify-center">
            <span className="text-[#0A0A0A] font-bold text-sm">AP</span>
          </div>
          <span className="text-white font-semibold text-lg">
            Auto Pulse
          </span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-4 px-3">
        <ul className="space-y-1">
          {navItems.map((item) => {
            const isActive = currentPath === item.href;
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={`
                    flex items-center gap-3 px-3 py-2.5 rounded-lg
                    transition-all duration-200
                    ${isActive
                      ? 'bg-[#FFBF00] text-[#0A0A0A] font-medium'
                      : 'text-[#9CA3AF] hover:bg-[#2D2D2D] hover:text-white'
                    }
                  `}
                >
                  <span className="text-lg">{item.icon}</span>
                  <span className="text-sm">{item.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>

        <div className="mt-6 pt-4 border-t border-[#2D2D2D]">
          <ul className="space-y-1">
            {authItems.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-[#9CA3AF] hover:bg-[#2D2D2D] hover:text-white transition-all duration-200"
                >
                  <span className="text-lg">{item.icon}</span>
                  <span className="text-sm">{item.label}</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-[#2D2D2D]">
        <p className="text-xs text-[#9CA3AF] text-center">
          © 2026 Auto Pulse
        </p>
      </div>
    </aside>
  );
}
