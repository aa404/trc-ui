import 'package:flutter/material.dart';
import 'package:trc_ui/trc_ui.dart';

class NavigationDemo extends StatefulWidget {
  const NavigationDemo({super.key});

  @override
  State<NavigationDemo> createState() => _NavigationDemoState();
}

class _NavigationDemoState extends State<NavigationDemo> {
  String _period = 'month';
  int _page = 5;
  String _language = 'en';

  @override
  Widget build(BuildContext context) {
    const gap = SizedBox(height: 40);
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        TrcBreadcrumbs(
          items: [
            TrcBreadcrumb(label: 'Home', onTap: () {}),
            TrcBreadcrumb(label: 'Docs', onTap: () {}),
            const TrcBreadcrumb(label: 'Navigation'),
          ],
        ),
        gap,
        const TrcTabs<String>(
          semanticLabel: 'Project',
          items: [
            TrcTabItem(
              value: 'overview',
              label: 'Overview',
              content: TrcText(
                'Thin labels on a hairline; the selected one is underlined.',
              ),
            ),
            TrcTabItem(
              value: 'activity',
              label: 'Activity',
              content: TrcText('Arrows, Home and End move between tabs.'),
            ),
            TrcTabItem(
              value: 'billing',
              label: 'Billing',
              content: SizedBox(),
              disabled: true,
            ),
            TrcTabItem(
              value: 'settings',
              label: 'Settings',
              content: TrcText('Only the selected tab is in the Tab order.'),
            ),
          ],
        ),
        gap,
        Wrap(
          spacing: 16,
          runSpacing: 16,
          crossAxisAlignment: WrapCrossAlignment.center,
          children: [
            TrcSegmentedControl<String>(
              semanticLabel: 'Billing period',
              value: _period,
              onChanged: (v) => setState(() => _period = v),
              options: const [
                TrcSegment(value: 'month', label: 'Monthly'),
                TrcSegment(value: 'year', label: 'Yearly'),
                TrcSegment(value: 'life', label: 'Lifetime'),
              ],
            ),
            TrcLanguageSwitcher(
              value: _language,
              onChanged: (c) => setState(() => _language = c),
              languages: const [
                TrcLanguage(code: 'en', name: 'English'),
                TrcLanguage(code: 'fr', name: 'Français'),
              ],
            ),
          ],
        ),
        gap,
        TrcPagination(
          page: _page,
          total: 20,
          onChanged: (p) => setState(() => _page = p),
        ),
        gap,
        const TrcAccordion<int>(
          initialValue: [1],
          items: [
            TrcAccordionItem(
              value: 1,
              title: 'How long does delivery take?',
              content: Text('Two working days in the country, five abroad.'),
            ),
            TrcAccordionItem(
              value: 2,
              title: 'Can I return an order?',
              content: Text('Within thirty days, in its original packaging.'),
            ),
            TrcAccordionItem(
              value: 3,
              title: 'Is there a warranty?',
              content: Text('Two years on every product.'),
            ),
          ],
        ),
        gap,
        const TrcSteps(
          current: 1,
          items: [
            TrcStep(
              title: 'Create your account',
              description: 'An email and a password, nothing else.',
            ),
            TrcStep(
              title: 'Invite your team',
              description: 'Everyone gets their own access.',
            ),
            TrcStep(
              title: 'Publish',
              description: 'Your site goes online in one click.',
            ),
          ],
        ),
      ],
    );
  }
}
