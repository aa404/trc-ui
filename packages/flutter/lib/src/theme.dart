import 'package:flutter/foundation.dart';
import 'package:flutter/material.dart';

/// Design tokens of the deep black theme: colors, type, shapes and motion.
///
/// The theme is always dark. Change the accent with [copyWith]: the soft accent
/// and the focus ring are derived from it, so they follow.
///
/// Provide it with a [TrcTheme] above your widgets, or register it as a
/// [ThemeExtension] (which [toMaterialTheme] does for you). Without either,
/// widgets fall back to the default tokens.
@immutable
class TrcThemeData extends ThemeExtension<TrcThemeData> with Diagnosticable {
  /// Creates a theme; every token has the default value of the deep black design.
  const TrcThemeData({
    this.background = const Color(0xFF0B0C0F),
    this.surface = const Color(0xFF151618),
    this.surfaceRaised = const Color(0xFF1B1C1F),
    this.surfaceAlt = const Color(0xFF232428),
    this.foreground = const Color(0xFFFFFFFF),
    this.foregroundMuted = const Color(0xB8FFFFFF),
    this.foregroundSubtle = const Color(0x8CFFFFFF),
    this.foregroundFaint = const Color(0x66FFFFFF),
    this.border = const Color(0x14FFFFFF),
    this.borderStrong = const Color(0x29FFFFFF),
    this.borderPill = const Color(0x33FFFFFF),
    this.accent = const Color(0xFF08C8D8),
    this.onAccent = const Color(0xFF0B0C0F),
    this.danger = const Color(0xFFFF6B6B),
    this.fontFamily = defaultFontFamily,
    this.fontFamilyFallback = defaultFontFallback,
    this.monoFontFamily = 'monospace',
    this.monoFontFamilyFallback = defaultMonoFallback,
    this.radius = 16,
    this.radiusSmall = 10,
    this.ease = const Cubic(0.77, 0, 0.175, 1),
    this.easeOut = const Cubic(0.22, 1, 0.36, 1),
    this.duration = const Duration(milliseconds: 500),
  });

  /// Montserrat as bundled in this package.
  static const String defaultFontFamily = 'packages/trc_ui/Montserrat';

  /// System fonts used for glyphs missing from Montserrat.
  static const List<String> defaultFontFallback = [
    'Roboto',
    '.SF UI Text',
    'Segoe UI',
    'Helvetica Neue',
    'Arial',
    'sans-serif',
  ];

  /// System monospace fonts, tried in order.
  static const List<String> defaultMonoFallback = [
    'Menlo',
    'SF Mono',
    'Consolas',
    'Roboto Mono',
    'Courier New',
  ];

  /// Page background, near black.
  final Color background;

  /// Graphite surface of cards and panels.
  final Color surface;

  /// Slightly lighter surface: hovered cards.
  final Color surfaceRaised;

  /// Lighter graphite, to tell two side-by-side blocks apart.
  final Color surfaceAlt;

  /// Main text color.
  final Color foreground;

  /// Body text (72 % white): it does not compete with headings.
  final Color foregroundMuted;

  /// Secondary text (55 % white): hints, labels of data.
  final Color foregroundSubtle;

  /// Faintest text (40 % white): placeholders, disabled details.
  final Color foregroundFaint;

  /// Barely visible hairline (8 % white).
  final Color border;

  /// Stronger hairline (16 % white): form controls.
  final Color borderStrong;

  /// Border of pills (20 % white).
  final Color borderPill;

  /// The single accent color.
  final Color accent;

  /// Text and icons placed on the accent.
  final Color onAccent;

  /// Reserved for errors.
  final Color danger;

  /// Font family of every widget. A family from another package needs its
  /// full name, such as `packages/my_fonts/Inter`.
  final String fontFamily;

  /// Fonts used for glyphs missing from [fontFamily].
  final List<String> fontFamilyFallback;

  /// Font family of code and keyboard keys.
  final String monoFontFamily;

  /// Fallbacks of [monoFontFamily].
  final List<String> monoFontFamilyFallback;

  /// Corner radius of cards and large panels.
  final double radius;

  /// Corner radius of small elements.
  final double radiusSmall;

  /// The pill curve (easeInOutQuart).
  final Curve ease;

  /// Soft ease-out for entrances.
  final Curve easeOut;

  /// Duration of the pill stretch.
  final Duration duration;

  /// The accent at 12 %: selected backgrounds and focus halos of fields.
  Color get accentSoft => accent.withValues(alpha: 0.12);

  /// Color of the keyboard focus ring.
  Color get ring => accent;

  /// Text style in [fontFamily]. [letterSpacing] is in em, like the CSS of the
  /// React library: -0.01 by default.
  TextStyle text({
    double size = 15,
    FontWeight weight = FontWeight.w400,
    Color? color,
    double? height,
    double letterSpacing = -0.01,
  }) {
    return TextStyle(
      inherit: false,
      fontFamily: fontFamily,
      fontFamilyFallback: fontFamilyFallback,
      fontSize: size,
      fontWeight: weight,
      color: color ?? foreground,
      height: height,
      letterSpacing: size * letterSpacing,
      textBaseline: TextBaseline.alphabetic,
      leadingDistribution: TextLeadingDistribution.even,
      decoration: TextDecoration.none,
    );
  }

