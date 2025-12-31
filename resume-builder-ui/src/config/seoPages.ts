/**
 * Centralized SEO Page Configurations
 * Single source of truth for all SEO landing page content
 * Follows DRY principle - modify content here, not in components
 */

import type { PageConfig } from '../types/seo';

export const SEO_PAGES: Record<string, PageConfig> = {
  // /actual-free-resume-builder
  actualFree: {
    seo: {
      title: 'Actual Free Resume Builder — No Paywall, No Watermark',
      description:
        'Build a 100% free, ATS-friendly resume online. No sign-ups. No paywalls. Download DOCX/PDF instantly. The only truly free resume builder.',
      keywords: [
        'actual free resume builder',
        'free resume builder no watermark',
        'truly free resume',
        'no paywall resume builder',
        'ATS resume free',
      ],
      canonicalUrl: '/actual-free-resume-builder',
    },
    hero: {
      h1: 'Actual Free Resume Builder',
      subtitle: 'No hidden fees, no watermarks, no trials. Just a free resume builder that actually works.',
      description:
        'Unlike other "free" builders that hide features behind paywalls, EasyFreeResume is 100% free forever. Create professional, ATS-friendly resumes and download instantly in PDF or DOCX format.',
      primaryCTA: {
        text: 'Start Building Free',
        href: '/templates',
        variant: 'primary',
      },
      secondaryCTA: {
        text: 'See Templates',
        href: '/templates',
        variant: 'outline',
      },
    },
    metrics: [
      { value: '100%', label: 'Free Forever', icon: '🎁' },
      { value: '0', label: 'Hidden Fees', icon: '💰' },
      { value: '∞', label: 'Downloads', icon: '📥' },
      { value: 'No', label: 'Watermark', icon: '✨' },
    ],
    features: [
      {
        icon: '🚫',
        title: 'No Paywall, Ever',
        description:
          'All features are free. No premium upgrades, no locked templates, no bait-and-switch tactics.',
      },
      {
        icon: '📝',
        title: 'Professional Templates',
        description:
          'Access all our ATS-optimized templates without paying a cent. Download as many times as you need.',
      },
      {
        icon: '⚡',
        title: 'Instant Export',
        description:
          'Download your resume immediately in PDF or DOCX. No waiting, no email verification, no tricks.',
      },
      {
        icon: '🎯',
        title: 'ATS-Friendly by Design',
        description:
          'Every template passes Applicant Tracking Systems. Your resume will get seen by real humans.',
      },
      {
        icon: '🔒',
        title: 'Complete Privacy',
        description:
          'No account required. No data stored. Your information stays private and secure.',
      },
      {
        icon: '💾',
        title: 'Save and Edit Anytime',
        description:
          'Download your resume data as YAML and re-upload to make edits. No cloud storage fees.',
      },
    ],
    faqs: [
      {
        question: 'Is it 100% free?',
        answer:
          'Yes. No trials, no credit card, no watermark. Every feature is free forever. We make money through ethical ads, not by locking features.',
      },
      {
        question: 'Do I need an account?',
        answer:
          'No. You can build and download resumes as a guest without signup. Creating a free account unlocks Cloud Storage for saving multiple resumes and accessing them from any device.',
      },
      {
        question: 'Will it pass ATS?',
        answer:
          'Yes if you keep headings, fonts, and sections as provided. Our templates are designed specifically for Applicant Tracking Systems.',
      },
      {
        question: 'Can I download DOCX and PDF?',
        answer:
          'Yes. Both formats are available. DOCX is recommended for ATS systems, PDF for email applications.',
      },
      {
        question: 'Do you store my data?',
        answer:
          'Only if you choose to save. Otherwise it is discarded after you leave. We respect your privacy completely.',
      },
      {
        question: 'Can I customize fonts and spacing?',
        answer:
          'Yes. Stay within ATS-safe fonts (Arial, Calibri, Times New Roman) for best results with automated systems.',
      },
      {
        question: 'How many resumes can I save to the cloud?',
        answer:
          'With a free account, you can save up to 5 resume versions in cloud storage. This lets you tailor different resumes for different job types while accessing them from any device.',
      },
    ],
  },

  // /free-resume-builder-no-sign-up
  noSignUp: {
    seo: {
      title: 'Free Resume Builder - No Sign Up Required',
      description:
        'Create and download your resume in minutes. No registration, no account, no hassle. Start building immediately with our free resume builder.',
      keywords: [
        'free resume builder no sign up',
        'no registration resume builder',
        'anonymous resume builder',
        'instant resume builder',
        'no account resume',
      ],
      canonicalUrl: '/free-resume-builder-no-sign-up',
    },
    hero: {
      h1: 'Free Resume Builder No Sign Up',
      subtitle: 'Start creating your professional resume right now. No forms, no passwords, no waiting.',
      description:
        'Skip the signup hassle. Our resume builder works instantly in your browser. Create, customize, and download your resume without creating an account or providing any personal information.',
      primaryCTA: {
        text: 'Build Resume Now',
        href: '/templates',
        variant: 'primary',
      },
    },
    steps: [
      {
        number: 1,
        title: 'Choose a template',
        description: 'Select from our ATS-friendly, professional resume templates. All are 100% free.',
      },
      {
        number: 2,
        title: 'Fill in your details',
        description:
          'Add your experience, education, and skills using our intuitive editor. No technical skills required.',
      },
      {
        number: 3,
        title: 'Download instantly',
        description:
          'Export your resume as PDF or DOCX. No email verification, no watermarks, no sign up needed.',
      },
    ],
    features: [
      {
        icon: '⚡',
        title: 'Instant Access',
        description: 'Start building immediately. The editor opens in seconds with no barriers.',
      },
      {
        icon: '🔒',
        title: 'Privacy First',
        description:
          'No account means no tracking. Your data never leaves your browser unless you save it.',
      },
      {
        icon: '📥',
        title: 'Export Without Limits',
        description: 'Download as many times as you want. No daily limits, no restrictions.',
      },
      {
        icon: '💾',
        title: 'Local Save Option',
        description:
          'Save your resume as a file on your computer. Re-upload anytime to continue editing.',
      },
      {
        icon: '🎨',
        title: 'Full Customization',
        description:
          'Access all design options without an account. Change fonts, colors, and sections freely.',
      },
      {
        icon: '✨',
        title: 'No Watermark',
        description: 'Your resume is yours. No "Created with..." branding on your downloads.',
      },
    ],
    faqs: [
      {
        question: 'Can I build and download with no signup?',
        answer:
          'Yes. Full export works in guest mode. You can create, customize, and download your complete resume without ever creating an account.',
      },
      {
        question: 'Is anything limited for guests?',
        answer:
          'Guest users have full access to all templates, PDF/DOCX downloads, and editing features. Creating a free account adds Cloud Auto-Save, My Resumes Dashboard (manage up to 5 resumes), and automatic resume recovery across devices.',
      },
      {
        question: 'Will you email me?',
        answer: 'No. No account means no emails. We cannot send you anything because we do not have your information.',
      },
      {
        question: 'What happens to my resume if I sign in later?',
        answer:
          'When you sign in for the first time, our migration system automatically transfers any resumes you created as a guest to your secure cloud account. You will see a success message confirming the transfer.',
      },
      {
        question: 'Can I come back to an unsaved resume?',
        answer:
          'Use the download data feature to save your resume as a YAML file. Upload this file later to continue editing.',
      },
      {
        question: 'Is guest mode ATS-friendly?',
        answer:
          'Yes. Same templates and formatting rules apply. Guest and registered users get identical ATS-optimized resumes.',
      },
      {
        question: 'Are exports branded?',
        answer: 'No. No logos or watermarks appear on your resume. It is 100% your own professional document.',
      },
    ],
  },

  // /ats-resume-templates (hub)
  templatesHub: {
    seo: {
      title: 'Free ATS-Friendly Resume Templates',
      description:
        'Download professional, ATS-ready resume templates. Free DOCX and Google Docs formats. Clean layouts that pass Applicant Tracking Systems.',
      keywords: [
        'ats friendly resume templates',
        'free resume templates',
        'ats resume format',
        'applicant tracking system templates',
        'professional resume templates',
      ],
      canonicalUrl: '/ats-resume-templates',
    },
    hero: {
      h1: 'ATS-Friendly Resume Templates',
      subtitle: 'Professional templates designed to pass Applicant Tracking Systems',
      description:
        'Choose from our collection of clean, modern resume templates optimized for ATS parsing. All templates are free to use and available in multiple formats.',
      primaryCTA: {
        text: 'Browse All Templates',
        href: '/templates',
        variant: 'primary',
      },
    },
    features: [
      {
        icon: '✅',
        title: 'ATS-Optimized Formatting',
        description:
          'Clean structure that ATS systems can parse correctly. No complex tables, graphics, or unusual fonts.',
      },
      {
        icon: '📄',
        title: 'Multiple Formats',
        description: 'Available in DOCX, PDF, and Google Docs. Choose the format that works best for your application.',
      },
      {
        icon: '🎨',
        title: 'Professional Design',
        description: 'Modern, clean layouts that impress hiring managers while maintaining ATS compatibility.',
      },
      {
        icon: '🔤',
        title: 'Safe Fonts',
        description: 'Uses standard fonts like Arial, Calibri, and Times New Roman that all ATS systems can read.',
      },
      {
        icon: '📏',
        title: 'Proper Sections',
        description: 'Clear section headings (Experience, Education, Skills) that ATS systems recognize.',
      },
      {
        icon: '💾',
        title: 'Easy Customization',
        description: 'Fully editable templates. Adjust content, spacing, and style to match your needs.',
      },
    ],
    faqs: [
      {
        question: 'What is an ATS-friendly template?',
        answer:
          'Clean structure that parses section titles, job titles, dates, and bullets correctly in Applicant Tracking Systems. Avoids complex formatting that confuses automated scanners.',
      },
      {
        question: 'Which fonts are safe for ATS?',
        answer:
          'Calibri, Arial, Helvetica, Times New Roman, Georgia, and other standard system fonts. Avoid decorative or uncommon fonts.',
      },
      {
        question: 'Are tables or columns OK in ATS resumes?',
        answer:
          'Avoid complex tables. Use simple one-column layouts for maximum reliability. Some modern ATS can handle simple two-column designs.',
      },
      {
        question: 'PDF or DOCX for ATS?',
        answer:
          'Use DOCX if unsure. Some older ATS systems parse PDFs poorly. Modern systems handle both, but DOCX is safer.',
      },
      {
        question: 'Can I add icons and graphics to ATS templates?',
        answer:
          'Best to avoid. Icons and graphics rarely parse correctly and can confuse ATS systems. Stick to text-only formatting.',
      },
      {
        question: 'Do two-page resumes hurt ATS performance?',
        answer:
          'No. Length does not affect parsing if structure is clean. Use two pages if you have substantial experience.',
      },
    ],
  },

  // /templates/ats-friendly
  atsFriendly: {
    seo: {
      title: 'Free ATS-Friendly Resume Template — Download',
      description:
        'Download our most popular ATS-friendly resume template. Clean, professional layout in DOCX and Google Docs. Optimized for Applicant Tracking Systems.',
      keywords: [
        'ats friendly resume template',
        'free ats template download',
        'applicant tracking system template',
        'ats resume format',
        'professional resume template',
      ],
      canonicalUrl: '/templates/ats-friendly',
    },
    breadcrumbs: [
      { label: 'Home', href: '/' },
      { label: 'ATS Templates', href: '/ats-resume-templates' },
      { label: 'ATS-Friendly', href: '/templates/ats-friendly' },
    ],
    hero: {
      h1: 'Free ATS-Friendly Resume Template',
      subtitle: 'Our most popular template, designed to pass any Applicant Tracking System',
      description:
        'This template has been tested with major ATS platforms including Workday, Taleo, iCIMS, and Greenhouse. Features clean formatting, standard fonts, and proper section headers.',
      primaryCTA: {
        text: 'Use This Template',
        href: '/templates',
        variant: 'primary',
      },
    },
    features: [
      {
        icon: '📐',
        title: 'Clean Layout',
        description: 'Single-column design with clear sections. No complex tables or graphics that confuse ATS.',
      },
      {
        icon: '🔤',
        title: 'Standard Fonts',
        description: 'Uses Calibri 11pt for body text. Easily readable by all ATS systems and hiring managers.',
      },
      {
        icon: '📏',
        title: 'Proper Margins',
        description: '1-inch margins on all sides. Standard US letter size (8.5" x 11"). Prints perfectly.',
      },
      {
        icon: '📋',
        title: 'Standard Sections',
        description:
          'Professional Summary, Work Experience, Education, Skills. All section headers are ATS-recognized.',
      },
      {
        icon: '📝',
        title: 'Bullet-Friendly',
        description: 'Uses standard bullet points (•) that parse correctly. Avoids special characters.',
      },
      {
        icon: '📅',
        title: 'Date Format',
        description: 'Consistent "Month Year" format (e.g., January 2024). ATS systems parse this reliably.',
      },
    ],
    faqs: [
      {
        question: 'Can I edit this template in Google Docs?',
        answer:
          'Yes. We provide both DOCX and Google Docs versions. Both maintain ATS-friendly formatting.',
      },
      {
        question: 'Is there a student version?',
        answer:
          'Yes. The education-first layout places Education before Experience, perfect for recent graduates.',
      },
      {
        question: 'Can I add a skills bar or icons?',
        answer:
          'Skip visual skill bars. Use text bullets for ATS compatibility. Icons do not parse well in most systems.',
      },
      {
        question: 'How should I format dates and locations?',
        answer:
          'Use consistent formats like "Jan 2024–Present" for dates and "London, UK" for locations. Consistency helps ATS parsing.',
      },
      {
        question: 'Will headers or footers break ATS parsing?',
        answer:
          'Keep important content in the main body. Some ATS systems ignore headers/footers. Your name should be in the body, not just the header.',
      },
      {
        question: 'Can I switch fonts?',
        answer: 'Yes. Stick to Arial, Calibri, Times New Roman, Georgia, or Helvetica for best ATS compatibility.',
      },
    ],
  },

  // /resume-keywords (hub)
  keywordsHub: {
    seo: {
      title: 'Resume Keywords Guide — ATS Keywords by Industry',
      description:
        'Complete guide to resume keywords that pass ATS systems. Industry-specific keywords for technology, healthcare, finance, marketing, and more.',
      keywords: [
        'resume keywords',
        'ats keywords',
        'resume keywords by industry',
        'job keywords',
        'resume optimization',
      ],
      canonicalUrl: '/resume-keywords',
    },
    hero: {
      h1: 'Resume Keywords By Industry',
      subtitle: 'Find the right keywords to pass Applicant Tracking Systems and impress hiring managers',
      description:
        'Over 98% of Fortune 500 companies use ATS to filter resumes. Using the right industry-specific keywords is critical to getting your resume seen by human recruiters.',
      primaryCTA: {
        text: 'Build Optimized Resume',
        href: '/templates',
        variant: 'primary',
      },
    },
    features: [
      {
        icon: '🎯',
        title: 'Industry-Specific Keywords',
        description:
          'Curated lists of high-impact keywords for technology, healthcare, finance, marketing, customer service, and more.',
      },
      {
        icon: '🤖',
        title: 'ATS-Optimized',
        description:
          'Keywords that Applicant Tracking Systems scan for. Increase your resume score and ranking.',
      },
      {
        icon: '📝',
        title: 'Real Examples',
        description: 'See how to naturally incorporate keywords into your resume with before/after examples.',
      },
      {
        icon: '📊',
        title: 'Skills & Tools',
        description:
          'Technical skills, software, certifications, and methodologies that recruiters search for.',
      },
      {
        icon: '💼',
        title: 'Job Title Variations',
        description:
          'Alternative titles and role descriptions to match different job postings in your field.',
      },
      {
        icon: '🔄',
        title: 'Regularly Updated',
        description: 'Keywords refreshed quarterly to reflect current industry trends and demands.',
      },
    ],
    faqs: [
      {
        question: 'What are resume keywords?',
        answer:
          'Skills, job titles, tools, certifications, and industry terms that hiring managers and ATS software look for. They often match language directly from job descriptions.',
      },
      {
        question: 'How do I find the right keywords for my resume?',
        answer:
          'Collect 3-5 job ads for your target role. Highlight repeated terms in responsibilities and requirements. Add those phrases naturally to your summary, work history, and skills section.',
      },
      {
        question: 'Is keyword stuffing effective?',
        answer:
          'No. Use keywords naturally in context with your actual experience. ATS systems can detect keyword stuffing, and hiring managers will reject obvious padding.',
      },
      {
        question: 'Where should I place keywords on my resume?',
        answer:
          'Professional summary (3-5 primary keywords), work experience bullets (mirror job ad phrasing), skills section (technical tools and certifications), and job titles (use standard terms).',
      },
      {
        question: 'Should I use acronyms or spell out terms?',
        answer:
          'Use both. Write "Project Management Professional (PMP)" so ATS catches both the acronym and full term. Same for technical terms.',
      },
      {
        question: 'How often should I update my resume keywords?',
        answer:
          'Update for each application to match the specific job posting. Keep a master resume with all possible keywords, then tailor for each role.',
      },
    ],
  },

  // /resume-keywords/customer-service
  customerServiceKeywords: {
    seo: {
      title: 'Customer Service Resume Keywords and Skills [Free List]',
      description:
        'Complete list of customer service resume keywords that ATS systems scan for. Includes soft skills, CRM software, metrics, and real examples.',
      keywords: [
        'customer service resume keywords',
        'customer support keywords',
        'CRM resume skills',
        'help desk resume keywords',
        'customer service skills list',
      ],
      canonicalUrl: '/resume-keywords/customer-service',
    },
    breadcrumbs: [
      { label: 'Home', href: '/' },
      { label: 'Resume Keywords', href: '/resume-keywords' },
      { label: 'Customer Service', href: '/resume-keywords/customer-service' },
    ],
    hero: {
      h1: 'Customer Service Resume Keywords',
      subtitle: 'Essential keywords to pass ATS and showcase your customer service expertise',
      description:
        'Comprehensive list of customer service keywords including soft skills, CRM platforms, metrics (CSAT, NPS, FCR), and industry-specific terms. Includes real resume examples.',
      primaryCTA: {
        text: 'Build Your Resume',
        href: '/templates',
        variant: 'primary',
      },
      secondaryCTA: {
        text: 'See All Keywords',
        href: '/resume-keywords',
        variant: 'outline',
      },
    },
    faqs: [
      {
        question: 'What are the most important customer service keywords?',
        answer:
          'Customer Support, CRM (Salesforce, Zendesk), conflict resolution, CSAT/NPS metrics, active listening, communication skills, problem-solving, and ticketing systems.',
      },
      {
        question: 'Should I list every software I have used?',
        answer:
          'Yes, if relevant. List specific CRM platforms (Salesforce, HubSpot, Zendesk) and tools (Slack, Jira Service Desk) you have used. ATS often filters by specific software names.',
      },
      {
        question: 'How do I incorporate soft skills keywords?',
        answer:
          'Pair soft skills with quantifiable achievements. Instead of just "communication skills," write "utilized active listening and empathy-driven communication to achieve 95% CSAT score."',
      },
      {
        question: 'What customer service metrics should I include?',
        answer:
          'CSAT (Customer Satisfaction Score), NPS (Net Promoter Score), FCR (First Contact Resolution), AHT (Average Handle Time), response time, and customer retention rates.',
      },
      {
        question: 'Are industry-specific keywords important?',
        answer:
          'Yes. Retail customer service uses POS systems, inventory management, and cash handling. Technical support uses remote desktop, troubleshooting, and ITIL. Match keywords to your specific field.',
      },
      {
        question: 'How many keywords should I include?',
        answer:
          'Focus on 15-20 highly relevant keywords naturally distributed throughout your resume. Prioritize keywords that appear in your target job description.',
      },
    ],
  },

  // /best-free-resume-builder-reddit
  redditRecommended: {
    seo: {
      title: 'Best Free Resume Builder — What Reddit Recommends',
      description:
        'Reddit users recommend EasyFreeResume as the best free resume builder. No paywalls, ATS-friendly, actually free. See why thousands trust our builder.',
      keywords: [
        'best free resume builder reddit',
        'reddit resume builder',
        'free resume builder no paywall',
        'reddit recommended resume',
        'actually free resume builder',
      ],
      canonicalUrl: '/best-free-resume-builder-reddit',
    },
    hero: {
      h1: 'Best Free Resume Builder - Reddit Recommended',
      subtitle: 'See why Reddit users consistently recommend EasyFreeResume',
      description:
        'We analyzed top Reddit threads in r/resumes, r/jobs, and r/cscareerquestions. Users value truly free exports, ATS compatibility, no watermarks, and privacy. Here is how we meet every criteria.',
      primaryCTA: {
        text: 'Try It Free',
        href: '/templates',
        variant: 'primary',
      },
    },
    features: [
      {
        icon: '✅',
        title: 'Truly Free Exports',
        description:
          'Reddit #1 complaint: "free" builders that lock downloads. We offer unlimited free PDF and DOCX downloads with zero restrictions.',
      },
      {
        icon: '🤖',
        title: 'ATS-Friendly Templates',
        description:
          'Redditors emphasize ATS compatibility. Our templates use clean formatting, standard fonts, and proper sections that pass automated screening.',
      },
      {
        icon: '🚫',
        title: 'No Watermarks',
        description:
          'Users hate "Created with..." branding on their resumes. Your downloaded resume is 100% yours with no attribution required.',
      },
      {
        icon: '🔒',
        title: 'Privacy First',
        description:
          'Reddit values privacy. No account required, no data storage, no tracking. Your information stays on your device.',
      },
      {
        icon: '⚡',
        title: 'Fast & Simple',
        description:
          'No bloat, no upsell popups. Clean editor that works immediately. Reddit appreciates straightforward tools that respect users.',
      },
      {
        icon: '📱',
        title: 'Open Source Spirit',
        description:
          'While not fully open source, we share our approach transparently and listen to community feedback.',
      },
    ],
    faqs: [
      {
        question: 'What do Reddit users value most in resume builders?',
        answer:
          'Truly free exports, ATS compatibility, no watermarks, privacy/no signup, and no aggressive upselling. Users want straightforward tools without dark patterns.',
      },
      {
        question: 'Are free resume builders safe to use?',
        answer:
          'Use tools with clear privacy policies and local export options. Avoid builders that require accounts with excessive personal data. Read reviews on Reddit for unbiased opinions.',
      },
      {
        question: 'Do recruiters care which resume builder I used?',
        answer:
          'No. Recruiters care about content quality, formatting, and ATS compatibility. The tool used is irrelevant as long as the final resume is professional.',
      },
      {
        question: 'How do I identify fake "free" resume builders?',
        answer:
          'Red flags: requiring credit card for "free trial," adding watermarks on free plans, locking templates behind paywall, charging to remove branding. Actually free means no catches. We offer both guest mode (no signup) and free cloud accounts with auto-save and multi-resume management - all at $0.',
      },
      {
        question: 'Is DOCX or PDF better for ATS?',
        answer:
          'DOCX is safest for ATS. Use PDF only when job posting specifically requests it. Modern ATS handle both, but DOCX parsing is more reliable.',
      },
      {
        question: 'Can I save multiple resume versions for different jobs?',
        answer:
          'Yes. Create a free account to unlock the My Resumes dashboard where you can save up to 5 different resume versions. Perfect for tailoring your resume to different industries or job types.',
      },
      {
        question: 'Can I import my existing resume?',
        answer:
          'Yes. You can export a data file for a resume you have created or worked on before. Upload it to continue editing without starting from scratch.',
      },
    ],
  },
};
