import { MainLayout } from '@/components/layout/MainLayout';
import Link from 'next/link';

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 mb-2">
            <div className="w-10 h-10 rounded bg-[#FFBF00] flex items-center justify-center">
              <span className="text-[#0A0A0A] font-bold">AP</span>
            </div>
            <span className="text-white font-semibold text-xl">Auto Pulse</span>
          </div>
          <p className="text-[#9CA3AF]">Hesabınıza giriş yapın</p>
        </div>

        {/* Login Form */}
        <div className="bg-[#2D2D2D] rounded-xl p-8">
          <div className="space-y-4">
            <div>
              <label className="block text-[#9CA3AF] text-sm mb-2">
                E-posta
              </label>
              <input
                type="email"
                placeholder="ornek@email.com"
                className="w-full h-12 bg-[#0A0A0A] rounded-lg px-4 text-white placeholder-[#9CA3AF] border border-[#9CA3AF] focus:border-[#FFBF00] focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-[#9CA3AF] text-sm mb-2">
                Şifre
              </label>
              <input
                type="password"
                placeholder="••••••••"
                className="w-full h-12 bg-[#0A0A0A] rounded-lg px-4 text-white placeholder-[#9CA3AF] border border-[#9CA3AF] focus:border-[#FFBF00] focus:outline-none"
              />
            </div>
            <button className="w-full h-12 bg-[#FFBF00] text-[#0A0A0A] rounded-lg font-medium hover:bg-[#FFD700] transition-colors">
              Giriş Yap
            </button>
          </div>

          <div className="mt-6 text-center">
            <p className="text-[#9CA3AF] text-sm">
              Hesabınız yok mu?{' '}
              <Link href="/auth/register" className="text-[#FFBF00] hover:underline">
                Kayıt olun
              </Link>
            </p>
          </div>
        </div>

        {/* Back Link */}
        <div className="mt-6 text-center">
          <Link href="/" className="text-[#9CA3AF] hover:text-white text-sm">
            ← Ana sayfaya dön
          </Link>
        </div>
      </div>
    </div>
  );
}
