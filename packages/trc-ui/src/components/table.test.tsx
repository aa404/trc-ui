import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { expectAccessible } from "../../test/axe";
import { Stat } from "./stat";
import { Table, type TableColumn } from "./table";

type Invoice = { id: string; client: string; amount: number; date: Date };

const rows: Invoice[] = [
  { id: "1", client: "Kpɔ̀n", amount: 1200, date: new Date(2026, 8, 3) },
  { id: "2", client: "Atelier Sena", amount: 340, date: new Date(2026, 9, 12) },
  { id: "3", client: "Blonoumi", amount: 9800, date: new Date(2026, 6, 21) },
];

const columns: TableColumn<Invoice>[] = [
  { key: "client", header: "Client", sortable: true },
  { key: "amount", header: "Amount", align: "right", sortable: true, render: (r) => `€${r.amount}` },
  { key: "date", header: "Date", sortable: true, render: (r) => r.date.toISOString().slice(0, 10) },
];

const firstColumn = () =>
  screen
    .getAllByRole("row")
    .slice(1)
    .map((row) => within(row).getAllByRole("cell")[0]!.textContent);

describe("Table", () => {
  it("renders a captioned table with headers", () => {
    render(<Table caption="Invoices" columns={columns} rows={rows} rowKey={(r) => r.id} />);
    const table = screen.getByRole("table", { name: "Invoices" });
    expect(within(table).getAllByRole("columnheader")).toHaveLength(3);
    expect(screen.getByRole("region", { name: "Invoices" })).toHaveAttribute("tabindex", "0");
    expect(screen.getByText("€1200").closest("td")).toHaveClass("trc-table__cell--right");
  });

  it("sorts by a column, both ways, and announces it", async () => {
    render(<Table caption="Invoices" columns={columns} rows={rows} rowKey={(r) => r.id} />);
    const header = screen.getByRole("columnheader", { name: "Amount" });
    expect(header).toHaveAttribute("aria-sort", "none");
    await userEvent.click(screen.getByRole("button", { name: "Amount" }));
    expect(header).toHaveAttribute("aria-sort", "ascending");
    expect(firstColumn()).toEqual(["Atelier Sena", "Kpɔ̀n", "Blonoumi"]);
    await userEvent.click(screen.getByRole("button", { name: "Amount" }));
    expect(header).toHaveAttribute("aria-sort", "descending");
    expect(firstColumn()).toEqual(["Blonoumi", "Kpɔ̀n", "Atelier Sena"]);
  });

  it("sorts dates and text, and starts from defaultSort", async () => {
    render(
      <Table
        caption="Invoices"
        columns={columns}
        rows={rows}
        rowKey={(r) => r.id}
        defaultSort={{ key: "date", direction: "descending" }}
      />,
    );
    expect(firstColumn()).toEqual(["Atelier Sena", "Kpɔ̀n", "Blonoumi"]);
    await userEvent.click(screen.getByRole("button", { name: "Client" }));
    expect(firstColumn()).toEqual(["Atelier Sena", "Blonoumi", "Kpɔ̀n"]);
  });

  it("shows a message without rows", () => {
    render(<Table caption="Invoices" columns={columns} rows={[]} rowKey={(r) => r.id} emptyText="No invoice yet" />);
    expect(screen.getByText("No invoice yet")).toHaveAttribute("colspan", "3");
  });

  it("is accessible", async () => {
    const { container } = render(<Table caption="Invoices" columns={columns} rows={rows} rowKey={(r) => r.id} />);
    await expectAccessible(container);
  });
});

describe("Stat", () => {
  it("pairs the label and the value", () => {
    render(<Stat label="Visitors" value="12 480" change="+12 %" changeTone="positive" description="vs last month" />);
    expect(screen.getByRole("term")).toHaveTextContent("Visitors");
    expect(screen.getAllByRole("definition")[0]).toHaveTextContent("12 480");
    expect(screen.getByText("+12 %")).toHaveClass("trc-stat__change--positive");
  });

  it("is accessible", async () => {
    const { container } = render(<Stat label="Revenue" value="€8 200" change="-3 %" changeTone="negative" />);
    await expectAccessible(container);
  });
});
