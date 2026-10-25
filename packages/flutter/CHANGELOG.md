## 0.1.0

First release: the Flutter port of trc ui 0.5.

- Tokens and theme: `TrcThemeData` (a `ThemeExtension`), `TrcTheme`, `toMaterialTheme()`; the accent drives the soft accent and the focus ring. Montserrat bundled.
- Typography: `TrcHeading` with an accent word between asterisks, `TrcText`, `TrcAccentText`, `plainText`, `TrcStepNumber`, `TrcEnter`.
- `TrcPillButton`: the stretching dot on hover and keyboard focus, a short stretch on touch, solid and compact variants, loading state, custom icon.
- Surfaces: `TrcCard` (alt tone, interactive, watermark icon), `TrcSection` (inset card), `TrcContainer`.
- Forms: `TrcField`, `TrcTextField`, `TrcTextArea`, `TrcSelect`, `TrcCheckbox`, `TrcSwitch`, `TrcRadioGroup`, `TrcPasswordField`, `TrcPinInput`, `TrcCombobox`, `TrcSlider`, `TrcDatePicker`, `TrcFileField` and `TrcDropzone` (with `acceptsFile`, `validateFiles`, `formatBytes`).
- Overlays and feedback: `showTrcDialog`, `showTrcDrawer`, `TrcMenu`, `TrcPopover`, `TrcTooltip`, `TrcToaster` and `TrcToast`, `TrcAlert`.
- Navigation: `TrcTabs`, `TrcSegmentedControl`, `TrcAccordion`, `TrcBreadcrumbs`, `TrcPagination` (`paginationRange`), `TrcLanguageSwitcher`, `TrcSteps`, and `TrcBottomNav` (floating or docked, sliding accent pill, badges, glass).
- Data display: `TrcAvatar`, `TrcAvatarGroup`, `TrcTag`, `TrcStat`, `TrcTable`, `TrcSkeleton`, `TrcSpinner`, `TrcProgress`, `TrcKbd`, `TrcDivider`, `TrcCodeBlock`.
- App chrome: `TrcHeader`, `TrcPageHero`, `TrcBackToTop`.
- Semantics, keyboard support and reduced motion throughout; every built-in text translatable.
