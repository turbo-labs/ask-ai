# ask-ai

A row of "ask AI about this product" links for your website. One click opens ChatGPT, Claude, Perplexity, Grok or Gemini in a new tab with your question already typed in.

It is a set of plain prefill URLs, so there is no API key, no backend and no client-side JavaScript. The React component has no hooks and renders as a Server Component.

<img src="docs/ask-ai-light.png" alt="The ask-ai row on a light background: the label “Ask AI for a summary of Acme” above ChatGPT, Claude, Perplexity, Grok and Gemini icons" width="420">

<img src="docs/ask-ai-dark.png" alt="The same row on a dark background with theme set to dark: each icon has a hairline light edge" width="420">

Extracted from the footer of [shipstar.ai](https://shipstar.ai).

## Install

The package is installed straight from GitHub (the built files are committed, so there is no build step on install):

```bash
npm install github:turbo-labs/ask-ai#v0.1.3
```

Requires React 18 or newer.

## Use

```tsx
import { AskAi } from "@turbo-labs/ask-ai"

export function Footer() {
  return (
    <AskAi
      label="Ask AI for a summary of Acme"
      prompt="How can acme.com help me ship faster? What are the key benefits versus doing it by hand?"
    />
  )
}
```

Write the prompt the way a visitor would ask it, and name your domain so the assistant looks at your site rather than guessing.

### Props

| Prop | Type | Default | |
|---|---|---|---|
| `prompt` | `string` | required | The question to prefill. |
| `label` | `ReactNode` | none | Text above the icons. |
| `providers` | `Array<id \| AskAiProvider>` | all five | Which assistants to show, in order. Ids: `chatgpt`, `claude`, `perplexity`, `grok`, `gemini`. |
| `linkLabel` | `(name) => string` | `Ask {name} for a summary` | Accessible name and tooltip of each link. |
| `size` | `number` | `24` | Icon size in px. |
| `gap` | `number` | `16` | Space between icons in px. |
| `theme` | `"light" \| "dark"` | `"light"` | The surface the row sits on. See [Dark surfaces](#dark-surfaces). |
| `className`, `style` | | | Applied to the wrapper. |
| `unstyled` | `boolean` | `false` | Skip the built-in styles. |

### Styling

The label inherits your text colour and font, so a colour class on the wrapper is usually all it needs. Everything else is a custom property, set on the wrapper or any ancestor:

| Property | Default | |
|---|---|---|
| `--ask-ai-size` | `24px` | Icon height. Set this rather than sizing `.ask-ai-icon` directly: the size rule is deliberately specific enough to survive global `img` resets. |
| `--ask-ai-gap` | `16px` | Space between icons. |
| `--ask-ai-opacity` | `0.7` (`0.9` on dark) | Resting opacity; links go to `1` on hover and focus. |
| `--ask-ai-edge` | `transparent` (`rgb(255 255 255 / .28)` on dark) | Colour of the 1px edge around each icon. |
| `--ask-ai-label-color` | `inherit` | |
| `--ask-ai-label-size` | `12px` | |
| `--ask-ai-label-leading` | `1.5` | Label line height. |
| `--ask-ai-label-gap` | `12px` | Space between label and icons. |

With Tailwind:

```tsx
<AskAi className="text-neutral-400 [--ask-ai-label-leading:1rem]" label="…" prompt="…" />
```

Use the properties rather than targeting the inner classes with utilities: Tailwind 4 emits utilities inside a cascade layer, and layered rules lose to the component's unlayered ones whatever their specificity. Plain unlayered CSS does override them (the built-in rules have zero specificity), and `unstyled` drops them entirely. Classes: `ask-ai`, `ask-ai-label`, `ask-ai-links`, `ask-ai-link`, `ask-ai-icon`.

### Dark surfaces

The Perplexity and Grok icons are near-black tiles, so on a dark footer they sink into the background. Pass `theme="dark"`:

```tsx
<AskAi theme="dark" className="text-neutral-400" label="…" prompt="…" />
```

Every icon gets a hairline light edge and the resting opacity rises to `0.9`. The theme only changes the defaults, so `--ask-ai-edge` and `--ask-ai-opacity` still override it. It is a prop rather than a `prefers-color-scheme` query because a dark footer on a light site is the common case. The wrapper carries `data-ask-ai-theme="dark"` if you want to hook your own CSS onto it.

### Tracking clicks

Each link carries `data-ask-ai="<provider id>"`, so a delegated listener or a tag-manager click trigger can count them without the component shipping any JavaScript.

### Another assistant

Pass a provider object. `url` receives the prompt already URL-encoded.

```tsx
<AskAi
  prompt="…"
  providers={[
    "chatgpt",
    "claude",
    { id: "lechat", name: "Le Chat", url: (q) => `https://chat.mistral.ai/chat?q=${q}`, icon: "/lechat.png" },
  ]}
/>
```

### Without React

```ts
import { askAiLinks } from "@turbo-labs/ask-ai/links"

askAiLinks({ prompt: "What does acme.com do?" })
// [{ id: "chatgpt", name: "ChatGPT", href: "https://chat.openai.com/?prompt=What%20does…" }, …]
```

The icons are in `assets/` as 64px PNGs if you render the links yourself.

## Provider URLs

| Assistant | URL |
|---|---|
| ChatGPT | `https://chat.openai.com/?prompt=…` |
| Claude | `https://claude.ai/new?q=…` |
| Perplexity | `https://perplexity.ai/search/new?q=…` |
| Grok | `https://x.com/i/grok?text=…` |
| Gemini | `https://www.google.com/search?udm=50&aep=11&q=…` (Google AI Mode) |

These are the vendors' own prefill parameters and they change them now and then. If one stops working, please open an issue or a pull request against `src/links.ts`.

## Develop

```bash
npm install
npm test          # builds, then runs node:test against dist/
npm run typecheck
```

`dist/` and `src/icons.ts` are generated and committed; CI fails if they are stale, so run `npm test` (or `npm run build`) before committing. To change an icon, replace the PNG in `assets/` and rebuild.

## Licence

MIT. The assistant names and logos are trademarks of their respective owners and are used here only to identify the services the links open.
