'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';

import { formatTryPrice } from '@/lib/formatters/currency';

type ChatVehicle = {
  id: string;
  brand: string;
  model: string;
  year: number;
  price: number;
  fuelType: string;
  bodyType: string;
  horsepower: number;
};

type ChatResponse = {
  blocked: boolean;
  answer: string;
  vehicles?: ChatVehicle[];
  quota: {
    isPremium: boolean;
    used: number;
    limit: number;
    remaining: number;
    resetAt: number;
    blocked: boolean;
  };
  suggestedAction?: {
    href: string;
    label: string;
  } | null;
};

type Message = {
  id: string;
  role: 'user' | 'assistant';
  text: string;
  vehicles?: ChatVehicle[];
};

function formatResetTime(timestamp: number) {
  return new Intl.DateTimeFormat('tr-TR', {
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(timestamp));
}

export function AIChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      role: 'assistant',
      text: 'Araç seçimi, kronik sorunlar, fiyat bandı ve karşılaştırma için sorunu yaz. Ücretsiz kullanım 3 saatte 3 sorudur.',
    },
  ]);
  const [quota, setQuota] = useState<ChatResponse['quota'] | null>(null);
  const [cta, setCta] = useState<ChatResponse['suggestedAction'] | null>(null);

  const placeholder = useMemo(() => (
    quota?.blocked
      ? 'Ücretsiz hak doldu. Üyelik veya reset süresini bekle.'
      : 'Örn: 2024 aile SUV öner, BMW M3 mü Audi RS5 mi?'
  ), [quota?.blocked]);

  async function submitMessage() {
    const message = input.trim();
    if (!message || isLoading || quota?.blocked) return;

    setInput('');
    setIsLoading(true);
    setMessages((prev) => [...prev, { id: `${Date.now()}-user`, role: 'user', text: message }]);

    try {
      const response = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message }),
      });

      const data = await response.json() as ChatResponse;
      setQuota(data.quota);
      setCta(data.suggestedAction ?? null);
      setMessages((prev) => [
        ...prev,
        {
          id: `${Date.now()}-assistant`,
          role: 'assistant',
          text: data.answer,
          vehicles: data.vehicles,
        },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: `${Date.now()}-assistant-error`,
          role: 'assistant',
          text: 'Yanıt alınamadı. Birkaç saniye sonra tekrar dene.',
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className="fixed bottom-5 right-5 z-[70] flex items-center gap-3 rounded-full border border-amber-400/30 bg-[#171411]/95 px-4 py-3 text-sm font-semibold text-amber-100 shadow-[0_18px_50px_rgba(0,0,0,0.45)] backdrop-blur"
      >
        <span className="flex h-10 w-10 items-center justify-center rounded-full bg-amber-400 text-[#1a1408]">
          <span className="material-symbols-outlined text-xl">smart_toy</span>
        </span>
        <span className="hidden sm:block">AI Asistan</span>
      </button>

      {isOpen && (
        <div className="fixed bottom-24 right-5 z-[70] flex h-[70vh] w-[calc(100vw-2.5rem)] max-w-[420px] flex-col overflow-hidden rounded-[28px] border border-white/10 bg-[#0f0c0a]/96 shadow-[0_28px_90px_rgba(0,0,0,0.55)] backdrop-blur-xl">
          <div className="border-b border-white/10 bg-gradient-to-r from-amber-500/10 via-white/0 to-orange-500/10 px-5 py-4">
            <div className="flex items-center justify-between gap-4">
              <div>
                <div className="text-xs uppercase tracking-[0.32em] text-amber-200/70">Auto Pulse AI</div>
                <div className="mt-1 text-sm text-stone-300">Araç sorularına kısa ve net cevap verir.</div>
              </div>
              <button type="button" onClick={() => setIsOpen(false)} className="text-stone-400 transition hover:text-white">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            <div className="mt-4 flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 px-3 py-2 text-xs text-stone-300">
              <span>
                {quota?.isPremium
                  ? 'Premium aktif'
                  : `Kalan ücretsiz soru: ${quota ? quota.remaining : 3}/3`}
              </span>
              <span>
                {quota?.isPremium || !quota ? '3 saatlik pencere' : `Reset: ${formatResetTime(quota.resetAt)}`}
              </span>
            </div>
          </div>

          <div className="flex-1 space-y-4 overflow-y-auto px-4 py-4">
            {messages.map((message) => (
              <div key={message.id} className={message.role === 'user' ? 'ml-8' : 'mr-8'}>
                <div
                  className={`rounded-3xl px-4 py-3 text-sm leading-6 ${
                    message.role === 'user'
                      ? 'bg-amber-400 text-[#241907]'
                      : 'border border-white/10 bg-white/5 text-stone-200'
                  }`}
                >
                  {message.text}
                </div>
                {message.vehicles && message.vehicles.length > 0 && (
                  <div className="mt-3 grid gap-2">
                    {message.vehicles.map((vehicle) => (
                      <Link
                        key={vehicle.id}
                        href={`/vehicle/${vehicle.id}`}
                        className="rounded-2xl border border-white/10 bg-black/20 px-3 py-3 transition hover:border-amber-400/30 hover:bg-black/30"
                      >
                        <div className="text-xs uppercase tracking-[0.28em] text-stone-500">
                          {vehicle.year} · {vehicle.bodyType}
                        </div>
                        <div className="mt-1 text-sm font-semibold text-white">
                          {vehicle.brand} {vehicle.model}
                        </div>
                        <div className="mt-1 text-xs text-stone-400">
                          {vehicle.fuelType} · {vehicle.horsepower} hp · {formatTryPrice(vehicle.price)}
                        </div>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
            {isLoading && (
              <div className="mr-8 rounded-3xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-stone-400">
                Yanıt hazırlanıyor...
              </div>
            )}
          </div>

          <div className="border-t border-white/10 p-4">
            {cta && (
              <Link
                href={cta.href}
                className="mb-3 block rounded-2xl border border-amber-400/20 bg-amber-400/10 px-4 py-3 text-sm text-amber-100 transition hover:bg-amber-400/15"
              >
                {cta.label}
              </Link>
            )}
            <div className="flex items-end gap-3 rounded-[24px] border border-white/10 bg-white/5 p-2">
              <textarea
                value={input}
                onChange={(event) => setInput(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === 'Enter' && !event.shiftKey) {
                    event.preventDefault();
                    void submitMessage();
                  }
                }}
                rows={2}
                placeholder={placeholder}
                className="max-h-32 min-h-[52px] flex-1 resize-none bg-transparent px-3 py-2 text-sm text-white outline-none placeholder:text-stone-500"
              />
              <button
                type="button"
                onClick={() => void submitMessage()}
                disabled={isLoading || !input.trim() || quota?.blocked}
                className="rounded-2xl bg-amber-400 px-4 py-3 text-sm font-semibold text-[#241907] transition hover:brightness-105 disabled:cursor-not-allowed disabled:opacity-40"
              >
                Gönder
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
