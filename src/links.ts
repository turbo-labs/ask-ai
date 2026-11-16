export type AskAiProviderId = "chatgpt" | "claude" | "perplexity" | "grok" | "gemini" | "copilot" | "mistral"

export interface AskAiProvider {
  /** Stable identifier, also emitted as `data-ask-ai` on the link. */
  id: string
  /** Display name, used in the link's accessible label. */
  name: string
  /** Builds the provider URL from the already URL-encoded prompt. */
  url: (encodedPrompt: string) => string
  /** Icon `src`. Built-in providers ship one; custom providers supply their own. */
  icon?: string
}

export interface AskAiLink {
  id: string
  name: string
  href: string
  icon?: string
}

/** The built-in providers. None of them need an API key: each is a plain prefill URL. */
export const providers: Record<AskAiProviderId, AskAiProvider> = {
  chatgpt: { id: "chatgpt", name: "ChatGPT", url: (q) => `https://chat.openai.com/?prompt=${q}` },
  claude: { id: "claude", name: "Claude", url: (q) => `https://claude.ai/new?q=${q}` },
  perplexity: { id: "perplexity", name: "Perplexity", url: (q) => `https://perplexity.ai/search/new?q=${q}` },
  grok: { id: "grok", name: "Grok", url: (q) => `https://x.com/i/grok?text=${q}` },
  gemini: { id: "gemini", name: "Gemini", url: (q) => `https://www.google.com/search?udm=50&aep=11&q=${q}` },
  // Opt-in. copilot.microsoft.com/?q= drops the prompt for signed-out visitors, so this
  // opens Bing's Copilot search, which answers without an account.
  copilot: { id: "copilot", name: "Copilot", url: (q) => `https://www.bing.com/copilotsearch?q=${q}` },
  // Opt-in. Mistral's assistant (Vibe, formerly Le Chat).
  mistral: { id: "mistral", name: "Mistral", url: (q) => `https://chat.mistral.ai/chat?q=${q}` },
}

/** The row shown when `providers` is omitted. `copilot` and `mistral` are built in but opt-in. */
export const defaultProviders: AskAiProviderId[] = ["chatgpt", "claude", "perplexity", "grok", "gemini"]

export interface AskAiLinksOptions {
  /** The question to prefill. Write it as the visitor would ask it, and name your product or domain. */
  prompt: string
  /** Which providers to include, in order. Built-in ids or custom provider objects. Defaults to `defaultProviders`. */
  providers?: Array<AskAiProviderId | AskAiProvider>
}

/** Framework-free core: returns one link per provider with the prompt prefilled. */
export function askAiLinks({ prompt, providers: selected = defaultProviders }: AskAiLinksOptions): AskAiLink[] {
  const q = encodeURIComponent(prompt)
  return selected.map((entry) => {
    const provider = typeof entry === "string" ? providers[entry] : entry
    if (!provider) throw new Error(`ask-ai: unknown provider "${String(entry)}"`)
    return { id: provider.id, name: provider.name, href: provider.url(q), icon: provider.icon }
  })
}
