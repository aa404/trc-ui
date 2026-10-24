"use client";

import { useState } from "react";
import {
  ArrowLeft,
  Dialog,
  Drawer,
  DropdownMenu,
  Field,
  Input,
  PillButton,
  Popover,
  Switch,
  Text,
  Tooltip,
  toast,
} from "trc-ui";
import type { Lang } from "@/lib/i18n";

const T = {
  en: {
    delete: "Delete the project",
    deleteTitle: "Delete the project?",
    deleteText: "The project and its 12 pages will be removed. This cannot be undone.",
    cancel: "Cancel",
    confirm: "Delete",
    deleted: "Project deleted",
    rename: "Rename",
    renameTitle: "Rename the project",
    name: "Name",
    save: "Save",
    saved: "Saved",
    filters: "Filters",
    filtersText: "Narrow down the list. Changes apply right away.",
    archived: "Show archived projects",
    shared: "Only shared with me",
    done: "Done",
    left: "From the left",
    actions: "Actions",
    edit: "Edit",
    duplicate: "Duplicate",
    share: "Share",
    archive: "Archive",
    remove: "Delete",
    chosen: "Chosen:",
    filter: "Filter by date",
    from: "From",
    to: "To",
    apply: "Apply",
    copy: "Copy",
    copyHint: "Copy the install command",
    help: "Help",
    helpHint: "Opens the documentation in a new tab",
    toast: "Show a toast",
    success: "Success",
    error: "Error",
    withAction: "With an action",
    changes: "Your changes are online.",
    payment: "Payment failed",
    paymentText: "The card was declined. Try another one.",
    archivedOne: "Project archived",
    undo: "Undo",
    restored: "Project restored",
  },
  fr: {
    delete: "Supprimer le projet",
    deleteTitle: "Supprimer le projet ?",
    deleteText: "Le projet et ses 12 pages seront supprimés. Cette action est définitive.",
    cancel: "Annuler",
    confirm: "Supprimer",
    deleted: "Projet supprimé",
    rename: "Renommer",
    renameTitle: "Renommer le projet",
    name: "Nom",
    save: "Enregistrer",
    saved: "Enregistré",
    filters: "Filtres",
    filtersText: "Affinez la liste. Les changements s'appliquent tout de suite.",
    archived: "Afficher les projets archivés",
    shared: "Seulement partagés avec moi",
    done: "Terminé",
    left: "Depuis la gauche",
    actions: "Actions",
    edit: "Modifier",
    duplicate: "Dupliquer",
    share: "Partager",
    archive: "Archiver",
    remove: "Supprimer",
    chosen: "Choix :",
    filter: "Filtrer par date",
    from: "Du",
    to: "Au",
    apply: "Appliquer",
    copy: "Copier",
    copyHint: "Copier la commande d'installation",
    help: "Aide",
    helpHint: "Ouvre la documentation dans un nouvel onglet",
    toast: "Afficher une notification",
    success: "Succès",
    error: "Erreur",
    withAction: "Avec une action",
    changes: "Vos changements sont en ligne.",
    payment: "Le paiement a échoué",
    paymentText: "La carte a été refusée. Essayez-en une autre.",
    archivedOne: "Projet archivé",
    undo: "Annuler",
    restored: "Projet restauré",
  },
};

export function ConfirmDialogDemo({ lang }: { lang: Lang }) {
  const t = T[lang];
  const [open, setOpen] = useState(false);
  return (
    <>
      <PillButton onClick={() => setOpen(true)}>{t.delete}</PillButton>
      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        title={t.deleteTitle}
        description={t.deleteText}
        size="sm"
        footer={
          <>
            <PillButton size="sm" icon={<ArrowLeft />} onClick={() => setOpen(false)}>
              {t.cancel}
            </PillButton>
            <PillButton
              size="sm"
              solid
              data-autofocus
              onClick={() => {
                setOpen(false);
                toast(t.deleted);
              }}
            >
              {t.confirm}
            </PillButton>
          </>
        }
      />
    </>
  );
}

