import { Heading } from "trc-ui";
import { CodeBlock } from "@/components/code-block";
import { Demo } from "@/components/demo";
import { ToastDemo } from "@/components/demos/overlays";
import { DocPage } from "@/components/doc-page";
import { PropsTable, type PropRow } from "@/components/props-table";
import type { Lang } from "@/lib/i18n";

export const toastTitle = { en: "Toast", fr: "Notification" };

const OPTIONS: PropRow[] = [
  { name: "description", type: "ReactNode", description: { en: "Text under the title.", fr: "Texte sous le titre." } },
  {
    name: "tone",
    type: '"default" | "success" | "error"',
    default: '"default"',
    description: {
      en: "Also set by toast.success() and toast.error().",
      fr: "Aussi posé par toast.success() et toast.error().",
    },
  },
  {
    name: "duration",
    type: "number",
    default: "5000",
    description: {
      en: "Milliseconds on screen; Infinity keeps it until dismissed.",
      fr: "Millisecondes à l'écran ; Infinity le garde jusqu'à sa fermeture.",
    },
  },
  {
    name: "action",
    type: "{ label, onClick }",
    description: { en: "One action, such as Undo.", fr: "Une action, comme Annuler." },
  },
];

const TOASTER: PropRow[] = [
  {
    name: "position",
    type: '"bottom-right" | "bottom-center" | "top-right"',
    default: '"bottom-right"',
    description: { en: "Corner of the screen.", fr: "Coin de l'écran." },
  },
  {
    name: "duration",
    type: "number",
    default: "5000",
    description: { en: "Default time on screen.", fr: "Durée par défaut à l'écran." },
  },
  {
    name: "label / closeLabel",
    type: "string",
    default: '"Notifications" / "Close"',
    description: { en: "Labels, for translations.", fr: "Libellés, pour la traduction." },
  },
];

export function ToastContent({ lang }: { lang: Lang }) {
  const en = lang === "en";
  return (
    <DocPage
      lang={lang}
      href="/docs/toast/"
      title={toastTitle[lang]}
      lead={
        en
          ? "Short messages raised from anywhere in your code, shown in a corner and announced to screen readers."
          : "Des messages courts lancés de n'importe où dans le code, affichés dans un coin et annoncés aux lecteurs d'écran."
      }
    >
      <Heading as="h2" size="lg">
        {en ? "Place the *Toaster* once" : "Placer le *Toaster* une fois"}
      </Heading>
      <CodeBlock
        title="app/layout.tsx"
        code={`import { Toaster } from "trc-ui";

<body className="trc">
  {children}
  <Toaster />
</body>`}
      />

      <Heading as="h2" size="lg">
        {en ? "Raise a *toast*" : "Lancer une *notification*"}
      </Heading>
      <p>
        {en
          ? "Errors are announced right away; other messages politely, without interrupting. Timers pause while the pointer or the keyboard focus is on the notifications."
          : "Les erreurs sont annoncées tout de suite ; les autres messages poliment, sans interrompre. Les minuteries se mettent en pause quand le pointeur ou le focus clavier est sur les notifications."}
      </p>
      <Demo
        code={`import { toast } from "trc-ui";

toast("Saved", { description: "Your changes are online." });
toast.success("Saved");
toast.error("Payment failed", { description: "The card was declined." });
toast("Project archived", { action: { label: "Undo", onClick: restore } });`}
      >
        <ToastDemo lang={lang} />
      </Demo>
      <PropsTable lang={lang} rows={OPTIONS} />

      <Heading as="h2" size="lg">
        Toaster
      </Heading>
      <PropsTable lang={lang} rows={TOASTER} />
      <p>
        {en ? (
          <>
            <code>toast()</code> returns an id: pass it to <code>toast.dismiss(id)</code>, or call{" "}
            <code>toast.dismiss()</code> to clear them all.
          </>
        ) : (
          <>
            <code>toast()</code> renvoie un identifiant : passez-le à <code>toast.dismiss(id)</code>, ou appelez{" "}
            <code>toast.dismiss()</code> pour tout effacer.
          </>
        )}
      </p>
    </DocPage>
  );
}
