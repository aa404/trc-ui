import 'package:flutter/material.dart';
import 'package:trc_ui/trc_ui.dart';

import 'gallery.dart';

void main() => runApp(const GalleryApp());

/// The trc ui gallery: every widget on one page, with an accent switcher.
class GalleryApp extends StatefulWidget {
  const GalleryApp({super.key});

  @override
  State<GalleryApp> createState() => _GalleryAppState();
}

class _GalleryAppState extends State<GalleryApp> {
  TrcThemeData _tokens = const TrcThemeData();

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'trc ui',
      debugShowCheckedModeBanner: false,
      theme: _tokens.toMaterialTheme(),
      builder: (context, child) => TrcToaster(child: child!),
      home: GalleryPage(
        accent: _tokens.accent,
        onAccentChange: (color) =>
            setState(() => _tokens = _tokens.copyWith(accent: color)),
        only: Uri.base.queryParameters['section'],
      ),
    );
  }
}