export function FormDialogDemo({ lang }: { lang: Lang }) {
  const t = T[lang];
  const [open, setOpen] = useState(false);
  return (
    <>
      <PillButton onClick={() => setOpen(true)}>{t.rename}</PillButton>
      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        title={t.renameTitle}
        footer={
          <PillButton
            solid
            onClick={() => {
              setOpen(false);
              toast.success(t.saved);
            }}
          >
            {t.save}
          </PillButton>
        }
      >
        <Field label={t.name}>
          <Input defaultValue="trc ui" data-autofocus />
        </Field>
      </Dialog>
    </>
  );
}

export function DrawerDemo({ lang }: { lang: Lang }) {
  const t = T[lang];
  const [side, setSide] = useState<"right" | "left" | null>(null);
  return (
    <>
      <PillButton onClick={() => setSide("right")}>{t.filters}</PillButton>
      <PillButton onClick={() => setSide("left")}>{t.left}</PillButton>
      <Drawer
        open={side !== null}
        side={side ?? "right"}
        onClose={() => setSide(null)}
        title={t.filters}
        description={t.filtersText}
        footer={
          <PillButton solid onClick={() => setSide(null)}>
            {t.done}
          </PillButton>
        }
      >
        <div style={{ display: "grid", gap: 16 }}>
          <Switch label={t.archived} />
          <Switch label={t.shared} defaultChecked />
        </div>
      </Drawer>
    </>
  );
}

export function MenuDemo({ lang }: { lang: Lang }) {
  const t = T[lang];
  const [last, setLast] = useState<string | null>(null);
  const pick = (label: string) => () => setLast(label);
  return (
    <>
      <DropdownMenu
        trigger={<PillButton size="sm">{t.actions}</PillButton>}
        items={[
          { label: t.edit, onSelect: pick(t.edit), hint: "E" },
          { label: t.duplicate, onSelect: pick(t.duplicate), hint: "D" },
          { label: t.share, onSelect: pick(t.share), disabled: true },
          { label: t.archive, onSelect: pick(t.archive) },
          "separator",
          { label: t.remove, onSelect: pick(t.remove), danger: true },
        ]}
      />
      <Text size="sm" tone="subtle" aria-live="polite">
        {last ? `${t.chosen} ${last}` : ""}
      </Text>
    </>
  );
}

export function PopoverDemo({ lang }: { lang: Lang }) {
  const t = T[lang];
  const [open, setOpen] = useState(false);
  return (
    <Popover
      trigger={<PillButton size="sm">{t.filter}</PillButton>}
      title={t.filter}
      open={open}
      onOpenChange={setOpen}
    >
      <div style={{ display: "grid", gap: 12 }}>
        <Field label={t.from}>
          <Input type="date" />
        </Field>
        <Field label={t.to}>
          <Input type="date" />
        </Field>
        <PillButton size="sm" solid onClick={() => setOpen(false)} style={{ justifySelf: "start" }}>
          {t.apply}
        </PillButton>
      </div>
    </Popover>
  );
}

export function TooltipDemo({ lang }: { lang: Lang }) {
  const t = T[lang];
  return (
    <>
      <Tooltip label={t.copyHint}>
        <PillButton size="sm">{t.copy}</PillButton>
      </Tooltip>
      <Tooltip label={t.helpHint} side="bottom">
        <a href="#" className="docs-demo-link">
          {t.help}
        </a>
      </Tooltip>
    </>
  );
}

export function ToastDemo({ lang }: { lang: Lang }) {
  const t = T[lang];
  return (
    <>
      <PillButton size="sm" onClick={() => toast(t.saved, { description: t.changes })}>
        {t.toast}
      </PillButton>
      <PillButton size="sm" onClick={() => toast.success(t.saved)}>
        {t.success}
      </PillButton>
      <PillButton size="sm" onClick={() => toast.error(t.payment, { description: t.paymentText })}>
        {t.error}
      </PillButton>
      <PillButton
        size="sm"
        onClick={() => toast(t.archivedOne, { action: { label: t.undo, onClick: () => toast.success(t.restored) } })}
      >
        {t.withAction}
      </PillButton>
    </>
  );
}
