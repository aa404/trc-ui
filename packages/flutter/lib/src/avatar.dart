import 'package:flutter/widgets.dart';

import 'foundation.dart';
import 'icon_button.dart';
import 'icons.dart';
import 'theme.dart';

/// Up to two initials from a name: "Aurel Agbado" gives "AA", "trc" "T".
String avatarInitials(String name) {
  final words = name.trim().split(RegExp(r'\s+')).where((w) => w.isNotEmpty);
  if (words.isEmpty) return '';
  final list = words.toList();
  final letters = list.length > 1
      ? [list.first.characters.first, list.last.characters.first]
      : [list.first.characters.first];
  return letters.join().toUpperCase();
}

/// Size of a [TrcAvatar].
enum TrcAvatarSize {
  /// 28 px.
  sm,

  /// 40 px.
  md,

  /// 56 px.
  lg,
}

double _avatarDimension(TrcAvatarSize size) => switch (size) {
  TrcAvatarSize.sm => 28,
  TrcAvatarSize.md => 40,
  TrcAvatarSize.lg => 56,
};

double _initialsSize(TrcAvatarSize size) => switch (size) {
  TrcAvatarSize.sm => 11,
  TrcAvatarSize.md => 14,
  TrcAvatarSize.lg => 19,
};

/// Round picture of a person, falling back to their initials on graphite
/// when there is no image or it fails to load.
class TrcAvatar extends StatelessWidget {
  /// An avatar of [name].
  const TrcAvatar({
    super.key,
    required this.name,
    this.image,
    this.size = TrcAvatarSize.md,
  });

  /// Person or organization shown: the accessible name, and the source of
  /// the initials.
  final String name;

  /// Picture, such as a `NetworkImage`.
  final ImageProvider? image;

  /// Size.
  final TrcAvatarSize size;

  @override
  Widget build(BuildContext context) {
    final theme = TrcTheme.of(context);
    final d = _avatarDimension(size);
    final initials = Center(
      child: Text(
        avatarInitials(name),
        style: theme.text(
          size: _initialsSize(size),
          weight: FontWeight.w500,
          height: 1,
          letterSpacing: 0.02,
          color: theme.foregroundMuted,
        ),
      ),
    );
    return Semantics(
      image: true,
      label: name,
      excludeSemantics: true,
      child: ClipOval(
        child: Container(
          width: d,
          height: d,
          color: theme.surfaceAlt,
          child: image == null
              ? initials
              : Image(
                  image: image!,
                  width: d,
                  height: d,
                  fit: BoxFit.cover,
                  errorBuilder: (context, error, stack) => initials,
                ),
        ),
      ),
    );
  }
}

/// Overlapping avatars with a ring of the page color between them, the rest
/// summed up in a "+n" counter.
class TrcAvatarGroup extends StatelessWidget {
  /// A group of [avatars].
  const TrcAvatarGroup({
    super.key,
    required this.avatars,
    this.max = 4,
    this.size = TrcAvatarSize.md,
    this.moreLabel = '{count} more',
  });

  /// The avatars; give them the same [size].
  final List<TrcAvatar> avatars;

  /// Avatars shown before the counter.
  final int max;

  /// Size of the counter, and of the overlap.
  final TrcAvatarSize size;

  /// Accessible name of the counter, with `{count}`.
  final String moreLabel;

  @override
  Widget build(BuildContext context) {
    final theme = TrcTheme.of(context);
    final d = _avatarDimension(size);
    // The overlap follows the size, so that initials stay readable.
    final overlap = switch (size) {
      TrcAvatarSize.sm => 5.0,
      TrcAvatarSize.md => 8.0,
      TrcAvatarSize.lg => 12.0,
    };
    final shown = avatars.take(max).toList();
    final hidden = avatars.length - shown.length;
    final items = <Widget>[
      ...shown,
      if (hidden > 0)
        Semantics(
          image: true,
          label: fillLabel(moreLabel, {'count': hidden}),
          excludeSemantics: true,
          child: Container(
            width: d,
            height: d,
            alignment: Alignment.center,
            decoration: BoxDecoration(
              shape: BoxShape.circle,
              color: theme.surface,
              border: Border.all(color: theme.borderStrong),
            ),
            child: Text(
              '+$hidden',
              style: theme.text(
                size: _initialsSize(size),
                weight: FontWeight.w500,
                height: 1,
                color: theme.foregroundMuted,
              ),
            ),
          ),
        ),
    ];
    final step = d - overlap;
    return SizedBox(
      width: d + 4 + step * (items.length - 1),
      height: d + 4,
      child: Stack(
        clipBehavior: Clip.none,
        children: [
          for (var i = 0; i < items.length; i++)
            PositionedDirectional(
              start: step * i,
              top: 0,
              child: Container(
                padding: const EdgeInsets.all(2),
                decoration: BoxDecoration(
                  shape: BoxShape.circle,
                  color: theme.background,
                ),
                child: items[i],
              ),
            ),
        ],
      ),
    );
  }
}

