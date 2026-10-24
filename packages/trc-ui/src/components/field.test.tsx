import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { expectAccessible } from "../../test/axe";
import { Field, Input, Select, Textarea } from "./field";
import { Checkbox, Switch } from "./toggle";

describe("Field", () => {
  it("wires the label, hint and invalid state to the control", () => {
    render(
      <Field label="Email" error="Not valid" required>
        <Input />
      </Field>,
    );
    const input = screen.getByRole("textbox", { name: "Email" });
    expect(input).toBeRequired();
    expect(input).toHaveAttribute("aria-invalid", "true");
    expect(input).toHaveAccessibleDescription("Not valid");
  });

  it("keeps the describedby of the control", () => {
    render(
      <Field label="Name" hint="Your full name">
        <Input aria-describedby="extra" />
      </Field>,
    );
    expect(screen.getByRole("textbox").getAttribute("aria-describedby")).toMatch(/-message extra$/);
  });

  it("Select shows its placeholder until something is chosen", async () => {
    render(
      <Field label="Subject">
        <Select placeholder="Choose">
          <option value="a">A</option>
        </Select>
      </Field>,
    );
    const select = screen.getByRole("combobox", { name: "Subject" });
    expect(select).toHaveValue("");
    await userEvent.selectOptions(select, "a");
    expect(select).toHaveValue("a");
  });
});

describe("Checkbox and Switch", () => {
  it("toggle when their label is clicked", async () => {
    render(
      <>
        <Checkbox label="Terms" />
        <Switch label="Alerts" />
      </>,
    );
    await userEvent.click(screen.getByText("Terms"));
    await userEvent.click(screen.getByText("Alerts"));
    expect(screen.getByRole("checkbox", { name: "Terms" })).toBeChecked();
    expect(screen.getByRole("switch", { name: "Alerts" })).toBeChecked();
  });
});

it("forms are accessible", async () => {
  const { container } = render(
    <form>
      <Field label="Name" hint="Hint">
        <Input />
      </Field>
      <Field label="Message" error="Required">
        <Textarea />
      </Field>
      <Checkbox label="Terms" description="Read them" />
      <Switch label="Alerts" />
    </form>,
  );
  await expectAccessible(container);
});
