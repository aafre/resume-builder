import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it, vi } from "vitest";
import GlobalNavDrawer from "../components/GlobalNavDrawer";

const links = [
  { path: "/templates", label: "Templates" },
  { path: "/examples", label: "Examples" },
];

function renderDrawer(isOpen = true) {
  const onClose = vi.fn();
  const view = render(
    <MemoryRouter>
      <GlobalNavDrawer
        isOpen={isOpen}
        onClose={onClose}
        links={links}
        currentPath="/templates"
        resumeCount={0}
        isAuthenticated={false}
        onSignInClick={vi.fn()}
      />
    </MemoryRouter>
  );
  return { onClose, ...view };
}

describe("GlobalNavDrawer", () => {
  it("renders site destinations and marks the current page", () => {
    renderDrawer();

    const dialog = screen.getByRole("dialog");
    expect(dialog).toHaveAttribute("aria-modal", "true");
    expect(screen.getByRole("link", { name: "Templates" })).toHaveAttribute(
      "aria-current",
      "page"
    );
    expect(screen.getByRole("link", { name: "Examples" })).not.toHaveAttribute(
      "aria-current"
    );
  });

  it("closes on Escape", () => {
    const { onClose } = renderDrawer();

    fireEvent.keyDown(document, { key: "Escape" });

    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("moves focus in on open and returns it to the opener on close", () => {
    const trigger = document.createElement("button");
    document.body.appendChild(trigger);
    trigger.focus();
    expect(document.activeElement).toBe(trigger);

    const { rerender } = renderDrawer();
    expect(screen.getByRole("dialog").contains(document.activeElement)).toBe(true);

    rerender(
      <MemoryRouter>
        <GlobalNavDrawer
          isOpen={false}
          onClose={vi.fn()}
          links={links}
          currentPath="/templates"
          resumeCount={0}
          isAuthenticated={false}
          onSignInClick={vi.fn()}
        />
      </MemoryRouter>
    );

    expect(document.activeElement).toBe(trigger);
    trigger.remove();
  });
});
