import { MainLayout } from '@/components/layout/MainLayout';

export default function SavedPage() {
  return (
    <MainLayout currentPath="/saved">
      <div className="p-8">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-bold text-white mb-2">
            Kayıtlı Araçlar
          </h1>
          <p className="text-[#9CA3AF] mb-8">
            Kaydettiğiniz araçlar burada görüntülenir.
          </p>

          {/* Empty State */}
          <div className="bg-[#2D2D2D] rounded-xl p-12 text-center">
            <p className="text-[#FFBF00] text-5xl mb-4">🔖</p>
            <h3 className="text-white text-xl font-medium mb-2">
              Henüz kayıtlı araç yok
            </h3>
            <p className="text-[#9CA3AF]">
              İlgilendiğiniz araçları kaydetmek için giriş yapın.
            </p>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
