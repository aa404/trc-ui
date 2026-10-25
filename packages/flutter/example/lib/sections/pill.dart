import 'package:flutter/material.dart';
import 'package:trc_ui/trc_ui.dart';

class PillDemo extends StatefulWidget {
  const PillDemo({super.key});

  @override
  State<PillDemo> createState() => _PillDemoState();
}

class _PillDemoState extends State<PillDemo> {
  bool _loading = false;

  Future<void> _save() async {
    setState(() => _loading = true);
    await Future<void>.delayed(const Duration(seconds: 2));
    if (mounted) setState(() => _loading = false);
  }

  @override
  Widget build(BuildContext context) {
    return Wrap(
      spacing: 12,
      runSpacing: 12,
      crossAxisAlignment: WrapCrossAlignment.center,
      children: [
        TrcPillButton(label: 'Get started', solid: true, onPressed: () {}),
        TrcPillButton(label: 'Learn more', onPressed: () {}),
        TrcPillButton(
          label: 'Back',
          icon: const TrcIcon(TrcGlyph.arrowLeft),
          onPressed: () {},
        ),
        TrcPillButton(label: 'Compact', small: true, onPressed: () {}),
        TrcPillButton(
          label: _loading ? 'Saving' : 'Save',
          loading: _loading,
          onPressed: _save,
        ),
        const TrcPillButton(label: 'Disabled', onPressed: null),
      ],
    );
  }
}
