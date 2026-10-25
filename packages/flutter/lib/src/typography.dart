import 'dart:async';
import 'dart:math' as math;

import 'package:flutter/widgets.dart';

import 'foundation.dart';
import 'theme.dart';

/// A piece of a marked-up title: plain, or in the accent color.
typedef TrcAccentPart = ({String text, bool accent});

/// Splits a title into plain and accent parts: the words between asterisks
/// take the accent ("How it *works*"). Without asterisks, [accentLast] colors
/// the last words (titles coming from a CMS), but never the whole title.
List<TrcAccentPart> parseAccent(String text, {int accentLast = 0}) {
  if (text.contains('*')) {
    final pieces = text.split('*');
    return [
      for (var i = 0; i < pieces.length; i++)
        if (pieces[i].isNotEmpty) (text: pieces[i], accent: i.isOdd),
    ];
  }
  final words = text.split(' ');
  if (accentLast <= 0 || words.length < 2) return [(text: text, accent: false)];
  final n = math.min(accentLast, words.length - 1);
  return [
    (text: '${words.sublist(0, words.length - n).join(' ')} ', accent: false),
    (text: words.sublist(words.length - n).join(' '), accent: true),
  ];
}

/// Plain text of a marked-up title, for semantics labels and window titles.
String plainText(String text) => text.replaceAll('*', '');

/// Text spans of a marked-up title, the accent parts in [accent].
List<InlineSpan> accentSpans(
  String text, {
  required Color accent,
  int accentLast = 0,
}) {
  return [
    for (final part in parseAccent(text, accentLast: accentLast))
      TextSpan(
        text: part.text,
        style: part.accent ? TextStyle(color: accent) : null,
      ),
  ];
}

/// Colors the words between asterisks with the accent: "How it *works*".
/// Without asterisks, [accentLast] colors the last words.
///
/// Inherits the surrounding text style; give [style] to change it.
class TrcAccentText extends StatelessWidget {
  /// Shows [text] with its accent words.
  const TrcAccentText(
    this.text, {
    super.key,
    this.accentLast = 0,
    this.style,
    this.textAlign,
    this.maxLines,
    this.overflow,
  });

  /// The marked-up text.
  final String text;

  /// Number of trailing words in the accent when [text] has no asterisks.
  final int accentLast;

  /// Style of the whole text.
  final TextStyle? style;

  /// Horizontal alignment.
  final TextAlign? textAlign;

  /// Maximum number of lines.
  final int? maxLines;

  /// How overflowing text is cut.
  final TextOverflow? overflow;

  @override
  Widget build(BuildContext context) {
    final theme = TrcTheme.of(context);
    return Text.rich(
      TextSpan(
        children: accentSpans(
          text,
          accent: theme.accent,
          accentLast: accentLast,
        ),
      ),
      style: style,
      textAlign: textAlign,
      maxLines: maxLines,
      overflow: overflow,
      semanticsLabel: plainText(text),
    );
  }
}

/// Visual size of a [TrcHeading].
enum TrcHeadingSize {
  /// 48 to 72 px: the one title of a hero.
  display,

  /// 36 to 48 px: section titles.
  xl,

  /// 28 to 36 px.
  lg,

  /// 24 px.
  md,

  /// 20 px.
  sm,
}

/// Font size and line height of a heading at a screen [width], following the
/// fluid sizes of the React library (`clamp()` on the viewport width).
({double fontSize, double height}) headingMetrics(
  TrcHeadingSize size,
  double width,
) {
  final vw = width / 100;
  double clamp(double min, double fluid, double max) =>
      fluid.clamp(min, max).toDouble();
  return switch (size) {
    TrcHeadingSize.display => (
      fontSize: clamp(48, 35.2 + 3.6 * vw, 72),
      height: 1.08,
    ),
    TrcHeadingSize.xl => (
      fontSize: clamp(36, 30.4 + 1.6 * vw, 48),
      height: 1.08,
    ),
    TrcHeadingSize.lg => (
      fontSize: clamp(28, 24.8 + 0.9 * vw, 36),
      height: 1.15,
    ),
    TrcHeadingSize.md => (fontSize: 24, height: 1.2),
    TrcHeadingSize.sm => (fontSize: 20, height: 1.3),
  };
}

/// Thin Montserrat 400 heading. The words between *asterisks* take the
/// accent; announced as a heading of [level] to screen readers.
class TrcHeading extends StatelessWidget {
  /// A heading showing [text].
  const TrcHeading(
    this.text, {
    super.key,
    this.size = TrcHeadingSize.xl,
    this.level = 2,
    this.accentLast = 0,
    this.color,
    this.textAlign,
    this.maxLines,
  }) : assert(level >= 1 && level <= 6);

  /// The marked-up title.
  final String text;

  /// Visual size; set separately from the [level].
  final TrcHeadingSize size;

  /// Heading level in the page outline, from 1 to 6 (2 by default).
  final int level;

  /// Number of trailing words in the accent when [text] has no asterisks.
  final int accentLast;

  /// Text color; the foreground by default.
  final Color? color;

  /// Horizontal alignment.
  final TextAlign? textAlign;

  /// Maximum number of lines.
  final int? maxLines;

