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

### Navigation

- `Tabs`: thin labels underlined with the accent, roving tabindex, automatic or manual activation.
- `SegmentedControl`: pill switch built on native radio buttons.
- `Accordion`: single or multiple, animated height, closed content out of the accessibility tree, arrow keys between titles.
- `Breadcrumbs`: trail to the current page.
- `Pagination`: constant-width range with ellipses, buttons or links (`href` function or `"/page/{page}"` pattern, usable from server components).
- `LanguageSwitcher`: the EN | FR pill, as links (with `lang` and `hreflang`) or buttons.
- `Steps`: vertical timeline with large thin numbers and the current step.

### Forms

- `RadioGroup`: native radio buttons in a fieldset, hint and error tied to the group, vertical or horizontal.
- `PasswordInput`: Show / Hide button whose accessible name includes its visible text.
- `PinInput`: one box per character, paste and text-message autofill, Backspace and arrow keys.
- `Combobox`: search with suggestions, case and accent insensitive, `aria-activedescendant` keyboard navigation.
- `FileInput` and `Dropzone`: native file input, drag and drop, validation by type, size and count, announced rejections; `formatBytes`, `acceptsFile` and `validateFiles` helpers.
- `Slider`: native range input filled with the accent, formatted and announced value.
- `DatePicker`: calendar dialog with full keyboard support, `Intl` month and day names, min and max dates.

### Data display

- `Avatar` and `AvatarGroup`: picture or initials, overlapping group with a counter.
- `Tag`: small label, accent tone, optional remove button.
- `Stat`: key figure in a large thin number, with its change.
- `Table`: captioned data table, sortable columns announced with `aria-sort`, keyboard-scrollable region.
- `Skeleton`, `Spinner` and `Progress`: loading placeholders, status spinner, determinate or indeterminate progress bar.
- `Kbd` and `Divider`: keyboard keys, hairlines with an optional label.
- `CodeBlock`: file tab and copy button; bring your own highlighting.

### Tooling

- Unit and accessibility tests (Vitest, Testing Library, axe) for every component.
- Label props that took a function (`moreLabel`, `pageLabel`, `charLabel`, `countLabel`, `removeLabel`, `rejectionLabel`) also accept string templates such as `"{count} more"`, usable from server components.

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
