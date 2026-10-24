import { act, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { expectAccessible } from "../../test/axe";
import { SiteFooter } from "./site-footer";
import { SiteHeader } from "./site-header";

const nav = [
  { label: "Product", items: [{ label: "How it works", href: "/how", description: "Steps" }] },
  { label: "Pricing", href: "/pricing", active: true },
];

describe("SiteHeader", () => {
  it("marks the current page and opens dropdowns", async () => {
    render(<SiteHeader logo="acme" logoLabel="Acme" nav={nav} cta={{ label: "Sign in", href: "/login" }} />);
    expect(screen.getAllByRole("link", { name: "Pricing" })[0]).toHaveAttribute("aria-current", "page");
    const trigger = screen.getByRole("button", { name: "Product" });
    expect(trigger).toHaveAttribute("aria-expanded", "false");
    // A mouse click hovers first: the menu opens on hover and the click keeps it open.
    await userEvent.click(trigger);
    expect(trigger).toHaveAttribute("aria-expanded", "true");
    await userEvent.click(trigger);
    expect(trigger).toHaveAttribute("aria-expanded", "false");
  });

  it("toggles the dropdown with the keyboard", async () => {
    render(<SiteHeader logo="acme" logoLabel="Acme" nav={nav} />);
    const trigger = screen.getByRole("button", { name: "Product" });
    trigger.focus();
    await userEvent.keyboard("{Enter}");
    expect(trigger).toHaveAttribute("aria-expanded", "true");
    await userEvent.keyboard("{Escape}");
    expect(trigger).toHaveAttribute("aria-expanded", "false");
    expect(document.activeElement).toBe(trigger);
  });

  it("opens the mobile menu as a modal dialog and closes it with Escape", async () => {
    render(<SiteHeader logo="acme" logoLabel="Acme" nav={nav} />);
    const burger = screen.getByRole("button", { name: "Menu" });
    await userEvent.click(burger);
    const dialog = screen.getByRole("dialog", { name: "Menu" });
    expect(dialog).toHaveAttribute("aria-modal", "true");
    expect(dialog).toContainElement(document.activeElement as HTMLElement);
    expect(document.body.style.overflow).toBe("hidden");
    await userEvent.keyboard("{Escape}");
    expect(burger).toHaveAttribute("aria-expanded", "false");
    expect(document.activeElement).toBe(burger);
    expect(document.body.style.overflow).toBe("");
  });

  it("turns into a graphite bar once the page scrolls", () => {
    const { container } = render(<SiteHeader logo="acme" logoLabel="Acme" />);
    const bar = container.querySelector(".trc-header__bar")!;
    expect(bar).not.toHaveClass("trc-header__bar--scrolled");
    act(() => {
      window.scrollY = 200;
      window.dispatchEvent(new Event("scroll"));
    });
    expect(bar).toHaveClass("trc-header__bar--scrolled");
    window.scrollY = 0;
  });
});

it("header and footer are accessible", async () => {
  const { container } = render(
    <div>
      <SiteHeader logo="acme" logoLabel="Acme" nav={nav} />
      <main />
      <SiteFooter
        logo="acme"
        logoLabel="Acme"
        columns={[{ title: "Product", links: [{ label: "Docs", href: "/docs" }] }]}
        legal={[{ label: "Terms", href: "/terms" }]}
        copyright="© Acme"
      />
    </div>,
  );
  await expectAccessible(container);
});
