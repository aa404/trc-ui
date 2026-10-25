import 'package:flutter/widgets.dart';

import 'focus_ring.dart';
import 'foundation.dart';
import 'icons.dart';
import 'theme.dart';

/// Pages to show: always the first and the last, the current one with
/// [siblings] on each side, and ellipses (null) in between. The number of
/// entries stays constant, so the controls do not jump around.
List<int?> paginationRange(int page, int total, {int siblings = 1}) {
  final slots = siblings * 2 + 5;
  List<int> range(int from, int to) => [for (var i = from; i <= to; i++) i];
  if (total <= slots) return range(1, total);
  if (page <= siblings + 3) return [...range(1, slots - 2), null, total];
  if (page >= total - siblings - 2) {
    return [1, null, ...range(total - slots + 3, total)];
  }
  return [1, null, ...range(page - siblings, page + siblings), null, total];
}

/// Page navigation: numbers with ellipses, previous and next. Stays on one
/// line on small screens.
class TrcPagination extends StatelessWidget {
  /// Pagination at [page] (from 1) of [total].
  const TrcPagination({
    super.key,
    required this.page,
    required this.total,
    required this.onChanged,
    this.siblings = 1,
    this.semanticLabel = 'Pagination',
    this.previousLabel = 'Previous',
    this.nextLabel = 'Next',
    this.pageLabel = 'Page {page}',
  });

  /// Current page, from 1.
  final int page;

  /// Number of pages; nothing is shown for a single page.
  final int total;

  /// Called with the new page.
  final ValueChanged<int> onChanged;

  /// Pages shown on each side of the current one.
  final int siblings;

  /// Accessible name of the navigation.
  final String semanticLabel;

  /// Accessible name of the previous button.
  final String previousLabel;

  /// Accessible name of the next button.
  final String nextLabel;

  /// Accessible name of a page number, with `{page}`.
  final String pageLabel;

  @override
  Widget build(BuildContext context) {
    if (total <= 1) return const SizedBox.shrink();
    final theme = TrcTheme.of(context);
    final compact = MediaQuery.sizeOf(context).width <= 480;
    final gap = compact ? 2.0 : 6.0;

    Widget control({
      required int target,
      required Widget child,
      required String label,
      bool current = false,
    }) {
      final disabled = target < 1 || target > total;
      return Semantics(
        button: true,
        selected: current,
        enabled: !disabled,
        label: label,
        container: true,
        child: TrcTappable(
          excludeChildSemantics: true,
          enabled: !disabled,
          cursor: current ? SystemMouseCursors.basic : null,
          onTap: () {
            if (!current) onChanged(target);
          },
          builder: (context, state) {
            final lit = state.hovered && !current;
            return TrcFocusRing(
              visible: state.focused,
              borderRadius: BorderRadius.circular(999),
              child: Opacity(
                opacity: disabled ? 0.35 : 1,
                child: AnimatedContainer(
                  duration: const Duration(milliseconds: 200),
                  constraints: BoxConstraints(minWidth: compact ? 32 : 40),
                  height: compact ? 34 : 40,
                  padding: EdgeInsets.symmetric(horizontal: compact ? 4 : 10),
                  alignment: Alignment.center,
                  decoration: BoxDecoration(
                    borderRadius: BorderRadius.circular(999),
                    color: lit
                        ? const Color(0x0FFFFFFF)
                        : const Color(0x00FFFFFF),
                    border: Border.all(
                      color: current
                          ? theme.borderPill
                          : const Color(0x00FFFFFF),
                    ),
                  ),
                  child: IconTheme(
                    data: IconThemeData(
                      size: 18,
                      color: lit ? theme.foreground : theme.foregroundMuted,
                    ),
                    child: DefaultTextStyle(
                      style: theme
                          .text(
                            size: 14,
                            height: 1,
                            color: current
                                ? theme.accent
                                : lit
                                ? theme.foreground
                                : theme.foregroundMuted,
                          )
                          .copyWith(
                            fontFeatures: const [FontFeature.tabularFigures()],
                          ),
                      child: child,
                    ),
                  ),
                ),
              ),
            );
          },
        ),
      );
    }

    final entries = paginationRange(page, total, siblings: siblings);
    return Semantics(
      label: semanticLabel,
      container: true,
      explicitChildNodes: true,
      child: FittedBox(
        fit: BoxFit.scaleDown,
        alignment: AlignmentDirectional.centerStart,
        child: Row(
          mainAxisSize: MainAxisSize.min,
          children: [
            control(
              target: page - 1,
              label: previousLabel,
              child: const TrcIcon(TrcGlyph.arrowLeft),
            ),
            for (final entry in entries) ...[
              SizedBox(width: gap),
              if (entry == null)
                ExcludeSemantics(
                  child: SizedBox(
                    width: compact ? 16 : 24,
                    child: Text(
                      '…',
                      textAlign: TextAlign.center,
                      style: theme.text(size: 14, color: theme.foregroundFaint),
                    ),
                  ),
                )
              else
                control(
                  target: entry,
                  label: fillLabel(pageLabel, {'page': entry}),
                  current: entry == page,
                  child: Text('$entry'),
                ),
            ],
            SizedBox(width: gap),
            control(
              target: page + 1,
              label: nextLabel,
              child: const TrcIcon(TrcGlyph.arrowRight),
            ),
          ],
        ),
      ),
    );
  }
}

