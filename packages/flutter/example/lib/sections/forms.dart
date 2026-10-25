import 'package:flutter/material.dart';
import 'package:trc_ui/trc_ui.dart';

class FormsDemo extends StatefulWidget {
  const FormsDemo({super.key});

  @override
  State<FormsDemo> createState() => _FormsDemoState();
}

class _FormsDemoState extends State<FormsDemo> {
  String? _country;
  bool _terms = false;
  bool _news = true;

  @override
  Widget build(BuildContext context) {
    final fields = [
      const TrcField(
        label: 'Full name',
        required: true,
        child: TrcTextField(
          placeholder: 'Ama Mensah',
          autofillHints: [AutofillHints.name],
        ),
      ),
      const TrcField(
        label: 'Email',
        hint: 'We never share it.',
        child: TrcTextField(
          placeholder: 'you@example.com',
          keyboardType: TextInputType.emailAddress,
        ),
      ),
      TrcField(
        label: 'Country',
        child: TrcSelect<String>(
          value: _country,
          placeholder: 'Choose a country',
          onChanged: (v) => setState(() => _country = v),
          options: const [
            TrcSelectOption(value: 'bj', label: 'Benin'),
            TrcSelectOption(value: 'ci', label: "Côte d'Ivoire"),
            TrcSelectOption(value: 'gh', label: 'Ghana'),
            TrcSelectOption(value: 'ng', label: 'Nigeria', disabled: true),
            TrcSelectOption(value: 'tg', label: 'Togo'),
          ],
        ),
      ),
      const TrcField(
        label: 'Website',
        error: 'Enter an address starting with https://',
        child: TrcTextField(placeholder: 'https://'),
      ),
    ];
    return Column(
      crossAxisAlignment: CrossAxisAlignment.stretch,
      children: [
        LayoutBuilder(
          builder: (context, constraints) {
            final two = constraints.maxWidth >= 640;
            final width = two
                ? (constraints.maxWidth - 24) / 2
                : constraints.maxWidth;
            return Wrap(
              spacing: 24,
              runSpacing: 24,
              children: [
                for (final f in fields) SizedBox(width: width, child: f),
              ],
            );
          },
        ),
        const SizedBox(height: 24),
        const TrcField(
          label: 'Message',
          child: TrcTextArea(placeholder: 'Tell us about your project'),
        ),
        const SizedBox(height: 24),
        TrcCheckbox(
          value: _terms,
          onChanged: (v) => setState(() => _terms = v),
          label: 'I accept the terms',
          description: 'You can read them at any time.',
        ),
        const SizedBox(height: 16),
        TrcSwitch(
          value: _news,
          onChanged: (v) => setState(() => _news = v),
          label: 'Monthly newsletter',
          description: 'One email a month at most.',
        ),
        const SizedBox(height: 16),
        const TrcCheckbox(value: true, onChanged: null, label: 'Disabled'),
      ],
    );
  }
}
