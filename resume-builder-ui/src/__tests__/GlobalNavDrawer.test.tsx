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

  it("renders outside the header so a filtered ancestor cannot contain it", () => {
    // Header carries backdrop-blur-xl, which makes it the containing block for
    // fixed descendants and clamped the drawer to header height. The portal is
    // what prevents that; jsdom cannot measure layout, so assert the escape.
    const { container } = renderDrawer();

    const dialog = screen.getByRole("dialog");
    expect(container.contains(dialog)).toBe(false);
    expect(dialog.parentElement).toBe(document.body);
    expect(dialog.closest("header")).toBeNull();
  });

  it("closes itself when the viewport crosses the lg breakpoint", () => {
    // The drawer is lg:hidden. Without this it stays mounted and its focus
    // trap keeps swallowing Tab against a panel nobody can see.
    let fireChange: ((e: { matches: boolean }) => void) | undefined;
    const addEventListener = vi.fn((_: string, handler: (e: { matches: boolean }) => void) => {
      fireChange = handler;
    });
    const removeEventListener = vi.fn();
    vi.spyOn(window, "matchMedia").mockReturnValue({
      matches: false,
      media: "(min-width: 1024px)",
      onchange: null,
      addEventListener,
      removeEventListener,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      dispatchEvent: vi.fn(),
    } as unknown as MediaQueryList);

    const { onClose, unmount } = renderDrawer();
    expect(onClose).not.toHaveBeenCalled();

    fireChange?.({ matches: true });
    expect(onClose).toHaveBeenCalledTimes(1);

    unmount();
    expect(removeEventListener).toHaveBeenCalled();
    vi.mocked(window.matchMedia).mockRestore();
  });

  it("locks body scroll while open and restores it on close", () => {
    expect(document.body.style.overflow).toBe("");

    const { unmount } = renderDrawer();
    expect(document.body.style.overflow).toBe("hidden");

    unmount();
    expect(document.body.style.overflow).toBe("");
  });
});
