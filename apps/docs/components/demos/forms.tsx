"use client";

import { useState } from "react";
import {
  Combobox,
  DatePicker,
  Dropzone,
  Field,
  FileInput,
  PasswordInput,
  PinInput,
  RadioGroup,
  Slider,
  Text,
  formatBytes,
} from "trc-ui";
import type { Lang } from "@/lib/i18n";

const narrow = { display: "grid", gap: 20, width: "100%", maxWidth: 420 } as const;

export function RadioDemo({ lang }: { lang: Lang }) {
  const en = lang === "en";
  return (
    <div style={{ display: "grid", gap: 32, width: "100%" }}>
      <RadioGroup
        label={en ? "Plan" : "Formule"}
        hint={en ? "You can change it at any time." : "Vous pouvez en changer à tout moment."}
        defaultValue="pro"
        options={[
          {
            value: "free",
            label: en ? "Free" : "Gratuite",
            description: en ? "For personal projects" : "Pour les projets personnels",
          },
          {
            value: "pro",
            label: "Pro",
            description: en ? "For a business, up to 10 sites" : "Pour une entreprise, jusqu'à 10 sites",
          },
          { value: "team", label: en ? "Team" : "Équipe", description: en ? "Coming soon" : "Bientôt", disabled: true },
        ]}
      />
      <RadioGroup
        label={en ? "Contact me by" : "Me contacter par"}
        orientation="horizontal"
        options={[
          { value: "email", label: en ? "Email" : "E-mail" },
          { value: "phone", label: en ? "Phone" : "Téléphone" },
          { value: "sms", label: "SMS" },
        ]}
        error={en ? "Choose a way to reach you." : "Choisissez un moyen de vous joindre."}
        required
      />
    </div>
  );
}

export function PasswordDemo({ lang }: { lang: Lang }) {
  const en = lang === "en";
  return (
    <div style={narrow}>
      <Field label={en ? "Password" : "Mot de passe"} hint={en ? "At least 12 characters." : "Au moins 12 caractères."}>
        <PasswordInput
          defaultValue="correct-horse-battery"
          autoComplete="new-password"
          {...(en ? {} : { showLabel: "Afficher", hideLabel: "Masquer", noun: "le mot de passe" })}
        />
      </Field>
    </div>
  );
}

export function PinDemo({ lang }: { lang: Lang }) {
  const en = lang === "en";
  const [done, setDone] = useState<string | null>(null);
  return (
    <div style={narrow}>
      <Field
        label={en ? "Verification code" : "Code de vérification"}
        hint={en ? "Sent to +229 •• •• 42 17" : "Envoyé au +229 •• •• 42 17"}
      >
        <PinInput
          length={6}
          onChange={() => setDone(null)}
          onComplete={setDone}
          label={en ? "Verification code" : "Code de vérification"}
          charLabel={(i, n) => (en ? `Digit ${i + 1} of ${n}` : `Chiffre ${i + 1} sur ${n}`)}
        />
      </Field>
      <Text size="sm" tone="subtle" aria-live="polite">
        {done ? (en ? `Code ${done} complete.` : `Code ${done} complet.`) : ""}
      </Text>
    </div>
  );
}

const COUNTRIES = [
  ["bj", "Bénin"],
  ["bf", "Burkina Faso"],
  ["cm", "Cameroun"],
  ["ci", "Côte d'Ivoire"],
  ["ga", "Gabon"],
  ["gh", "Ghana"],
  ["gn", "Guinée"],
  ["ml", "Mali"],
  ["ne", "Niger"],
  ["ng", "Nigeria"],
  ["sn", "Sénégal"],
  ["tg", "Togo"],
] as const;

