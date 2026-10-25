import 'package:flutter/material.dart';
import 'package:trc_ui/trc_ui.dart';

class AdvancedFormsDemo extends StatefulWidget {
  const AdvancedFormsDemo({super.key});

  @override
  State<AdvancedFormsDemo> createState() => _AdvancedFormsDemoState();
}

class _AdvancedFormsDemoState extends State<AdvancedFormsDemo> {
  String? _plan = 'pro';

  @override
  Widget build(BuildContext context) {
    final items = <Widget>[
      TrcRadioGroup<String>(
        label: 'Plan',
        hint: 'You can change it at any time.',
        value: _plan,
        onChanged: (v) => setState(() => _plan = v),
        options: const [
          TrcRadioOption(
            value: 'free',
            label: 'Free',
            description: 'One project.',
          ),
          TrcRadioOption(
            value: 'pro',
            label: 'Pro',
            description: 'Unlimited projects.',
          ),
          TrcRadioOption(value: 'team', label: 'Team', disabled: true),
        ],
      ),
      const TrcField(
        label: 'Password',
        hint: 'At least 12 characters.',
        child: TrcPasswordField(placeholder: 'Your password'),
      ),
      TrcField(
        label: 'Verification code',
        hint: 'Sent by text message.',
        child: TrcPinInput(
          onCompleted: (code) =>
              TrcToast.success(context, 'Code $code entered'),
        ),
      ),
    ];
    return LayoutBuilder(
      builder: (context, constraints) {
        final two = constraints.maxWidth >= 720;
        final width = two
            ? (constraints.maxWidth - 32) / 2
            : constraints.maxWidth;
        return Wrap(
          spacing: 32,
          runSpacing: 32,
          children: [
            for (final item in items) SizedBox(width: width, child: item),
          ],
        );
      },
    );
  }
}
