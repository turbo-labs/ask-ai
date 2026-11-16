/** The built-in providers, in display order. None of them need an API key: each is a plain prefill URL. */
export const providers = {
    chatgpt: { id: "chatgpt", name: "ChatGPT", url: (q) => `https://chat.openai.com/?prompt=${q}` },
    claude: { id: "claude", name: "Claude", url: (q) => `https://claude.ai/new?q=${q}` },
    perplexity: { id: "perplexity", name: "Perplexity", url: (q) => `https://perplexity.ai/search/new?q=${q}` },
    grok: { id: "grok", name: "Grok", url: (q) => `https://x.com/i/grok?text=${q}` },
    gemini: { id: "gemini", name: "Gemini", url: (q) => `https://www.google.com/search?udm=50&aep=11&q=${q}` },
};
export const defaultProviders = ["chatgpt", "claude", "perplexity", "grok", "gemini"];
/** Framework-free core: returns one link per provider with the prompt prefilled. */
export function askAiLinks({ prompt, providers: selected = defaultProviders }) {
    const q = encodeURIComponent(prompt);
    return selected.map((entry) => {
        const provider = typeof entry === "string" ? providers[entry] : entry;
        if (!provider)
            throw new Error(`ask-ai: unknown provider "${String(entry)}"`);
        return { id: provider.id, name: provider.name, href: provider.url(q), icon: provider.icon };
    });
}
