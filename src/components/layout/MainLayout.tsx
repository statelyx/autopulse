/**
 * AUTO PULSE — Main Layout Bileşeni
 * Sidebar ve TopNav ile birlikte çalışan ana layout
 */

import { Sidebar } from './Sidebar';
import { TopNav } from './TopNav';

interface MainLayoutProps {
  children: React.ReactNode;
  currentPath?: string;
}

export function MainLayout({ children, currentPath }: MainLayoutProps) {
  return (
    <div className="min-h-screen bg-[#0A0A0A]">
      <Sidebar currentPath={currentPath} />
      <TopNav />

      {/* Main Content Area */}
      <main className="ml-64 mt-16 min-h-[calc(100vh-4rem)]">
        {children}
      </main>
    </div>
  );
}
