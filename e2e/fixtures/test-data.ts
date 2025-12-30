import yaml from 'js-yaml';

/**
 * Test Data Factory for E2E Tests
 *
 * Provides functions to create test data:
 * - Resume templates
 * - Contact info
 * - Sections
 * - YAML strings
 */

export interface ContactInfo {
  name: string;
  location?: string;
  email: string;
  phone?: string;
  linkedin?: string;
  social_links?: Array<{
    platform: string;
    url: string;
    display_text?: string;
  }>;
}

export interface Section {
  name: string;
  type?: string;
  content: unknown;
}

export interface ResumeTemplate {
  contact_info: ContactInfo;
  sections: Section[];
}

/**
 * Create basic resume template
 */
export function createBasicResume(overrides?: Partial<ResumeTemplate>): ResumeTemplate {
  return {
    contact_info: {
      name: 'E2E Test User',
      location: 'San Francisco, CA',
      email: 'e2e-test@example.com',
      phone: '+1-555-0100',
      social_links: [
        {
          platform: 'linkedin',
          url: 'https://linkedin.com/in/e2etest',
          display_text: 'E2E Test',
        },
      ],
    },
    sections: [
      {
        name: 'Summary',
        type: 'text',
        content: 'Experienced software engineer with expertise in testing and automation.',
      },
      {
        name: 'Skills',
        type: 'bulleted-list',
        content: ['JavaScript', 'TypeScript', 'Python', 'Playwright', 'Testing'],
      },
    ],
    ...overrides,
  };
}

/**
 * Create resume with experience section
 */
export function createResumeWithExperience(): ResumeTemplate {
  return createBasicResume({
    sections: [
      {
        name: 'Summary',
        type: 'text',
        content: 'Experienced software engineer specializing in test automation.',
      },
      {
        name: 'Experience',
        type: 'experience',
        content: [
          {
            company: 'Test Company Inc',
            title: 'Senior QA Engineer',
            dates: '2020 - Present',
            description: [
              'Implemented end-to-end testing framework using Playwright',
              'Reduced test execution time by 50% through parallel testing',
              'Mentored junior engineers on testing best practices',
            ],
            icon: 'company_google.png',
          },
          {
            company: 'Previous Corp',
            title: 'QA Engineer',
            dates: '2018 - 2020',
            description: [
              'Developed automated test suites for web applications',
              'Collaborated with developers to improve code quality',
            ],
          },
        ],
      },
      {
        name: 'Skills',
        type: 'bulleted-list',
        content: ['Playwright', 'Cypress', 'Jest', 'Python', 'CI/CD'],
      },
    ],
  });
}

/**
 * Create resume with education section
 */
export function createResumeWithEducation(): ResumeTemplate {
  return createBasicResume({
    sections: [
      {
        name: 'Education',
        type: 'education',
        content: [
          {
            degree: 'Bachelor of Science in Computer Science',
            school: 'Test University',
            year: '2018',
            field: 'Computer Science',
          },
        ],
      },
      {
        name: 'Skills',
        type: 'bulleted-list',
        content: ['JavaScript', 'Python', 'Testing'],
      },
    ],
  });
}

/**
 * Create resume with certifications (icon-list)
 */
export function createResumeWithCertifications(): ResumeTemplate {
  return createBasicResume({
    sections: [
      {
        name: 'Certifications',
        type: 'icon-list',
        content: [
          {
            certification: 'AWS Certified Developer',
            issuer: 'Amazon Web Services',
            date: '2023',
            icon: 'cert_aws.png',
          },
          {
            certification: 'Google Cloud Professional',
            issuer: 'Google Cloud',
            date: '2022',
            icon: 'cert_gcp.png',
          },
        ],
      },
    ],
  });
}

/**
 * Convert resume template to YAML string
 */
export function toYAML(resume: ResumeTemplate): string {
  return yaml.dump(resume, {
    indent: 2,
    lineWidth: 100,
    noRefs: true,
  });
}

/**
 * Pre-defined test resume data
 */
export const testResumeData = {
  basic: createBasicResume(),
  withExperience: createResumeWithExperience(),
  withEducation: createResumeWithEducation(),
  withCertifications: createResumeWithCertifications(),
};

/**
 * Pre-defined YAML strings
 */
export const testYAML = {
  basic: toYAML(testResumeData.basic),
  withExperience: toYAML(testResumeData.withExperience),
  withEducation: toYAML(testResumeData.withEducation),
  withCertifications: toYAML(testResumeData.withCertifications),
};

/**
 * Create minimal resume (for quick tests)
 */
export function createMinimalResume(): ResumeTemplate {
  return {
    contact_info: {
      name: 'Test User',
      email: 'test@example.com',
    },
    sections: [
      {
        name: 'Summary',
        type: 'text',
        content: 'Test summary.',
      },
    ],
  };
}

/**
 * Create resume with specific title for testing
 */
export function createResumeWithTitle(title: string): ResumeTemplate {
  const resume = createBasicResume();
  resume.contact_info.name = title;
  return resume;
}
