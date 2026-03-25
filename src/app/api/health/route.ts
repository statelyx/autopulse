/**
 * AUTO PULSE — Health Check Endpoint
 *
 * Render health check için kullanılır.
 * Servis ayakta mı kontrol eder.
 */

import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json(
    {
      status: 'ok',
      service: 'auto-pulse',
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV || 'unknown',
    },
    { status: 200 }
  );
}

export const dynamic = 'force-dynamic';
