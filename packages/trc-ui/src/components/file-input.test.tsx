import { fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { expectAccessible } from "../../test/axe";
import { Field } from "./field";
import { Dropzone, FileInput, acceptsFile, formatBytes, validateFiles } from "./file-input";

const file = (name: string, type: string, size = 1000) => new File([new Uint8Array(size)], name, { type });

describe("file helpers", () => {
  it("formats sizes", () => {
    expect(formatBytes(820)).toBe("820 B");
    expect(formatBytes(14540)).toBe("14 KB");
    expect(formatBytes(3.5 * 1024 * 1024)).toBe("3.5 MB");
  });

  it("matches accept lists by extension, family and exact type", () => {
    expect(acceptsFile(file("a.PNG", "image/png"), "image/*")).toBe(true);
    expect(acceptsFile(file("a.pdf", "application/pdf"), ".pdf,image/*")).toBe(true);
    expect(acceptsFile(file("a.zip", "application/zip"), ".pdf,image/*")).toBe(false);
    expect(acceptsFile(file("a.txt", "text/plain"), "text/plain")).toBe(true);
  });

  it("rejects by type, then size, then count", () => {
    const { accepted, rejected } = validateFiles(
      [
        file("a.png", "image/png"),
        file("b.zip", "application/zip"),
        file("c.png", "image/png", 9000),
        file("d.png", "image/png"),
      ],
      { accept: "image/*", maxSize: 5000, maxFiles: 1 },
    );
    expect(accepted.map((f) => f.name)).toEqual(["a.png"]);
    expect(rejected.map((r) => `${r.file.name}:${r.reason}`)).toEqual(["b.zip:type", "c.png:size", "d.png:count"]);
  });
});

describe("FileInput", () => {
  it("is labelled by its Field and shows the chosen file", async () => {
    const onFilesChange = vi.fn();
    render(
      <Field label="Resume">
        <FileInput accept=".pdf" onFilesChange={onFilesChange} />
      </Field>,
    );
    const input = screen.getByLabelText("Resume") as HTMLInputElement;
    expect(input.type).toBe("file");
    expect(screen.getByText("No file chosen")).toBeInTheDocument();
    await userEvent.upload(input, file("cv.pdf", "application/pdf"));
    expect(screen.getByText("cv.pdf")).toBeInTheDocument();
    expect(onFilesChange).toHaveBeenCalledWith([expect.objectContaining({ name: "cv.pdf" })]);
  });

  it("counts several files", async () => {
    render(<FileInput multiple aria-label="Photos" />);
    await userEvent.upload(screen.getByLabelText("Photos"), [file("a.png", "image/png"), file("b.png", "image/png")]);
    expect(screen.getByText("2 files")).toBeInTheDocument();
  });
});

describe("Dropzone", () => {
  it("adds browsed files, lists them and removes them", async () => {
    const onFilesChange = vi.fn();
    render(<Dropzone accept="image/*" hint="PNG or JPG" onFilesChange={onFilesChange} />);
    const input = screen.getByLabelText(/Drop files here or browse/) as HTMLInputElement;
    expect(input).toHaveAccessibleDescription("PNG or JPG");
    await userEvent.upload(input, [file("a.png", "image/png", 2048)]);
    expect(screen.getByText("a.png")).toBeInTheDocument();
    expect(screen.getByText("2.0 KB")).toBeInTheDocument();
    await userEvent.click(screen.getByRole("button", { name: "Remove a.png" }));
    expect(screen.queryByText("a.png")).toBeNull();
    expect(onFilesChange).toHaveBeenLastCalledWith([]);
  });

  it("accepts dropped files and announces rejections", () => {
    render(<Dropzone accept="image/*" maxSize={5000} />);
    const area = document.querySelector(".trc-dropzone__area")!;
    fireEvent.dragEnter(area, { dataTransfer: { files: [] } });
    expect(area).toHaveClass("trc-dropzone__area--dragging");
    fireEvent.drop(area, {
      dataTransfer: {
        files: [file("ok.png", "image/png"), file("big.png", "image/png", 9000), file("doc.zip", "application/zip")],
      },
    });
    expect(area).not.toHaveClass("trc-dropzone__area--dragging");
    expect(screen.getByText("ok.png")).toBeInTheDocument();
    expect(screen.getByText("big.png: the file is too large")).toBeInTheDocument();
    expect(screen.getByText("doc.zip: this type of file is not accepted").closest("[aria-live]")).toBeInTheDocument();
  });

  it("keeps a single file without multiple", () => {
    render(<Dropzone multiple={false} />);
    const area = document.querySelector(".trc-dropzone__area")!;
    fireEvent.drop(area, { dataTransfer: { files: [file("a.txt", "text/plain")] } });
    fireEvent.drop(area, { dataTransfer: { files: [file("b.txt", "text/plain")] } });
    expect(screen.queryByText("a.txt")).toBeNull();
    expect(screen.getByText("b.txt")).toBeInTheDocument();
  });

  it("is accessible", async () => {
    const { container } = render(
      <div>
        <Field label="Attachments">
          <FileInput />
        </Field>
        <Dropzone hint="Up to 5 MB" />
      </div>,
    );
    await expectAccessible(container);
  });
});
