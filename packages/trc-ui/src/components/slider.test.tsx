import { fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { expectAccessible } from "../../test/axe";
import { Field } from "./field";
import { Slider } from "./slider";

describe("Slider", () => {
  it("is a labelled slider with its range", () => {
    render(
      <Field label="Budget" hint="Per month">
        <Slider min={0} max={200} step={10} defaultValue={40} />
      </Field>,
    );
    const slider = screen.getByRole("slider", { name: "Budget" });
    expect(slider).toHaveValue("40");
    expect(slider).toHaveAttribute("max", "200");
    expect(slider).toHaveAccessibleDescription("Per month");
    expect(slider.style.getPropertyValue("--trc-slider-progress")).toBe("20%");
  });

  it("changes with the keyboard and reports numbers", async () => {
    const onValueChange = vi.fn();
    render(<Slider aria-label="Volume" defaultValue={50} onValueChange={onValueChange} />);
    const slider = screen.getByRole("slider", { name: "Volume" });
    fireEvent.change(slider, { target: { value: "75" } });
    expect(onValueChange).toHaveBeenLastCalledWith(75);
    expect(slider.style.getPropertyValue("--trc-slider-progress")).toBe("75%");
  });

  it("shows and announces a formatted value", () => {
    render(<Slider aria-label="Price" defaultValue={40} showValue formatValue={(v) => `€ ${v}`} />);
    expect(screen.getByRole("slider")).toHaveAttribute("aria-valuetext", "€ 40");
    expect(screen.getByText("€ 40")).toBeInTheDocument();
  });

  it("is accessible", async () => {
    const { container } = render(
      <Field label="Opacity">
        <Slider defaultValue={30} showValue />
      </Field>,
    );
    await expectAccessible(container);
    await userEvent.tab();
    expect(document.activeElement).toBe(screen.getByRole("slider"));
  });
});
