import { MainLayout } from '@/components/layout/MainLayout';

export default function AboutPage() {
  return (
    <MainLayout currentPath="/about">
      <div className="p-8">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl font-bold text-white mb-2">
            Hakkında
          </h1>
          <p className="text-[#9CA3AF] mb-8">
            Auto Pulse proje bilgileri.
          </p>

          {/* About Content */}
          <div className="bg-[#2D2D2D] rounded-xl p-8 space-y-6">
            <div>
              <h2 className="text-[#FFBF00] font-semibold text-lg mb-2">
                Vizyon
              </h2>
              <p className="text-[#9CA3AF]">
                Premium Otomotiv Intelligence Platformu — teknik araç verileri,
                gerçek kullanıcı yorumları ve yapay zeka analizleri bir arada.
              </p>
            </div>

            <div>
              <h2 className="text-[#FFBF00] font-semibold text-lg mb-2">
                Teknoloji
              </h2>
              <ul className="text-[#9CA3AF] space-y-1">
                <li>• Next.js 16+ (App Router)</li>
                <li>• TypeScript (Strict Mode)</li>
                <li>• Tailwind CSS</li>
                <li>• Supabase</li>
                <li>• Hugging Face AI</li>
              </ul>
            </div>

            <div>
              <h2 className="text-[#FFBF00] font-semibold text-lg mb-2">
                Versiyon
              </h2>
              <p className="text-[#9CA3AF]">
                v1.0.0 — Faz 4 Development
              </p>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
