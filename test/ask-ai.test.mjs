// Runs against dist/ — the files consumers actually import.
import assert from "node:assert/strict"
import { describe, it } from "node:test"
import { createElement as h } from "react"
import { renderToStaticMarkup } from "react-dom/server"
import { AskAi, askAiLinks } from "../dist/index.js"
import { askAiLinks as linksOnly } from "../dist/links.js"

const prompt = "How can acme.com help me? What's the catch & cost?"
const count = (html, re) => (html.match(re) ?? []).length

describe("askAiLinks", () => {
  it("returns the five providers in order with the prompt encoded", () => {
    const links = askAiLinks({ prompt })
    const q = encodeURIComponent(prompt)
    assert.deepEqual(
      links.map((l) => [l.id, l.href]),
      [
        ["chatgpt", `https://chat.openai.com/?prompt=${q}`],
        ["claude", `https://claude.ai/new?q=${q}`],
        ["perplexity", `https://perplexity.ai/search/new?q=${q}`],
        ["grok", `https://x.com/i/grok?text=${q}`],
        ["gemini", `https://www.google.com/search?udm=50&aep=11&q=${q}`],
      ],
    )
    // The "&" inside the prompt must not split the query string.
    assert.equal(new URL(links[1].href).searchParams.get("q"), prompt)
  })

  it("selects, orders and extends providers", () => {
    const links = askAiLinks({
      prompt,
      providers: ["claude", { id: "mistral", name: "Le Chat", url: (q) => `https://chat.mistral.ai/chat?q=${q}` }],
    })
    assert.deepEqual(links.map((l) => l.id), ["claude", "mistral"])
    assert.ok(links[1].href.startsWith("https://chat.mistral.ai/chat?q=How%20can"))
  })

  it("rejects an unknown provider id", () => {
    assert.throws(() => askAiLinks({ prompt, providers: ["copilot"] }), /unknown provider/)
  })

  it("is importable without React from the /links entry", () => {
    assert.equal(linksOnly({ prompt, providers: ["grok"] }).length, 1)
  })
})

describe("<AskAi>", () => {
  it("renders labelled, safe external links with inline icons", () => {
    const html = renderToStaticMarkup(h(AskAi, { prompt, label: "Ask AI for a summary of Acme" }))
    assert.ok(html.includes("Ask AI for a summary of Acme"))
    assert.equal(count(html, /<a /g), 5)
    assert.equal(count(html, /target="_blank" rel="noopener noreferrer"/g), 5)
    assert.equal(count(html, /src="data:image\/png;base64,/g), 5)
    assert.ok(html.includes('data-ask-ai="claude"'))
    assert.ok(html.includes("Ask Claude for a summary"))
    assert.ok(html.includes("<style>"))
    // Icon size must outrank a host's global `img { height: auto }` reset.
    assert.ok(html.includes(".ask-ai .ask-ai-icon{height:var(--ask-ai-size,24px)"))
    // Host-tunable values are custom properties (layered utilities can't override unlayered rules).
    for (const v of ["--ask-ai-size", "--ask-ai-gap", "--ask-ai-opacity", "--ask-ai-label-color", "--ask-ai-label-size", "--ask-ai-label-leading", "--ask-ai-label-gap"])
      assert.ok(html.includes(`var(${v},`), v)
  })

  it("marks the wrapper for the dark theme without touching the provider attribute", () => {
    const light = renderToStaticMarkup(h(AskAi, { prompt }))
    const dark = renderToStaticMarkup(h(AskAi, { prompt, theme: "dark" }))
    assert.ok(light.startsWith('<div class="ask-ai"><style>'))
    assert.ok(dark.includes('<div class="ask-ai" data-ask-ai-theme="dark"'))
    // Click tracking keys on [data-ask-ai]; the wrapper must not match it.
    assert.equal(count(dark, / data-ask-ai="/g), 5)
    // The edge is transparent unless the host or the dark theme sets it, and dark only changes fallbacks.
    assert.ok(dark.includes("outline:1px solid var(--ask-ai-edge,transparent)"))
    assert.ok(dark.includes('[data-ask-ai-theme="dark"] .ask-ai-icon){outline-color:var(--ask-ai-edge,rgb(255 255 255/.28))}'))
    assert.ok(dark.includes('[data-ask-ai-theme="dark"] .ask-ai-link){opacity:var(--ask-ai-opacity,.9)}'))
  })

  it("supports unstyled, sizing and a custom link label", () => {
    const html = renderToStaticMarkup(
      h(AskAi, { prompt, unstyled: true, size: 32, providers: ["grok"], linkLabel: (n) => `Open ${n}` }),
    )
    assert.ok(!html.includes("<style>"))
    assert.ok(!html.includes("ask-ai-label"))
    assert.ok(html.includes("--ask-ai-size:32px"))
    assert.ok(html.includes('title="Open Grok"'))
  })

  it("falls back to the name for a custom provider without an icon", () => {
    const html = renderToStaticMarkup(
      h(AskAi, { prompt, providers: [{ id: "x", name: "Le Chat", url: (q) => `https://e.test/?q=${q}` }] }),
    )
    assert.ok(html.includes(">Le Chat</a>"))
    assert.ok(!html.includes("<img"))
  })
})
