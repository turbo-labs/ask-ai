import type { CSSProperties, ReactNode } from "react"
import { icons } from "./icons.js"
import { askAiLinks, type AskAiLinksOptions } from "./links.js"

export interface AskAiProps extends AskAiLinksOptions {
  /** Text above the icons, e.g. "Ask AI for a summary of Acme". Omit to render the icons alone. */
  label?: ReactNode
  /** Accessible label per link. Defaults to "Ask {name} for a summary". */
  linkLabel?: (providerName: string) => string
  /** Icon size in CSS pixels. Default 24. */
  size?: number
  /** Gap between icons in CSS pixels. Default 16. */
  gap?: number
  /** Class on the wrapper, for layout or to set the `--ask-ai-*` custom properties. */
  className?: string
  style?: CSSProperties
  /** Skip the built-in stylesheet and style the `ask-ai*` classes yourself. */
  unstyled?: boolean
}

const builtinIcons: Record<string, string> = icons

// Zero specificity (:where), so unlayered host CSS wins. Utilities that live in
// a cascade layer (Tailwind 4) lose to any unlayered rule whatever its
// specificity, so everything a host may want to change is a custom property.
const css = `
:where(.ask-ai-label){margin:0 0 var(--ask-ai-label-gap,12px);font-size:var(--ask-ai-label-size,12px);line-height:var(--ask-ai-label-leading,1.5);color:var(--ask-ai-label-color,inherit)}
:where(.ask-ai-links){display:flex;flex-wrap:wrap;align-items:center;gap:var(--ask-ai-gap,16px)}
:where(.ask-ai-link){display:inline-flex;opacity:var(--ask-ai-opacity,.7);transition:opacity .15s ease}
:where(.ask-ai-link:hover,.ask-ai-link:focus-visible){opacity:1}
:where(.ask-ai-icon){display:block;height:var(--ask-ai-size,24px);width:auto;border-radius:22%}
:where(.ask-ai-sr){position:absolute;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;clip:rect(0,0,0,0);white-space:nowrap;border:0}
`.trim()

/**
 * A row of links that open an AI assistant with your prompt prefilled.
 * No hooks, no client JavaScript: it renders as a React Server Component.
 */
export function AskAi({
  prompt,
  providers,
  label,
  linkLabel = (name) => `Ask ${name} for a summary`,
  size,
  gap,
  className,
  style,
  unstyled = false,
}: AskAiProps) {
  const links = askAiLinks({ prompt, providers })
  const vars: Record<string, string> = {}
  if (size !== undefined) vars["--ask-ai-size"] = `${size}px`
  if (gap !== undefined) vars["--ask-ai-gap"] = `${gap}px`

  return (
    <div className={className ? `ask-ai ${className}` : "ask-ai"} style={{ ...vars, ...style } as CSSProperties}>
      {!unstyled && <style dangerouslySetInnerHTML={{ __html: css }} />}
      {label != null && <p className="ask-ai-label">{label}</p>}
      <div className="ask-ai-links">
        {links.map((link) => {
          const text = linkLabel(link.name)
          const icon = link.icon ?? builtinIcons[link.id]
          return (
            <a
              key={link.id}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              title={text}
              className="ask-ai-link"
              data-ask-ai={link.id}
            >
              {icon ? (
                <>
                  <img
                    src={icon}
                    alt=""
                    width={size ?? 24}
                    height={size ?? 24}
                    loading="lazy"
                    decoding="async"
                    className="ask-ai-icon"
                  />
                  <span className="ask-ai-sr">{text}</span>
                </>
              ) : (
                link.name
              )}
            </a>
          )
        })}
      </div>
    </div>
  )
}