  @override
  Widget build(BuildContext context) {
    final theme = TrcTheme.of(context);
    final metrics = headingMetrics(size, MediaQuery.sizeOf(context).width);
    return Semantics(
      header: true,
      container: true,
      headingLevel: level,
      child: TrcAccentText(
        text,
        accentLast: accentLast,
        textAlign: textAlign,
        maxLines: maxLines,
        overflow: maxLines == null ? null : TextOverflow.ellipsis,
        style: theme.text(
          size: metrics.fontSize,
          height: metrics.height,
          letterSpacing: -0.025,
          color: color,
        ),
      ),
    );
  }
}

/// Size of a [TrcText].
enum TrcTextSize {
  /// 18 px: introductions.
  lg,

  /// 16 px.
  md,

  /// 14 px.
  sm,
}

/// Color of a [TrcText].
enum TrcTextTone {
  /// Full white.
  normal,

  /// 72 % white: body text, the default.
  muted,

  /// 55 % white: secondary details.
  subtle,
}

/// Body text, muted by default so that it does not compete with headings.
class TrcText extends StatelessWidget {
  /// Shows [text].
  const TrcText(
    this.text, {
    super.key,
    this.size = TrcTextSize.md,
    this.tone = TrcTextTone.muted,
    this.textAlign,
    this.maxLines,
    this.overflow,
    this.weight = FontWeight.w400,
  });

  /// The text shown.
  final String text;

  /// Font size.
  final TrcTextSize size;

  /// Color.
  final TrcTextTone tone;

  /// Horizontal alignment.
  final TextAlign? textAlign;

  /// Maximum number of lines.
  final int? maxLines;

  /// How overflowing text is cut.
  final TextOverflow? overflow;

  /// Font weight.
  final FontWeight weight;

  /// The style of a [TrcText] of this size and tone, for rich text.
  static TextStyle styleOf(
    BuildContext context, {
    TrcTextSize size = TrcTextSize.md,
    TrcTextTone tone = TrcTextTone.muted,
  }) {
    final theme = TrcTheme.of(context);
    return theme.text(
      size: switch (size) {
        TrcTextSize.lg => 18,
        TrcTextSize.md => 16,
        TrcTextSize.sm => 14,
      },
      height: 1.65,
      color: switch (tone) {
        TrcTextTone.normal => theme.foreground,
        TrcTextTone.muted => theme.foregroundMuted,
        TrcTextTone.subtle => theme.foregroundSubtle,
      },
    );
  }

  @override
  Widget build(BuildContext context) {
    return Text(
      text,
      style: styleOf(
        context,
        size: size,
        tone: tone,
      ).copyWith(fontWeight: weight),
      textAlign: textAlign,
      maxLines: maxLines,
      overflow: overflow,
    );
  }
}

/// Large thin number in the accent color ("01", "02"…), reserved for steps in
/// a real order. Hidden from screen readers: the order is in the list itself.
class TrcStepNumber extends StatelessWidget {
  /// Shows [n] padded to two digits.
  const TrcStepNumber(this.n, {super.key, this.small = false});

  /// The number shown.
  final int n;

  /// 24 px instead of 48 px.
  final bool small;

  @override
  Widget build(BuildContext context) {
    final theme = TrcTheme.of(context);
    return ExcludeSemantics(
      child: Text(
        n.toString().padLeft(2, '0'),
        style: theme
            .text(
              size: small ? 24 : 48,
              weight: FontWeight.w300,
              height: 1,
              letterSpacing: -0.025,
              color: theme.accent,
            )
            .copyWith(fontFeatures: const [FontFeature.tabularFigures()]),
      ),
    );
  }
}

/// Soft entrance: the child fades in while rising 16 px, over 900 ms with the
/// ease-out curve. [delay] staggers several elements. Shown at once when the
/// platform reduces motion.
class TrcEnter extends StatefulWidget {
  /// Animates [child] in when first built.
  const TrcEnter({super.key, required this.child, this.delay = Duration.zero});

  /// Wait before the entrance starts.
  final Duration delay;

  /// The element shown.
  final Widget child;

  @override
  State<TrcEnter> createState() => _TrcEnterState();
}

class _TrcEnterState extends State<TrcEnter>
    with SingleTickerProviderStateMixin {
  late final AnimationController _controller = AnimationController(
    vsync: this,
    duration: const Duration(milliseconds: 900),
  );
  bool _started = false;
  Timer? _timer;

  @override
  void didChangeDependencies() {
    super.didChangeDependencies();
    if (_started) return;
    _started = true;
    if (trcReduceMotion(context)) {
      _controller.value = 1;
    } else if (widget.delay == Duration.zero) {
      _controller.forward();
    } else {
      _timer = Timer(widget.delay, _controller.forward);
    }
  }

  @override
  void dispose() {
    _timer?.cancel();
    _controller.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final curve = CurvedAnimation(
      parent: _controller,
      curve: TrcTheme.of(context).easeOut,
    );
    return AnimatedBuilder(
      animation: curve,
      builder: (context, child) => Opacity(
        opacity: curve.value,
        child: Transform.translate(
          offset: Offset(0, 16 * (1 - curve.value)),
          child: child,
        ),
      ),
      child: widget.child,
    );
  }
}
