import { fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { expectAccessible } from "../../test/axe";
import { Field } from "./field";
import { PinInput } from "./pin-input";

const boxes = () => screen.getAllByRole("textbox") as HTMLInputElement[];
const values = () =>
  boxes()
    .map((b) => b.value)
    .join("|");

describe("PinInput", () => {
  it("renders labelled boxes in a named group", () => {
    render(<PinInput length={4} />);
    expect(screen.getByRole("group", { name: "Verification code" })).toBeInTheDocument();
    expect(boxes()).toHaveLength(4);
    expect(boxes()[2]).toHaveAccessibleName("Character 3 of 4");
    expect(boxes()[0]).toHaveAttribute("autocomplete", "one-time-code");
    expect(boxes()[0]).toHaveAttribute("inputmode", "numeric");
  });

  it("moves forward while typing and completes", async () => {
    const onComplete = vi.fn();
    render(<PinInput length={4} onComplete={onComplete} />);
    await userEvent.click(boxes()[0]!);
    await userEvent.keyboard("1234");
    expect(values()).toBe("1|2|3|4");
    expect(onComplete).toHaveBeenCalledWith("1234");
  });

  it("ignores characters that do not fit the type", async () => {
    render(<PinInput length={4} />);
    await userEvent.click(boxes()[0]!);
    await userEvent.keyboard("a1b2");
    expect(values()).toBe("1|2||");
  });

  it("accepts letters in alphanumeric mode", async () => {
    render(<PinInput length={3} type="alphanumeric" />);
    await userEvent.click(boxes()[0]!);
    await userEvent.keyboard("A7z");
    expect(values()).toBe("A|7|z");
  });

  it("moves back with Backspace and with the arrows", async () => {
    render(<PinInput length={4} defaultValue="12" />);
    await userEvent.click(boxes()[2]!);
    await userEvent.keyboard("{Backspace}");
    expect(values()).toBe("1|||");
    expect(document.activeElement).toBe(boxes()[1]);
    await userEvent.keyboard("{ArrowLeft}");
    expect(document.activeElement).toBe(boxes()[0]);
    await userEvent.keyboard("{End}");
    expect(document.activeElement).toBe(boxes()[3]);
  });

  it("fills every box when a code is pasted", () => {
    const onComplete = vi.fn();
    render(<PinInput length={6} onComplete={onComplete} />);
    fireEvent.paste(boxes()[0]!, { clipboardData: { getData: () => "48 21-57" } });
    expect(values()).toBe("4|8|2|1|5|7");
    expect(onComplete).toHaveBeenCalledWith("482157");
  });

  it("handles autofill that puts the whole code in the first box", () => {
    render(<PinInput length={4} />);
    fireEvent.change(boxes()[0]!, { target: { value: "9876" } });
    expect(values()).toBe("9|8|7|6");
  });

  it("is wired to its Field", () => {
    render(
      <Field label="Code" error="Wrong code">
        <PinInput length={4} />
      </Field>,
    );
    expect(screen.getByLabelText("Code")).toBe(boxes()[0]);
    expect(screen.getByRole("group")).toHaveAccessibleDescription("Wrong code");
    expect(boxes()[1]).toHaveAttribute("aria-invalid", "true");
  });

  it("is accessible", async () => {
    const { container } = render(
      <Field label="Code" hint="Sent by text message">
        <PinInput length={6} />
      </Field>,
    );
    await expectAccessible(container);
  });
});
