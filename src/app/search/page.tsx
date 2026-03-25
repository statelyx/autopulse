import { MainLayout } from '@/components/layout/MainLayout';

export default function SearchPage() {
  return (
    <MainLayout currentPath="/search">
      <div className="p-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold text-white mb-2">
            Araç Ara
          </h1>
          <p className="text-[#9CA3AF] mb-8">
            Marka, model ve yıl ile araç arayın.
          </p>

          {/* Search Placeholder */}
          <div className="bg-[#2D2D2D] rounded-xl p-8 text-center">
            <p className="text-[#9CA3AF] mb-4">
              Gelişmiş arama motoru yakında burada.
            </p>
            <div className="w-full h-12 bg-[#0A0A0A] rounded-lg flex items-center px-4">
              <span className="text-[#9CA3AF] text-sm">Marka, model veya yıl girin...</span>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
