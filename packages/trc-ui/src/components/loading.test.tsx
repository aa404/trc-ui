import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { expectAccessible } from "../../test/axe";
import { Progress, Skeleton, Spinner } from "./loading";

describe("Skeleton", () => {
  it("is hidden from screen readers and can draw lines", () => {
    const { container } = render(<Skeleton lines={3} width={240} />);
    expect(container.firstChild).toHaveAttribute("aria-hidden");
    expect(container.querySelectorAll(".trc-skeleton")).toHaveLength(3);
    expect((container.querySelectorAll(".trc-skeleton")[2] as HTMLElement).style.width).toBe("60%");
  });

  it("draws a circle", () => {
    const { container } = render(<Skeleton circle width={48} />);
    expect(container.firstChild).toHaveStyle({ width: "48px", height: "48px" });
  });
});

describe("Spinner", () => {
  it("is announced as a status", () => {
    render(<Spinner label="Saving" />);
    expect(screen.getByRole("status")).toHaveTextContent("Saving");
  });
});

describe("Progress", () => {
  it("exposes its value and its label", () => {
    render(<Progress label="Upload" value={30} max={120} showValue />);
    const bar = screen.getByRole("progressbar", { name: "Upload" });
    expect(bar).toHaveAttribute("aria-valuenow", "30");
    expect(bar).toHaveAttribute("aria-valuemax", "120");
    expect(bar).toHaveAttribute("aria-valuetext", "25 %");
    expect(screen.getByText("25 %")).toBeInTheDocument();
  });

  it("clamps the value", () => {
    render(<Progress aria-label="Sync" value={150} />);
    expect(screen.getByRole("progressbar", { name: "Sync" })).toHaveAttribute("aria-valuenow", "100");
  });

  it("is indeterminate without a value", () => {
    const { container } = render(<Progress aria-label="Loading" />);
    expect(screen.getByRole("progressbar")).not.toHaveAttribute("aria-valuenow");
    expect(container.firstChild).toHaveClass("trc-progress--indeterminate");
  });

  it("loading states are accessible", async () => {
    const { container } = render(
      <div>
        <Skeleton lines={2} />
        <Spinner />
        <Progress label="Upload" value={40} showValue />
        <Progress aria-label="Loading" />
      </div>,
    );
    await expectAccessible(container);
  });
});
