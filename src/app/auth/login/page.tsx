/**
 * AUTO PULSE — Login Page
 * Supabase email authentication
 */

'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { signIn, isGuestMode } from '@/lib/auth/auth';
import { Suspense } from 'react';

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get('redirect') || '/dashboard';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const result = await signIn(email, password);

      if (result.success) {
        router.push(redirect);
      } else {
        setError(result.error || 'Giriş başarısız.');
      }
    } catch (err) {
      setError('Bir hata oluştu.');
    } finally {
      setIsLoading(false);
    }
  };

  // Guest mode notification
  if (isGuestMode()) {
    return (
      <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 mb-2">
              <div className="w-10 h-10 rounded bg-[#FFBF00] flex items-center justify-center">
                <span className="text-[#0A0A0A] font-bold">AP</span>
              </div>
              <span className="text-white font-semibold text-xl">Auto Pulse</span>
            </div>
          </div>

          <div className="bg-[#2D2D2D] rounded-xl p-8 text-center">
            <p className="text-[#9CA3AF] mb-4">
              ⚠️ Supabase yapılandırılmadı.
            </p>
            <p className="text-[#9CA3AF] text-sm mb-6">
              Guest mode aktif. Authentication özellikleri kullanılamaz.
            </p>
            <Link
              href="/"
              className="inline-block px-6 py-2 bg-[#FFBF00] text-[#0A0A0A] rounded-lg font-medium hover:bg-[#FFD700] transition-colors"
            >
              Ana Sayfaya Dön
            </Link>
          </div>
        </div>
      </div>
    );
  }

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
        <form onSubmit={handleSubmit} className="bg-[#2D2D2D] rounded-xl p-8">
          {error && (
            <div className="mb-4 p-3 bg-red-500/20 border border-red-500/50 rounded-lg">
              <p className="text-red-400 text-sm">{error}</p>
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label className="block text-[#9CA3AF] text-sm mb-2">
                E-posta
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="ornek@email.com"
                required
                disabled={isLoading}
                className="w-full h-12 bg-[#0A0A0A] rounded-lg px-4 text-white placeholder-[#9CA3AF] border border-[#9CA3AF] focus:border-[#FFBF00] focus:outline-none disabled:opacity-50"
              />
            </div>
            <div>
              <label className="block text-[#9CA3AF] text-sm mb-2">
                Şifre
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                disabled={isLoading}
                minLength={6}
                className="w-full h-12 bg-[#0A0A0A] rounded-lg px-4 text-white placeholder-[#9CA3AF] border border-[#9CA3AF] focus:border-[#FFBF00] focus:outline-none disabled:opacity-50"
              />
            </div>
            <button
              type="submit"
              disabled={isLoading}
              className="w-full h-12 bg-[#FFBF00] text-[#0A0A0A] rounded-lg font-medium hover:bg-[#FFD700] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Giriş yapılıyor...' : 'Giriş Yap'}
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
        </form>

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

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-[#0A0A0A]">
        <div className="text-[#9CA3AF]">Yükleniyor...</div>
      </div>
    }>
      <LoginForm />
    </Suspense>
  );
}
