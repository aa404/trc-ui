import { act, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useState } from "react";
import { describe, expect, it, vi } from "vitest";
import { expectAccessible } from "../../test/axe";
import { Dialog } from "./dialog";
import { Drawer } from "./drawer";
import { PillButton } from "./pill";

function DialogDemo({ onClose = () => {} }: { onClose?: () => void }) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <PillButton onClick={() => setOpen(true)}>Delete</PillButton>
      <Dialog
        open={open}
        onClose={() => {
          onClose();
          setOpen(false);
        }}
        title="Delete the project?"
        description="This cannot be undone."
        footer={
          <>
            <PillButton onClick={() => setOpen(false)}>Cancel</PillButton>
            <PillButton solid data-autofocus>
              Delete
            </PillButton>
          </>
        }
      />
    </>
  );
}

describe("Dialog", () => {
  it("is not rendered before mount, then hidden while closed", () => {
    render(<DialogDemo />);
    expect(screen.queryByRole("dialog")).toBeNull();
  });

  it("opens labelled, focuses the autofocus element and closes with Escape", async () => {
    const onClose = vi.fn();
    render(<DialogDemo onClose={onClose} />);
    const trigger = screen.getByRole("button", { name: "Delete" });
    await userEvent.click(trigger);
    const dialog = screen.getByRole("dialog", { name: "Delete the project?" });
    expect(dialog).toHaveAccessibleDescription("This cannot be undone.");
    expect(dialog).toHaveAttribute("aria-modal", "true");
    expect(document.activeElement).toHaveTextContent("Delete");
    expect(dialog).toContainElement(document.activeElement as HTMLElement);
    await userEvent.keyboard("{Escape}");
    expect(onClose).toHaveBeenCalledOnce();
    expect(screen.queryByRole("dialog")).toBeNull();
    expect(document.activeElement).toBe(trigger);
  });

  it("keeps Tab inside the window", async () => {
    render(<DialogDemo />);
    await userEvent.click(screen.getByRole("button", { name: "Delete" }));
    const dialog = screen.getByRole("dialog");
    for (let i = 0; i < 6; i++) {
      await userEvent.tab();
      expect(dialog).toContainElement(document.activeElement as HTMLElement);
    }
  });

  it("closes from the close button and the overlay", async () => {
    const onClose = vi.fn();
    render(<Dialog open onClose={onClose} title="Hello" />);
    await act(async () => {});
    await userEvent.click(screen.getByRole("button", { name: "Close" }));
    await userEvent.click(document.querySelector(".trc-layer__overlay")!);
    expect(onClose).toHaveBeenCalledTimes(2);
  });

  it("can ignore overlay clicks", async () => {
    const onClose = vi.fn();
    render(<Dialog open onClose={onClose} title="Hello" closeOnOverlay={false} />);
    await act(async () => {});
    await userEvent.click(document.querySelector(".trc-layer__overlay")!);
    expect(onClose).not.toHaveBeenCalled();
  });
});

describe("Drawer", () => {
  it("slides from the requested side", async () => {
    render(
      <Drawer open onClose={() => {}} title="Filters" side="left">
        Content
      </Drawer>,
    );
    await act(async () => {});
    expect(document.querySelector(".trc-layer--left")).toBeInTheDocument();
    expect(screen.getByRole("dialog", { name: "Filters" })).toHaveTextContent("Content");
  });
});

it("dialogs are accessible", async () => {
  render(
    <Dialog open onClose={() => {}} title="Title" description="Text" footer={<PillButton>OK</PillButton>}>
      Body
    </Dialog>,
  );
  await act(async () => {});
  await expectAccessible(document.body);
});
