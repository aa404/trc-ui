# trc_ui

Flutter widgets with a deep black design: near-black backgrounds, graphite cards, thin Montserrat headings, one accent color and pill buttons whose dot stretches on hover.

The Flutter port of [trc ui](https://ui.theringconcept.com), the React library.

[![pub](https://img.shields.io/pub/v/trc_ui?color=08c8d8&label=pub)](https://pub.dev/packages/trc_ui)
[![license](https://img.shields.io/badge/license-MIT-08c8d8)](https://github.com/aa404/trc-ui/blob/main/packages/flutter/LICENSE)

![A page built with trc_ui: floating header, inset hero with an accent glow, pill buttons](https://raw.githubusercontent.com/aa404/trc-ui/main/packages/flutter/doc/screenshots/hero.png)

- **Sober.** Near-black backgrounds, graphite cards, one accent color. Depth comes from shades of grey, not shadows.
- **Thin.** Light Montserrat headings, bundled with the package, with one accent word per title.
- **Alive.** Pills that stretch, cards that wake up on hover, a header that blurs as you scroll, a bottom bar whose pill slides.
- **Accessible.** Semantics on every control, keyboard focus and arrow keys on desktop and web, reduced motion respected, every built-in text translatable.
- **Light.** No dependency besides Flutter.

## Installation

```bash
flutter pub add trc_ui
```

Requires Flutter 3.32 or later.

## Setup

Give your `MaterialApp` the trc theme, and place the toaster once if you use toasts:

```dart
import 'package:flutter/material.dart';
import 'package:trc_ui/trc_ui.dart';

void main() => runApp(const App());

class App extends StatelessWidget {
  const App({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      theme: const TrcThemeData().toMaterialTheme(),
      builder: (context, child) => TrcToaster(child: child!),
      home: const HomePage(),
    );
  }
}
```

`toMaterialTheme()` builds a dark Material theme in the trc style (accent as primary, flat graphite surfaces, Montserrat) and registers the tokens, so the trc widgets and the Material widgets you keep look alike. Text fields rely on Material's `TextField`, so keep a `MaterialApp` (or Material localizations) above them.

## Usage

```dart
Column(
  crossAxisAlignment: CrossAxisAlignment.start,
  children: [
    const TrcHeading('Welcome to *deep black.*', level: 1, size: TrcHeadingSize.display),
    const SizedBox(height: 24),
    const TrcText('The words between asterisks take the accent color.', size: TrcTextSize.lg),
    const SizedBox(height: 32),
    TrcPillButton(label: 'Get started', solid: true, onPressed: () {}),
  ],
)
```

![Pill buttons: solid, outlined, hovered with the stretched dot, back, compact, loading and disabled](https://raw.githubusercontent.com/aa404/trc-ui/main/packages/flutter/doc/screenshots/pill.png)

## Components

| Widgets | What they are |
| --- | --- |
| `TrcHeading`, `TrcText`, `TrcAccentText`, `TrcStepNumber`, `TrcEnter` | Thin headings with an accent word, body text, large thin step numbers, a soft entrance. |
| `TrcPillButton` | The signature pill: a round accent dot that stretches to fill the pill on hover and keyboard focus. |
| `TrcCard`, `TrcSection`, `TrcContainer` | Graphite cards (interactive, with a watermark icon), inset sections, centered containers. |
| `TrcField`, `TrcTextField`, `TrcTextArea`, `TrcSelect`, `TrcCheckbox`, `TrcSwitch` | Form controls; `TrcField` gives its control the label, hint, error and required state. |
| `TrcRadioGroup`, `TrcPasswordField`, `TrcPinInput`, `TrcCombobox`, `TrcSlider`, `TrcDatePicker` | Choices, Show / Hide password, one-time codes, accent-insensitive search, range, calendar. |
| `TrcFileField`, `TrcDropzone` | File controls with validation by type, size and count; your app does the picking. |
| `showTrcDialog`, `showTrcDrawer`, `TrcMenu`, `TrcPopover`, `TrcTooltip` | Modal window, side panel, menu of actions, floating panel, tooltip. |
| `TrcToaster`, `TrcToast`, `TrcAlert` | Toasts with one action, paused on hover; inline alerts with a thin colored edge. |
| `TrcTabs`, `TrcSegmentedControl`, `TrcAccordion`, `TrcBreadcrumbs`, `TrcPagination`, `TrcLanguageSwitcher`, `TrcSteps` | Navigation within a screen. |
| `TrcBottomNav` | Bottom navigation: docked bar or floating capsule, sliding accent pill, badges, optional glass. |
| `TrcAvatar`, `TrcAvatarGroup`, `TrcTag`, `TrcStat`, `TrcTable` | People, labels, key figures, a sortable table. |
| `TrcSkeleton`, `TrcSpinner`, `TrcProgress`, `TrcKbd`, `TrcDivider`, `TrcCodeBlock` | Loading states, keys, hairlines, code with a copy button. |
| `TrcHeader`, `TrcPageHero`, `TrcBackToTop` | App chrome: a floating header that blurs on scroll, an inset hero, a back-to-top button. |

![Form controls: labels, hint, error, and a select open on its list](https://raw.githubusercontent.com/aa404/trc-ui/main/packages/flutter/doc/screenshots/forms.png)

![A menu of actions open under its pill, and alerts with a thin colored edge](https://raw.githubusercontent.com/aa404/trc-ui/main/packages/flutter/doc/screenshots/overlays.png)

![Avatars, tags, key figures in graphite cards and a sortable table](https://raw.githubusercontent.com/aa404/trc-ui/main/packages/flutter/doc/screenshots/data.png)

## Bottom navigation

```dart
Scaffold(
  extendBody: true, // the content scrolls behind the bar
  body: content,
  bottomNavigationBar: TrcBottomNav(
    items: const [
      TrcBottomNavItem(icon: Icon(Icons.home_outlined), label: 'Home'),
      TrcBottomNavItem(icon: Icon(Icons.search), label: 'Search'),
      TrcBottomNavItem(icon: Icon(Icons.chat_bubble_outline), label: 'Messages', badge: 3),
    ],
    currentIndex: index,
    onTap: (i) => setState(() => index = i),
    glass: true,
  ),
)
```

`style` picks a floating capsule (the default) or a docked `TrcBottomNavStyle.bar`; `labels` shows them always, for the selected item only, or never (screen readers still read them). Items take an optional `activeIcon`, a `badge` count or a `dot`. `glass: true` gives a translucent graphite background that blurs the content behind it (`blurSigma`, `glassOpacity`). Height, colors, radius, margins, spacing and a `centerAction` are configurable.

<img src="https://raw.githubusercontent.com/aa404/trc-ui/main/packages/flutter/doc/screenshots/bottom-nav.png" alt="A floating glass bottom navigation over scrolling cards, the Home item in an accent pill" width="320" />

## Theming

Every color, radius and motion setting is a token of `TrcThemeData`. Change the accent once; the soft accent and the focus ring follow:

```dart
final tokens = const TrcThemeData().copyWith(
  accent: const Color(0xFFD41367),
  onAccent: Colors.white, // text on the accent: near black by default
);

MaterialApp(theme: tokens.toMaterialTheme());
```

To theme a single area, wrap it in `TrcTheme(data: tokens, child: ...)`. Widgets read the tokens with `TrcTheme.of(context)`.

## Translations

Every built-in text is a parameter with an English default: `closeLabel`, `previousLabel`, `placeholder`… Texts that hold a value take a template, such as `pageLabel: 'Page {page}'`, `moreLabel: '{count} more'` or `badgeLabel: '{count} new'`. The date picker takes its month and day names from the app's `MaterialLocalizations`.

## Files

trc_ui does not open file pickers or receive dropped files itself, since that needs platform plugins. `TrcFileField` and `TrcDropzone` take an `onPick` callback that returns `TrcFile`s (name, size, media type and your own data), for instance from the `file_picker` package. They check, list and announce the files; `acceptsFile`, `validateFiles` and `formatBytes` are available on their own. To support drag and drop, call `TrcDropzoneState.add` from your drop plugin and set `dragging` while files hover.

## Notes

- Code blocks and keyboard keys use the platform's monospace font. Flutter web has no system fonts: set `monoFontFamily` to a monospace font your app bundles.
- Not ported from the React library: the site footer and the video hero (they need web pages and video plugins), and links rendered as `<a>` elements (use `onTap` with your router).

## Fonts

Montserrat is bundled with the package under the [SIL Open Font License 1.1](https://github.com/aa404/trc-ui/blob/main/packages/flutter/fonts/OFL.txt), copyright The Montserrat Project Authors.

## License

[MIT](https://github.com/aa404/trc-ui/blob/main/packages/flutter/LICENSE), by Aurel Agbado, [The Ring Concept](https://www.theringconcept.com/).
