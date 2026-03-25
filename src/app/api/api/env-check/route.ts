/**
 * AUTO PULSE — Environment Check Endpoint
 *
 * Hangi environment değişkenlerinin mevcut olduğunu raporlar.
 * Secret değerleri açığa çıkarmaz, sadece varlığını kontrol eder.
 */

import { NextResponse } from 'next/server';

// Mask value helper
function maskValue(value: string | undefined, showLength = 8): string | null {
  if (!value) return null;
  if (value.length <= showLength) return '***';
  return `${value.substring(0, showLength)}...`;
}

export async function GET() {
  const envVars = {
    // Next.js Core
    NODE_ENV: process.env.NODE_ENV,
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
    NEXT_PUBLIC_APP_NAME: process.env.NEXT_PUBLIC_APP_NAME,

    // Supabase
    SUPABASE_URL: maskValue(process.env.SUPABASE_URL),
    SUPABASE_KEY: maskValue(process.env.SUPABASE_KEY),
    SUPABASE_ANON_KEY_LEGACY: maskValue(process.env.SUPABASE_ANON_KEY_LEGACY),
    SUPABASE_SECRETKEY: maskValue(process.env.SUPABASE_SECRETKEY),
    NEXT_PUBLIC_SUPABASE_URL: maskValue(process.env.NEXT_PUBLIC_SUPABASE_URL),
    NEXT_PUBLIC_SUPABASE_ANON_KEY: maskValue(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY),
    SUPABASE_SERVICE_ROLE_KEY: maskValue(process.env.SUPABASE_SERVICE_ROLE_KEY),

    // Hugging Face
    HF_FINEGRAINED_API_KEY: maskValue(process.env.HF_FINEGRAINED_API_KEY),
    HF_ZEROSHOT_API_KEY: maskValue(process.env.HF_ZEROSHOT_API_KEY),
    HF_SUMMARIZATION_API_KEY: maskValue(process.env.HF_SUMMARIZATION_API_KEY),
    HUGGINGFACE_API_KEY: maskValue(process.env.HUGGINGFACE_API_KEY),

    // Render
    RENDER_API_URL: process.env.RENDER_API_URL,
    RENDER_INTERNAL_API_URL: process.env.RENDER_INTERNAL_API_URL,
  };

  // Hangi değişkenlerin mevcut olduğunu listele
  const presentVars = Object.entries(envVars)
    .filter(([_, value]) => value !== null && value !== undefined && value !== '')
    .map(([key]) => key);

  const missingVars = Object.entries(envVars)
    .filter(([_, value]) => value === null || value === undefined || value === '')
    .map(([key]) => key);

  const response = {
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'unknown',
    summary: {
      total: Object.keys(envVars).length,
      present: presentVars.length,
      missing: missingVars.length,
    },
    present: presentVars.sort(),
    missing: missingVars.sort(),
    values: envVars,
  };

  return NextResponse.json(response, { status: 200 });
}

export const dynamic = 'force-dynamic';
