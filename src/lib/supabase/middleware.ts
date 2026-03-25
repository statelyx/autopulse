/**
 * AUTO PULSE — Supabase Middleware
 * Next.js middleware ile route protection ve auth kontrolü
 */

import { createClient } from '@supabase/supabase-js';
import { NextResponse, type NextRequest } from 'next/server';

/**
 * Supabase middleware for route protection
 */
export async function updateSession(request: NextRequest) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL || '';
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
                         process.env.SUPABASE_ANON_KEY_LEGACY ||
                         process.env.SUPABASE_KEY ||
                         '';

  if (!supabaseUrl || !supabaseAnonKey) {
    // Guest mode - no auth check
    return NextResponse.next();
  }

  // Create Supabase client for middleware
  const supabase = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });

  // Refresh session if expired
  await supabase.auth.getSession();

  const response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  return response;
}

/**
 * Route guard helper
 * Korumalı route'lar için middleware kullanımı
 */
export const protectedRoutes = ['/dashboard', '/saved', '/compare'];
export const authRoutes = ['/auth/login', '/auth/register'];
export const publicRoutes = ['/', '/discover', '/search', '/vin', '/about', '/issues'];
