import { MainLayout } from '@/components/layout/MainLayout';

export default function ComparePage() {
  return (
    <MainLayout currentPath="/compare">
      <div className="p-8">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-bold text-white mb-2">
            Karşılaştır
          </h1>
          <p className="text-[#9CA3AF] mb-8">
            Araçları yan yana karşılaştırın.
          </p>

          {/* Compare Slots */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-[#2D2D2D] rounded-xl p-8 flex items-center justify-center min-h-[400px]">
              <div className="text-center">
                <p className="text-[#FFBF00] text-4xl mb-2">+</p>
                <p className="text-[#9CA3AF]">Araç Ekle</p>
              </div>
            </div>
            <div className="bg-[#2D2D2D] rounded-xl p-8 flex items-center justify-center min-h-[400px] border-2 border-dashed border-[#9CA3AF]">
              <div className="text-center">
                <p className="text-[#FFBF00] text-4xl mb-2">+</p>
                <p className="text-[#9CA3AF]">Araç Ekle</p>
              </div>
            </div>
            <div className="bg-[#2D2D2D] rounded-xl p-8 flex items-center justify-center min-h-[400px] border-2 border-dashed border-[#9CA3AF]">
              <div className="text-center">
                <p className="text-[#FFBF00] text-4xl mb-2">+</p>
                <p className="text-[#9CA3AF]">Araç Ekle</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
