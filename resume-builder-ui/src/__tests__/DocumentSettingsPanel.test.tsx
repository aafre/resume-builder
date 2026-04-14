import { render, screen, fireEvent } from "@testing-library/react";
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

    it("renders font button showing current font name", () => {
      renderPanel();
      const fontButton = screen.getByLabelText(/Font:.*Click to change/);
      expect(fontButton).toBeInTheDocument();
      expect(fontButton).toHaveTextContent("Arial");
    });

    it.skip("renders page number toggle with role=switch (disabled pending wkhtmltopdf fix)", () => {
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

    it("selected preset has scale-110 and ring-2 classes", () => {
      renderPanel({ ...defaultSettings, accent_color: "#2D3436" });

      const graphite = screen.getByLabelText("Graphite accent colour");
      expect(graphite.className).toContain("scale-110");
      expect(graphite.className).toContain("ring-2");
    });

    it("non-selected preset does not have ring-2 class", () => {
      renderPanel({ ...defaultSettings, accent_color: "#2D3436" });

      const racingGreen = screen.getByLabelText("Racing Green accent colour");
      expect(racingGreen.className).not.toContain("ring-2");
    });
  });

  // ─── Custom Colour ─────────────────────────────────────────

  describe("Custom Colour", () => {
    it("clicking custom button shows colour picker and hex input", async () => {
      const user = userEvent.setup();
      renderPanel();

      const customButton = screen.getByLabelText("Custom hex colour");
      await user.click(customButton);

      // Now the native color picker and hex input should be visible
      expect(screen.getByLabelText("Pick custom colour")).toBeInTheDocument();
      expect(screen.getByLabelText("Hex colour value")).toBeInTheDocument();
    });

    it("typing in hex input calls onSettingsChange with accent_color value", async () => {
      renderPanel({ ...defaultSettings, accent_color: "#2D3436" });

      // Open custom colour input
      const customButton = screen.getByLabelText("Custom hex colour");
      await userEvent.click(customButton);

      // Find the text input
      const hexInput = screen.getByLabelText("Hex colour value") as HTMLInputElement;
      expect(hexInput.tagName).toBe("INPUT");

      // Simulate typing by firing a change event directly
      fireEvent.change(hexInput, { target: { value: "#FF0000" } });

      expect(onSettingsChange).toHaveBeenCalledWith(
        expect.objectContaining({ accent_color: "#FF0000" })
      );
    });

    it("custom indicator shows when non-preset colour is active", () => {
      renderPanel({ ...defaultSettings, accent_color: "#ABCDEF" });

      const customButton = screen.getByLabelText("Custom hex colour");
      expect(customButton.className).toContain("scale-110");
      expect(customButton.className).toContain("ring-2");
    });

    it("custom button does not show indicator when a preset is active", () => {
      renderPanel({ ...defaultSettings, accent_color: "#2D3436" });

      const customButton = screen.getByLabelText("Custom hex colour");
      expect(customButton.className).not.toContain("ring-2 ring-offset-2 ring-gray-400 scale-110");
      expect(customButton.className).toContain("opacity-60");
    });
  });

  // ─── Font ───────────────────────────────────────────────────

  describe("Font", () => {
    it("font button shows current font name from settings", () => {
      renderPanel({ ...defaultSettings, font_family: "Georgia" });

      const fontButton = screen.getByLabelText(/Font:.*Click to change/);
      expect(fontButton).toHaveTextContent("Georgia");
    });

    it("font button calls onOpenFontModal when clicked", async () => {
      const user = userEvent.setup();
      const onOpenFontModal = vi.fn();
      render(
        <DocumentSettingsPanel
          settings={defaultSettings}
          onSettingsChange={onSettingsChange}
          onOpenFontModal={onOpenFontModal}
        />
      );

      const fontButton = screen.getByLabelText(/Font:.*Click to change/);
      await user.click(fontButton);

      expect(onOpenFontModal).toHaveBeenCalledOnce();
    });

    it("default font is Source Sans 3 when settings.font_family is undefined", () => {
      renderPanel({ accent_color: "#000000" });

      const fontButton = screen.getByLabelText(/Font:.*Click to change/);
      expect(fontButton).toHaveTextContent("Source Sans 3");
    });
  });

  // ─── Page Numbers ───────────────────────────────────────────

  describe.skip("Page Numbers (disabled pending wkhtmltopdf fix)", () => {
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

      // Font button defaults to Source Sans 3
      const fontButton = screen.getByLabelText(/Font:.*Click to change/);
      expect(fontButton).toHaveTextContent("Source Sans 3");
    });

    it("preserves other settings when updating colour", async () => {
      const user = userEvent.setup();
      const settings: DocumentSettings = {
        accent_color: "#2D3436",
        show_page_numbers: true,
        font_family: "Georgia",
      };
      renderPanel(settings);

      // Change colour
      const racingGreen = screen.getByLabelText("Racing Green accent colour");
      await user.click(racingGreen);

      expect(onSettingsChange).toHaveBeenCalledWith({
        accent_color: "#1B4332",
        show_page_numbers: true,
        font_family: "Georgia",
      });
    });
  });
});
