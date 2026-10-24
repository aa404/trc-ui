import { Heading } from "trc-ui";
import { Demo } from "@/components/demo";
import { ConfirmDialogDemo, DrawerDemo, FormDialogDemo } from "@/components/demos/overlays";
import { DocPage } from "@/components/doc-page";
import { PropsTable, type PropRow } from "@/components/props-table";
import type { Lang } from "@/lib/i18n";

export const dialogTitle = { en: "Dialog and drawer", fr: "Fenêtre et panneau" };

const SHARED: PropRow[] = [
  { name: "open", type: "boolean", description: { en: "Whether the window is shown.", fr: "Affiche la fenêtre." } },
  {
    name: "onClose",
    type: "() => void",
    description: {
      en: "Called on Escape, on the close button and on the overlay.",
      fr: "Appelé sur Échap, sur le bouton de fermeture et sur le voile.",
    },
  },
  {
    name: "title",
    type: "ReactNode",
    description: { en: "Title, also the accessible name.", fr: "Titre, aussi le nom accessible." },
  },
  {
    name: "description",
    type: "ReactNode",
    description: { en: "Text under the title, announced with it.", fr: "Texte sous le titre, annoncé avec lui." },
  },
  { name: "footer", type: "ReactNode", description: { en: "Actions at the bottom.", fr: "Actions en bas." } },
  {
    name: "closeOnOverlay",
    type: "boolean",
    default: "true",
    description: { en: "Closes when the overlay is clicked.", fr: "Ferme au clic sur le voile." },
  },
  {
    name: "closeLabel",
    type: "string",
    default: '"Close"',
    description: { en: "Label of the close button.", fr: "Libellé du bouton de fermeture." },
  },
];

const DIALOG_PROPS: PropRow[] = [
  ...SHARED,
  {
    name: "size",
    type: '"sm" | "md" | "lg"',
    default: '"md"',
    description: { en: "Max width: 400, 520 or 720 px.", fr: "Largeur max : 400, 520 ou 720 px." },
  },
];

const DRAWER_PROPS: PropRow[] = [
  ...SHARED,
  {
    name: "side",
    type: '"right" | "left"',
    default: '"right"',
    description: { en: "Edge the panel slides from.", fr: "Bord d'où glisse le panneau." },
  },
  {
    name: "size",
    type: '"sm" | "md"',
    default: '"sm"',
    description: { en: "Width: 380 or 480 px.", fr: "Largeur : 380 ou 480 px." },
  },
];

export function DialogContent({ lang }: { lang: Lang }) {
  const en = lang === "en";
  return (
    <DocPage
      lang={lang}
      href="/docs/dialog/"
      title={dialogTitle[lang]}
      lead={
        en
          ? "Modal windows over a dark overlay. Focus moves inside and stays there; Escape, the close button or the overlay close them, and focus returns where it was."
          : "Des fenêtres modales sur un voile sombre. Le focus entre et y reste ; Échap, le bouton de fermeture ou le voile les ferment, et le focus revient où il était."
      }
    >
      <Heading as="h2" size="lg">
        {en ? "Confirm an *action*" : "Confirmer une *action*"}
      </Heading>
      <p>
        {en ? (
          <>
            Put <code>data-autofocus</code> on the element that should receive focus first. For a destructive action,
            keep the confirmation explicit and the way back obvious.
          </>
        ) : (
          <>
            Posez <code>data-autofocus</code> sur l&apos;élément qui doit recevoir le focus en premier. Pour une action
            destructrice, gardez la confirmation explicite et le retour évident.
          </>
        )}
      </p>
      <Demo
        code={`const [open, setOpen] = useState(false);

<PillButton onClick={() => setOpen(true)}>Delete the project</PillButton>
<Dialog
  open={open}
  onClose={() => setOpen(false)}
  title="Delete the project?"
  description="The project and its 12 pages will be removed."
  size="sm"
  footer={
    <>
      <PillButton size="sm" icon={<ArrowLeft />} onClick={() => setOpen(false)}>Cancel</PillButton>
      <PillButton size="sm" solid data-autofocus onClick={remove}>Delete</PillButton>
    </>
  }
/>`}
      >
        <ConfirmDialogDemo lang={lang} />
      </Demo>

      <Heading as="h2" size="lg">
        {en ? "With a *form*" : "Avec un *formulaire*"}
      </Heading>
      <Demo
        code={`<Dialog open={open} onClose={close} title="Rename the project" footer={<PillButton solid>Save</PillButton>}>
  <Field label="Name">
    <Input defaultValue="trc ui" data-autofocus />
  </Field>
</Dialog>`}
      >
        <FormDialogDemo lang={lang} />
      </Demo>
      <PropsTable lang={lang} rows={DIALOG_PROPS} />

      <Heading as="h2" size="lg">
        {en ? "Side *panel*" : "Panneau *latéral*"}
      </Heading>
      <p>
        {en
          ? "Drawer slides from an edge, for filters, a cart or settings. It is the panel the site header uses for its mobile menu."
          : "Drawer glisse depuis un bord, pour des filtres, un panier ou des réglages. C'est le panneau qu'utilise l'en-tête du site pour son menu mobile."}
      </p>
      <Demo
        code={`<Drawer open={open} onClose={close} title="Filters" description="…" footer={<PillButton solid>Done</PillButton>}>
  <Switch label="Show archived projects" />
</Drawer>

<Drawer side="left" …>…</Drawer>`}
      >
        <DrawerDemo lang={lang} />
      </Demo>
      <PropsTable lang={lang} rows={DRAWER_PROPS} />
    </DocPage>
  );
}
