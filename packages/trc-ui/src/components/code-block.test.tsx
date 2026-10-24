import { act, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { expectAccessible } from "../../test/axe";
import { CodeBlock } from "./code-block";
import { Divider, Kbd } from "./kbd";

describe("CodeBlock", () => {
  it("shows the file tab and copies the code", async () => {
    const user = userEvent.setup();
    render(<CodeBlock code="npm install trc-ui" title="Terminal" language="bash" />);
    expect(screen.getByText("SH")).toBeInTheDocument();
    expect(screen.getByText("npm install trc-ui").closest("pre")).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "Copy code" }));
    expect(await navigator.clipboard.readText()).toBe("npm install trc-ui");
    expect(screen.getByRole("button", { name: "Copy code" })).toHaveAttribute("data-copied", "true");
    expect(screen.getByText("Copied")).toBeInTheDocument();
  });

  it("renders a custom highlighting but copies the source", async () => {
    const user = userEvent.setup();
    render(
      <CodeBlock code="const a = 1;">
        <span className="token">const</span> a = 1;
      </CodeBlock>,
    );
    expect(document.querySelector(".token")).toHaveTextContent("const");
    await user.click(screen.getByRole("button"));
    expect(await navigator.clipboard.readText()).toBe("const a = 1;");
    await act(() => new Promise((r) => setTimeout(r, 0)));
  });
});

describe("Kbd and Divider", () => {
  it("renders keys and separators", () => {
    render(
      <div>
        <Kbd>⌘</Kbd>
        <Divider />
        <Divider label="or" />
        <Divider orientation="vertical" />
      </div>,
    );
    expect(screen.getByText("⌘").tagName).toBe("KBD");
    expect(screen.getAllByRole("separator")).toHaveLength(3);
    expect(screen.getAllByRole("separator")[2]).toHaveAttribute("aria-orientation", "vertical");
  });
});

it("is accessible", async () => {
  const { container } = render(
    <div>
      <CodeBlock code="npm install trc-ui" title="Terminal" language="bash" />
      <CodeBlock code="echo" />
      <p>
        Press <Kbd>⌘</Kbd> <Kbd>K</Kbd>
      </p>
      <Divider label="or" />
    </div>,
  );
  await expectAccessible(container);
});
