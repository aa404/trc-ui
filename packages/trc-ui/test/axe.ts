import axe from "axe-core";
import { expect } from "vitest";

/** Runs axe on a rendered tree and fails with the list of violations, if any. */
export async function expectAccessible(container: Element) {
  const results = await axe.run(container, {
    rules: {
      // Color contrast cannot be computed in jsdom (no layout); it is checked in the browser instead.
      "color-contrast": { enabled: false },
      // Page-level rule: tests render fragments, and floating layers are portaled to the end of <body>.
      region: { enabled: false },
    },
  });
  const violations = results.violations.map((v) => `${v.id}: ${v.help} (${v.nodes.map((n) => n.target.join(" ")).join(", ")})`);
  expect(violations).toEqual([]);
}
