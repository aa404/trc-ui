import 'package:flutter/material.dart';
import 'package:trc_ui/trc_ui.dart';

class AdvancedFormsDemo extends StatefulWidget {
  const AdvancedFormsDemo({super.key});

  @override
  State<AdvancedFormsDemo> createState() => _AdvancedFormsDemoState();
}

class _AdvancedFormsDemoState extends State<AdvancedFormsDemo> {
  String? _plan = 'pro';
  String? _country;
  double _budget = 40;
  DateTime? _arrival;

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
      TrcField(
        label: 'Country',
        hint: 'Accents and case do not matter.',
        child: TrcCombobox<String>(
          value: _country,
          placeholder: 'Search a country',
          onChanged: (v) => setState(() => _country = v),
          options: const [
            TrcComboboxOption(value: 'bj', label: 'Bénin'),
            TrcComboboxOption(value: 'bf', label: 'Burkina Faso'),
            TrcComboboxOption(value: 'cm', label: 'Cameroun'),
            TrcComboboxOption(value: 'ci', label: "Côte d'Ivoire"),
            TrcComboboxOption(value: 'gh', label: 'Ghana'),
            TrcComboboxOption(value: 'ng', label: 'Nigeria'),
            TrcComboboxOption(value: 'sn', label: 'Sénégal'),
            TrcComboboxOption(value: 'tg', label: 'Togo'),
          ],
        ),
      ),
      TrcField(
        label: 'Monthly budget',
        child: TrcSlider(
          value: _budget,
          max: 200,
          step: 5,
          showValue: true,
          formatValue: (v) => '€ ${v.round()}',
          onChanged: (v) => setState(() => _budget = v),
        ),
      ),
      TrcField(
        label: 'Arrival',
        hint: 'Check-in from 3 pm.',
        child: TrcDatePicker(
          value: _arrival,
          min: DateTime.now(),
          onChanged: (d) => setState(() => _arrival = d),
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
