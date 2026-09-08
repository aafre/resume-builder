import { render, screen, fireEvent } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import ModalShell from "../components/shared/ModalShell";

function renderShell(props: Partial<React.ComponentProps<typeof ModalShell>> = {}) {
  const onClose = vi.fn();
  const view = render(
    <ModalShell isOpen onClose={onClose} label="Test dialog" {...props}>
      <h2 id="heading">Heading</h2>
      <button>First</button>
      <button>Last</button>
    </ModalShell>
  );
  return { onClose, ...view };
}

describe("ModalShell", () => {
  it("renders nothing when closed", () => {
    renderShell({ isOpen: false });
    expect(screen.queryByRole("dialog")).toBeNull();
    expect(document.body.style.overflow).toBe("");
  });

  it("portals out of its render container", () => {
    // Not cosmetic: a backdrop-filtered ancestor would otherwise become the
    // containing block for the fixed overlay and clamp it. See ModalShell docs.
    const { container } = renderShell();

    const dialog = screen.getByRole("dialog");
    expect(container.contains(dialog)).toBe(false);
    expect(document.body.contains(dialog)).toBe(true);
  });

  it("exposes dialog semantics with an accessible name", () => {
    renderShell();

    const dialog = screen.getByRole("dialog");
    expect(dialog).toHaveAttribute("aria-modal", "true");
    expect(dialog).toHaveAccessibleName("Test dialog");
  });

  it("prefers labelledBy over label when both could apply", () => {
    renderShell({ labelledBy: "heading" });

    const dialog = screen.getByRole("dialog");
    expect(dialog).toHaveAttribute("aria-labelledby", "heading");
    expect(dialog).not.toHaveAttribute("aria-label");
    expect(dialog).toHaveAccessibleName("Heading");
  });

  it("moves focus in on open and restores it to the opener on close", () => {
    const trigger = document.createElement("button");
    document.body.appendChild(trigger);
    trigger.focus();

    const { rerender, onClose } = renderShell();
    expect(screen.getByRole("dialog").contains(document.activeElement)).toBe(true);

    rerender(
      <ModalShell isOpen={false} onClose={onClose} label="Test dialog">
        <button>First</button>
      </ModalShell>
    );

    expect(document.activeElement).toBe(trigger);
    trigger.remove();
  });

  it("closes on Escape", () => {
    const { onClose } = renderShell();

    fireEvent.keyDown(document, { key: "Escape" });

    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("closes when the overlay itself is pressed", () => {
    const { onClose } = renderShell();

    const overlay = screen.getByRole("dialog").parentElement!;
    fireEvent.mouseDown(overlay);

    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("does not close when the press lands inside the panel", () => {
    const { onClose } = renderShell();

    fireEvent.mouseDown(screen.getByRole("button", { name: "First" }));

    expect(onClose).not.toHaveBeenCalled();
  });

  it("does not close on backdrop press when closeOnBackdrop is off", () => {
    // Destructive confirmations should not be dismissible by a stray click.
    const { onClose } = renderShell({ closeOnBackdrop: false });

    const overlay = screen.getByRole("dialog").parentElement!;
    fireEvent.mouseDown(overlay);

    expect(onClose).not.toHaveBeenCalled();
  });

  // The lock pins a fixed body at a negative offset rather than setting
  // `body { overflow: hidden }`. The one-liner does nothing in this app:
  // styles.css sets `html, body { height: 100%; display: flex }` and the
  // scrolling element is `html`, so body's overflow never reaches the viewport.
  // Measured in the running editor, the page still scrolled 600 -> 1400 behind
  // an open drawer with body overflow hidden. See hooks/useScrollLock.ts.
  it("locks scrolling while open and restores the offset on close", () => {
    window.scrollY = 240;
    const scrollTo = vi.fn();
    window.scrollTo = scrollTo as unknown as typeof window.scrollTo;

    expect(document.body.style.position).toBe("");

    const { unmount } = renderShell();
    expect(document.body.style.position).toBe("fixed");
    expect(document.body.style.top).toBe("-240px");
    expect(document.body.style.width).toBe("100%");

    unmount();
    expect(document.body.style.position).toBe("");
    expect(document.body.style.top).toBe("");
    expect(scrollTo).toHaveBeenCalledWith({ top: 240, behavior: "auto" });
  });

  it("keeps the lock held while a second overlay is stacked on top", () => {
    window.scrollY = 100;
    window.scrollTo = vi.fn() as unknown as typeof window.scrollTo;

    const first = renderShell();
    const second = renderShell();
    expect(document.body.style.position).toBe("fixed");

    // Closing only the inner overlay must not hand scrolling back to the page.
    second.unmount();
    expect(document.body.style.position).toBe("fixed");

    first.unmount();
    expect(document.body.style.position).toBe("");
  });
});
