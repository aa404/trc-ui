import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { expectAccessible } from "../../test/axe";
import { SegmentedControl } from "./segmented-control";
import { Tabs } from "./tabs";

const items = [
  { value: "npm", label: "npm", content: "npm install trc-ui" },
  { value: "yarn", label: "yarn", content: "yarn add trc-ui" },
  { value: "deno", label: "deno", content: "deno add npm:trc-ui", disabled: true },
  { value: "bun", label: "bun", content: "bun add trc-ui" },
];

describe("Tabs", () => {
  it("shows the first tab and links tabs to their panels", () => {
    render(<Tabs items={items} label="Package manager" />);
    const tab = screen.getByRole("tab", { name: "npm" });
    expect(screen.getByRole("tablist", { name: "Package manager" })).toBeInTheDocument();
    expect(tab).toHaveAttribute("aria-selected", "true");
    expect(screen.getByRole("tabpanel", { name: "npm" })).toHaveTextContent("npm install trc-ui");
    expect(screen.queryByText("yarn add trc-ui")).not.toBeVisible();
  });

  it("moves with the arrows, skipping disabled tabs, and selects as it goes", async () => {
    const onValueChange = vi.fn();
    render(<Tabs items={items} onValueChange={onValueChange} />);
    screen.getByRole("tab", { name: "npm" }).focus();
    await userEvent.keyboard("{ArrowRight}");
    expect(document.activeElement).toHaveTextContent("yarn");
    await userEvent.keyboard("{ArrowRight}");
    expect(document.activeElement).toHaveTextContent("bun");
    expect(onValueChange).toHaveBeenLastCalledWith("bun");
    expect(screen.getByRole("tabpanel")).toHaveTextContent("bun add trc-ui");
    await userEvent.keyboard("{ArrowRight}");
    expect(document.activeElement).toHaveTextContent("npm");
    await userEvent.keyboard("{End}");
    expect(document.activeElement).toHaveTextContent("bun");
    await userEvent.keyboard("{Home}");
    expect(document.activeElement).toHaveTextContent("npm");
  });

  it("keeps only the selected tab in the Tab order", () => {
    render(<Tabs items={items} defaultValue="yarn" />);
    const tabbable = screen.getAllByRole("tab").filter((t) => t.tabIndex === 0);
    expect(tabbable).toHaveLength(1);
    expect(tabbable[0]).toHaveTextContent("yarn");
  });

  it("with manual activation, selects on Enter only", async () => {
    render(<Tabs items={items} activation="manual" />);
    screen.getByRole("tab", { name: "npm" }).focus();
    await userEvent.keyboard("{ArrowRight}");
    expect(screen.getByRole("tab", { name: "npm" })).toHaveAttribute("aria-selected", "true");
    await userEvent.keyboard("{Enter}");
    expect(screen.getByRole("tab", { name: "yarn" })).toHaveAttribute("aria-selected", "true");
  });

  it("can be controlled", async () => {
    const onValueChange = vi.fn();
    render(<Tabs items={items} value="npm" onValueChange={onValueChange} />);
    await userEvent.click(screen.getByRole("tab", { name: "yarn" }));
    expect(onValueChange).toHaveBeenCalledWith("yarn");
    expect(screen.getByRole("tab", { name: "npm" })).toHaveAttribute("aria-selected", "true");
  });

  it("is accessible", async () => {
    const { container } = render(<Tabs items={items} label="Package manager" />);
    await expectAccessible(container);
  });
});

describe("SegmentedControl", () => {
  const options = [
    { value: "day", label: "Day" },
    { value: "week", label: "Week" },
    { value: "month", label: "Month" },
  ];

  it("is a labelled group of radios", async () => {
    const onValueChange = vi.fn();
    render(<SegmentedControl label="Period" options={options} onValueChange={onValueChange} />);
    expect(screen.getByRole("radiogroup", { name: "Period" })).toBeInTheDocument();
    expect(screen.getByRole("radio", { name: "Day" })).toBeChecked();
    await userEvent.click(screen.getByText("Month"));
    expect(screen.getByRole("radio", { name: "Month" })).toBeChecked();
    expect(onValueChange).toHaveBeenCalledWith("month");
  });

  it("moves the choice with the arrows", async () => {
    render(<SegmentedControl label="Period" options={options} defaultValue="week" />);
    screen.getByRole("radio", { name: "Week" }).focus();
    await userEvent.keyboard("{ArrowRight}");
    expect(screen.getByRole("radio", { name: "Month" })).toBeChecked();
  });

  it("is accessible", async () => {
    const { container } = render(<SegmentedControl label="Period" options={options} />);
    await expectAccessible(container);
  });
});