/// Small label for metadata (status, category, filter), with an optional
/// remove button. Never placed over photos, never with an icon.
class TrcTag extends StatelessWidget {
  /// A tag reading [label].
  const TrcTag(
    this.label, {
    super.key,
    this.accent = false,
    this.onRemove,
    this.removeLabel = 'Remove',
  });

  /// Text of the tag.
  final String label;

  /// The accent tone, for the one tag that matters on a card.
  final bool accent;

  /// Shows a remove button.
  final VoidCallback? onRemove;

  /// Start of the remove button's accessible name, followed by [label].
  final String removeLabel;

  @override
  Widget build(BuildContext context) {
    final theme = TrcTheme.of(context);
    final color = accent ? theme.accent : theme.foregroundMuted;
    return Container(
      height: 26,
      padding: EdgeInsetsDirectional.only(
        start: 10,
        end: onRemove == null ? 10 : 4,
      ),
      decoration: BoxDecoration(
        borderRadius: BorderRadius.circular(999),
        border: Border.all(
          color: accent
              ? theme.accent.withValues(alpha: 0.4)
              : theme.borderStrong,
        ),
      ),
      child: Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          Text(
            label,
            maxLines: 1,
            softWrap: false,
            style: theme.text(size: 13, height: 1, color: color),
          ),
          if (onRemove != null) ...[
            const SizedBox(width: 6),
            TrcIconButton(
              glyph: TrcGlyph.close,
              label: '$removeLabel $label',
              size: 18,
              iconSize: 12,
              color: color,
              onPressed: onRemove,
            ),
          ],
        ],
      ),
    );
  }
}

/// Color of a [TrcStat] change.
enum TrcStatTone {
  /// Accent: a good change.
  positive,

  /// Error color: a bad change.
  negative,

  /// Muted.
  neutral,
}

/// A key figure with its label, in a large thin number.
class TrcStat extends StatelessWidget {
  /// A figure [value] labelled [label].
  const TrcStat({
    super.key,
    required this.label,
    required this.value,
    this.change,
    this.changeTone = TrcStatTone.neutral,
    this.description,
  });

  /// What the figure measures.
  final String label;

  /// The figure.
  final String value;

  /// Change since the previous period: "+12 %".
  final String? change;

  /// Color of the change.
  final TrcStatTone changeTone;

  /// Short context: "vs last month".
  final String? description;

  @override
  Widget build(BuildContext context) {
    final theme = TrcTheme.of(context);
    final vw = MediaQuery.sizeOf(context).width / 100;
    final size = (27.2 + 1.2 * vw).clamp(32.0, 44.0);
    return Semantics(
      container: true,
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        mainAxisSize: MainAxisSize.min,
        children: [
          Text(
            label,
            style: theme.text(size: 14, color: theme.foregroundSubtle),
          ),
          const SizedBox(height: 6),
          Text(
            value,
            style: theme
                .text(
                  size: size,
                  weight: FontWeight.w300,
                  height: 1.05,
                  letterSpacing: -0.03,
                )
                .copyWith(fontFeatures: const [FontFeature.tabularFigures()]),
          ),
          if (change != null || description != null) ...[
            const SizedBox(height: 8),
            Wrap(
              spacing: 8,
              runSpacing: 4,
              children: [
                if (change != null)
                  Text(
                    change!,
                    style: theme
                        .text(
                          size: 13,
                          color: switch (changeTone) {
                            TrcStatTone.positive => theme.accent,
                            TrcStatTone.negative => theme.danger,
                            TrcStatTone.neutral => theme.foregroundMuted,
                          },
                        )
                        .copyWith(
                          fontFeatures: const [FontFeature.tabularFigures()],
                        ),
                  ),
                if (description != null)
                  Text(
                    description!,
                    style: theme.text(size: 13, color: theme.foregroundSubtle),
                  ),
              ],
            ),
          ],
        ],
      ),
    );
  }
}
