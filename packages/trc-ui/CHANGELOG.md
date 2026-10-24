# Changelog

## Unreleased

### Overlays and feedback

- `Dialog`: modal window with title, description and actions; focus kept inside, Escape and overlay to close, focus returned.
- `Drawer`: side panel from the left or right, on the same modal layer; the `SiteHeader` mobile menu now uses it.
- `DropdownMenu`: menu of actions with full keyboard support (arrows, Home, End, typeahead), disabled and destructive items, links.
- `Popover`: non-modal floating panel, focus moved inside, Escape and outside click to close; controlled or not.
- `Tooltip`: on hover and keyboard focus, tied with `aria-describedby`, hoverable and dismissable with Escape.
- `toast()` and `Toaster`: global queue, polite announcements and immediate ones for errors, pause on hover and focus, one action.
- `Alert`: inline message with a thin colored edge.
- Floating elements are portaled and placed against their trigger, flipping when there is no room.

### Fixes

- Header dropdowns opened by hovering no longer close on the click that follows.
- Derived accent tokens follow an accent overridden on a single area.

## 0.1.0

First public release.

- Design tokens as CSS variables prefixed with `--trc-`, with a single themable accent color.
- Typography: `Heading` with an accent word between asterisks, `Text`, `AccentText`, `plainText`, `StepNumber`.
- Pill buttons: `PillButton` and `PillLink`, with the stretching dot, a compact size, a solid variant and a loading state.
- Surfaces: `Card` (alt tone, interactive, watermark icon), `Section` (inset card), `Container`.
- Forms: `Field`, `Input`, `Textarea`, `Select`, `Checkbox`, `Switch`, wired for screen readers.
- Site chrome: `SiteHeader` (floating, dropdowns, accessible mobile panel) and `SiteFooter`.
- Heroes: `PageHero`, `HeroVideo` (crossfading videos, soft parallax) and `BackToTop`.
- ESM and CommonJS builds, TypeScript types, `"use client"` for the Next.js App Router.