  /// Monospace text style, for code and keys.
  TextStyle mono({double size = 13, Color? color, double? height}) {
    return TextStyle(
      inherit: false,
      fontFamily: monoFontFamily,
      fontFamilyFallback: monoFontFamilyFallback,
      fontSize: size,
      fontWeight: FontWeight.w400,
      color: color ?? foreground,
      height: height,
      textBaseline: TextBaseline.alphabetic,
      leadingDistribution: TextLeadingDistribution.even,
      decoration: TextDecoration.none,
    );
  }

  @override
  TrcThemeData copyWith({
    Color? background,
    Color? surface,
    Color? surfaceRaised,
    Color? surfaceAlt,
    Color? foreground,
    Color? foregroundMuted,
    Color? foregroundSubtle,
    Color? foregroundFaint,
    Color? border,
    Color? borderStrong,
    Color? borderPill,
    Color? accent,
    Color? onAccent,
    Color? danger,
    String? fontFamily,
    List<String>? fontFamilyFallback,
    String? monoFontFamily,
    List<String>? monoFontFamilyFallback,
    double? radius,
    double? radiusSmall,
    Curve? ease,
    Curve? easeOut,
    Duration? duration,
  }) {
    return TrcThemeData(
      background: background ?? this.background,
      surface: surface ?? this.surface,
      surfaceRaised: surfaceRaised ?? this.surfaceRaised,
      surfaceAlt: surfaceAlt ?? this.surfaceAlt,
      foreground: foreground ?? this.foreground,
      foregroundMuted: foregroundMuted ?? this.foregroundMuted,
      foregroundSubtle: foregroundSubtle ?? this.foregroundSubtle,
      foregroundFaint: foregroundFaint ?? this.foregroundFaint,
      border: border ?? this.border,
      borderStrong: borderStrong ?? this.borderStrong,
      borderPill: borderPill ?? this.borderPill,
      accent: accent ?? this.accent,
      onAccent: onAccent ?? this.onAccent,
      danger: danger ?? this.danger,
      fontFamily: fontFamily ?? this.fontFamily,
      fontFamilyFallback: fontFamilyFallback ?? this.fontFamilyFallback,
      monoFontFamily: monoFontFamily ?? this.monoFontFamily,
      monoFontFamilyFallback:
          monoFontFamilyFallback ?? this.monoFontFamilyFallback,
      radius: radius ?? this.radius,
      radiusSmall: radiusSmall ?? this.radiusSmall,
      ease: ease ?? this.ease,
      easeOut: easeOut ?? this.easeOut,
      duration: duration ?? this.duration,
    );
  }

  @override
  TrcThemeData lerp(covariant TrcThemeData? other, double t) {
    if (other == null) return this;
    Color c(Color a, Color b) => Color.lerp(a, b, t)!;
    final near = t < 0.5 ? this : other;
    return TrcThemeData(
      background: c(background, other.background),
      surface: c(surface, other.surface),
      surfaceRaised: c(surfaceRaised, other.surfaceRaised),
      surfaceAlt: c(surfaceAlt, other.surfaceAlt),
      foreground: c(foreground, other.foreground),
      foregroundMuted: c(foregroundMuted, other.foregroundMuted),
      foregroundSubtle: c(foregroundSubtle, other.foregroundSubtle),
      foregroundFaint: c(foregroundFaint, other.foregroundFaint),
      border: c(border, other.border),
      borderStrong: c(borderStrong, other.borderStrong),
      borderPill: c(borderPill, other.borderPill),
      accent: c(accent, other.accent),
      onAccent: c(onAccent, other.onAccent),
      danger: c(danger, other.danger),
      fontFamily: near.fontFamily,
      fontFamilyFallback: near.fontFamilyFallback,
      monoFontFamily: near.monoFontFamily,
      monoFontFamilyFallback: near.monoFontFamilyFallback,
      radius: _lerp(radius, other.radius, t),
      radiusSmall: _lerp(radiusSmall, other.radiusSmall, t),
      ease: near.ease,
      easeOut: near.easeOut,
      duration: near.duration,
    );
  }

