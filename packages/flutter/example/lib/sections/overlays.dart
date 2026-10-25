import 'package:flutter/material.dart';
import 'package:trc_ui/trc_ui.dart';

class OverlaysDemo extends StatelessWidget {
  const OverlaysDemo({super.key});

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.stretch,
      children: [
        _buttons(context),
        const SizedBox(height: 32),
        const TrcAlert(
          title: 'Your trial ends in 3 days',
          child: Text('Choose a plan to keep your projects online.'),
        ),
        const SizedBox(height: 12),
        TrcAlert(
          title: 'Payment failed',
          tone: TrcAlertTone.error,
          actions: [
            TrcPillButton(label: 'Update card', small: true, onPressed: () {}),
          ],
          child: const Text('Your card was declined. Check its details.'),
        ),
      ],
    );
  }

  Widget _buttons(BuildContext context) {
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
        TrcPillButton(
          label: 'Toast',
          onPressed: () => TrcToast.success(
            context,
            'Changes saved',
            description: 'Your page is online.',
            action: TrcToastAction(label: 'Undo', onPressed: () {}),
          ),
        ),
        TrcPillButton(
          label: 'Error toast',
          onPressed: () =>
              TrcToast.error(context, 'Could not reach the server'),
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
