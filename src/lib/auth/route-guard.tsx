/**
 * AUTO PULSE — Route Guard Component
 * Korumalı route'lar için auth kontrolü
 */

'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { isGuestMode, isSupabaseConfigured } from '@/lib/supabase/client';
import type { Session } from '@supabase/supabase-js';

interface RouteGuardProps {
  children: React.ReactNode;
  requireAuth?: boolean;
  redirectTo?: string;
}

/**
 * Korumalı route wrapper
 */
export function RouteGuard({ children, requireAuth = false, redirectTo = '/auth/login' }: RouteGuardProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Guest mode — auth kontrolü yapma
    if (isGuestMode()) {
      setIsLoading(false);
      setIsAuthenticated(true); // Guest mode = herkes erişebilir
      return;
    }

    if (!isSupabaseConfigured()) {
      setIsLoading(false);
      setIsAuthenticated(false);
      return;
    }

    // Auth kontrolü
    async function checkAuth() {
      try {
        // Dinamik import to avoid SSR issues
        const { getSession } = await import('@/lib/auth/auth');
        const session = await getSession();

        if (requireAuth && !session) {
          router.push(`${redirectTo}?redirect=${pathname}`);
        } else {
          setIsAuthenticated(!!session);
        }
      } catch (error) {
        console.error('Auth check failed:', error);
        if (requireAuth) {
          router.push(`${redirectTo}?redirect=${pathname}`);
        }
      } finally {
        setIsLoading(false);
      }
    }

    checkAuth();
  }, [requireAuth, redirectTo, pathname, router]);

  // Guest mode — direkt children'ı göster
  if (isGuestMode()) {
    return <>{children}</>;
  }

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0A0A0A]">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-[#FFBF00] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-[#9CA3AF]">Yükleniyor...</p>
        </div>
      </div>
    );
  }

  // Auth required but not authenticated
  if (requireAuth && !isAuthenticated) {
    return null; // Router redirect olacak
  }

  return <>{children}</>;
}

/**
 * Auth check hook
 */
export function useAuth() {
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (isGuestMode()) {
      setIsLoading(false);
      return;
    }

    async function loadSession() {
      try {
        const { getSession } = await import('@/lib/auth/auth');
        const s = await getSession();
        setSession(s);
      } catch (error) {
        console.error('Failed to load session:', error);
      } finally {
        setIsLoading(false);
      }
    }

    loadSession();
  }, []);

  return { session, isLoading, isAuthenticated: !!session };
}
