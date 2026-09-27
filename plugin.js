import { APPEARANCE_AREAS, ROUTES_AREA, PALETTE_AREA, host } from '@hermes/plugin-sdk'
import { useState } from 'react'
import { jsx, jsxs } from 'react/jsx-runtime'

// Desktop already shares --composer-width between transcript, composer and
// its backing layers. Override only that token, not scroll/layout containers.
const MIN = 480
const MAX = 1800
const DEFAULT = 900
const normalize = value => Number.isFinite(Number(value)) && Number(value) > 0
  ? Math.min(MAX, Math.max(MIN, Math.round(Number(value)))) : DEFAULT

export default {
  id: 'session-width',
  name: 'Session Width',
  register(ctx) {
    const saved = ctx.storage.get('preferences')
    let preferences = { width: normalize(saved?.width ?? DEFAULT), fullWidth: saved?.fullWidth === true }
    const style = document.createElement('style')
    style.dataset.hermesPlugin = 'session-width'
    document.head.appendChild(style)
    const apply = () => {
      style.textContent = `:root { --composer-width: ${preferences.fullWidth ? '100%' : preferences.width + 'px'} !important; }`
    }
    apply()
    ctx.onDispose(() => style.remove())

    function Settings() {
      const [state, setState] = useState(preferences)
      const [draft, setDraft] = useState(String(preferences.width))
      const update = next => {
        preferences = { ...preferences, ...next }
        ctx.storage.set('preferences', preferences)
        apply()
        setState(preferences)
      }
      const commit = () => {
        const width = normalize(draft)
        setDraft(String(width))
        update({ width })
      }
      return jsxs('section', {
        'aria-label': 'Session Width',
        style: { padding: '16px', border: '1px solid var(--ui-stroke-secondary)', borderRadius: '8px', color: 'var(--ui-text-primary)' },
        children: [
          jsx('h3', { style: { margin: '0 0 8px', fontWeight: 600 }, children: 'Session Width' }),
          jsx('p', { style: { color: 'var(--ui-text-secondary)', margin: '0 0 12px', fontSize: '13px' }, children: 'Center the conversation and composer within a maximum width. Applies to all sessions; narrow panes still fit.' }),
          jsxs('label', { style: { display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }, children: [
            jsx('input', { type: 'checkbox', checked: state.fullWidth, onChange: e => update({ fullWidth: e.target.checked }) }),
            'Full width'
          ] }),
          jsxs('div', { style: { display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '12px' }, children: [
            jsx('input', { type: 'range', min: MIN, max: MAX, step: 10, value: state.width, disabled: state.fullWidth, 'aria-label': 'Session width slider', style: { flex: '1 1 160px', accentColor: 'var(--ui-accent)' }, onChange: e => { const width = normalize(e.target.value); setDraft(String(width)); update({ width }) } }),
            jsx('input', { type: 'number', min: MIN, max: MAX, step: 10, value: draft, disabled: state.fullWidth, 'aria-label': 'Maximum session width', style: { width: '88px', padding: '6px', border: '1px solid var(--ui-stroke-secondary)', borderRadius: '4px', background: 'transparent', color: 'inherit' }, onChange: e => { setDraft(e.target.value); const width = Number(e.target.value); if (width >= MIN && width <= MAX) update({ width: Math.round(width) }) }, onBlur: commit, onKeyDown: e => { if (e.key === 'Enter') { commit(); e.currentTarget.blur() } } }),
            jsx('span', { children: 'px' })
          ] })
        ]
      })
    }
    ctx.register({ id: 'settings', area: APPEARANCE_AREAS.extra, render: () => jsx(Settings, {}) })
    ctx.register({ id: 'page', area: ROUTES_AREA, data: { path: '/session-width' }, render: () => jsx(Settings, {}) })
    ctx.register({ id: 'open', area: PALETTE_AREA, data: { id: 'session-width.open', label: 'Session Width', keywords: ['width', 'appearance'], run: () => host.navigate('/session-width') } })
  }
}
