import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { expectAccessible } from "../../test/axe";
import { AccentText, Heading, plainText, StepNumber, Text } from "./typography";

describe("AccentText", () => {
  it("colors the words between asterisks", () => {
    const { container } = render(<AccentText text="How it *works*" />);
    expect(container.querySelector(".trc-accent")).toHaveTextContent("works");
    expect(container).toHaveTextContent("How it works");
  });

  it("colors the last words with accentLast", () => {
    const { container } = render(<AccentText text="The reality in data" accentLast={2} />);
    expect(container.querySelector(".trc-accent")).toHaveTextContent("in data");
  });

  it("never colors the whole title", () => {
    const { container } = render(<AccentText text="Hello" accentLast={3} />);
    expect(container.querySelector(".trc-accent")).toBeNull();
  });
});

describe("Heading", () => {
  it("renders the requested tag with its size", () => {
    render(
      <Heading as="h1" size="display">
        Deep *black*
      </Heading>,
    );
    const heading = screen.getByRole("heading", { level: 1, name: "Deep black" });
    expect(heading).toHaveClass("trc-heading--display");
  });
});

it("plainText removes the asterisks", () => {
  expect(plainText("How it *works*")).toBe("How it works");
});

it("StepNumber pads to two digits and is hidden from screen readers", () => {
  const { container } = render(<StepNumber n={3} />);
  expect(container.firstChild).toHaveTextContent("03");
  expect(container.firstChild).toHaveAttribute("aria-hidden");
});

it("typography is accessible", async () => {
  const { container } = render(
    <main>
      <Heading as="h1">Title *here*</Heading>
      <Text>Body text.</Text>
    </main>,
  );
  await expectAccessible(container);
});
