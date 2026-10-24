import { Alert, Heading, PillButton } from "trc-ui";
import { Demo } from "@/components/demo";
import { DocPage } from "@/components/doc-page";
import { PropsTable, type PropRow } from "@/components/props-table";
import type { Lang } from "@/lib/i18n";

export const alertTitle = { en: "Alert", fr: "Alerte" };

const PROPS: PropRow[] = [
  { name: "title", type: "ReactNode", description: { en: "Short title.", fr: "Titre court." } },
  {
    name: "tone",
    type: '"info" | "success" | "error"',
    default: '"info"',
    description: { en: "Color of the left edge.", fr: "Couleur du bord gauche." },
  },
  { name: "actions", type: "ReactNode", description: { en: "Actions under the text.", fr: "Actions sous le texte." } },
  {
    name: "role",
    type: '"alert" | "status"',
    description: {
      en: "When the message appears after an action: alert (urgent) or status (polite).",
      fr: "Quand le message apparaît après une action : alert (urgent) ou status (poli).",
    },
  },
];

const T = {
  en: {
    lead: "An inline message in a graphite card, marked by a thin colored edge rather than an icon badge.",
    infoTitle: "A new version is available",
    infoText: "trc ui 0.2 adds dialogs, menus and toasts.",
    okTitle: "Your domain is connected",
    okText: "HTTPS will be active within the hour.",
    errTitle: "The payment failed",
    errText: "The card was declined. Check its details or use another one.",
    retry: "Try again",
  },
  fr: {
    lead: "Un message en ligne dans une carte graphite, marqué d'un fin bord coloré plutôt que d'une pastille d'icône.",
    infoTitle: "Une nouvelle version est disponible",
    infoText: "trc ui 0.2 ajoute fenêtres, menus et notifications.",
    okTitle: "Votre domaine est connecté",
    okText: "Le HTTPS sera actif dans l'heure.",
    errTitle: "Le paiement a échoué",
    errText: "La carte a été refusée. Vérifiez ses informations ou utilisez-en une autre.",
    retry: "Réessayer",
  },
};

export function AlertContent({ lang }: { lang: Lang }) {
  const en = lang === "en";
  const t = T[lang];
  return (
    <DocPage lang={lang} href="/docs/alert/" title={alertTitle[lang]} lead={t.lead}>
      <Heading as="h2" size="lg">
        {en ? "Three *tones*" : "Trois *tons*"}
      </Heading>
      <p>
        {en
          ? "Information and success use the accent; errors use the error color, the only other color of the design."
          : "L'information et le succès utilisent l'accent ; les erreurs, la couleur d'erreur, seule autre couleur du design."}
      </p>
      <Demo
        code={`<Alert title="${t.infoTitle}">${t.infoText}</Alert>
<Alert tone="success" title="${t.okTitle}">${t.okText}</Alert>
<Alert tone="error" title="${t.errTitle}" actions={<PillButton size="sm">${t.retry}</PillButton>}>
  ${t.errText}
</Alert>`}
      >
        <div style={{ display: "grid", gap: 12, width: "100%" }}>
          <Alert title={t.infoTitle}>{t.infoText}</Alert>
          <Alert tone="success" title={t.okTitle}>
            {t.okText}
          </Alert>
          <Alert tone="error" title={t.errTitle} actions={<PillButton size="sm">{t.retry}</PillButton>}>
            {t.errText}
          </Alert>
        </div>
      </Demo>
      <PropsTable lang={lang} rows={PROPS} />
    </DocPage>
  );
}
