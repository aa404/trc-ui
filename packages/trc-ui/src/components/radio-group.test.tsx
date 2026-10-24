import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { expectAccessible } from "../../test/axe";
import { Field } from "./field";
import { PasswordInput } from "./password-input";
import { RadioGroup } from "./radio-group";

const plans = [
  { value: "free", label: "Free", description: "For personal projects" },
  { value: "pro", label: "Pro" },
  { value: "team", label: "Team", disabled: true },
];

describe("RadioGroup", () => {
  it("is a fieldset named by its legend", () => {
    render(<RadioGroup label="Plan" options={plans} hint="Change it anytime." />);
    const group = screen.getByRole("group", { name: "Plan" });
    expect(group).toHaveAccessibleDescription("Change it anytime.");
    expect(screen.getAllByRole("radio")).toHaveLength(3);
  });

  it("selects with a click and with the arrows", async () => {
    const onValueChange = vi.fn();
    render(<RadioGroup label="Plan" options={plans} defaultValue="free" onValueChange={onValueChange} />);
    await userEvent.click(screen.getByText("Pro"));
    expect(screen.getByRole("radio", { name: "Pro" })).toBeChecked();
    expect(onValueChange).toHaveBeenLastCalledWith("pro");
    screen.getByRole("radio", { name: "Pro" }).focus();
    await userEvent.keyboard("{ArrowUp}");
    expect(screen.getByRole("radio", { name: /Free/ })).toBeChecked();
  });

  it("reports an error on the group", () => {
    render(<RadioGroup label="Plan" options={plans} error="Choose a plan." required />);
    const group = screen.getByRole("group", { name: "Plan" });
    expect(group).toHaveAttribute("aria-invalid", "true");
    expect(group).toHaveAccessibleDescription("Choose a plan.");
    expect(screen.getByRole("radio", { name: "Pro" })).toBeRequired();
  });

  it("is accessible", async () => {
    const { container } = render(<RadioGroup label="Plan" options={plans} defaultValue="pro" hint="Hint" />);
    await expectAccessible(container);
  });
});

describe("PasswordInput", () => {
  it("shows and hides the password, wired to its Field", async () => {
    render(
      <Field label="Password" hint="At least 12 characters">
        <PasswordInput defaultValue="secret" />
      </Field>,
    );
    const input = screen.getByLabelText("Password");
    expect(input).toHaveAttribute("type", "password");
    expect(input).toHaveAccessibleDescription("At least 12 characters");
    const toggle = screen.getByRole("button", { name: "Show password" });
    expect(toggle).toHaveAttribute("aria-controls", input.id);
    await userEvent.click(toggle);
    expect(input).toHaveAttribute("type", "text");
    expect(screen.getByRole("button", { name: "Hide password" })).toBeInTheDocument();
  });

  it("can be translated", () => {
    render(
      <Field label="Mot de passe">
        <PasswordInput showLabel="Afficher" hideLabel="Masquer" noun="le mot de passe" />
      </Field>,
    );
    expect(screen.getByRole("button", { name: "Afficher le mot de passe" })).toBeInTheDocument();
  });

  it("is accessible", async () => {
    const { container } = render(
      <Field label="Password">
        <PasswordInput />
      </Field>,
    );
    await expectAccessible(container);
  });
});
