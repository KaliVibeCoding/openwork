/**
 * KVC Cowork — Provider Priority & Config
 * Replaces apps/app/src/app/utils/providers.ts
 *
 * Provider priority:
 *   1. Moonshot / Kimi 3  — KVC primary orchestrator
 *   2. Cloudflare         — free edge inference
 *   3. OpenRouter         — free tier multi-model
 *   4. NVIDIA             — high-perf inference
 *   5. Anthropic          — Claude fallback
 *   6. OpenAI             — GPT fallback
 *   7. Everything else
 */

import type { ProviderListResponse } from "@opencode-ai/sdk/v2/client";

export const PINNED_PROVIDER_ORDER = [
  "moonshot",
  "cloudflare",
  "openrouter",
  "nvidia",
  "anthropic",
  "openai",
  "google",
] as const;

export const providerPriorityRank = (id: string): number => {
  const normalized = id.trim().toLowerCase();
  const index = PINNED_PROVIDER_ORDER.indexOf(
    normalized as (typeof PINNED_PROVIDER_ORDER)[number],
  );
  return index === -1 ? PINNED_PROVIDER_ORDER.length : index;
};

export const compareProviders = (
  a: { id: string; name?: string },
  b: { id: string; name?: string },
): number => {
  const rankDiff = providerPriorityRank(a.id) - providerPriorityRank(b.id);
  if (rankDiff !== 0) return rankDiff;

  const aName = (a.name ?? a.id).trim();
  const bName = (b.name ?? b.id).trim();
  return aName.localeCompare(bName);
};

export const filterProviderList = (
  value: ProviderListResponse,
  disabledProviders: string[],
): ProviderListResponse => {
  const disabled = new Set(
    disabledProviders.flatMap((id) => {
      const trimmed = id.trim();
      return trimmed ? [trimmed] : [];
    }),
  );
  if (!disabled.size) return value;
  return {
    all: value.all.filter((provider) => !disabled.has(provider.id)),
    connected: value.connected.filter((id) => !disabled.has(id)),
  };
};

/* ── Kimi 3 / Moonshot AI config ─────────────────────────── */
/**
 * Kimi 3 provider config for the OpenWork settings file.
 * API key is stored in keychain — never hardcoded.
 *
 * Add to ~/.openwork/config.json under "providers":
 */
export const KIMI_PROVIDER_CONFIG = {
  id: "moonshot",
  name: "Kimi (Moonshot AI)",
  apiBaseUrl: "https://api.moonshot.cn/v1",
  // API key set via: openwork config set moonshot.apiKey <your-key>
  // or store in env: MOONSHOT_API_KEY
  models: [
    {
      id: "moonshot-v1-128k",
      name: "Kimi 3 — 128K",
      contextLength: 131072,
      capabilities: ["chat", "vision", "function-calling"],
      recommended: true,
    },
    {
      id: "moonshot-v1-32k",
      name: "Kimi 3 — 32K",
      contextLength: 32768,
      capabilities: ["chat", "vision", "function-calling"],
      recommended: false,
    },
    {
      id: "moonshot-v1-8k",
      name: "Kimi 3 — 8K",
      contextLength: 8192,
      capabilities: ["chat"],
      recommended: false,
    },
  ],
} as const;

/* ── Cloudflare Workers AI config ─────────────────────────── */
export const CLOUDFLARE_PROVIDER_CONFIG = {
  id: "cloudflare",
  name: "Cloudflare Workers AI",
  // Account ID set via env: CF_ACCOUNT_ID
  // API token set via: openwork config set cloudflare.apiKey <token>
  apiBaseUrl: "https://api.cloudflare.com/client/v4/accounts/{CF_ACCOUNT_ID}/ai/v1",
  models: [
    {
      id: "@cf/meta/llama-3.3-70b-instruct-fp8-fast",
      name: "Llama 3.3 70B (Fast)",
      contextLength: 131072,
      free: true,
      recommended: true,
    },
    {
      id: "@cf/meta/llama-3.1-8b-instruct",
      name: "Llama 3.1 8B",
      contextLength: 131072,
      free: true,
      recommended: false,
    },
    {
      id: "@cf/mistral/mistral-7b-instruct-v0.2",
      name: "Mistral 7B",
      contextLength: 32768,
      free: true,
      recommended: false,
    },
    {
      id: "@cf/google/gemma-7b-it",
      name: "Gemma 7B",
      contextLength: 8192,
      free: true,
      recommended: false,
    },
    {
      id: "@cf/baai/bge-large-en-v1.5",
      name: "BGE Embeddings (large)",
      contextLength: 512,
      free: true,
      type: "embedding",
    },
  ],
} as const;

/* ── NVIDIA NIM config ────────────────────────────────────── */
export const NVIDIA_PROVIDER_CONFIG = {
  id: "nvidia",
  name: "NVIDIA NIM",
  apiBaseUrl: "https://integrate.api.nvidia.com/v1",
  // API key set via: openwork config set nvidia.apiKey <token>
  models: [
    {
      id: "nvidia/llama-3.1-nemotron-70b-instruct",
      name: "Nemotron 70B",
      contextLength: 131072,
      recommended: true,
    },
    {
      id: "nvidia/llama-3.3-nemotron-super-49b-v1",
      name: "Nemotron Super 49B",
      contextLength: 131072,
      recommended: true,
    },
    {
      id: "nvidia/mistral-nemo-minitron-8b-8k-instruct",
      name: "Mistral NeMo 8B",
      contextLength: 8192,
      recommended: false,
    },
  ],
} as const;

/* ── OpenRouter config (free tier models) ─────────────────── */
export const OPENROUTER_FREE_MODELS = [
  "mistralai/mistral-7b-instruct:free",
  "meta-llama/llama-3.1-8b-instruct:free",
  "google/gemma-2-9b-it:free",
  "microsoft/phi-3-mini-128k-instruct:free",
  "qwen/qwen-2-7b-instruct:free",
  "huggingfaceh4/zephyr-7b-beta:free",
] as const;

export const OPENROUTER_PROVIDER_CONFIG = {
  id: "openrouter",
  name: "OpenRouter",
  apiBaseUrl: "https://openrouter.ai/api/v1",
  // API key set via: openwork config set openrouter.apiKey <key>
  // Free tier available — no billing required for :free models
  freeModels: OPENROUTER_FREE_MODELS,
} as const;
