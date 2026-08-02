/**
 * KVC Cowork — Model Defaults
 * Replaces apps/app/src/app/defaults/models.ts
 *
 * Kimi 3 (Moonshot AI) = primary orchestrator
 * NVIDIA + Cloudflare Workers AI + OpenRouter free models = full fleet
 */

/**
 * Models shown with a star at the top of each provider's model list.
 * Kimi 3 leads as the KVC Cowork orchestrator of choice.
 */
export const RECOMMENDED_MODEL_PATTERNS: string[] = [
  // Kimi 3 — primary KVC orchestrator
  "kimi-k2",
  "kimi-k3",
  "moonshot-v1",

  // Anthropic — fallback orchestrator
  "claude-opus-4",
  "claude-sonnet-4",

  // NVIDIA — edge inference
  "nvidia/llama-3.1-nemotron-70b",
  "nvidia/llama-3.3-nemotron-super",
  "nvidia/mistral-nemo",

  // Cloudflare Workers AI — free edge models
  "cf/meta/llama-3.3-70b-instruct-fp8-fast",
  "cf/meta/llama-3.1-8b-instruct",
  "cf/mistral/mistral-7b-instruct-v0.2",

  // OpenRouter free tier
  "mistralai/mistral-7b-instruct:free",
  "meta-llama/llama-3.1-8b-instruct:free",
  "google/gemma-2-9b-it:free",
  "microsoft/phi-3-mini-128k-instruct:free",

  // GPT-4o
  "gpt-4o",
];

/**
 * The default model used when no preference is stored.
 * Kimi 3 is the KVC Cowork orchestrator.
 */
export const DEFAULT_MODEL = "kimi-k2";

/**
 * Provider display priority.
 * Kimi (Moonshot) sits first as the KVC primary orchestrator.
 */
export const PINNED_PROVIDER_ORDER = [
  "moonshot",   // Kimi 3 — KVC primary
  "cloudflare", // Edge AI — free
  "openrouter", // Multi-model gateway
  "nvidia",     // High-perf inference
  "anthropic",  // Claude fallback
  "openai",     // GPT fallback
  "google",     // Gemini
] as const;

/**
 * Provider metadata for display in the KVC Cowork UI.
 */
export const KVC_PROVIDER_META: Record<
  string,
  { label: string; badge?: string; color: string; free?: boolean }
> = {
  moonshot: {
    label: "Kimi (Moonshot AI)",
    badge: "KVC Primary",
    color: "#ff69b4",
  },
  cloudflare: {
    label: "Cloudflare Workers AI",
    badge: "Free · Edge",
    color: "#87ceeb",
    free: true,
  },
  openrouter: {
    label: "OpenRouter",
    badge: "Free tier available",
    color: "#ffd700",
    free: true,
  },
  nvidia: {
    label: "NVIDIA NIM",
    badge: "High perf",
    color: "#76b900",
  },
  anthropic: {
    label: "Anthropic",
    color: "#c96442",
  },
  openai: {
    label: "OpenAI",
    color: "#10a37f",
  },
  google: {
    label: "Google Gemini",
    color: "#4285f4",
  },
};

/**
 * Check if a model is in the recommended list.
 */
export function isRecommendedModel(modelId: string): boolean {
  const lower = modelId.toLowerCase();
  return RECOMMENDED_MODEL_PATTERNS.some((p) => lower.includes(p.toLowerCase()));
}

/**
 * Check if a provider offers free-tier models.
 */
export function isFreeTierProvider(providerId: string): boolean {
  return KVC_PROVIDER_META[providerId]?.free === true;
}

/**
 * Get provider display label.
 */
export function getProviderLabel(providerId: string): string {
  return KVC_PROVIDER_META[providerId]?.label ?? providerId;
}
