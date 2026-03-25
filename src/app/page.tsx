import { MainLayout } from '@/components/layout/MainLayout';
import Link from 'next/link';

export default function HomePage() {
  return (
    <MainLayout currentPath="/">
      <div className="p-8">
        <div className="max-w-4xl mx-auto text-center py-12">
          {/* Hero Section */}
          <div className="mb-12">
            <div className="inline-flex items-center gap-3 mb-6">
              <div className="w-16 h-16 rounded-2xl bg-[#FFBF00] flex items-center justify-center">
                <span className="text-[#0A0A0A] font-bold text-2xl">AP</span>
              </div>
              <h1 className="text-5xl font-bold text-white">
                AUTO PULSE
              </h1>
            </div>
            <p className="text-xl text-[#9CA3AF] max-w-2xl mx-auto">
              Premium Otomotiv Intelligence Platformu
            </p>
            <p className="text-[#9CA3AF] mt-4">
              Teknik araç verileri, gerçek kullanıcı yorumları ve yapay zeka analizleri.
            </p>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <Link
              href="/discover"
              className="group bg-[#2D2D2D] rounded-xl p-8 hover:bg-[#3D3D3D] transition-all duration-300"
            >
              <div className="text-4xl mb-4">🔍</div>
              <h3 className="text-white font-semibold text-lg mb-2">Keşfet</h3>
              <p className="text-[#9CA3AF] text-sm">
                Marka ve modelleri inceleyin
              </p>
            </Link>

            <Link
              href="/compare"
              className="group bg-[#2D2D2D] rounded-xl p-8 hover:bg-[#3D3D3D] transition-all duration-300"
            >
              <div className="text-4xl mb-4">⚖️</div>
              <h3 className="text-white font-semibold text-lg mb-2">Karşılaştır</h3>
              <p className="text-[#9CA3AF] text-sm">
                Araçları yan yana karşılaştırın
              </p>
            </Link>

            <Link
              href="/vin"
              className="group bg-[#2D2D2D] rounded-xl p-8 hover:bg-[#3D3D3D] transition-all duration-300"
            >
              <div className="text-4xl mb-4">🔢</div>
              <h3 className="text-white font-semibold text-lg mb-2">VIN Sorgu</h3>
              <p className="text-[#9CA3AF] text-sm">
                Şasi numarası ile detaylı bilgi
              </p>
            </Link>
          </div>

          {/* CTA */}
          <div className="bg-[#2D2D2D] rounded-xl p-8">
            <h2 className="text-white text-xl font-semibold mb-2">
              Hemen başlayın
            </h2>
            <p className="text-[#9CA3AF] mb-6">
              Milyonlarca araç verisi ve AI destekli analizler parmaklarınızda.
            </p>
            <div className="flex justify-center gap-4">
              <Link
                href="/search"
                className="px-8 py-3 bg-[#FFBF00] text-[#0A0A0A] rounded-lg font-medium hover:bg-[#FFD700] transition-colors"
              >
                Araç Ara
              </Link>
              <Link
                href="/about"
                className="px-8 py-3 bg-[#2D2D2D] text-white rounded-lg font-medium border border-[#9CA3AF] hover:bg-[#3D3D3D] transition-colors"
              >
                Daha Fazla
              </Link>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
