import { render, screen, fireEvent, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { DocumentSettingsPanel } from "../components/DocumentSettingsPanel";
import type { DocumentSettings } from "../types";

describe("DocumentSettingsPanel", () => {
  let onSettingsChange: ReturnType<typeof vi.fn>;

  const defaultSettings: DocumentSettings = {
    accent_color: "#2D3436",
    show_page_numbers: false,
    font_family: "Arial",
  };

  beforeEach(() => {
    onSettingsChange = vi.fn();
  });

  const renderPanel = (settings: DocumentSettings = defaultSettings) =>
    render(
      <DocumentSettingsPanel
        settings={settings}
        onSettingsChange={onSettingsChange}
      />
    );

  // ─── Rendering ──────────────────────────────────────────────

  describe("Rendering", () => {
    it("renders Document Settings header text", () => {
      renderPanel();
      expect(screen.getByText("Document Settings")).toBeInTheDocument();
    });

    it("renders 10 colour preset buttons", () => {
      renderPanel();
      const presetButtons = screen.getAllByLabelText(/accent colour$/i);
      expect(presetButtons).toHaveLength(10);
    });

    it("renders font dropdown with grouped options", () => {
      renderPanel();
      const select = screen.getByLabelText("Font");
      const options = within(select).getAllByRole("option");
      expect(options).toHaveLength(15); // 4 sans + 5 serif + 6 classic
      const groups = within(select).getAllByRole("group");
      expect(groups).toHaveLength(3); // Sans Serif, Serif, Classic
    });

    it("renders page number toggle with role=switch", () => {
      renderPanel();
      const toggle = screen.getByRole("switch");
      expect(toggle).toBeInTheDocument();
    });

    it("renders custom colour button", () => {
      renderPanel();
      expect(screen.getByLabelText("Custom hex colour")).toBeInTheDocument();
    });
  });

  // ─── Expand / Collapse ──────────────────────────────────────

  describe("Expand/Collapse", () => {
    it("starts expanded by default (aria-expanded=true)", () => {
      renderPanel();
      const headerButton = screen.getByRole("button", {
        name: /document settings/i,
      });
      expect(headerButton).toHaveAttribute("aria-expanded", "true");
    });

    it("starts with body content visible", () => {
      renderPanel();
      expect(screen.getByText("Accent Colour")).toBeInTheDocument();
    });

    it("collapses on header click (body hidden)", async () => {
      const user = userEvent.setup();
      renderPanel();

      const headerButton = screen.getByRole("button", {
        name: /document settings/i,
      });
      await user.click(headerButton);

      expect(headerButton).toHaveAttribute("aria-expanded", "false");
      expect(screen.queryByText("Accent Colour")).not.toBeInTheDocument();
    });

    it("re-expands on second click", async () => {
      const user = userEvent.setup();
      renderPanel();

      const headerButton = screen.getByRole("button", {
        name: /document settings/i,
      });

      await user.click(headerButton);
      expect(screen.queryByText("Accent Colour")).not.toBeInTheDocument();

      await user.click(headerButton);
      expect(screen.getByText("Accent Colour")).toBeInTheDocument();
      expect(headerButton).toHaveAttribute("aria-expanded", "true");
    });

    it("aria-expanded toggles correctly", async () => {
      const user = userEvent.setup();
      renderPanel();

      const headerButton = screen.getByRole("button", {
        name: /document settings/i,
      });

      expect(headerButton).toHaveAttribute("aria-expanded", "true");
      await user.click(headerButton);
      expect(headerButton).toHaveAttribute("aria-expanded", "false");
      await user.click(headerButton);
      expect(headerButton).toHaveAttribute("aria-expanded", "true");
    });
  });

  // ─── Colour Presets ─────────────────────────────────────────

  describe("Colour Presets", () => {
    it("clicking Graphite preset calls onSettingsChange with accent_color #2D3436", async () => {
      const user = userEvent.setup();
      renderPanel({ ...defaultSettings, accent_color: "#000000" });

      const graphite = screen.getByLabelText("Graphite accent colour");
      await user.click(graphite);

      expect(onSettingsChange).toHaveBeenCalledWith(
        expect.objectContaining({ accent_color: "#2D3436" })
      );
    });

    it("clicking Racing Green preset calls onSettingsChange with accent_color #1B4332", async () => {
      const user = userEvent.setup();
      renderPanel();

      const racingGreen = screen.getByLabelText("Racing Green accent colour");
      await user.click(racingGreen);

      expect(onSettingsChange).toHaveBeenCalledWith(
        expect.objectContaining({ accent_color: "#1B4332" })
      );
    });

    it("selected preset has scale-110 class", () => {
      renderPanel({ ...defaultSettings, accent_color: "#2D3436" });

      const graphite = screen.getByLabelText("Graphite accent colour");
      expect(graphite.className).toContain("scale-110");
      expect(graphite.className).toContain("ring-");
    });

    it("non-selected preset does not have ring class", () => {
      renderPanel({ ...defaultSettings, accent_color: "#2D3436" });

      const racingGreen = screen.getByLabelText("Racing Green accent colour");
      expect(racingGreen.className).not.toContain("ring-[1.5px]");
    });
  });

  // ─── Custom Colour ─────────────────────────────────────────

  describe("Custom Colour", () => {
    it("clicking custom button shows hex input", async () => {
      const user = userEvent.setup();
      renderPanel();

      // Initially no text input visible (only button with "Custom hex colour" label)
      const customButtons = screen.getAllByLabelText("Custom hex colour");
      expect(customButtons).toHaveLength(1); // just the button

      await user.click(customButtons[0]);

      // Now the hex input should also be visible
      const allCustom = screen.getAllByLabelText("Custom hex colour");
      expect(allCustom.length).toBe(2); // button + input
    });

    it("typing in hex input calls onSettingsChange with accent_color value", async () => {
      renderPanel({ ...defaultSettings, accent_color: "#2D3436" });

      // Open custom colour input
      const customButton = screen.getByLabelText("Custom hex colour");
      await userEvent.click(customButton);

      // Find the text input (second element with the label)
      const hexInput = screen.getAllByLabelText("Custom hex colour")[1];
      expect(hexInput.tagName).toBe("INPUT");

      // Simulate typing by firing a change event directly (controlled input
      // won't re-render since onSettingsChange is mocked and doesn't update props)
      fireEvent.change(hexInput, { target: { value: "#FF0000" } });

      expect(onSettingsChange).toHaveBeenCalledWith(
        expect.objectContaining({ accent_color: "#FF0000" })
      );
    });

    it("custom indicator shows when non-preset colour is active", () => {
      renderPanel({ ...defaultSettings, accent_color: "#ABCDEF" });

      const customButton = screen.getByLabelText("Custom hex colour");
      // When a non-preset colour is active, the custom button gets scale-110 and ring
      expect(customButton.className).toContain("scale-110");
      expect(customButton.className).toContain("ring-");
    });

    it("custom button does not show indicator when a preset is active", () => {
      renderPanel({ ...defaultSettings, accent_color: "#2D3436" });

      const customButton = screen.getByLabelText("Custom hex colour");
      // When a preset is active, the custom button should NOT have ring-[1.5px]
      // (it does have hover:scale-110, but not the non-hover scale-110 class)
      expect(customButton.className).not.toContain("ring-[1.5px]");
      expect(customButton.className).toContain("opacity-60");
    });
  });

  // ─── Font ───────────────────────────────────────────────────

  describe("Font", () => {
    it("font dropdown shows current value from settings", () => {
      renderPanel({ ...defaultSettings, font_family: "Georgia" });

      const select = screen.getByLabelText("Font") as HTMLSelectElement;
      expect(select.value).toBe("Georgia");
    });

    it("changing font calls onSettingsChange with font_family", () => {
      renderPanel();

      const select = screen.getByLabelText("Font");
      fireEvent.change(select, { target: { value: "EB Garamond" } });

      expect(onSettingsChange).toHaveBeenCalledWith(
        expect.objectContaining({ font_family: "EB Garamond" })
      );
    });

    it("default font is Source Sans 3 when settings.font_family is undefined", () => {
      renderPanel({ accent_color: "#000000" });

      const select = screen.getByLabelText("Font") as HTMLSelectElement;
      expect(select.value).toBe("Source Sans 3");
    });
  });

  // ─── Page Numbers ───────────────────────────────────────────

  describe("Page Numbers", () => {
    it("toggle is off by default (aria-checked=false)", () => {
      renderPanel();

      const toggle = screen.getByRole("switch");
      expect(toggle).toHaveAttribute("aria-checked", "false");
    });

    it("clicking toggle calls onSettingsChange with show_page_numbers: true", async () => {
      const user = userEvent.setup();
      renderPanel();

      const toggle = screen.getByRole("switch");
      await user.click(toggle);

      expect(onSettingsChange).toHaveBeenCalledWith(
        expect.objectContaining({ show_page_numbers: true })
      );
    });

    it("toggle reflects true state (aria-checked=true)", () => {
      renderPanel({ ...defaultSettings, show_page_numbers: true });

      const toggle = screen.getByRole("switch");
      expect(toggle).toHaveAttribute("aria-checked", "true");
    });

    it("clicking toggle when on calls onSettingsChange with show_page_numbers: false", async () => {
      const user = userEvent.setup();
      renderPanel({ ...defaultSettings, show_page_numbers: true });

      const toggle = screen.getByRole("switch");
      await user.click(toggle);

      expect(onSettingsChange).toHaveBeenCalledWith(
        expect.objectContaining({ show_page_numbers: false })
      );
    });
  });

  // ─── Edge cases ─────────────────────────────────────────────

  describe("Edge cases", () => {
    it("renders without crashing with empty settings ({})", () => {
      renderPanel({});
      expect(screen.getByText("Document Settings")).toBeInTheDocument();
    });

    it("renders without crashing with undefined settings fields", () => {
      renderPanel({
        accent_color: undefined,
        show_page_numbers: undefined,
        font_family: undefined,
      });
      expect(screen.getByText("Document Settings")).toBeInTheDocument();
    });

    it("uses correct defaults when settings are empty", () => {
      renderPanel({});

      // Font defaults to Source Sans 3
      const select = screen.getByLabelText("Font") as HTMLSelectElement;
      expect(select.value).toBe("Source Sans 3");

      // Page numbers default to off
      const toggle = screen.getByRole("switch");
      expect(toggle).toHaveAttribute("aria-checked", "false");
    });

    it("preserves other settings when updating a single field", async () => {
      const user = userEvent.setup();
      const settings: DocumentSettings = {
        accent_color: "#2D3436",
        show_page_numbers: true,
        font_family: "Georgia",
      };
      renderPanel(settings);

      // Change font
      fireEvent.change(screen.getByLabelText("Font"), {
        target: { value: "Cambria" },
      });

      expect(onSettingsChange).toHaveBeenCalledWith({
        accent_color: "#2D3436",
        show_page_numbers: true,
        font_family: "Cambria",
      });
    });
  });
});
