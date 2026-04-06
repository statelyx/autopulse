/**
 * AUTO PULSE — Supabase Client (Browser)
 * Client-side Supabase istemcisi
 */

import { createClient } from '@supabase/supabase-js';

// Environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ||
                    process.env.SUPABASE_URL ||
                    '';

const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
                        process.env.SUPABASE_ANON_KEY_LEGACY ||
                        process.env.SUPABASE_KEY ||
                        '';

// Validate required variables
if (!supabaseUrl && process.env.NODE_ENV === 'development') {
  console.warn('Supabase URL bulunamadı. Guest mode aktif.');
}

if (!supabaseAnonKey && process.env.NODE_ENV === 'development') {
  console.warn('Supabase Anon Key bulunamadı. Guest mode aktif.');
}

// Create client (guest mode - no auth required for basic operations)
export const supabase = !supabaseUrl || !supabaseAnonKey
  ? null // Guest mode
  : createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
        flowType: 'pkce', // Recommended for browser
      },
    });

/**
 * Helper: Supabase bağlantısı kontrol et
 */
export function isSupabaseConfigured(): boolean {
  return supabase !== null;
}

/**
 * Helper: Guest mode kontrolü
 */
export function isGuestMode(): boolean {
  return supabase === null;
}