export function ComboboxDemo({ lang }: { lang: Lang }) {
  const en = lang === "en";
  const [value, setValue] = useState<string | null>("bj");
  return (
    <div style={narrow}>
      <Field label={en ? "Country" : "Pays"} hint={en ? "Try “cote” or “sen”." : "Essayez « cote » ou « sen »."}>
        <Combobox
          options={COUNTRIES.map(([v, label]) => ({ value: v, label }))}
          value={value}
          onValueChange={setValue}
          placeholder={en ? "Search a country" : "Rechercher un pays"}
          emptyText={en ? "No country matches." : "Aucun pays ne correspond."}
          name="country"
        />
      </Field>
      <Text size="sm" tone="subtle">
        {en ? "Value:" : "Valeur :"} <code>{value ?? "null"}</code>
      </Text>
    </div>
  );
}

export function FileDemo({ lang }: { lang: Lang }) {
  const en = lang === "en";
  return (
    <div style={narrow}>
      <Field label={en ? "Resume" : "CV"} hint={en ? "PDF only." : "PDF uniquement."}>
        <FileInput
          accept=".pdf"
          buttonLabel={en ? "Choose a file" : "Choisir un fichier"}
          placeholder={en ? "No file chosen" : "Aucun fichier"}
        />
      </Field>
    </div>
  );
}

export function DropzoneDemo({ lang }: { lang: Lang }) {
  const en = lang === "en";
  const [total, setTotal] = useState(0);
  return (
    <div style={{ display: "grid", gap: 12, width: "100%" }}>
      <Dropzone
        accept="image/*,.pdf"
        maxSize={5 * 1024 * 1024}
        maxFiles={4}
        onFilesChange={(files) => setTotal(files.reduce((sum, f) => sum + f.size, 0))}
        title={en ? "Drop files here or" : "Déposez vos fichiers ici ou"}
        browseLabel={en ? "browse" : "parcourez"}
        hint={
          en ? "Images or PDF, up to 5 MB each, 4 files at most." : "Images ou PDF, 5 Mo chacun, 4 fichiers au plus."
        }
        removeLabel={(file) => (en ? `Remove ${file.name}` : `Retirer ${file.name}`)}
        rejectionLabel={({ file, reason }) =>
          en
            ? `${file.name}: ${reason === "type" ? "this type is not accepted" : reason === "size" ? "larger than 5 MB" : "4 files at most"}`
            : `${file.name} : ${reason === "type" ? "ce type n'est pas accepté" : reason === "size" ? "plus de 5 Mo" : "4 fichiers au plus"}`
        }
      />
      <Text size="sm" tone="subtle">
        {en ? "Total:" : "Total :"} {formatBytes(total)}
      </Text>
    </div>
  );
}

export function SliderDemo({ lang }: { lang: Lang }) {
  const en = lang === "en";
  const price = new Intl.NumberFormat(en ? "en-GB" : "fr-FR", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0,
  });
  return (
    <div style={narrow}>
      <Field label={en ? "Monthly budget" : "Budget mensuel"}>
        <Slider min={0} max={500} step={10} defaultValue={120} showValue formatValue={(v) => price.format(v)} />
      </Field>
      <Field label={en ? "Opacity" : "Opacité"}>
        <Slider defaultValue={72} showValue formatValue={(v) => `${v} %`} />
      </Field>
    </div>
  );
}

export function DatePickerDemo({ lang }: { lang: Lang }) {
  const en = lang === "en";
  const [date, setDate] = useState<Date | null>(null);
  // Limits computed once, on the client.
  const [limits] = useState(() => {
    const today = new Date();
    return { min: today, max: new Date(today.getFullYear(), today.getMonth() + 3, today.getDate()) };
  });
  return (
    <div style={narrow}>
      <Field
        label={en ? "Arrival" : "Arrivée"}
        hint={en ? "From today, within 3 months." : "À partir d'aujourd'hui, dans les 3 mois."}
      >
        <DatePicker
          value={date}
          onValueChange={setDate}
          locale={en ? "en-GB" : "fr-FR"}
          min={limits.min}
          max={limits.max}
          placeholder={en ? "Choose a date" : "Choisir une date"}
          label={en ? "Choose a date" : "Choisir une date"}
          previousMonthLabel={en ? "Previous month" : "Mois précédent"}
          nextMonthLabel={en ? "Next month" : "Mois suivant"}
          name="arrival"
        />
      </Field>
    </div>
  );
}
