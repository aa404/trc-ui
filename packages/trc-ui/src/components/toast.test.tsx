import { act, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { expectAccessible } from "../../test/axe";
import { Alert } from "./alert";
import { Toaster, toast } from "./toast";

describe("toast", () => {
  beforeEach(() => vi.useFakeTimers());
  afterEach(() => {
    act(() => {
      toast.dismiss();
      vi.runAllTimers();
    });
    vi.useRealTimers();
  });

  it("shows a toast in a labelled live region", () => {
    render(<Toaster />);
    act(() => {
      toast("Saved", { description: "Your changes are online." });
    });
    const region = screen.getByRole("region", { name: "Notifications" });
    const live = region.querySelector("[aria-live=polite]")!;
    expect(live).toBeInTheDocument();
    expect(live).toHaveTextContent("Saved");
    expect(live).toHaveTextContent("Your changes are online.");
  });

  it("announces errors as alerts", () => {
    render(<Toaster />);
    act(() => {
      toast.error("Payment failed");
    });
    expect(screen.getByRole("alert")).toHaveTextContent("Payment failed");
  });

  it("disappears after its duration", () => {
    render(<Toaster duration={3000} />);
    act(() => {
      toast("Copied");
    });
    act(() => vi.advanceTimersByTime(2900));
    expect(screen.queryByText("Copied")).toBeInTheDocument();
    act(() => vi.advanceTimersByTime(400));
    expect(screen.queryByText("Copied")).toBeNull();
  });

  it("pauses while hovered", () => {
    render(<Toaster duration={3000} />);
    act(() => {
      toast("Copied");
    });
    act(() => vi.advanceTimersByTime(2000));
    fireEvent.mouseEnter(screen.getByRole("region"));
    act(() => vi.advanceTimersByTime(10000));
    expect(screen.getByText("Copied")).toBeInTheDocument();
    fireEvent.mouseLeave(screen.getByRole("region"));
    act(() => vi.advanceTimersByTime(1300));
    expect(screen.queryByText("Copied")).toBeNull();
  });

  it("runs its action, then dismisses", () => {
    const undo = vi.fn();
    render(<Toaster />);
    act(() => {
      toast("Deleted", { action: { label: "Undo", onClick: undo }, duration: Infinity });
    });
    fireEvent.click(screen.getByRole("button", { name: "Undo" }));
    act(() => vi.advanceTimersByTime(300));
    expect(undo).toHaveBeenCalledOnce();
    expect(screen.queryByText("Deleted")).toBeNull();
  });

  it("can be dismissed by id or with its close button", () => {
    render(<Toaster />);
    let id = 0;
    act(() => {
      id = toast("First", { duration: Infinity });
      toast("Second", { duration: Infinity });
    });
    act(() => {
      toast.dismiss(id);
      vi.advanceTimersByTime(300);
    });
    expect(screen.queryByText("First")).toBeNull();
    fireEvent.click(screen.getByRole("button", { name: "Close" }));
    act(() => vi.advanceTimersByTime(300));
    expect(screen.queryByText("Second")).toBeNull();
  });

});

it("toaster is accessible", async () => {
  render(<Toaster />);
  act(() => {
    toast.success("Saved", { action: { label: "View", onClick: () => {} } });
    toast.error("Failed");
  });
  await expectAccessible(document.body);
  act(() => toast.dismiss());
});

describe("Alert", () => {
  it("renders its title, text and actions, with a tone", () => {
    const { container } = render(
      <Alert title="Heads up" tone="error" actions={<button>Retry</button>}>
        Something went wrong.
      </Alert>,
    );
    expect(container.firstChild).toHaveClass("trc-alert--error");
    expect(container).toHaveTextContent("Heads upSomething went wrong.Retry");
  });

  it("passes the live role through", () => {
    render(<Alert role="status">Done</Alert>);
    expect(screen.getByRole("status")).toHaveTextContent("Done");
  });

  it("is accessible", async () => {
    const { container } = render(<Alert title="Info">Text</Alert>);
    await expectAccessible(container);
  });
});
