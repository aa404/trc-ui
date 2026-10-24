import { act, render, screen } from "@testing-library/react";
import { expect, it } from "vitest";
import { expectAccessible } from "../../test/axe";
import { BackToTop } from "./back-to-top";
import { HeroVideo, PageHero } from "./hero";
import { Card, Container, Section } from "./surfaces";

it("Card renders as a link and hides its watermark from screen readers", () => {
  render(
    <Card as="a" href="/x" interactive watermark={<svg />}>
      Open
    </Card>,
  );
  const link = screen.getByRole("link", { name: "Open" });
  expect(link).toHaveClass("trc-card--interactive", "trc-card--watermark");
  expect(link.querySelector(".trc-card__watermark")).toHaveAttribute("aria-hidden");
});

it("Section inset wraps its content in a card", () => {
  const { container } = render(<Section inset>Content</Section>);
  expect(container.querySelector("section > .trc-section-inset__card")).toHaveTextContent("Content");
});

it("PageHero puts the last words of a long title in the accent", () => {
  render(<PageHero title="An inner page inset from the edges" />);
  const heading = screen.getByRole("heading", { level: 1 });
  expect(heading.querySelector(".trc-accent")).toHaveTextContent("the edges");
});

it("HeroVideo renders no active video before hydration effects run", () => {
  const { container } = render(
    <HeroVideo clips={[{ mp4: "/a.mp4" }, { mp4: "/b.mp4" }]}>
      <h1>Hero</h1>
    </HeroVideo>,
  );
  expect(container.querySelectorAll("video")).toHaveLength(2);
  expect(container.querySelectorAll("video[muted], video")).toBeTruthy();
});

it("BackToTop appears after the first screen", () => {
  const { container } = render(<BackToTop />);
  // Hidden from assistive technology while the first screen is visible.
  const button = container.querySelector("button")!;
  expect(button).toHaveAttribute("aria-hidden", "true");
  expect(button).toHaveAttribute("tabindex", "-1");
  act(() => {
    window.scrollY = window.innerHeight * 2;
    window.dispatchEvent(new Event("scroll"));
  });
  expect(button).toHaveAttribute("tabindex", "0");
  expect(screen.getByRole("button", { name: "Back to top" })).toBe(button);
  window.scrollY = 0;
});

it("surfaces are accessible", async () => {
  const { container } = render(
    <Container as="main">
      <PageHero title="Title" description="Lead" />
      <Section>
        <Card>Card</Card>
      </Section>
    </Container>,
  );
  await expectAccessible(container);
});
