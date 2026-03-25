import { MainLayout } from '@/components/layout/MainLayout';

export default function DashboardPage() {
  return (
    <MainLayout currentPath="/dashboard">
      <div className="p-8">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-bold text-white mb-2">
            Dashboard
          </h1>
          <p className="text-[#9CA3AF] mb-8">
            Özet istatistikler ve favori araçlarınız burada görüntülenecek.
          </p>

          {/* Placeholder Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-[#2D2D2D] rounded-xl p-6">
              <p className="text-[#9CA3AF] text-sm mb-1">Aranan Araç</p>
              <p className="text-3xl font-bold text-[#FFBF00]">0</p>
            </div>
            <div className="bg-[#2D2D2D] rounded-xl p-6">
              <p className="text-[#9CA3AF] text-sm mb-1">Karşılaştırma</p>
              <p className="text-3xl font-bold text-[#FFBF00]">0</p>
            </div>
            <div className="bg-[#2D2D2D] rounded-xl p-6">
              <p className="text-[#9CA3AF] text-sm mb-1">Kayıtlı Araç</p>
              <p className="text-3xl font-bold text-[#FFBF00]">0</p>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
