export const CURRENT_YEAR = new Date().getFullYear();

export interface BlogPost {
  slug: string;
  title: string;
  description: string;
  publishDate: string;
  lastUpdated?: string;
  readTime: string;
  category: string;
  featured?: boolean;
  comingSoon?: boolean;
}

export const blogPosts: BlogPost[] = [
  // New AI Blog Content (Featured)
  {
    slug: "ai-resume-prompts-hub",
    title: "AI Resume Prompts Hub: Best Prompts for ChatGPT, Claude, Gemini & More",
    description: "Compare Claude, ChatGPT, Gemini, Grok, Copilot, and DeepSeek for resume writing. Pick the best AI prompt for bullets, summaries, ATS keywords, and cover letters.",
    publishDate: "2026-05-13",
    lastUpdated: "2026-05-25",
    readTime: "12 min",
    category: "AI & Tools",
  },
  {
    slug: "ai-resume-writing-guide",
    title: "AI Resume Writing: The Complete 2026 Guide (ChatGPT, Claude, Gemini & More)",
    description: "Master AI-powered resume writing with ChatGPT, Claude, Gemini, and Grok. Learn the best tools, prompts, and strategies for creating resumes that get interviews.",
    publishDate: "2026-01-21",
    readTime: "15 min",
    category: "AI & Tools",
  },
  {
    slug: "claude-resume-prompts",
    title: "25+ Claude AI Resume Prompts (Copy-Paste Ready) 2026",
    description: "Best Claude prompts for resume writing: professional summary, experience bullets, cover letters, career change, ATS optimization. Copy-paste ready for Claude 3.5 Sonnet and Opus.",
    publishDate: "2026-01-21",
    lastUpdated: "2026-02-17",
    readTime: "18 min",
    category: "AI & Tools",
  },
  {
    slug: "return-to-work-programs",
    title: "Return to Work Programs: Verified Returnships in the US, UK, and India (2026)",
    description: "A maintained, verified list of return-to-work programs and returnships at JPMorgan Chase, Goldman Sachs, Microsoft, Deloitte, and more — official links, eligibility, and application status, checked directly against each company's own program page.",
    publishDate: "2026-03-05",
    lastUpdated: "2026-09-22",
    readTime: "13 min",
    category: "Job Applications",
  },
  {
    slug: "resume-employment-gaps",
    title: "How to Explain Employment Gaps on Your Resume (2026 Guide)",
    description: "How to explain employment gaps on your resume: honest framing for layoffs, caregiving, health, travel, and career changes. Format strategies, example language, and what not to do.",
    publishDate: "2026-03-05",
    readTime: "10 min",
    category: "Resume Tips",
  },
  // ai-cover-letter-prompts intentionally removed from index/sitemap — the page is
  // noindexed as a thin, near-duplicate prompt-cluster sibling (post-Apr-2026 core-update
  // quality pruning). Route kept in App.tsx so the live URL still serves the noindex tag.
  // Existing posts
  {
    slug: "behavioral-interview-questions",
    title: "15+ Behavioral Interview Questions (and How to Answer with the STAR Method)",
    description: "Prepare for tough behavioral questions by mastering the STAR method with these common examples and answer frameworks.",
    publishDate: "2025-09-02",
    lastUpdated: "2026-03-22",
    readTime: "6 min",
    category: "Interview Prep",
  },
  {
    slug: "how-to-write-a-resume-guide",
    title: `How to Write a Resume in ${CURRENT_YEAR}: The Complete Step-by-Step Guide`,
    description: "From a blank page to a finished, professional resume, this guide covers every section, formatting rule, and writing tip you need to know.",
    publishDate: "2025-08-25",
    lastUpdated: "2026-03-22",
    readTime: "8 min",
    category: "Resume Writing",
  },
  {
    slug: "best-free-resume-builders-2026",
    title: "9 Best Free Resume Builders in 2026 (Honestly Reviewed)",
    description: "We tested 9 free resume builders so you don't have to. Real pricing, actual free tiers, ATS compatibility, and export formats — no affiliate bias.",
    publishDate: "2026-03-05",
    readTime: "14 min",
    category: "Comparisons",
  },
  {
    slug: "resume-action-verbs",
    title: "Action Verbs for Resumes: 200+ Words to Boost Your Impact",
    description: "Replace boring words with powerful action verbs that grab recruiters' attention and showcase your accomplishments.",
    publishDate: "2025-08-20",
    lastUpdated: "2026-09-22",
    readTime: "9 min",
    category: "Resume Sections",
  },
  {
    slug: "ats-resume-optimization",
    title: "ATS Resume Optimization: Beat the Bots and Land Interviews",
    description:
      "Master the art of creating ATS-friendly resumes that pass automated screening systems and reach human recruiters.",
    publishDate: "2025-07-22",
    readTime: "8 min",
    category: "ATS Optimization",
    featured: false,
  },
  {
    slug: "resume-no-experience",
    title: "Resume with No Experience: Real Examples + Free Template",
    description:
      "How to write an ATS-friendly, confidence-boosting resume when you're just starting out. Includes copy-paste examples and free template.",
    publishDate: "2025-07-20",
    readTime: "10\u201314 min",
    category: "Entry Level",
  },
  {
    slug: "professional-summary-examples",
    title: "30+ Professional Summary Examples for Resumes (2026)",
    description:
      "Copy-paste professional summary examples for every industry: tech, healthcare, finance, marketing, student. Plus a 60-second formula for writing your own.",
    publishDate: "2025-07-18",
    lastUpdated: "2026-09-22",
    readTime: "12 min",
    category: "Resume Sections",
    featured: false,
  },
  {
    slug: "resume-vs-cv-difference",
    title: "Resume vs CV: Understanding the Key Differences",
    description:
      "Learn when to use a resume versus a CV, and how to format each document for maximum impact.",
    publishDate: "2025-07-02",
    readTime: "5 min",
    category: "Resume Basics",
  },
  // resume-keywords-by-industry retired 2026-09-23 — 301'd to resume-keywords-guide
  // (title-collision genuine merge, PR #803: loser was unindexed, 0 external inbound
  // links, half the content depth of the survivor). Route kept in App.tsx as a redirect.
  {
    slug: "how-why-easyfreeresume-completely-free",
    title: "How (and Why) is EasyFreeResume Completely Free?",
    description: "No paywalls, no hidden fees, no premium upgrades. We break down why we built a truly free resume builder and how we are committed to keeping it that way.",
    publishDate: "2025-08-01",
    readTime: "8 min",
    category: "Company",
    featured: true,
  },
  {
    slug: "zety-vs-easy-free-resume",
    title: "Zety Pricing 2026: Why Pay? Use This 100% Free Alternative Instead",
    description: "Looking for Zety pricing? Don't get locked into a $5.95-$23.95/month subscription. EasyFreeResume offers the same ATS templates for $0. No hidden fees, no watermarks.",
    publishDate: "2025-07-28",
    lastUpdated: "2026-02-25",
    readTime: "9 min",
    category: "Comparisons",
  },
  {
    slug: "resume-io-vs-easy-free-resume",
    title: "Resume.io Pricing 2026: Free Alternative That Does More",
    description: "Resume.io costs $2.95-$24.95/month for downloads. EasyFreeResume offers the same ATS templates for $0. Compare features, privacy, and see why free wins.",
    publishDate: "2026-01-21",
    readTime: "8 min",
    category: "Comparisons",
  },
  {
    slug: "resume-genius-vs-easy-free-resume",
    title: "Resume Genius Pricing 2026: Is $7.95/Month Worth It? (Free Alternative)",
    description: "Resume Genius charges $7.95-$39.95/month for PDF downloads. See how EasyFreeResume offers the same ATS templates completely free with better privacy.",
    publishDate: "2026-01-21",
    lastUpdated: "2026-02-04",
    readTime: "8 min",
    category: "Comparisons",
  },
  {
    slug: "novoresume-vs-easy-free-resume",
    title: "NovoResume Pricing 2026: Premium Templates Free Alternative",
    description: "NovoResume's premium plans cost $16-$99/year. Compare features with EasyFreeResume, a 100% free alternative with ATS-friendly templates and better privacy.",
    publishDate: "2026-01-21",
    lastUpdated: "2026-02-10",
    readTime: "7 min",
    category: "Comparisons",
  },
  {
    slug: "enhancv-vs-easy-free-resume",
    title: "Enhancv Pricing 2026: Is $9.99/Month Worth It? Free Alternative Compared",
    description: "Enhancv costs $9.99-$24.99/month for premium features. Compare with EasyFreeResume, a free alternative with ATS-friendly templates and complete privacy.",
    publishDate: "2026-01-21",
    lastUpdated: "2026-02-04",
    readTime: "7 min",
    category: "Comparisons",
  },
  {
    slug: "canva-resume-vs-easy-free-resume",
    title: "Canva Resume Templates 2026: Why They Fail ATS (Better Alternative)",
    description: "Canva's free resume templates look great but often fail ATS scans. Learn why and discover EasyFreeResume, a free alternative designed for ATS compatibility.",
    publishDate: "2026-01-21",
    lastUpdated: "2026-02-10",
    readTime: "8 min",
    category: "Comparisons",
  },
  {
    slug: "flowcv-vs-easy-free-resume",
    title: "FlowCV vs EasyFreeResume 2026: Which Free Resume Builder is Better?",
    description: "Both FlowCV and EasyFreeResume offer free resume building. Compare features, privacy, and templates to see which free option is truly better for your job search.",
    publishDate: "2026-01-21",
    lastUpdated: "2026-05-12",
    readTime: "7 min",
    category: "Comparisons",
  },
];
