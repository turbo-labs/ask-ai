export type AskAiProviderId = "chatgpt" | "claude" | "perplexity" | "grok" | "gemini" | "copilot" | "mistral";
export interface AskAiProvider {
    /** Stable identifier, also emitted as `data-ask-ai` on the link. */
    id: string;
    /** Display name, used in the link's accessible label. */
    name: string;
    /** Builds the provider URL from the already URL-encoded prompt. */
    url: (encodedPrompt: string) => string;
    /** Icon `src`. Built-in providers ship one; custom providers supply their own. */
    icon?: string;
}
export interface AskAiLink {
    id: string;
    name: string;
    href: string;
    icon?: string;
}
/** The built-in providers. None of them need an API key: each is a plain prefill URL. */
export declare const providers: Record<AskAiProviderId, AskAiProvider>;
/** The row shown when `providers` is omitted. `copilot` and `mistral` are built in but opt-in. */
export declare const defaultProviders: AskAiProviderId[];
export interface AskAiLinksOptions {
    /** The question to prefill. Write it as the visitor would ask it, and name your product or domain. */
    prompt: string;
    /** Which providers to include, in order. Built-in ids or custom provider objects. Defaults to `defaultProviders`. */
    providers?: Array<AskAiProviderId | AskAiProvider>;
}
/** Framework-free core: returns one link per provider with the prompt prefilled. */
export declare function askAiLinks({ prompt, providers: selected }: AskAiLinksOptions): AskAiLink[];
