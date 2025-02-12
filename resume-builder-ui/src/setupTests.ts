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

// Ensure URL.createObjectURL exists.
if (!URL.createObjectURL) {
  URL.createObjectURL = vi.fn(() => "blob:http://dummy-url");
}