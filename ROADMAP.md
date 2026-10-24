# Roadmap

What comes next for trc ui, release by release. Every component ships with its documentation page in English and French, live demos and a props table, and follows the design rules: a single accent color, no shadows, thin headings, no icons in badges, no icons in buttons other than the pill arrow.

## 0.2 — Overlays and feedback

- [ ] `Dialog`: modal window with title, description and actions; focus kept inside, closes with Escape (reuses `useModal`).
- [ ] `Drawer`: side panel from the left or right, extracted from the `SiteHeader` mobile menu.
- [ ] `DropdownMenu`: menu of actions, arrow keys and typeahead.
- [ ] `Popover`: floating panel anchored to a trigger.
- [ ] `Tooltip`: on hover and focus, with a delay; never the only way to get the information.
- [ ] `Toast` and `Toaster`: announced to screen readers, paused on hover, stacked at the bottom.
- [ ] `Alert`: inline message (info, success, error) without a colored icon badge.

## 0.3 — Navigation

- [ ] `Tabs`: keyboard navigation with arrow keys (roving tabindex).
- [ ] `SegmentedControl`: the pill switch used in the colors generator.
- [ ] `Accordion`: one or several items open, animated height; the base of a FAQ.
- [ ] `Breadcrumbs`.
- [ ] `Pagination`.
- [ ] `LanguageSwitcher`: the EN / FR switch of the docs, as a component.
- [ ] `Steps`: a vertical timeline built on `StepNumber`.

## 0.4 — Forms

- [ ] `RadioGroup`.
- [ ] `PasswordInput`: show and hide the password.
- [ ] `PinInput`: one-time codes (OTP), with paste support.
- [ ] `Combobox`: search with suggestions.
- [ ] `FileInput` and `Dropzone`.
- [ ] `Slider`.
- [ ] `DatePicker`.

## 0.5 — Data display

- [ ] `Avatar` and `AvatarGroup`.
- [ ] `Tag`: small label for metadata; never placed over photos.
- [ ] `Stat`: a key figure with its label.
- [ ] `Table`: dense and readable, with sortable headers.
- [ ] `Skeleton`, `Spinner` and `Progress`.
- [ ] `Kbd` and `Divider`.
- [ ] `CodeBlock`: the docs code block with its copy button, as a component.

## 0.6 — Showcase blocks

Ready-made sections for landing pages, assembled from the components above.

- [ ] `FeatureGrid`: pillar cards with watermark icons.
- [ ] `PricingTable` and `PricingCard`.
- [ ] `Testimonial`.
- [ ] `LogoCloud`.
- [ ] `FaqSection`: built on `Accordion`.
- [ ] `CtaBanner`: an inset section with a heading and pills.
- [ ] `AuthLayout`: sign-in and sign-up screens, a card on one side and the form on the other.
- [ ] `PhoneMockup`: an animated product screen in the same design.

## Quality and tooling

- [ ] Unit tests with Vitest and Testing Library, accessibility checks with axe.
- [ ] Visual regression tests with Playwright screenshots (desktop and mobile).
- [ ] CI on pull requests: typecheck, build, tests.
- [ ] Release automation with Changesets, and npm provenance.
- [ ] Remove `apps/playground` once the docs cover every component.

Not planned on purpose: a light theme (the design is always dark), secondary accent colors and gradients, keyword marquees.
