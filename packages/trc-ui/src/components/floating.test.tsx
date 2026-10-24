import { act, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { expectAccessible } from "../../test/axe";
import { DropdownMenu } from "./dropdown-menu";
import { PillButton } from "./pill";
import { Popover } from "./popover";
import { Tooltip } from "./tooltip";

// Runs the focus moves scheduled with requestAnimationFrame.
const nextFrame = () => act(() => new Promise((resolve) => requestAnimationFrame(() => resolve(undefined))));

function Menu({ onEdit = () => {}, onDelete = () => {} }) {
  return (
    <DropdownMenu
      trigger={<PillButton size="sm">Actions</PillButton>}
      items={[
        { label: "Edit", onSelect: onEdit, hint: "E" },
        { label: "Duplicate", disabled: true },
        { label: "Download", onSelect: () => {} },
        "separator",
        { label: "Delete", onSelect: onDelete, danger: true },
      ]}
    />
  );
}

describe("DropdownMenu", () => {
  it("opens from the trigger and focuses the first item", async () => {
    render(<Menu />);
    const trigger = screen.getByRole("button", { name: "Actions" });
    expect(trigger).toHaveAttribute("aria-haspopup", "menu");
    await userEvent.click(trigger);
    await nextFrame();
    expect(trigger).toHaveAttribute("aria-expanded", "true");
    expect(screen.getByRole("menu", { name: "Actions" })).toBeInTheDocument();
    expect(document.activeElement).toHaveTextContent("Edit");
  });

  it("moves with the arrows, skipping disabled items, and wraps around", async () => {
    render(<Menu />);
    await userEvent.click(screen.getByRole("button", { name: "Actions" }));
    await nextFrame();
    await userEvent.keyboard("{ArrowDown}");
    expect(document.activeElement).toHaveTextContent("Download");
    await userEvent.keyboard("{ArrowDown}");
    expect(document.activeElement).toHaveTextContent("Delete");
    await userEvent.keyboard("{ArrowDown}");
    expect(document.activeElement).toHaveTextContent("Edit");
    await userEvent.keyboard("{End}");
    expect(document.activeElement).toHaveTextContent("Delete");
    await userEvent.keyboard("{Home}");
    expect(document.activeElement).toHaveTextContent("Edit");
  });

  it("jumps to an item by its first letter", async () => {
    render(<Menu />);
    await userEvent.click(screen.getByRole("button", { name: "Actions" }));
    await nextFrame();
    await userEvent.keyboard("d");
    expect(document.activeElement).toHaveTextContent("Download");
    await userEvent.keyboard("d");
    expect(document.activeElement).toHaveTextContent("Delete");
  });

  it("selects with Enter, closes and returns focus to the trigger", async () => {
    const onDelete = vi.fn();
    render(<Menu onDelete={onDelete} />);
    const trigger = screen.getByRole("button", { name: "Actions" });
    await userEvent.click(trigger);
    await nextFrame();
    await userEvent.keyboard("{End}{Enter}");
    expect(onDelete).toHaveBeenCalledOnce();
    expect(screen.queryByRole("menu")).toBeNull();
    expect(document.activeElement).toBe(trigger);
  });

  it("opens on the last item with ArrowUp and closes with Escape", async () => {
    render(<Menu />);
    const trigger = screen.getByRole("button", { name: "Actions" });
    trigger.focus();
    await userEvent.keyboard("{ArrowUp}");
    await nextFrame();
    expect(document.activeElement).toHaveTextContent("Delete");
    await userEvent.keyboard("{Escape}");
    expect(screen.queryByRole("menu")).toBeNull();
    expect(document.activeElement).toBe(trigger);
  });

  it("ignores disabled items and closes on an outside click", async () => {
    render(
      <>
        <Menu />
        <p>Outside</p>
      </>,
    );
    await userEvent.click(screen.getByRole("button", { name: "Actions" }));
    await userEvent.click(screen.getByRole("menuitem", { name: "Duplicate" }));
    expect(screen.getByRole("menu")).toBeInTheDocument();
    await userEvent.click(screen.getByText("Outside"));
    expect(screen.queryByRole("menu")).toBeNull();
  });
});

describe("Popover", () => {
  it("opens a labelled panel, focuses its first field and closes with Escape", async () => {
    render(
      <Popover trigger={<PillButton>Filter</PillButton>} title="Filter by date">
        <input aria-label="From" />
      </Popover>,
    );
    const trigger = screen.getByRole("button", { name: "Filter" });
    await userEvent.click(trigger);
    expect(screen.getByRole("dialog", { name: "Filter by date" })).toBeInTheDocument();
    expect(document.activeElement).toBe(screen.getByRole("textbox", { name: "From" }));
    await userEvent.keyboard("{Escape}");
    expect(screen.queryByRole("dialog")).toBeNull();
    expect(document.activeElement).toBe(trigger);
  });

  it("can be controlled", async () => {
    const onOpenChange = vi.fn();
    render(
      <Popover trigger={<button>Info</button>} label="Details" open onOpenChange={onOpenChange}>
        Text
      </Popover>,
    );
    expect(screen.getByRole("dialog", { name: "Details" })).toHaveTextContent("Text");
    await userEvent.click(screen.getByRole("button", { name: "Info" }));
    expect(onOpenChange).toHaveBeenCalledWith(false);
  });
});

describe("Tooltip", () => {
  it("describes its element and shows on focus, hides with Escape", async () => {
    render(
      <Tooltip label="Copy the code">
        <button>Copy</button>
      </Tooltip>,
    );
    const button = screen.getByRole("button", { name: "Copy" });
    expect(button).toHaveAccessibleDescription("Copy the code");
    const tip = document.querySelector("[role=tooltip]")!;
    expect(tip).not.toHaveClass("trc-tooltip--open");
    await userEvent.tab();
    await act(() => new Promise((r) => setTimeout(r, 10)));
    expect(tip).toHaveClass("trc-tooltip--open");
    await userEvent.keyboard("{Escape}");
    expect(tip).not.toHaveClass("trc-tooltip--open");
  });

  it("keeps the element's own handlers", async () => {
    const onFocus = vi.fn();
    render(
      <Tooltip label="Hint">
        <button onFocus={onFocus}>Field</button>
      </Tooltip>,
    );
    await userEvent.tab();
    expect(onFocus).toHaveBeenCalledOnce();
  });
});

it("floating elements are accessible", async () => {
  render(
    <main>
      <Menu />
      <Tooltip label="Hint">
        <button>Help</button>
      </Tooltip>
    </main>,
  );
  await userEvent.click(screen.getByRole("button", { name: "Actions" }));
  await nextFrame();
  await expectAccessible(document.body);
});