/// One step of a [TrcBreadcrumbs] trail.
@immutable
class TrcBreadcrumb {
  /// A step labelled [label]; tappable when [onTap] is given.
  const TrcBreadcrumb({required this.label, this.onTap});

  /// Text of the step.
  final String label;

  /// Navigates to the step.
  final VoidCallback? onTap;
}

/// Trail from the home page to the current page, separated by thin slashes.
/// The last item is the current page and is not tappable.
class TrcBreadcrumbs extends StatelessWidget {
  /// A trail of [items].
  const TrcBreadcrumbs({
    super.key,
    required this.items,
    this.semanticLabel = 'Breadcrumb',
  });

  /// From the home page to the current page.
  final List<TrcBreadcrumb> items;

  /// Accessible name of the trail.
  final String semanticLabel;

  @override
  Widget build(BuildContext context) {
    final theme = TrcTheme.of(context);
    return Semantics(
      label: semanticLabel,
      container: true,
      explicitChildNodes: true,
      child: Wrap(
        spacing: 10,
        runSpacing: 4,
        crossAxisAlignment: WrapCrossAlignment.center,
        children: [
          for (var i = 0; i < items.length; i++) ...[
            if (i == items.length - 1 || items[i].onTap == null)
              Text(
                items[i].label,
                style: theme.text(size: 14, color: theme.foreground),
              )
            else
              Semantics(
                link: true,
                label: items[i].label,
                container: true,
                child: TrcTappable(
                  excludeChildSemantics: true,
                  onTap: items[i].onTap,
                  builder: (context, state) => TrcFocusRing(
                    visible: state.focused,
                    borderRadius: BorderRadius.circular(4),
                    child: Text(
                      items[i].label,
                      style: theme.text(
                        size: 14,
                        color: state.hovered
                            ? theme.foreground
                            : theme.foregroundSubtle,
                      ),
                    ),
                  ),
                ),
              ),
            if (i < items.length - 1)
              ExcludeSemantics(
                child: Text(
                  '/',
                  style: theme.text(size: 14, color: theme.foregroundFaint),
                ),
              ),
          ],
        ],
      ),
    );
  }
}

/// A language offered by a [TrcLanguageSwitcher].
@immutable
class TrcLanguage {
  /// A language with its [code] and its [name] in that language.
  const TrcLanguage({required this.code, required this.name});

  /// Code shown in capitals: "en", "fr"…
  final String code;

  /// Full name in that language ("English", "Français"), read aloud.
  final String name;
}

/// The EN | FR pill: one button per language, the current one in the accent.
class TrcLanguageSwitcher extends StatelessWidget {
  /// A switcher over [languages].
  const TrcLanguageSwitcher({
    super.key,
    required this.languages,
    required this.value,
    required this.onChanged,
    this.semanticLabel = 'Language',
  });

  /// The languages.
  final List<TrcLanguage> languages;

  /// Code of the current language.
  final String value;

  /// Called with the chosen code.
  final ValueChanged<String> onChanged;

  /// Accessible name of the switcher.
  final String semanticLabel;

  @override
  Widget build(BuildContext context) {
    final theme = TrcTheme.of(context);
    return Semantics(
      label: semanticLabel,
      container: true,
      explicitChildNodes: true,
      child: Container(
        height: 40,
        padding: const EdgeInsets.symmetric(horizontal: 4),
        decoration: BoxDecoration(
          borderRadius: BorderRadius.circular(999),
          border: Border.all(color: const Color(0x26FFFFFF)),
        ),
        child: Row(
          mainAxisSize: MainAxisSize.min,
          children: [
            for (final language in languages)
              Semantics(
                button: true,
                selected: language.code == value,
                label: language.name,
                container: true,
                child: TrcTappable(
                  excludeChildSemantics: true,
                  onTap: () => onChanged(language.code),
                  builder: (context, state) => TrcFocusRing(
                    visible: state.focused,
                    borderRadius: BorderRadius.circular(999),
                    child: Padding(
                      padding: const EdgeInsets.symmetric(
                        horizontal: 10,
                        vertical: 6,
                      ),
                      child: Text(
                        language.code.toUpperCase(),
                        style: theme.text(
                          size: 13,
                          weight: FontWeight.w500,
                          height: 1,
                          letterSpacing: 0.04,
                          color: language.code == value
                              ? theme.accent
                              : state.hovered
                              ? theme.foreground
                              : theme.foregroundSubtle,
                        ),
                      ),
                    ),
                  ),
                ),
              ),
          ],
        ),
      ),
    );
  }
}
