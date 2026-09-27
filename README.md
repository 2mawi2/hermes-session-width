# Session Width — Hermes Desktop plugin

Limits and centers the session transcript and composer to a maximum width in the [Hermes desktop app](https://hermes-agent.nousresearch.com).

## Features

- Max-width slider + numeric input (480–1800 px, default 900 px)
- Full-width toggle
- Applies to transcript and composer together (overrides the app's shared `--composer-width` token only; scroll containers untouched)
- Preference persists across restarts, removes its styles cleanly when disabled

## Install

```sh
mkdir -p ~/.hermes/desktop-plugins/session-width
curl -o ~/.hermes/desktop-plugins/session-width/plugin.js \
  https://raw.githubusercontent.com/2mawi2/hermes-session-width/main/plugin.js
```

The app hot-loads it within a few seconds (fallback: ⌘K → "Reload desktop plugins").

## Use

⌘K → **Session Width**. Enable/disable in Settings → Plugins.

## Notes

Single plain-JS file, no build step, no Hermes core changes. It overrides the CSS custom property `--composer-width` — the one internal detail to re-check after app updates.
