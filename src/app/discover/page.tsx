import { MainLayout } from '@/components/layout/MainLayout';

export default function DiscoverPage() {
  return (
    <MainLayout currentPath="/discover">
      <div className="p-8">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-bold text-white mb-2">
            Keşfet
          </h1>
          <p className="text-[#9CA3AF] mb-8">
            Marka ve modelleri keşfedin.
          </p>

          {/* Placeholder Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {Array.from({ length: 12 }).map((_, i) => (
              <div
                key={i}
                className="aspect-square bg-[#2D2D2D] rounded-xl flex items-center justify-center"
              >
                <span className="text-[#9CA3AF] text-sm">Marka {i + 1}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
