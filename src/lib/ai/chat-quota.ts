export const CHAT_QUOTA_LIMIT = 3;
export const CHAT_QUOTA_WINDOW_MS = 3 * 60 * 60 * 1000;
export const CHAT_QUOTA_COOKIE = 'autopulse-chat-quota';
export const MEMBERSHIP_COOKIE = 'autopulse-membership';

export type ChatQuotaState = {
  used: number;
  windowStartedAt: number;
};

export function getDefaultQuotaState(now = Date.now()): ChatQuotaState {
  return {
    used: 0,
    windowStartedAt: now,
  };
}

export function parseQuotaCookie(value?: string | null, now = Date.now()): ChatQuotaState {
  if (!value) {
    return getDefaultQuotaState(now);
  }

  try {
    const parsed = JSON.parse(value) as Partial<ChatQuotaState>;
    if (typeof parsed.used !== 'number' || typeof parsed.windowStartedAt !== 'number') {
      return getDefaultQuotaState(now);
    }

    if (now - parsed.windowStartedAt >= CHAT_QUOTA_WINDOW_MS) {
      return getDefaultQuotaState(now);
    }

    return {
      used: Math.max(0, Math.min(parsed.used, CHAT_QUOTA_LIMIT)),
      windowStartedAt: parsed.windowStartedAt,
    };
  } catch {
    return getDefaultQuotaState(now);
  }
}

export function buildQuotaSnapshot(state: ChatQuotaState, isPremium: boolean, now = Date.now()) {
  const resetAt = state.windowStartedAt + CHAT_QUOTA_WINDOW_MS;
  const remaining = isPremium ? Infinity : Math.max(0, CHAT_QUOTA_LIMIT - state.used);

  return {
    isPremium,
    used: state.used,
    limit: CHAT_QUOTA_LIMIT,
    remaining,
    resetAt,
    blocked: !isPremium && state.used >= CHAT_QUOTA_LIMIT && now < resetAt,
  };
}

export function consumeQuota(state: ChatQuotaState, isPremium: boolean) {
  if (isPremium) {
    return state;
  }

  return {
    ...state,
    used: Math.min(CHAT_QUOTA_LIMIT, state.used + 1),
  };
}
