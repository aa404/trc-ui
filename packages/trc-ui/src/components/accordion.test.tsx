import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { expectAccessible } from "../../test/axe";
import { Accordion } from "./accordion";
import { Steps } from "./steps";

const items = [
  { value: "a", title: "What is trc ui?", content: "A React library." },
  { value: "b", title: "Is it free?", content: "Yes, MIT." },
  { value: "c", title: "Does it work with Next.js?", content: "Yes." },
];

describe("Accordion", () => {
  it("renders buttons inside headings, linked to their regions", () => {
    render(<Accordion items={items} headingLevel={2} />);
    const button = screen.getByRole("button", { name: "What is trc ui?" });
    expect(button.closest("h2")).toBeInTheDocument();
    expect(button).toHaveAttribute("aria-expanded", "false");
    expect(document.getElementById(button.getAttribute("aria-controls")!)).toHaveAttribute("aria-labelledby", button.id);
  });

  it("opens one item at a time by default", async () => {
    render(<Accordion items={items} />);
    await userEvent.click(screen.getByRole("button", { name: "What is trc ui?" }));
    expect(screen.getByRole("region", { name: "What is trc ui?" })).toHaveTextContent("A React library.");
    await userEvent.click(screen.getByRole("button", { name: "Is it free?" }));
    expect(screen.getByRole("button", { name: "What is trc ui?" })).toHaveAttribute("aria-expanded", "false");
    expect(screen.getByRole("button", { name: "Is it free?" })).toHaveAttribute("aria-expanded", "true");
    await userEvent.click(screen.getByRole("button", { name: "Is it free?" }));
    expect(screen.getByRole("button", { name: "Is it free?" })).toHaveAttribute("aria-expanded", "false");
  });

  it("keeps several items open with type multiple", async () => {
    const onValueChange = vi.fn();
    render(<Accordion items={items} type="multiple" defaultValue={["a"]} onValueChange={onValueChange} />);
    await userEvent.click(screen.getByRole("button", { name: "Is it free?" }));
    expect(onValueChange).toHaveBeenLastCalledWith(["a", "b"]);
    expect(screen.getAllByRole("button").filter((b) => b.getAttribute("aria-expanded") === "true")).toHaveLength(2);
  });

  it("moves between titles with the arrows", async () => {
    render(<Accordion items={items} />);
    screen.getByRole("button", { name: "What is trc ui?" }).focus();
    await userEvent.keyboard("{ArrowDown}");
    expect(document.activeElement).toHaveTextContent("Is it free?");
    await userEvent.keyboard("{End}");
    expect(document.activeElement).toHaveTextContent("Does it work with Next.js?");
    await userEvent.keyboard("{ArrowDown}");
    expect(document.activeElement).toHaveTextContent("What is trc ui?");
  });

  it("is accessible", async () => {
    const { container } = render(<Accordion items={items} defaultValue={["a"]} />);
    await expectAccessible(container);
  });
});

describe("Steps", () => {
  const steps = [{ title: "Install" }, { title: "Import the styles", description: "Once." }, { title: "Compose" }];

  it("is an ordered list with hidden decorative numbers", () => {
    const { container } = render(<Steps items={steps} />);
    expect(screen.getAllByRole("listitem")).toHaveLength(3);
    expect(container.querySelector(".trc-steps__number")).toHaveAttribute("aria-hidden");
    expect(container.querySelector(".trc-steps__number")).toHaveTextContent("01");
  });

  it("marks the current step", () => {
    const { container } = render(<Steps items={steps} current={1} />);
    const items = screen.getAllByRole("listitem");
    expect(items[1]).toHaveAttribute("aria-current", "step");
    expect(items[0]).toHaveClass("trc-steps__item--complete");
    expect(items[2]).toHaveClass("trc-steps__item--upcoming");
    expect(container.querySelectorAll("[aria-current]")).toHaveLength(1);
  });

  it("is accessible", async () => {
    const { container } = render(<Steps items={steps} current={0} />);
    await expectAccessible(container);
  });
});
