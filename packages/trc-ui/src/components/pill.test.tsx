import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { expectAccessible } from "../../test/axe";
import { PillButton, PillLink } from "./pill";

describe("PillButton", () => {
  it("is a button that does not submit forms by default", async () => {
    const onClick = vi.fn();
    render(<PillButton onClick={onClick}>Go</PillButton>);
    const button = screen.getByRole("button", { name: "Go" });
    expect(button).toHaveAttribute("type", "button");
    await userEvent.click(button);
    expect(onClick).toHaveBeenCalledOnce();
  });

  it("is disabled and busy while loading", async () => {
    const onClick = vi.fn();
    render(
      <PillButton loading onClick={onClick}>
        Send
      </PillButton>,
    );
    const button = screen.getByRole("button", { name: "Send" });
    expect(button).toBeDisabled();
    expect(button).toHaveAttribute("aria-busy", "true");
    await userEvent.click(button);
    expect(onClick).not.toHaveBeenCalled();
  });
});

describe("PillLink", () => {
  it("renders a link, or the given component", () => {
    const Custom = (props: React.ComponentProps<"a">) => <a data-custom {...props} />;
    render(
      <>
        <PillLink href="/a">Plain</PillLink>
        <PillLink as={Custom} href="/b">
          Routed
        </PillLink>
      </>,
    );
    expect(screen.getByRole("link", { name: "Plain" })).toHaveAttribute("href", "/a");
    expect(screen.getByRole("link", { name: "Routed" })).toHaveAttribute("data-custom");
  });
});

it("pills are accessible", async () => {
  const { container } = render(
    <div>
      <PillButton solid>One</PillButton>
      <PillLink href="/x">Two</PillLink>
    </div>,
  );
  await expectAccessible(container);
});
