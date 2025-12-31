import '@testing-library/jest-dom';

import { vi } from "vitest";
import yaml from "js-yaml";

const sampleTemplate = {
  contact_info: {
    name: "John Doe",
    location: "London, UK",
    email: "john.doe@example.com",
    phone: "+44 7000000000",
    linkedin: "https://linkedin.com/in/johndoe",
  },
  sections: [
    {
      name: "Summary",
      type: "text",
      content: "This is a summary.",
    },
    {
      name: "Experience",
      content: [
        {
          company: "Company A",
          title: "Developer",
          dates: "2020-2021",
          description: ["Did awesome work."],
          icon: "company_a.png",
        },
      ],
    },
    {
      name: "Certifications",
      type: "icon-list",
      content: [
        {
          certification: "Test Cert",
          issuer: "Test Issuer",
          date: "2020",
          icon: "nonexistent.png",
        },
      ],
    },
  ],
};

const mockTemplateData = {
  yaml: yaml.dump(sampleTemplate),
  supportsIcons: false,
};

vi.mock("../services/templates", () => ({
  fetchTemplate: vi.fn().mockResolvedValue(mockTemplateData),
  generateResume: vi.fn().mockResolvedValue({
    pdfBlob: new Blob(["dummy pdf content"], { type: "application/pdf" }),
    fileName: "resume.pdf",
  }),
}));

// Mock Supabase client for tests
vi.mock("./lib/supabase", () => ({
  supabase: {
    from: vi.fn(() => ({
      select: vi.fn(() => ({
        eq: vi.fn(() => ({
          maybeSingle: vi.fn(() =>
            Promise.resolve({
              data: {
                tour_completed: false,
                idle_nudge_shown: false,
                announcement_dismissals: []
              },
              error: null
            })
          ),
        })),
      })),
      upsert: vi.fn(() => ({
        eq: vi.fn(() =>
          Promise.resolve({ data: null, error: null })
        ),
      })),
    })),
    auth: {
      getSession: vi.fn(() => Promise.resolve({ data: { session: null }, error: null })),
      onAuthStateChange: vi.fn(() => ({
        data: { subscription: { unsubscribe: vi.fn() } },
      })),
    },
  },
}));

// Ensure URL.createObjectURL exists.
if (!URL.createObjectURL) {
  URL.createObjectURL = vi.fn(() => "blob:http://dummy-url");
}