import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { expectAccessible } from "../../test/axe";
import { addMonths, gridStart, toISODate } from "../utils/dates";
import { DatePicker } from "./date-picker";
import { Field } from "./field";

const march12 = new Date(2026, 2, 12);
const focusedLabel = () => document.activeElement?.getAttribute("aria-label");

describe("date helpers", () => {
  it("adds months without overflowing", () => {
    expect(toISODate(addMonths(new Date(2026, 0, 31), 1))).toBe("2026-02-28");
    expect(toISODate(addMonths(new Date(2024, 0, 31), 1))).toBe("2024-02-29");
    expect(toISODate(addMonths(new Date(2026, 2, 12), -12))).toBe("2025-03-12");
  });

  it("starts the grid on the requested weekday", () => {
    // 1 March 2026 is a Sunday.
    expect(toISODate(gridStart(march12, 1))).toBe("2026-02-23");
    expect(toISODate(gridStart(march12, 0))).toBe("2026-03-01");
  });
});

const setup = (props = {}) =>
  render(
    <Field label="Arrival" hint="Check-in from 3 pm">
      <DatePicker locale="en-GB" defaultValue={march12} name="arrival" {...props} />
    </Field>,
  );

describe("DatePicker", () => {
  it("is a labelled button showing the date", () => {
    const { container } = setup();
    const trigger = screen.getByRole("button", { name: "Arrival" });
    expect(trigger).toHaveTextContent("12 Mar 2026");
    expect(trigger).toHaveAccessibleDescription("12 Mar 2026 Check-in from 3 pm");
    expect(trigger).toHaveAttribute("aria-haspopup", "dialog");
    expect(container.querySelector("input[type=hidden]")).toHaveValue("2026-03-12");
  });

  it("opens a calendar focused on the chosen day", async () => {
    setup();
    await userEvent.click(screen.getByRole("button", { name: "Arrival" }));
    expect(screen.getByRole("dialog", { name: "Choose a date" })).toBeInTheDocument();
    expect(screen.getByRole("grid", { name: "March 2026" })).toBeInTheDocument();
    expect(focusedLabel()).toBe("Thursday, 12 March 2026");
    expect(screen.getByRole("gridcell", { selected: true })).toHaveTextContent("12");
  });

  it("moves with the keyboard and chooses with Enter", async () => {
    const onValueChange = vi.fn();
    setup({ onValueChange });
    const trigger = screen.getByRole("button", { name: "Arrival" });
    await userEvent.click(trigger);
    await userEvent.keyboard("{ArrowRight}");
    expect(focusedLabel()).toBe("Friday, 13 March 2026");
    await userEvent.keyboard("{ArrowDown}");
    expect(focusedLabel()).toBe("Friday, 20 March 2026");
    await userEvent.keyboard("{Home}");
    expect(focusedLabel()).toBe("Monday, 16 March 2026");
    await userEvent.keyboard("{End}");
    expect(focusedLabel()).toBe("Sunday, 22 March 2026");
    await userEvent.keyboard("{PageDown}");
    expect(focusedLabel()).toBe("Wednesday, 22 April 2026");
    expect(screen.getByRole("grid", { name: "April 2026" })).toBeInTheDocument();
    await userEvent.keyboard("{Shift>}{PageUp}{/Shift}");
    expect(focusedLabel()).toBe("Tuesday, 22 April 2025");
    await userEvent.keyboard("{Enter}");
    expect(onValueChange).toHaveBeenCalledWith(new Date(2025, 3, 22));
    expect(screen.queryByRole("dialog")).toBeNull();
    expect(document.activeElement).toBe(trigger);
    expect(trigger).toHaveTextContent("22 Apr 2025");
  });

  it("changes month with the buttons and closes with Escape", async () => {
    setup();
    const trigger = screen.getByRole("button", { name: "Arrival" });
    await userEvent.click(trigger);
    await userEvent.click(screen.getByRole("button", { name: "Next month" }));
    expect(screen.getByRole("grid", { name: "April 2026" })).toBeInTheDocument();
    await userEvent.keyboard("{Escape}");
    expect(screen.queryByRole("dialog")).toBeNull();
    expect(document.activeElement).toBe(trigger);
  });

  it("disables days out of range and keeps the focus inside it", async () => {
    setup({ min: new Date(2026, 2, 10), max: new Date(2026, 2, 14) });
    await userEvent.click(screen.getByRole("button", { name: "Arrival" }));
    expect(screen.getByRole("button", { name: "Monday, 9 March 2026" })).toBeDisabled();
    expect(screen.getByRole("button", { name: "Saturday, 14 March 2026" })).toBeEnabled();
    await userEvent.keyboard("{ArrowDown}");
    expect(focusedLabel()).toBe("Saturday, 14 March 2026");
  });

  it("shows a placeholder without a value", () => {
    render(
      <Field label="Date">
        <DatePicker locale="en-GB" placeholder="Pick a day" />
      </Field>,
    );
    expect(screen.getByRole("button", { name: "Date" })).toHaveTextContent("Pick a day");
  });

  it("is accessible, closed and open", async () => {
    const { container } = setup();
    await expectAccessible(container);
    await userEvent.click(screen.getByRole("button", { name: "Arrival" }));
    await expectAccessible(document.body);
  });
});
