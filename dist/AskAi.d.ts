import type { CSSProperties, ReactNode } from "react";
import { type AskAiLinksOptions } from "./links.js";
export interface AskAiProps extends AskAiLinksOptions {
    /** Text above the icons, e.g. "Ask AI for a summary of Acme". Omit to render the icons alone. */
    label?: ReactNode;
    /** Accessible label per link. Defaults to "Ask {name} for a summary". */
    linkLabel?: (providerName: string) => string;
    /** Icon size in CSS pixels. Default 24. */
    size?: number;
    /** Gap between icons in CSS pixels. Default 16. */
    gap?: number;
    /** Class on the wrapper, for layout or to set the `--ask-ai-*` custom properties. */
    className?: string;
    style?: CSSProperties;
    /** Skip the built-in stylesheet and style the `ask-ai*` classes yourself. */
    unstyled?: boolean;
}
/**
 * A row of links that open an AI assistant with your prompt prefilled.
 * No hooks, no client JavaScript: it renders as a React Server Component.
 */
export declare function AskAi({ prompt, providers, label, linkLabel, size, gap, className, style, unstyled, }: AskAiProps): import("react").JSX.Element;
