import { fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { expectAccessible } from "../../test/axe";
import { Avatar, AvatarGroup, initials } from "./avatar";
import { Tag } from "./tag";

describe("Avatar", () => {
  it("takes up to two initials", () => {
    expect(initials("Aurel Agbado")).toBe("AA");
    expect(initials("Marie Claire Dossou")).toBe("MD");
    expect(initials("trc")).toBe("T");
    expect(initials("  ")).toBe("");
  });

  it("shows the image, named by the person", () => {
    render(<Avatar name="Aurel Agbado" src="/a.jpg" />);
    expect(screen.getByRole("img", { name: "Aurel Agbado" })).toHaveAttribute("src", "/a.jpg");
  });

  it("falls back to the initials when the image fails", () => {
    render(<Avatar name="Aurel Agbado" src="/broken.jpg" />);
    fireEvent.error(screen.getByRole("img"));
    expect(screen.getByRole("img", { name: "Aurel Agbado" })).toHaveTextContent("AA");
  });

  it("groups avatars with a counter", () => {
    render(
      <AvatarGroup max={2}>
        <Avatar name="Ama" />
        <Avatar name="Koffi" />
        <Avatar name="Sena" />
        <Avatar name="Yao" />
      </AvatarGroup>,
    );
    expect(screen.getAllByRole("img")).toHaveLength(3);
    expect(screen.getByRole("img", { name: "2 more" })).toHaveTextContent("+2");
  });
});

describe("Tag", () => {
  it("renders a label and an optional remove button", async () => {
    const onRemove = vi.fn();
    render(
      <Tag tone="accent" onRemove={onRemove}>
        Design
      </Tag>,
    );
    await userEvent.click(screen.getByRole("button", { name: "Remove Design" }));
    expect(onRemove).toHaveBeenCalledOnce();
  });
});

it("avatars and tags are accessible", async () => {
  const { container } = render(
    <div>
      <AvatarGroup max={1}>
        <Avatar name="Ama" />
        <Avatar name="Koffi" src="/k.jpg" />
      </AvatarGroup>
      <Tag>New</Tag>
      <Tag onRemove={() => {}}>Filter</Tag>
    </div>,
  );
  await expectAccessible(container);
});
