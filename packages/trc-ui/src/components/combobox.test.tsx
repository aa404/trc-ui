import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { expectAccessible } from "../../test/axe";
import { Combobox } from "./combobox";
import { Field } from "./field";

const countries = [
  { value: "bj", label: "Bénin" },
  { value: "bf", label: "Burkina Faso" },
  { value: "ci", label: "Côte d'Ivoire" },
  { value: "gh", label: "Ghana", disabled: true },
  { value: "ng", label: "Nigeria" },
  { value: "tg", label: "Togo" },
];

const setup = (props = {}) =>
  render(
    <Field label="Country">
      <Combobox options={countries} placeholder="Search" {...props} />
    </Field>,
  );

describe("Combobox", () => {
  it("is a labelled combobox that opens a listbox", async () => {
    setup();
    const input = screen.getByRole("combobox", { name: "Country" });
    expect(input).toHaveAttribute("aria-expanded", "false");
    await userEvent.click(input);
    expect(input).toHaveAttribute("aria-expanded", "true");
    expect(screen.getByRole("listbox")).toHaveAttribute("id", input.getAttribute("aria-controls"));
    expect(screen.getAllByRole("option")).toHaveLength(6);
  });

  it("filters ignoring case and accents", async () => {
    setup();
    await userEvent.type(screen.getByRole("combobox"), "cote");
    expect(screen.getAllByRole("option").map((o) => o.textContent)).toEqual(["Côte d'Ivoire"]);
    await userEvent.clear(screen.getByRole("combobox"));
    await userEvent.type(screen.getByRole("combobox"), "zzz");
    expect(screen.queryAllByRole("option")).toHaveLength(0);
    expect(screen.getByText("No results")).toBeInTheDocument();
  });

  it("moves the active option with the arrows, skipping disabled ones, and chooses with Enter", async () => {
    const onValueChange = vi.fn();
    setup({ onValueChange });
    const input = screen.getByRole("combobox");
    input.focus();
    await userEvent.keyboard("{ArrowDown}");
    const active = () => document.getElementById(input.getAttribute("aria-activedescendant")!)?.textContent;
    expect(active()).toBe("Bénin");
    await userEvent.keyboard("{ArrowDown}{ArrowDown}{ArrowDown}");
    expect(active()).toBe("Nigeria");
    await userEvent.keyboard("{Enter}");
    expect(onValueChange).toHaveBeenCalledWith("ng");
    expect(input).toHaveValue("Nigeria");
    expect(input).toHaveAttribute("aria-expanded", "false");
    expect(document.activeElement).toBe(input);
  });

  it("chooses with a click and marks the selected option", async () => {
    setup();
    await userEvent.click(screen.getByRole("combobox"));
    await userEvent.click(screen.getByRole("option", { name: "Togo" }));
    expect(screen.getByRole("combobox")).toHaveValue("Togo");
    await userEvent.click(screen.getByRole("combobox"));
    expect(screen.getByRole("option", { name: "Togo" })).toHaveAttribute("aria-selected", "true");
  });

  it("restores the chosen label on Escape and when leaving", async () => {
    setup({ defaultValue: "bj" });
    const input = screen.getByRole("combobox");
    expect(input).toHaveValue("Bénin");
    await userEvent.clear(input);
    await userEvent.type(input, "Tog");
    await userEvent.keyboard("{Escape}");
    expect(input).toHaveValue("Bénin");
    await userEvent.type(input, "x");
    await userEvent.tab();
    expect(input).toHaveValue("Bénin");
  });

  it("submits the value with a name", () => {
    const { container } = setup({ defaultValue: "tg", name: "country" });
    expect(container.querySelector("input[type=hidden][name=country]")).toHaveValue("tg");
  });

  it("is accessible, open or closed", async () => {
    const { container } = setup({ defaultValue: "bj" });
    await expectAccessible(container);
    await userEvent.click(screen.getByRole("combobox"));
    await expectAccessible(document.body);
  });
});
