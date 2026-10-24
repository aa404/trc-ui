import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { fill } from "../utils/label";
import { Avatar, AvatarGroup } from "./avatar";
import { Dropzone, FileInput } from "./file-input";
import { Pagination } from "./pagination";
import { PinInput } from "./pin-input";

const file = (name: string, type: string, size = 10) => new File([new Uint8Array(size)], name, { type });

describe("label templates, usable from server components", () => {
  it("fills placeholders and keeps unknown ones", () => {
    expect(fill("{count} de plus", { count: 3 })).toBe("3 de plus");
    expect(fill("{a} {b}", { a: 1 })).toBe("1 {b}");
  });

  it("AvatarGroup", () => {
    render(
      <AvatarGroup max={1} moreLabel="{count} de plus">
        <Avatar name="Ama" />
        <Avatar name="Koffi" />
      </AvatarGroup>,
    );
    expect(screen.getByRole("img", { name: "1 de plus" })).toBeInTheDocument();
  });

  it("Pagination", () => {
    render(<Pagination page={1} total={3} href="/p/{page}" pageLabel="Aller à la page {page}" />);
    expect(screen.getByRole("link", { name: "Aller à la page 2" })).toHaveAttribute("href", "/p/2");
  });

  it("PinInput, with a 1-based index", () => {
    render(<PinInput length={4} charLabel="Chiffre {index} sur {length}" />);
    expect(screen.getAllByRole("textbox")[0]).toHaveAccessibleName("Chiffre 1 sur 4");
  });

  it("FileInput and Dropzone", () => {
    const { container } = render(
      <div>
        <FileInput aria-label="Pièces" multiple countLabel="{count} fichiers" />
        <Dropzone
          accept="image/*"
          removeLabel="Retirer {name}"
          rejectionLabel={{ type: "{name} : type refusé" }}
        />
      </div>,
    );
    fireEvent.change(screen.getByLabelText("Pièces"), { target: { files: [file("a.png", "image/png"), file("b.png", "image/png")] } });
    expect(screen.getByText("2 fichiers")).toBeInTheDocument();
    fireEvent.drop(container.querySelector(".trc-dropzone__area")!, {
      dataTransfer: { files: [file("ok.png", "image/png"), file("doc.zip", "application/zip")] },
    });
    expect(screen.getByRole("button", { name: "Retirer ok.png" })).toBeInTheDocument();
    expect(screen.getByText("doc.zip : type refusé")).toBeInTheDocument();
  });
});
