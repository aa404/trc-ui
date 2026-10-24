import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { expectAccessible } from "../../test/axe";
import { Breadcrumbs } from "./breadcrumbs";
import { LanguageSwitcher } from "./language-switcher";
import { Pagination, paginationRange } from "./pagination";

describe("paginationRange", () => {
  it("shows every page when they fit", () => {
    expect(paginationRange(3, 7)).toEqual([1, 2, 3, 4, 5, 6, 7]);
  });

  it("keeps a constant number of entries around the current page", () => {
    expect(paginationRange(1, 20)).toEqual([1, 2, 3, 4, 5, "ellipsis", 20]);
    expect(paginationRange(4, 20)).toEqual([1, 2, 3, 4, 5, "ellipsis", 20]);
    expect(paginationRange(5, 20)).toEqual([1, "ellipsis", 4, 5, 6, "ellipsis", 20]);
    expect(paginationRange(16, 20)).toEqual([1, "ellipsis", 15, 16, 17, "ellipsis", 20]);
    expect(paginationRange(17, 20)).toEqual([1, "ellipsis", 16, 17, 18, 19, 20]);
    expect(paginationRange(20, 20)).toEqual([1, "ellipsis", 16, 17, 18, 19, 20]);
    for (let page = 1; page <= 20; page++) expect(paginationRange(page, 20)).toHaveLength(7);
  });

  it("widens with more siblings", () => {
    expect(paginationRange(10, 20, 2)).toEqual([1, "ellipsis", 8, 9, 10, 11, 12, "ellipsis", 20]);
  });
});

describe("Pagination", () => {
  it("marks the current page and changes page", async () => {
    const onPageChange = vi.fn();
    render(<Pagination page={5} total={20} onPageChange={onPageChange} />);
    expect(screen.getByRole("navigation", { name: "Pagination" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Page 5" })).toHaveAttribute("aria-current", "page");
    await userEvent.click(screen.getByRole("button", { name: "Page 6" }));
    await userEvent.click(screen.getByRole("button", { name: "Previous" }));
    expect(onPageChange.mock.calls).toEqual([[6], [4]]);
  });

  it("disables previous on the first page and next on the last", () => {
    const { rerender } = render(<Pagination page={1} total={3} onPageChange={() => {}} />);
    expect(screen.getByRole("button", { name: "Previous" })).toBeDisabled();
    rerender(<Pagination page={3} total={3} onPageChange={() => {}} />);
    expect(screen.getByRole("button", { name: "Next" })).toBeDisabled();
  });

  it("renders links from a function", () => {
    render(<Pagination page={2} total={3} href={(p) => `/blog?page=${p}`} />);
    expect(screen.getByRole("link", { name: "Page 3" })).toHaveAttribute("href", "/blog?page=3");
  });

  it("renders links from a pattern", () => {
    render(<Pagination page={1} total={3} href="/blog/page/{page}" />);
    expect(screen.getByRole("link", { name: "Page 2" })).toHaveAttribute("href", "/blog/page/2");
    expect(screen.getByRole("link", { name: "Next" })).toHaveAttribute("href", "/blog/page/2");
    expect(screen.queryByRole("link", { name: "Previous" })).toBeNull();
  });

  it("renders nothing for a single page", () => {
    const { container } = render(<Pagination page={1} total={1} />);
    expect(container).toBeEmptyDOMElement();
  });

  it("is accessible", async () => {
    const { container } = render(<Pagination page={5} total={20} onPageChange={() => {}} />);
    await expectAccessible(container);
  });
});

describe("Breadcrumbs", () => {
  it("links every item but the current page", () => {
    render(
      <Breadcrumbs
        items={[
          { label: "Home", href: "/" },
          { label: "Docs", href: "/docs" },
          { label: "Pagination" },
        ]}
      />,
    );
    expect(screen.getByRole("navigation", { name: "Breadcrumb" })).toBeInTheDocument();
    expect(screen.getAllByRole("link")).toHaveLength(2);
    expect(screen.getByText("Pagination")).toHaveAttribute("aria-current", "page");
  });

  it("is accessible", async () => {
    const { container } = render(<Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Here" }]} />);
    await expectAccessible(container);
  });
});

describe("LanguageSwitcher", () => {
  const languages = [
    { code: "en", name: "English", href: "/" },
    { code: "fr", name: "Français", href: "/fr/" },
  ];

  it("links to each language, the current one marked", () => {
    render(<LanguageSwitcher languages={languages} value="fr" />);
    const fr = screen.getByRole("link", { name: "Français" });
    expect(fr).toHaveAttribute("aria-current", "true");
    expect(fr).toHaveAttribute("hreflang", "fr");
    expect(fr).toHaveTextContent("FR");
  });

  it("calls onChange without links", async () => {
    const onChange = vi.fn();
    render(<LanguageSwitcher languages={languages.map(({ href: _, ...l }) => l)} value="en" onChange={onChange} />);
    await userEvent.click(screen.getByRole("button", { name: "Français" }));
    expect(onChange).toHaveBeenCalledWith("fr");
  });

  it("is accessible", async () => {
    const { container } = render(<LanguageSwitcher languages={languages} value="en" />);
    await expectAccessible(container);
  });
});
