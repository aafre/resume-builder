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

  it("locks body scroll while open and restores it on close", () => {
    expect(document.body.style.overflow).toBe("");

    const { unmount } = renderShell();
    expect(document.body.style.overflow).toBe("hidden");

    unmount();
    expect(document.body.style.overflow).toBe("");
  });
});
