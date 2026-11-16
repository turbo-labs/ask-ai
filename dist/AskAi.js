import { jsx as _jsx, Fragment as _Fragment, jsxs as _jsxs } from "react/jsx-runtime";
import { icons } from "./icons.js";
import { askAiLinks } from "./links.js";
const builtinIcons = icons;
// Zero specificity (:where), so unlayered host CSS wins. Utilities that live in
// a cascade layer (Tailwind 4) lose to any unlayered rule whatever its
// specificity, so everything a host may want to change is a custom property.
// Icon size is the one rule with real specificity: global `img` resets
// (`height:auto`, `max-width:100%`) would otherwise blow the icons up to
// their natural size.
const css = `
:where(.ask-ai-label){margin:0 0 var(--ask-ai-label-gap,12px);font-size:var(--ask-ai-label-size,12px);line-height:var(--ask-ai-label-leading,1.5);color:var(--ask-ai-label-color,inherit)}
:where(.ask-ai-links){display:flex;flex-wrap:wrap;align-items:center;gap:var(--ask-ai-gap,16px)}
:where(.ask-ai-link){display:inline-flex;opacity:var(--ask-ai-opacity,.7);transition:opacity .15s ease}
:where(.ask-ai-link:hover,.ask-ai-link:focus-visible){opacity:1}
:where(.ask-ai-icon){display:block;border-radius:22%}
.ask-ai .ask-ai-icon{height:var(--ask-ai-size,24px);width:auto;max-width:none}
:where(.ask-ai-sr){position:absolute;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;clip:rect(0,0,0,0);white-space:nowrap;border:0}
`.trim();
/**
 * A row of links that open an AI assistant with your prompt prefilled.
 * No hooks, no client JavaScript: it renders as a React Server Component.
 */
export function AskAi({ prompt, providers, label, linkLabel = (name) => `Ask ${name} for a summary`, size, gap, className, style, unstyled = false, }) {
    const links = askAiLinks({ prompt, providers });
    const vars = {};
    if (size !== undefined)
        vars["--ask-ai-size"] = `${size}px`;
    if (gap !== undefined)
        vars["--ask-ai-gap"] = `${gap}px`;
    return (_jsxs("div", { className: className ? `ask-ai ${className}` : "ask-ai", style: { ...vars, ...style }, children: [!unstyled && _jsx("style", { dangerouslySetInnerHTML: { __html: css } }), label != null && _jsx("p", { className: "ask-ai-label", children: label }), _jsx("div", { className: "ask-ai-links", children: links.map((link) => {
                    const text = linkLabel(link.name);
                    const icon = link.icon ?? builtinIcons[link.id];
                    return (_jsx("a", { href: link.href, target: "_blank", rel: "noopener noreferrer", title: text, className: "ask-ai-link", "data-ask-ai": link.id, children: icon ? (_jsxs(_Fragment, { children: [_jsx("img", { src: icon, alt: "", width: size ?? 24, height: size ?? 24, loading: "lazy", decoding: "async", className: "ask-ai-icon" }), _jsx("span", { className: "ask-ai-sr", children: text })] })) : (link.name) }, link.id));
                }) })] }));
}
