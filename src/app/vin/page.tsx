import { MainLayout } from '@/components/layout/MainLayout';

export default function VinPage() {
  return (
    <MainLayout currentPath="/vin">
      <div className="p-8">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-3xl font-bold text-white mb-2">
            VIN Sorgulama
          </h1>
          <p className="text-[#9CA3AF] mb-8">
            Araç şasi numarası ile detaylı sorgulama.
          </p>

          {/* VIN Input */}
          <div className="bg-[#2D2D2D] rounded-xl p-8">
            <label className="block text-[#9CA3AF] text-sm mb-2">
              VIN Kodu
            </label>
            <input
              type="text"
              placeholder="Örn: WVWZZZ... (17 karakter)"
              className="w-full h-12 bg-[#0A0A0A] rounded-lg px-4 text-white placeholder-[#9CA3AF] border border-[#9CA3AF] focus:border-[#FFBF00] focus:outline-none"
              maxLength={17}
            />
            <button className="w-full mt-4 h-12 bg-[#FFBF00] text-[#0A0A0A] rounded-lg font-medium hover:bg-[#FFD700] transition-colors">
              Sorgula
            </button>
          </div>

          {/* Info */}
          <div className="mt-6 bg-[#2D2D2D] rounded-xl p-6">
            <p className="text-[#9CA3AF] text-sm">
              💡 VIN (Vehicle Identification Number) araçın kimlik numarasıdır.
              Sürücü kabini üzerindeki plakada veya araç kayıt belgesinde bulunur.
            </p>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
