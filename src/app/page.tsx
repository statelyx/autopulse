/**
 * AUTO PULSE — Main Homepage
 * Exact replication of stitch/stitch/auto_pulse_dashboard/code.html design
 * "The Digital Cockpit" — Obsidian Kinetic Design System
 */

import {
  TopNavBar,
  SideNavBar,
  HeroSection,
  FilterSection,
  QuickAccessGrid,
  BentoGridInsights,
  ChronicIssueReports,
  Footer,
} from '@/components/dashboard';

export default function HomePage() {
  return (
    <>
      <TopNavBar />
      <SideNavBar />

      <main className="md:ml-64 pt-16 min-h-screen">
        <HeroSection />

        <FilterSection />

        <section className="max-w-7xl mx-auto px-8">
          <QuickAccessGrid />
        </section>

        <BentoGridInsights />

        <section className="max-w-7xl mx-auto px-8">
          <ChronicIssueReports />
        </section>
      </main>

      <Footer />
    </>
  );
}
