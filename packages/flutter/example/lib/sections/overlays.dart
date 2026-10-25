import 'package:flutter/material.dart';
import 'package:trc_ui/trc_ui.dart';

class OverlaysDemo extends StatelessWidget {
  const OverlaysDemo({super.key});

  @override
  Widget build(BuildContext context) {
    return Wrap(
      spacing: 12,
      runSpacing: 12,
      crossAxisAlignment: WrapCrossAlignment.center,
      children: [
        TrcPillButton(
          label: 'Open a dialog',
          onPressed: () => showTrcDialog<void>(
            context: context,
            title: 'Delete the project?',
            description: 'Its pages and files are deleted with it.',
            child: const Text(
              'This cannot be undone. Export the project first if you may need it later.',
            ),
            actions: [
              TrcPillButton(
                label: 'Cancel',
                small: true,
                onPressed: () => Navigator.pop(context),
              ),
              TrcPillButton(
                label: 'Delete',
                small: true,
                solid: true,
                onPressed: () => Navigator.pop(context),
              ),
            ],
          ),
        ),
        TrcPillButton(
          label: 'Open a drawer',
          onPressed: () => showTrcDrawer<void>(
            context: context,
            title: 'Filters',
            description: 'Narrow the list down.',
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                TrcCheckbox(
                  value: true,
                  onChanged: (_) {},
                  label: 'Available now',
                ),
                const SizedBox(height: 14),
                TrcCheckbox(
                  value: false,
                  onChanged: (_) {},
                  label: 'Free delivery',
                ),
              ],
            ),
            actions: [
              TrcPillButton(
                label: 'Apply',
                solid: true,
                onPressed: () => Navigator.pop(context),
              ),
            ],
          ),
        ),
        TrcMenu(
          items: [
            TrcMenuItem(label: 'Edit', hint: 'E', onSelected: () {}),
            TrcMenuItem(label: 'Duplicate', hint: 'D', onSelected: () {}),
            const TrcMenuItem(label: 'Archive', disabled: true),
            const TrcMenuSeparator(),
            TrcMenuItem(label: 'Delete', danger: true, onSelected: () {}),
          ],
          builder: (context, toggle, open) =>
              TrcPillButton(label: 'Actions', onPressed: toggle),
        ),
        TrcPopover(
          title: 'Share this page',
          builder: (context, toggle, open) =>
              TrcPillButton(label: 'Share', onPressed: toggle),
          child: const Text(
            'Anyone with the link can view it. Links expire after 30 days.',
          ),
        ),
        TrcTooltip(
          message: 'Copy the link',
          child: TrcIconButton(
            glyph: TrcGlyph.copy,
            label: 'Copy',
            onPressed: () {},
          ),
        ),
      ],
    );
  }
}
