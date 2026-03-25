/**
 * AUTO PULSE — Supabase Server Client
 * Server-side Supabase istemcisi (Service Role key ile)
 */

import { createClient } from '@supabase/supabase-js';

// Environment variables
const supabaseUrl = process.env.SUPABASE_URL ||
                    process.env.NEXT_PUBLIC_SUPABASE_URL ||
                    '';

const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY ||
                           process.env.SUPABASE_SECRETKEY ||
                           '';

// Validate
if (!supabaseUrl) {
  console.warn('Supabase Server: URL bulunamadı.');
}

/**
 * Server client oluşturur (admin yetkileri ile)
 * Sadece server-side kullanılmalı (API routes, server components)
 */
export function createServerClient() {
  if (!supabaseUrl || !supabaseServiceKey) {
    console.warn('Supabase server client yapılandırılmadı.');
    return null;
  }

  return createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}

/**
 * Server client instance (singleton pattern)
 */
let serverClient: ReturnType<typeof createServerClient> | null = null;

export function getServerClient() {
  if (!serverClient) {
    serverClient = createServerClient();
  }
  return serverClient;
}
