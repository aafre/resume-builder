/// <reference types="vitest" />
import { screen, waitFor } from "@testing-library/react";
import { Route, Routes } from "react-router-dom";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { toast } from "react-hot-toast";
import Editor from "../components/Editor";
import { renderWithProviders } from "../test-utils";
import * as apiClientModule from "../lib/api-client";

// ── Mocks ──────────────────────────────────────────────────────────

vi.mock("react-hot-toast");
vi.mock("../lib/api-client");
vi.mock("../lib/supabase", () => ({ supabase: {} }));

// Template service – never resolves during these tests (we won't need it)
vi.mock("../services/templates", () => ({
  fetchTemplate: vi.fn().mockResolvedValue({
    yaml: "contact_info: {}\nsections: []",
    supportsIcons: false,
  }),
}));

// Validation stubs
vi.mock("../services/validationService", () => ({
  validateYAMLStructure: vi.fn(() => ({ valid: true })),
  validateResumeStructure: vi.fn(() => ({ valid: true })),
}));

// Section helpers – pass-through
vi.mock("../utils/sectionMigration", () => ({
  migrateLegacySections: vi.fn((s: unknown) => s),
}));
vi.mock("../services/yamlService", () => ({
  processSectionsForExport: vi.fn((s: unknown) => s),
}));

// usePreview – return inert stub so it doesn't make network requests
vi.mock("../hooks/usePreview", () => ({
  usePreview: () => ({
    previewUrl: null,
    isGenerating: false,
    generatePreview: vi.fn(),
    retryGeneration: vi.fn(),
    previewError: null,
    hasPreview: false,
    lastPreviewSections: null,
    lastPreviewContactInfo: null,
    isStale: false,
    checkAndRefreshIfStale: vi.fn(),
    resetPreview: vi.fn(),
    hasPendingDebounce: false,
  }),
}));

// usePreferencePersistence – inert stub
vi.mock("../hooks/usePreferencePersistence", () => ({
  default: () => ({
    preferences: { tour_completed: true },
    prefsLoading: false,
    setPreference: vi.fn(),
  }),
}));

// Editor sub-components – lightweight stubs to avoid deep rendering
vi.mock("../components/editor/index", () => ({
  EditorHeader: () => <div data-testid="editor-header" />,
  EditorModals: () => null,
  EditorContent: () => <div data-testid="editor-content" />,
}));

// NotFound / ErrorPage (lazy-loaded by Editor)
vi.mock("../components/NotFound", () => ({
  default: () => <div data-testid="not-found-page">Not Found</div>,
}));
vi.mock("../components/ErrorPage", () => ({
  default: () => <div data-testid="error-page">Error</div>,
}));

// ── Helpers ────────────────────────────────────────────────────────

/**
 * Render the Editor at `/editor/:resumeId` with a catch-all `/templates`
 * route so we can detect the redirect.
 */
function renderEditorWithResumeId(resumeId: string, authOverrides?: object) {
  return renderWithProviders(
    <Routes>
      <Route path="/editor/:resumeId" element={<Editor />} />
      <Route
        path="/templates"
        element={<div data-testid="templates-page">Templates Page</div>}
      />
    </Routes>,
    {
      withEditorProvider: true,
      initialRoute: `/editor/${resumeId}`,
      ...( authOverrides ? { authContext: authOverrides } : {}),
    }
  );
}

// ── Tests ──────────────────────────────────────────────────────────

describe("Editor – resume not found redirect", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("redirects to /templates and shows toast when resume ID does not exist", async () => {
    // API returns 404
    vi.spyOn(apiClientModule.apiClient, "get").mockRejectedValue(
      new Error("Resume not found")
    );

    renderEditorWithResumeId("a88cf64d-0179-4ac2-be18-000000000000");

    // Should redirect to /templates
    await waitFor(() => {
      expect(screen.getByTestId("templates-page")).toBeInTheDocument();
    });

    // Should show toast
    expect(toast.error).toHaveBeenCalledWith(
      "Resume not found. Pick a template to start fresh."
    );
  });

  it("redirects to /templates when user has no session", async () => {
    // No session → useResumeLoader sets resumeNotFound immediately
    renderEditorWithResumeId("a88cf64d-0179-4ac2-be18-000000000000", {
      user: null,
      session: null,
      loading: false,
      signingOut: false,
      isAuthenticated: false,
      isAnonymous: false,
      hasMigrated: false,
      migrationInProgress: false,
      anonMigrationInProgress: false,
      migratedResumeCount: 0,
      signInWithGoogle: vi.fn(),
      signInWithLinkedIn: vi.fn(),
      signInWithEmail: vi.fn(),
      signOut: vi.fn(),
    });

    await waitFor(() => {
      expect(screen.getByTestId("templates-page")).toBeInTheDocument();
    });

    // API should never be called without a session
    expect(apiClientModule.apiClient.get).not.toHaveBeenCalled();
  });

  it("does NOT redirect when resume loads successfully", async () => {
    const mockResume = {
      id: "a88cf64d-0179-4ac2-be18-111111111111",
      contact_info: { name: "Test User", email: "test@example.com" },
      sections: [],
      template_id: "modern",
      icons: [],
    };

    vi.spyOn(apiClientModule.apiClient, "get").mockResolvedValue({
      resume: mockResume,
    });

    renderEditorWithResumeId("a88cf64d-0179-4ac2-be18-111111111111");

    // Should render the editor content, NOT the templates page
    await waitFor(() => {
      expect(screen.getByTestId("editor-content")).toBeInTheDocument();
    });

    expect(screen.queryByTestId("templates-page")).not.toBeInTheDocument();
    expect(toast.error).not.toHaveBeenCalled();
  });

  it("makes only one API call for a non-existent resume (no infinite loop)", async () => {
    vi.spyOn(apiClientModule.apiClient, "get").mockRejectedValue(
      new Error("Resume not found")
    );

    renderEditorWithResumeId("a88cf64d-0179-4ac2-be18-000000000000");

    await waitFor(() => {
      expect(screen.getByTestId("templates-page")).toBeInTheDocument();
    });

    // Wait an extra tick to catch any rogue retries
    await new Promise((r) => setTimeout(r, 200));

    // Exactly one API call — no infinite loop
    expect(apiClientModule.apiClient.get).toHaveBeenCalledTimes(1);
  });
});
