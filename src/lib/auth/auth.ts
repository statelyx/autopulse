/**
 * AUTO PULSE — Auth Helpers
 * Email authentication ve guest mode için yardımcı fonksiyonlar
 */

import { supabase, isSupabaseConfigured } from '@/lib/supabase/client';
import { isGuestMode as checkGuestMode } from '@/lib/supabase/client';
import type { AuthError, User } from '@supabase/supabase-js';

// Re-export isGuestMode for convenience
export const isGuestMode = checkGuestMode;

/**
 * Auth Response Type
 */
export interface AuthResult {
  success: boolean;
  user?: User | null;
  error?: string;
}

/**
 * Email ile kayıt
 */
export async function signUp(email: string, password: string, fullName?: string): Promise<AuthResult> {
  if (isGuestMode()) {
    return {
      success: false,
      error: 'Supabase yapılandırılmadı. Guest mode aktif.',
    };
  }

  if (!supabase) {
    return { success: false, error: 'Supabase client bulunamadı.' };
  }

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: fullName,
      },
    },
  });

  if (error) {
    return { success: false, error: error.message };
  }

  return { success: true, user: data.user };
}

/**
 * Email ile giriş
 */
export async function signIn(email: string, password: string): Promise<AuthResult> {
  if (isGuestMode()) {
    return {
      success: false,
      error: 'Supabase yapılandırılmadı. Guest mode aktif.',
    };
  }

  if (!supabase) {
    return { success: false, error: 'Supabase client bulunamadı.' };
  }

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return { success: false, error: error.message };
  }

  return { success: true, user: data.user };
}

/**
 * Çıkış
 */
export async function signOut(): Promise<{ success: boolean; error?: string }> {
  if (isGuestMode() || !supabase) {
    return { success: true }; // Guest mode'da çıkış anlamsız
  }

  const { error } = await supabase.auth.signOut();

  if (error) {
    return { success: false, error: error.message };
  }

  return { success: true };
}

/**
 * Mevcut kullanıcıyı al
 */
export async function getCurrentUser() {
  if (isGuestMode() || !supabase) {
    return null;
  }

  const { data: { user } } = await supabase.auth.getUser();
  return user;
}

/**
 * Oturum durumunu kontrol et
 */
export async function getSession() {
  if (isGuestMode() || !supabase) {
    return null;
  }

  const { data: { session } } = await supabase.auth.getSession();
  return session;
}

/**
 * Auth state değişikliklerini dinle
 */
export function onAuthStateChange(callback: (event: string, session: any) => void) {
  if (isGuestMode() || !supabase) {
    return { data: { subscription: null } };
  }

  return supabase.auth.onAuthStateChange((event: string, session: any) => {
    callback(event, session);
  });
}

/**
 * Şifre sıfırlama isteği
 */
export async function resetPassword(email: string): Promise<AuthResult> {
  if (isGuestMode() || !supabase) {
    return {
      success: false,
      error: 'Supabase yapılandırılmadı. Guest mode aktif.',
    };
  }

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${window.location.origin}/auth/reset-password`,
  });

  if (error) {
    return { success: false, error: error.message };
  }

  return { success: true };
}

/**
 * Şifre güncelleme
 */
export async function updatePassword(newPassword: string): Promise<AuthResult> {
  if (isGuestMode() || !supabase) {
    return {
      success: false,
      error: 'Supabase yapılandırılmadı.',
    };
  }

  const { error } = await supabase.auth.updateUser({
    password: newPassword,
  });

  if (error) {
    return { success: false, error: error.message };
  }

  return { success: true };
}