  /// A Material [ThemeData] in the trc style, so that a [MaterialApp] (and the
  /// Material widgets you keep) match: dark scheme, accent as primary, flat
  /// surfaces, Montserrat. It also registers these tokens as an extension.
  ThemeData toMaterialTheme() {
    final scheme = ColorScheme.dark(
      primary: accent,
      onPrimary: onAccent,
      secondary: accent,
      onSecondary: onAccent,
      surface: surface,
      onSurface: foreground,
      onSurfaceVariant: foregroundMuted,
      surfaceContainerLowest: background,
      surfaceContainerLow: surface,
      surfaceContainer: surface,
      surfaceContainerHigh: surfaceRaised,
      surfaceContainerHighest: surfaceAlt,
      error: danger,
      onError: background,
      outline: borderStrong,
      outlineVariant: border,
    );
    final base = ThemeData(
      brightness: Brightness.dark,
      colorScheme: scheme,
      useMaterial3: true,
      fontFamily: fontFamily,
      fontFamilyFallback: fontFamilyFallback,
    );
    final rounded = RoundedRectangleBorder(
      borderRadius: BorderRadius.circular(radius),
      side: BorderSide(color: border),
    );
    return base.copyWith(
      scaffoldBackgroundColor: background,
      canvasColor: background,
      dividerColor: border,
      hoverColor: const Color(0x0FFFFFFF),
      focusColor: accentSoft,
      highlightColor: Colors.transparent,
      splashColor: Colors.transparent,
      splashFactory: NoSplash.splashFactory,
      textTheme: base.textTheme.apply(
        fontFamily: fontFamily,
        bodyColor: foregroundMuted,
        displayColor: foreground,
      ),
      textSelectionTheme: TextSelectionThemeData(
        cursorColor: accent,
        selectionColor: accent.withValues(alpha: 0.3),
        selectionHandleColor: accent,
      ),
      appBarTheme: AppBarTheme(
        backgroundColor: background,
        foregroundColor: foreground,
        elevation: 0,
        scrolledUnderElevation: 0,
        surfaceTintColor: Colors.transparent,
      ),
      cardTheme: CardThemeData(
        color: surface,
        elevation: 0,
        shape: rounded,
        surfaceTintColor: Colors.transparent,
      ),
      dialogTheme: DialogThemeData(
        backgroundColor: surface,
        elevation: 0,
        shape: rounded,
        surfaceTintColor: Colors.transparent,
      ),
      dividerTheme: DividerThemeData(color: border, thickness: 1, space: 1),
      tooltipTheme: TooltipThemeData(
        decoration: BoxDecoration(
          color: surfaceAlt,
          borderRadius: BorderRadius.circular(8),
          border: Border.all(color: border),
        ),
        textStyle: text(size: 13, height: 1.4),
      ),
      extensions: [this],
    );
  }

  @override
  void debugFillProperties(DiagnosticPropertiesBuilder properties) {
    super.debugFillProperties(properties);
    properties
      ..add(ColorProperty('background', background))
      ..add(ColorProperty('surface', surface))
      ..add(ColorProperty('accent', accent))
      ..add(ColorProperty('onAccent', onAccent))
      ..add(ColorProperty('danger', danger))
      ..add(StringProperty('fontFamily', fontFamily))
      ..add(DoubleProperty('radius', radius));
  }

  @override
  bool operator ==(Object other) {
    if (identical(this, other)) return true;
    return other is TrcThemeData &&
        other.background == background &&
        other.surface == surface &&
        other.surfaceRaised == surfaceRaised &&
        other.surfaceAlt == surfaceAlt &&
        other.foreground == foreground &&
        other.foregroundMuted == foregroundMuted &&
        other.foregroundSubtle == foregroundSubtle &&
        other.foregroundFaint == foregroundFaint &&
        other.border == border &&
        other.borderStrong == borderStrong &&
        other.borderPill == borderPill &&
        other.accent == accent &&
        other.onAccent == onAccent &&
        other.danger == danger &&
        other.fontFamily == fontFamily &&
        listEquals(other.fontFamilyFallback, fontFamilyFallback) &&
        other.monoFontFamily == monoFontFamily &&
        listEquals(other.monoFontFamilyFallback, monoFontFamilyFallback) &&
        other.radius == radius &&
        other.radiusSmall == radiusSmall &&
        other.ease == ease &&
        other.easeOut == easeOut &&
        other.duration == duration;
  }

  @override
  int get hashCode => Object.hashAll([
    background,
    surface,
    surfaceRaised,
    surfaceAlt,
    foreground,
    foregroundMuted,
    foregroundSubtle,
    foregroundFaint,
    border,
    borderStrong,
    borderPill,
    accent,
    onAccent,
    danger,
    fontFamily,
    Object.hashAll(fontFamilyFallback),
    monoFontFamily,
    Object.hashAll(monoFontFamilyFallback),
    radius,
    radiusSmall,
    ease,
    easeOut,
    duration,
  ]);
}

double _lerp(double a, double b, double t) => a + (b - a) * t;

/// Makes [data] available to the trc widgets below, including those shown in
/// overlays (dialogs, menus) opened from here.
///
/// Read it with [TrcTheme.of].
class TrcTheme extends InheritedTheme {
  /// Provides [data] to [child].
  const TrcTheme({super.key, required this.data, required super.child});

  /// The tokens provided.
  final TrcThemeData data;

  /// The closest tokens: from a [TrcTheme], else from the Material theme's
  /// extensions, else the defaults.
  static TrcThemeData of(BuildContext context) {
    final scope = context.dependOnInheritedWidgetOfExactType<TrcTheme>();
    if (scope != null) return scope.data;
    return Theme.of(context).extension<TrcThemeData>() ?? const TrcThemeData();
  }

  @override
  Widget wrap(BuildContext context, Widget child) =>
      TrcTheme(data: data, child: child);

  @override
  bool updateShouldNotify(TrcTheme oldWidget) => data != oldWidget.data;
}
