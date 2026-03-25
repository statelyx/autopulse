import { MainLayout } from '@/components/layout/MainLayout';

export default function IssuesPage() {
  return (
    <MainLayout currentPath="/issues">
      <div className="p-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold text-white mb-2">
            Bilinen Sorunlar
          </h1>
          <p className="text-[#9CA3AF] mb-8">
            Araçların yaygın sorunları ve çözümleri.
          </p>

          {/* Issues List */}
          <div className="space-y-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="bg-[#2D2D2D] rounded-xl p-6">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-[#FFBF00] flex items-center justify-center text-[#0A0A0A] font-bold">
                    {i + 1}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-white font-medium mb-1">
                      Örnek Sorun Başlığı {i + 1}
                    </h3>
                    <p className="text-[#9CA3AF] text-sm">
                      Bu alan için sorun detayları yakında eklenecek.
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
