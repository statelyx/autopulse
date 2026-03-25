/**
 * AUTO PULSE — API Status Endpoint
 *
 * Tüm servislerin durumunu raporlar.
 */

import { NextResponse } from 'next/server';

export async function GET() {
  const startTime = Date.now();

  // Supabase bağlantı kontrolü
  const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  // Hugging Face key kontrolü
  const hfFinegrainedKey = process.env.HF_FINEGRAINED_API_KEY;
  const hfZeroShotKey = process.env.HF_ZEROSHOT_API_KEY;
  const hfSummarizationKey = process.env.HF_SUMMARIZATION_API_KEY;

  const response = {
    service: 'auto-pulse-api',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    responseTime: Date.now() - startTime,
    environment: process.env.NODE_ENV || 'unknown',
    integrations: {
      supabase: {
        configured: !!supabaseUrl && !!supabaseKey,
        url: supabaseUrl ? `${supabaseUrl.substring(0, 20)}...` : null,
      },
      huggingface: {
        finegrained: {
          configured: !!hfFinegrainedKey,
          keyPresent: hfFinegrainedKey ? 'hf_...' : null,
        },
        zeroshot: {
          configured: !!hfZeroShotKey,
          keyPresent: hfZeroShotKey ? 'hf_...' : null,
        },
        summarization: {
          configured: !!hfSummarizationKey,
          keyPresent: hfSummarizationKey ? 'hf_...' : null,
        },
      },
    },
    endpoints: [
      { method: 'GET', path: '/api/health', description: 'Health check' },
      { method: 'GET', path: '/api/status', description: 'API status' },
      { method: 'GET', path: '/api/env-check', description: 'Environment check' },
    ],
  };

  return NextResponse.json(response, { status: 200 });
}

export const dynamic = 'force-dynamic';
