"use client";

import { useEffect, useState } from "react";
import { Progress, Table, Tag, type TableColumn } from "trc-ui";
import type { Lang } from "@/lib/i18n";

type Invoice = { id: string; client: string; amount: number; date: Date; status: "paid" | "due" };

const INVOICES: Invoice[] = [
  { id: "F-1042", client: "Atelier Sena", amount: 340, date: new Date(2026, 9, 12), status: "due" },
  { id: "F-1041", client: "Kpɔ̀n", amount: 1200, date: new Date(2026, 8, 3), status: "paid" },
  { id: "F-1040", client: "Blonoumi", amount: 9800, date: new Date(2026, 6, 21), status: "paid" },
  { id: "F-1039", client: "Maison Dossou", amount: 2150, date: new Date(2026, 5, 2), status: "paid" },
];

export function TableDemo({ lang }: { lang: Lang }) {
  const en = lang === "en";
  const money = new Intl.NumberFormat(en ? "en-GB" : "fr-FR", { style: "currency", currency: "EUR" });
  const date = new Intl.DateTimeFormat(en ? "en-GB" : "fr-FR", { dateStyle: "medium" });
  const columns: TableColumn<Invoice>[] = [
    { key: "id", header: en ? "Invoice" : "Facture" },
    { key: "client", header: "Client", sortable: true },
    { key: "date", header: "Date", sortable: true, render: (r) => date.format(r.date) },
    {
      key: "status",
      header: en ? "Status" : "Statut",
      render: (r) =>
        r.status === "due" ? <Tag tone="accent">{en ? "Due" : "À payer"}</Tag> : <Tag>{en ? "Paid" : "Payée"}</Tag>,
    },
    {
      key: "amount",
      header: en ? "Amount" : "Montant",
      align: "right",
      sortable: true,
      render: (r) => money.format(r.amount),
    },
  ];
  return (
    <div style={{ width: "100%" }}>
      <Table
        caption={en ? "Invoices" : "Factures"}
        columns={columns}
        rows={INVOICES}
        rowKey={(r) => r.id}
        defaultSort={{ key: "date", direction: "descending" }}
      />
    </div>
  );
}

export function TagsDemo({ lang }: { lang: Lang }) {
  const en = lang === "en";
  const [filters, setFilters] = useState(en ? ["Design", "React", "Open source"] : ["Design", "React", "Open source"]);
  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
      <Tag tone="accent">{en ? "New" : "Nouveau"}</Tag>
      <Tag>Beta</Tag>
      {filters.map((filter) => (
        <Tag
          key={filter}
          removeLabel={en ? "Remove" : "Retirer"}
          onRemove={() => setFilters((current) => current.filter((f) => f !== filter))}
        >
          {filter}
        </Tag>
      ))}
    </div>
  );
}

export function UploadProgressDemo({ lang }: { lang: Lang }) {
  const en = lang === "en";
  const [value, setValue] = useState(0);
  useEffect(() => {
    const timer = window.setInterval(() => setValue((v) => (v >= 100 ? 0 : v + 4)), 220);
    return () => window.clearInterval(timer);
  }, []);
  return (
    <div style={{ display: "grid", gap: 24, width: "100%", maxWidth: 420 }}>
      <Progress label={en ? "Uploading photos" : "Envoi des photos"} value={value} showValue />
      <Progress aria-label={en ? "Preparing" : "Préparation"} label={en ? "Preparing…" : "Préparation…"} />
    </div>
  );
}
