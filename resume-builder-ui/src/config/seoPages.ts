/**
 * Centralized SEO Page Configurations
 * Single source of truth for all SEO landing page content
 * Follows DRY principle - modify content here, not in components
 */

import type { PageConfig } from '../types/seo';

const CURRENT_YEAR = new Date().getFullYear();

export const SEO_PAGES: Record<string, PageConfig> = {
  // /templates (SEO-rich templates landing page)
  templates: {
    seo: {
      title: `Free Resume Templates ${CURRENT_YEAR} | ATS-Friendly Professional Designs`,
      description:
        'Browse free, ATS-optimized resume templates. Modern, professional designs that pass Applicant Tracking Systems. No sign-up required. Download PDF instantly.',
      keywords: [
        'free resume templates',
        'ats resume templates',
        'professional resume templates',
        `resume templates ${CURRENT_YEAR}`,
        'modern resume templates',
        'free resume templates download',
      ],
      canonicalUrl: '/templates',
      hreflangLinks: [
        { hreflang: 'en-US', href: 'https://easyfreeresume.com/templates' },
        { hreflang: 'en-GB', href: 'https://easyfreeresume.com/cv-templates/ats-friendly' },
        { hreflang: 'en-AU', href: 'https://easyfreeresume.com/cv-templates/ats-friendly' },
        { hreflang: 'x-default', href: 'https://easyfreeresume.com/templates' },
      ],
    },
    hero: {
      h1: 'Free Resume Templates',
      subtitle: 'Professional, ATS-friendly designs that get you interviews',
      description:
        'Choose from our collection of free resume templates. Every template is optimized for Applicant Tracking Systems and designed by professionals. No watermarks, no sign-up required.',
    },
    features: [
      {
        icon: '✅',
        title: 'ATS-Optimized',
        description:
          'Every template passes major Applicant Tracking Systems including Workday, Taleo, and iCIMS.',
      },
      {
        icon: '🎨',
        title: 'Professional Designs',
        description:
          'Modern layouts created by professional designers. Clean typography and balanced spacing.',
      },
      {
        icon: '📥',
        title: 'Instant Download',
        description:
          'Download your resume as PDF immediately. No email required, no watermarks added.',
      },
      {
        icon: '🔒',
        title: 'Privacy First',
        description:
          'Your data stays in your browser. We never store your personal information on our servers.',
      },
      {
        icon: '✏️',
        title: 'Easy Customization',
        description:
          'Change fonts, colors, and sections. Add or remove content with our intuitive editor.',
      },
      {
        icon: '💰',
        title: '100% Free',
        description:
          'All templates, all features, forever free. No premium tier, no hidden costs.',
      },
    ],
    faqs: [
      {
        question: 'Are these resume templates really free?',
        answer:
          'Yes, 100% free. All templates are available without payment, sign-up, or hidden fees. You can download unlimited resumes in PDF format at no cost. We sustain our service through ethical advertising, not by locking features behind paywalls.',
      },
      {
        question: 'Will these templates pass ATS systems?',
        answer:
          'Yes. Every template is designed specifically for Applicant Tracking System compatibility. We use standard fonts (Arial, Calibri, Times New Roman), clean single-column layouts, proper heading hierarchy, and standard bullet points. Our templates have been tested with major ATS platforms including Workday, Taleo, iCIMS, and Greenhouse.',
      },
      {
        question: 'Do I need to create an account?',
        answer:
          'No account is required. You can build and download your resume as a guest. Creating a free account (optional) unlocks cloud storage for saving up to 5 resumes and accessing them from any device.',
      },
      {
        question: 'What file formats can I download?',
        answer:
          'You can download your resume as a PDF file, which is universally accepted and preserves formatting across all devices. PDF is recommended for most job applications.',
      },
      {
        question: 'Can I customize the templates?',
        answer:
          'Yes. Our editor allows you to customize fonts, spacing, sections, and content. You can add or remove sections, reorder content, and personalize colors while maintaining ATS compatibility.',
      },
      {
        question: 'How do I choose the right template?',
        answer:
          'Consider your industry and experience level. Modern templates work well for tech and creative roles. Classic layouts suit finance, law, and traditional industries. Minimalist designs are versatile for any field. All our templates are ATS-friendly regardless of style.',
      },
      {
        question: 'Are these templates suitable for all industries?',
        answer:
          'Yes. We offer templates for every industry and career level. Whether you are in tech, healthcare, finance, education, or creative fields, our templates provide professional formatting that hiring managers expect.',
      },
      {
        question: 'Can I use these templates for international job applications?',
        answer:
          'Yes. Our templates follow widely accepted resume formatting standards. For UK applications, we also offer CV-specific templates with appropriate formatting conventions.',
      },
    ],
  },

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
      title: 'Free Resume Builder - No Sign Up Required | Download PDF Instantly',
      description:
        'Build your resume in minutes with zero sign-up. Choose from ATS-friendly templates, fill in your details, download PDF. 100% free, no email, no watermarks ever.',
      keywords: [
        'free resume builder no sign up',
        'instant pdf download',
        'no registration resume builder',
        'anonymous resume builder',
        'instant resume builder',
        'no account resume',
      ],
      canonicalUrl: '/free-resume-builder-no-sign-up',
      hreflangLinks: [
        { hreflang: 'en-US', href: 'https://easyfreeresume.com/free-resume-builder-no-sign-up' },
        { hreflang: 'en-GB', href: 'https://easyfreeresume.com/free-cv-builder-no-sign-up' },
        { hreflang: 'en-AU', href: 'https://easyfreeresume.com/free-cv-builder-no-sign-up' },
        { hreflang: 'x-default', href: 'https://easyfreeresume.com/free-resume-builder-no-sign-up' },
      ],
    },
    hero: {
      h1: 'Build Your Resume in Minutes - No Account Required',
      subtitle: 'Instant PDF download. No sign up, no passwords, no waiting. Start now.',
      description:
        'Create a professional, ATS-friendly resume and download your PDF instantly. No account creation, no email verification, no personal information required. Your resume, ready in minutes.',
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
      {
        question: 'What file formats can I download?',
        answer:
          'You can download your resume as PDF (recommended for job applications) or DOCX (if the employer specifically requests a Word document). Both formats are free and unlimited.',
      },
      {
        question: 'How does this compare to paid resume builders?',
        answer:
          'Most paid builders like Zety, Resume.io, and Resume Genius charge $5-$25/month for PDF downloads. EasyFreeResume offers the same ATS-friendly templates, PDF/DOCX exports, and customization options at zero cost. We are funded by non-intrusive ads instead of subscriptions.',
      },
      {
        question: 'Can I create multiple resumes without an account?',
        answer:
          'Yes. You can create as many resumes as you need in guest mode. Each resume can be downloaded as a YAML data file and re-uploaded later. For managing multiple resumes in one place, create a free account to access the My Resumes Dashboard.',
      },
      {
        question: 'Is my resume data safe without an account?',
        answer:
          'Your resume data is processed entirely in your browser and on our servers only during PDF generation. We do not store your resume content, personal information, or any identifying data. Once your PDF is generated, the data is discarded.',
      },
    ],
  },

  // /free-cv-builder-no-sign-up (UK market)
  cvBuilder: {
    seo: {
      title: 'Free CV Builder (No Sign Up) - UK & International',
      description:
        'Build your CV online for free — no registration, no watermark. ATS-optimised CV templates suitable for UK, EU, and Commonwealth applications. Download PDF instantly.',
      keywords: [
        'free cv builder',
        'cv builder uk',
        'cv builder uk free',
        'cv maker no sign up',
        'uk cv builder',
        'cv template free',
        'cv maker online free uk',
        'curriculum vitae builder',
        'online cv maker free',
      ],
      canonicalUrl: '/free-cv-builder-no-sign-up',
      hreflangLinks: [
        { hreflang: 'en-US', href: 'https://easyfreeresume.com/free-resume-builder-no-sign-up' },
        { hreflang: 'en-GB', href: 'https://easyfreeresume.com/free-cv-builder-no-sign-up' },
        { hreflang: 'en-AU', href: 'https://easyfreeresume.com/free-cv-builder-no-sign-up' },
        { hreflang: 'x-default', href: 'https://easyfreeresume.com/free-resume-builder-no-sign-up' },
      ],
      ogLocale: 'en_GB',
    },
    hero: {
      h1: 'Free CV Builder - No Sign Up Required',
      subtitle: 'Build your CV online for free. Perfect for UK, Europe, and international job applications.',
      description:
        'Create a professional, ATS-friendly CV and download instantly. No account creation, no email verification, no personal information required. Your CV, ready in minutes.',
      primaryCTA: {
        text: 'Build CV Now',
        href: '/templates',
        variant: 'primary',
      },
    },
    steps: [
      {
        number: 1,
        title: 'Choose a template',
        description: 'Select from our ATS-friendly, professional CV templates. All are 100% free.',
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
          'Export your CV as PDF or DOCX. No email verification, no watermarks, no sign up needed.',
      },
    ],
    features: [
      {
        icon: '🇬🇧',
        title: 'UK-Friendly Format',
        description: 'Templates designed with UK employer expectations in mind. Personal profile section included.',
      },
      {
        icon: '⚡',
        title: 'Instant Access',
        description: 'Start building immediately. The editor opens in seconds with no barriers.',
      },
      {
        icon: '🔒',
        title: 'Privacy First',
        description: 'Your CV stays in your browser. We do not store your personal information.',
      },
      {
        icon: '📥',
        title: 'Free Downloads',
        description: 'Export to PDF or DOCX for free. No credit card, no premium tier required.',
      },
      {
        icon: '✅',
        title: 'ATS-Compatible',
        description: 'Clean formatting that passes Applicant Tracking Systems used by UK employers.',
      },
      {
        icon: '✨',
        title: 'No Watermark',
        description: 'Your CV is yours. No branding or watermarks on your downloads.',
      },
    ],
    faqs: [
      {
        question: 'Is this CV builder suitable for UK jobs?',
        answer:
          'Yes. Our templates follow UK CV conventions including a personal profile section at the top, reverse chronological order, and professional formatting that UK employers expect.',
      },
      {
        question: 'What is the difference between a CV and a resume?',
        answer:
          'In the UK, Europe, and many other countries, "CV" (curriculum vitae) is the standard term for a job application document. In the US and Canada, "resume" is more common. Our templates work for both—the format is identical.',
      },
      {
        question: 'Can I download my CV without signing up?',
        answer:
          'Yes. You can create, customize, and download your complete CV in PDF or DOCX format without ever creating an account.',
      },
      {
        question: 'How long should a UK CV be?',
        answer:
          'A standard UK job application CV should be 2 pages maximum. Our templates help you keep content concise while including all essential sections.',
      },
      {
        question: 'Should I include a photo on my UK CV?',
        answer:
          'Generally, no. UK CVs typically do not include photos unless specifically requested by the employer. This differs from some European countries.',
      },
      {
        question: 'Are the CV templates ATS-friendly?',
        answer:
          'Yes. All templates use clean formatting, standard fonts, and clear section headings that Applicant Tracking Systems can parse correctly.',
      },
    ],
  },

  // /cv-templates/ats-friendly (UK CV templates hub)
  cvTemplatesHub: {
    seo: {
      title: 'Free ATS-Friendly CV Templates - UK & International',
      description:
        'Download professional, ATS-optimised CV templates. Free PDF and DOCX formats. Clean layouts designed for UK, European, and Commonwealth job applications.',
      keywords: [
        'ats friendly cv templates',
        'free cv templates uk',
        'ats cv format',
        'professional cv template',
        'cv templates download',
        'uk cv template free',
      ],
      canonicalUrl: '/cv-templates/ats-friendly',
      hreflangLinks: [
        { hreflang: 'en-US', href: 'https://easyfreeresume.com/templates' },
        { hreflang: 'en-GB', href: 'https://easyfreeresume.com/cv-templates/ats-friendly' },
        { hreflang: 'en-AU', href: 'https://easyfreeresume.com/cv-templates/ats-friendly' },
        { hreflang: 'x-default', href: 'https://easyfreeresume.com/templates' },
      ],
      ogLocale: 'en_GB',
    },
    hero: {
      h1: 'Free ATS-Friendly CV Templates',
      subtitle: 'Professional CV templates that pass Applicant Tracking Systems.',
      description:
        'Download CV templates designed for UK and international job applications. Clean formatting, standard sections, and ATS-compatible layouts—all 100% free.',
      primaryCTA: {
        text: 'Browse Templates',
        href: '/templates',
        variant: 'primary',
      },
    },
    features: [
      {
        icon: '🇬🇧',
        title: 'UK Format',
        description: 'Templates follow UK CV conventions with personal profile section and proper formatting.',
      },
      {
        icon: '✅',
        title: 'ATS-Optimized',
        description: 'Clean layouts that Applicant Tracking Systems can parse correctly.',
      },
      {
        icon: '📄',
        title: 'PDF & DOCX',
        description: 'Download in your preferred format. Edit in Word or use as-is.',
      },
      {
        icon: '💰',
        title: '100% Free',
        description: 'No premium tier, no watermarks, no hidden costs.',
      },
    ],
    faqs: [
      {
        question: 'What makes a CV template ATS-friendly?',
        answer:
          'ATS-friendly CV templates use standard fonts, clear section headings (Experience, Education, Skills), simple formatting without complex tables or graphics, and standard bullet points. Our templates are designed to pass all major ATS systems.',
      },
      {
        question: 'Are these CV templates suitable for UK applications?',
        answer:
          'Yes. Our templates follow UK CV conventions including a personal profile section at the top, reverse chronological work history, and the 2-page standard format that UK employers expect.',
      },
      {
        question: 'Can I customize these CV templates?',
        answer:
          'Yes. Use our free editor to add your information, rearrange sections, and customize fonts and spacing. Download the finished CV when ready.',
      },
      {
        question: 'What file formats are available?',
        answer:
          'You can download your CV as PDF (recommended for applications) or DOCX (for further editing in Microsoft Word).',
      },
      {
        question: 'Do I need to create an account?',
        answer:
          'No. You can browse templates, customize your CV, and download—all without creating an account or providing any personal information.',
      },
    ],
  },

  // /ats-resume-templates (hub)
  templatesHub: {
    seo: {
      title: 'Free ATS Resume Templates (2026) — Tested on Workday, Taleo & More',
      description:
        'Download free ATS-friendly resume templates tested on Workday, Taleo, iCIMS, and Greenhouse. Clean layouts that pass every ATS. No sign-up required.',
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
      {
        question: 'How do I know if my resume is ATS-friendly?',
        answer:
          'Use our free ATS keyword scanner to check your resume against a job description. It shows your keyword match rate and identifies missing terms. You can also copy your resume text into a plain text editor — if the content is still readable and organized, the ATS can parse it.',
      },
      {
        question: 'Are free ATS templates as good as paid ones?',
        answer:
          'Yes. ATS compatibility is about structure and formatting, not design complexity. A clean, free template with standard fonts and clear section headers will perform identically to a paid template in ATS parsing. Paid templates mainly offer more visual design options, which ATS systems ignore anyway.',
      },
      {
        question: 'What ATS systems do employers use most in 2026?',
        answer:
          'The most common ATS platforms are Workday, iCIMS, Greenhouse, Lever, Taleo (Oracle), BambooHR, and JazzHR. Our templates are tested against all of these. If a job application uses any of these systems, our templates will parse correctly.',
      },
      {
        question: 'Should I use the same template for every application?',
        answer:
          'Yes, use the same ATS-friendly template structure, but tailor the content for each application. Change your keywords, reorder skills, and adjust your summary to match each job description. The template formatting stays consistent while the content changes.',
      },
    ],
  },

  // /templates/ats-friendly
  atsFriendly: {
    seo: {
      title: `Free ATS-Friendly Resume Template (${CURRENT_YEAR}) - Edit & Download PDF`,
      description:
        'ATS-friendly resume template you can edit online for free. No sign-up needed. Passes Workday, Taleo & Greenhouse systems. Instant PDF download.',
      keywords: [
        'ats friendly resume template',
        'free ats template download',
        'applicant tracking system template',
        'ats resume format',
        'professional resume template',
      ],
      canonicalUrl: '/templates/ats-friendly',
      hreflangLinks: [
        { hreflang: 'en-US', href: 'https://easyfreeresume.com/templates/ats-friendly' },
        { hreflang: 'en-GB', href: 'https://easyfreeresume.com/cv-templates' },
        { hreflang: 'en-AU', href: 'https://easyfreeresume.com/cv-templates' },
        { hreflang: 'x-default', href: 'https://easyfreeresume.com/templates/ats-friendly' },
      ],
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

  // /jobs (Adzuna-powered job search)
  jobs: {
    seo: {
      title: `Job Search | Find Jobs That Match Your Resume ${CURRENT_YEAR} | EasyFreeResume`,
      description:
        'Search thousands of job openings across 19 countries with salary information. Find jobs that match your resume, compare salaries, and apply directly. Free job search powered by Adzuna.',
      keywords: [
        'job search',
        'find jobs',
        'job openings near me',
        'salary information',
        'apply for jobs online',
        'resume job search',
      ],
      canonicalUrl: '/jobs',
    },
    breadcrumbs: [
      { label: 'Home', href: '/' },
      { label: 'Job Search', href: '/jobs' },
    ],
    hero: {
      h1: 'Find Jobs That Match Your Resume',
      subtitle: 'Search thousands of open positions with salary info across 19 countries',
      description:
        'Use our free job search to find openings that match your skills and experience. Get salary information, filter by location, and apply directly to employers.',
    },
    faqs: [
      {
        question: 'How does the job search work?',
        answer:
          'Our job search is powered by Adzuna, which aggregates listings from thousands of job boards and company websites. Enter a job title and optional location to find matching openings with salary information. Click any listing to apply directly on the employer\'s site.',
      },
      {
        question: 'Is the job search free?',
        answer:
          'Yes, completely free. You can search for jobs, view salary information, and apply to positions without creating an account or paying anything. There are no limits on searches.',
      },
      {
        question: 'Which countries are supported?',
        answer:
          'We support job search across 19 countries including the United States, United Kingdom, Canada, Australia, India, Germany, France, Netherlands, Italy, Spain, Brazil, Mexico, Poland, New Zealand, Singapore, South Africa, Austria, Belgium, and Switzerland.',
      },
      {
        question: 'How accurate is the salary information?',
        answer:
          'Salary data comes directly from job postings aggregated by Adzuna. Some listings include employer-provided salary ranges, while others show estimated ranges based on similar roles. Use salary figures as a general guide and verify during the application process.',
      },
      {
        question: 'Can I search using my resume information?',
        answer:
          'Yes! When you build a resume in our editor, the job match badge automatically searches for relevant openings based on your job title and location. Click it to see matching jobs pre-filled with your resume details.',
      },
      {
        question: 'How can I improve my chances of getting hired?',
        answer:
          'Start with a strong, ATS-friendly resume using our free resume builder. Use industry-specific keywords from our Resume Keywords guide. Tailor your resume for each application and apply to jobs where your skills match the requirements.',
      },
    ],
  },

  // /resume-keywords (hub)
  keywordsHub: {
    seo: {
      title: 'Resume Keywords by Job Title & Industry (2026) — Complete ATS Guide',
      description:
        'Find the right resume keywords for your job title: 17+ industries, 50+ roles. ATS-optimized keyword lists with copy-paste examples. Updated for 2026.',
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
      title: '150+ Customer Service Resume Keywords (2026) — ATS-Optimized',
      description:
        'Complete customer service resume keywords: CRM tools, conflict resolution, CSAT metrics. Organized by role — call center, retail, tech support, healthcare. Copy-paste ready.',
      keywords: [
        'customer service resume keywords',
        'customer support keywords',
        'CRM resume skills',
        'help desk resume keywords',
        'customer service skills list',
        'resume keywords for customer service',
        'personal keywords for customer service',
        'good customer service keywords',
        'customer service skills for resume',
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
      title: `Best Free Resume Builder ${CURRENT_YEAR} (Reddit-Tested, Actually Free)`,
      description:
        `What r/resumes and r/jobs actually recommend in ${CURRENT_YEAR}. We analyzed 100+ Reddit threads. No paywalls, no watermarks, no sign-up. Here's what passed the test.`,
      keywords: [
        'best free resume builder reddit',
        'reddit resume builder',
        'free resume builder no paywall',
        'reddit recommended resume',
        'actually free resume builder',
        `best free resume builder ${CURRENT_YEAR}`,
      ],
      canonicalUrl: '/best-free-resume-builder-reddit',
    },
    hero: {
      h1: `Best Free Resume Builder ${CURRENT_YEAR} - Reddit Recommended`,
      subtitle: `See why Reddit users consistently recommend EasyFreeResume in ${CURRENT_YEAR}`,
      description:
        `We analyzed top Reddit threads in r/resumes, r/jobs, and r/cscareerquestions (updated Feb ${CURRENT_YEAR}). Users value truly free exports, ATS compatibility, no watermarks, and privacy. Here is how we meet every criteria.`,
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
      {
        question: 'What subreddits discuss resume builders?',
        answer:
          'The most active subreddits for resume advice are r/resumes (resume reviews and feedback), r/jobs (general job search), r/cscareerquestions (tech careers), and r/careerguidance (career transitions). Each community has strong opinions on which tools are genuinely free.',
      },
      {
        question: 'Do I need a different resume for each job application?',
        answer:
          'Yes, tailoring your resume for each application significantly improves your chances. Focus on matching keywords from the job description. Use our free ATS keyword scanner to check your match rate before submitting.',
      },
    ],
  },

  // /templates/modern-resume-templates
  modernTemplates: {
    seo: {
      title: `Modern Resume Templates ${CURRENT_YEAR} | Free Contemporary Designs`,
      description:
        'Download free modern resume templates with clean, contemporary designs. Perfect for tech, startups, and creative industries. ATS-friendly formats.',
      keywords: [
        'modern resume template',
        'contemporary resume design',
        'sleek resume template',
        'tech resume template',
        'startup resume template',
        'modern cv template',
      ],
      canonicalUrl: '/templates/modern-resume-templates',
    },
    hero: {
      h1: 'Modern Resume Templates',
      subtitle: 'Contemporary designs for forward-thinking professionals',
      description:
        'Stand out with our modern resume templates featuring clean lines, strategic white space, and contemporary typography. Perfect for tech, creative, and startup roles.',
    },
    features: [
      {
        icon: '✨',
        title: 'Contemporary Aesthetics',
        description: 'Clean, minimalist designs with modern typography that reflect current design trends.',
      },
      {
        icon: '💼',
        title: 'Tech Industry Ready',
        description: 'Layouts optimized for software engineers, product managers, and startup professionals.',
      },
      {
        icon: '✅',
        title: 'ATS Compatible',
        description: 'Modern look without sacrificing ATS compatibility. Your resume gets seen by humans.',
      },
      {
        icon: '📱',
        title: 'Digital-First Design',
        description: 'Optimized for both print and digital viewing. Looks great on any screen.',
      },
    ],
    faqs: [
      {
        question: 'What makes a resume template "modern"?',
        answer:
          'Modern resume templates feature clean, minimalist designs with contemporary typography, strategic use of white space, and subtle color accents. They avoid cluttered layouts and outdated decorative elements.',
      },
      {
        question: 'Are modern templates suitable for conservative industries?',
        answer:
          'While modern templates work great for tech, creative, and startup roles, we recommend classic templates for very conservative industries like law, finance, or government. Always consider your target employer.',
      },
      {
        question: 'Will modern templates pass ATS screening?',
        answer:
          'Yes. Our modern templates are designed with ATS compatibility in mind. They use standard fonts, proper heading hierarchy, and clean formatting that ATS systems can easily parse.',
      },
    ],
  },

  // /templates/minimalist-resume-templates
  minimalistTemplates: {
    seo: {
      title: `Minimalist Resume Templates ${CURRENT_YEAR} | Clean & Simple Designs`,
      description:
        'Free minimalist resume templates with clean, distraction-free layouts. Let your content shine with elegant simplicity. ATS-optimized for all industries.',
      keywords: [
        'minimalist resume template',
        'simple resume template',
        'clean resume design',
        'elegant resume template',
        'basic resume template',
        'no frills resume',
      ],
      canonicalUrl: '/templates/minimalist-resume-templates',
    },
    hero: {
      h1: 'Minimalist Resume Templates',
      subtitle: 'Clean simplicity that lets your qualifications shine',
      description:
        'Sometimes less is more. Our minimalist templates strip away distractions and put the focus where it belongs: on your experience, skills, and achievements.',
    },
    features: [
      {
        icon: '🎯',
        title: 'Content-Focused',
        description: 'No distracting graphics or colors. Your qualifications take center stage.',
      },
      {
        icon: '📄',
        title: 'Timeless Design',
        description: 'Clean layouts that never go out of style. Appropriate for any industry.',
      },
      {
        icon: '⚡',
        title: 'Easy to Read',
        description: 'Clear hierarchy and generous spacing make your resume scannable in seconds.',
      },
      {
        icon: '✅',
        title: 'Maximum ATS Score',
        description: 'Simple formatting means perfect ATS compatibility every time.',
      },
    ],
    faqs: [
      {
        question: 'Why choose a minimalist resume template?',
        answer:
          'Minimalist templates ensure recruiters focus on your content, not design elements. They scan quickly, work universally across industries, and have the highest ATS compatibility rates.',
      },
      {
        question: 'Are minimalist resumes too plain?',
        answer:
          'Not at all. Minimalist design is a deliberate choice that signals professionalism and confidence. Many top companies and executives prefer clean, distraction-free resumes that get straight to the point.',
      },
      {
        question: 'Can I add some color to a minimalist template?',
        answer:
          'Yes. Our minimalist templates allow subtle color customization. A single accent color for headers or your name can add personality while maintaining the clean aesthetic.',
      },
    ],
  },

  // /templates/resume-templates-for-students
  studentTemplates: {
    seo: {
      title: `Student Resume Templates ${CURRENT_YEAR} | Free Templates for First-Time Job Seekers`,
      description:
        'Free resume templates designed for students and recent graduates. Highlight education, internships, and projects when you have limited work experience.',
      keywords: [
        'student resume template',
        'college student resume',
        'entry level resume template',
        'new graduate resume',
        'first job resume template',
        'resume for students with no experience',
      ],
      canonicalUrl: '/templates/resume-templates-for-students',
    },
    hero: {
      h1: 'Student Resume Templates',
      subtitle: 'Designed for students, interns, and new graduates',
      description:
        'New to the job market? Our student-focused templates emphasize education, skills, projects, and extracurriculars to help you compete even without extensive work experience.',
    },
    features: [
      {
        icon: '🎓',
        title: 'Education First',
        description: 'Templates that put your degree, GPA, and relevant coursework front and center.',
      },
      {
        icon: '💡',
        title: 'Project Showcase',
        description: 'Dedicated sections for academic projects, capstones, and portfolio work.',
      },
      {
        icon: '🏆',
        title: 'Activities & Leadership',
        description: 'Highlight clubs, organizations, volunteer work, and leadership roles.',
      },
      {
        icon: '📈',
        title: 'Skills Emphasis',
        description: 'Prominent skills section to showcase technical and soft skills.',
      },
    ],
    faqs: [
      {
        question: 'What should a student resume include?',
        answer:
          'Focus on education (degree, GPA if 3.0+, relevant coursework), skills (technical and soft), projects, internships, campus activities, volunteer work, and any part-time jobs that show relevant skills.',
      },
      {
        question: 'How do I write a resume with no work experience?',
        answer:
          'Focus on transferable skills from coursework, projects, volunteer work, and activities. Quantify achievements where possible (e.g., "Led 15-member club," "Raised $5,000 for charity"). Check our blog for detailed guides.',
      },
      {
        question: 'Should students include their GPA?',
        answer:
          'Include your GPA if it is 3.0 or higher. You can also include your major GPA if it is significantly higher than your cumulative GPA. After your first full-time job, GPA becomes less relevant.',
      },
      {
        question: 'How long should a student resume be?',
        answer:
          'One page is standard and expected for students and new graduates. Focus on quality over quantity—include only the most relevant and impactful information.',
      },
    ],
  },

  // /cv-templates (Main CV Templates page for UK/EU/AU/NZ market)
  cvTemplates: {
    seo: {
      title: `Free CV Templates ${CURRENT_YEAR} | Professional UK & International Designs`,
      description:
        'Browse free, professional CV templates for UK, EU, and Commonwealth applications. ATS-optimised, no sign-up required. Download PDF instantly.',
      keywords: [
        'cv templates',
        'free cv templates',
        'uk cv templates',
        'cv template uk free',
        'professional cv template',
        'cv templates download',
        'curriculum vitae templates',
        `cv templates ${CURRENT_YEAR}`,
        'ats cv templates',
        'cv template free download uk',
      ],
      canonicalUrl: '/cv-templates',
      hreflangLinks: [
        { hreflang: 'en-US', href: 'https://easyfreeresume.com/templates/ats-friendly' },
        { hreflang: 'en-GB', href: 'https://easyfreeresume.com/cv-templates' },
        { hreflang: 'en-AU', href: 'https://easyfreeresume.com/cv-templates' },
        { hreflang: 'x-default', href: 'https://easyfreeresume.com/templates/ats-friendly' },
      ],
      ogLocale: 'en_GB',
    },
    hero: {
      h1: 'Free CV Templates',
      subtitle: 'Professional templates for UK, Europe, and international applications',
      description:
        'Choose from our collection of free CV templates. Every template follows UK and international CV conventions. ATS-optimised, no watermarks, no sign-up required.',
    },
    features: [
      {
        icon: '🇬🇧',
        title: 'UK CV Format',
        description:
          'Templates designed for UK employer expectations. Personal profile section, 2-page format, and UK date conventions.',
      },
      {
        icon: '✅',
        title: 'ATS-Optimised',
        description:
          'Every template passes Applicant Tracking Systems used by UK and international employers including CIPHR, PageUp, and Workday.',
      },
      {
        icon: '📄',
        title: '2-Page Standard',
        description:
          'Proper UK CV length. Our templates help you present comprehensive experience within the standard 2-page format.',
      },
      {
        icon: '🔒',
        title: 'Privacy First',
        description:
          'Your CV stays in your browser. No data storage, no tracking. Download directly without creating an account.',
      },
      {
        icon: '📥',
        title: 'Instant PDF Download',
        description:
          'Download your CV as PDF immediately. No email required, no watermarks, completely free.',
      },
      {
        icon: '💰',
        title: '100% Free',
        description:
          'All templates, all features, forever free. No premium tier, no hidden costs. Build unlimited CVs.',
      },
    ],
    faqs: [
      {
        question: 'What is the difference between a CV and a resume?',
        answer:
          'In the UK, Europe, Australia, and New Zealand, "CV" (curriculum vitae) is the standard term for a job application document. In the US and Canada, "resume" is more common. The document format is essentially the same—our templates work for both. Use whichever term is standard in your target country.',
      },
      {
        question: 'How long should a UK CV be?',
        answer:
          'A standard UK CV should be 2 pages maximum. This differs from academic CVs (which can be longer) and US resumes (typically 1 page). Our templates are designed to help you present your experience comprehensively within the 2-page standard.',
      },
      {
        question: 'Should I include a photo on my UK CV?',
        answer:
          'Generally, no. UK CVs typically do not include photos unless specifically requested by the employer. This differs from some European countries like Germany or France where photos are more common. Always follow the conventions of your target country.',
      },
      {
        question: 'What personal information should I include on a UK CV?',
        answer:
          'Include: your name, phone number, email, and general location (city/region). Do not include: date of birth, marital status, national insurance number, or nationality. UK equality laws discourage this information to prevent discrimination.',
      },
      {
        question: 'What is a personal profile section?',
        answer:
          'A personal profile (also called a personal statement) is a 3-4 line summary at the top of your CV. It briefly describes your experience, key skills, and career objectives. It is standard on UK CVs and replaces the "objective statement" used in US resumes.',
      },
      {
        question: 'Are these CV templates free to download?',
        answer:
          'Yes, 100% free. All templates are available without payment, sign-up, or hidden fees. You can download unlimited CVs in PDF format at no cost. We sustain our service through ethical advertising, not by locking features behind paywalls.',
      },
      {
        question: 'Will these templates work for international applications?',
        answer:
          'Yes. Our templates follow widely accepted professional standards suitable for UK, Europe, Australia, New Zealand, and most international applications. For US applications, we recommend our resume-focused templates which follow American conventions.',
      },
      {
        question: 'What date format should I use on a UK CV?',
        answer:
          'Use DD/MM/YYYY or written format (e.g., "January 2024 - Present" or "Jan 2024 - Present"). Be consistent throughout your CV. Our editor helps you maintain consistent date formatting.',
      },
    ],
  },

  // /free-resume-builder-download
  freeDownload: {
    seo: {
      title: `Free Resume Builder & Download | No Sign Up, No Payment | EasyFreeResume`,
      description:
        'Build your resume online and download as PDF or DOCX for free. No sign-up, no payment, no watermarks. ATS-friendly templates ready in minutes.',
      keywords: [
        'free resume builder download',
        'free resume download',
        'resume builder free download',
        'free resume builder pdf',
        'download resume free',
        'free resume maker download',
        `free resume builder ${CURRENT_YEAR}`,
      ],
      canonicalUrl: '/free-resume-builder-download',
    },
    hero: {
      h1: 'Free Resume Builder — Download PDF & DOCX Instantly',
      eyebrow: 'Free Download',
      subtitle: 'Build and download your professional resume in minutes',
      description:
        'Create an ATS-friendly resume with our free builder and download it instantly as PDF or DOCX. No payment, no sign-up, no watermarks — ever.',
      primaryCTA: { text: 'Build My Free Resume', href: '/templates' },
      secondaryCTA: { text: 'See Templates', href: '/ats-resume-templates', variant: 'outline' },
    },
    steps: [
      { number: 1, title: 'Pick a Template', description: 'Choose from our collection of ATS-optimized, professional resume templates. Every design is free.' },
      { number: 2, title: 'Add Your Content', description: 'Fill in your experience, skills, and education using our intuitive editor. AI suggestions help you write better.' },
      { number: 3, title: 'Download Instantly', description: 'Download your finished resume as PDF or DOCX. No payment, no email — it is yours immediately.' },
    ],
    features: [
      { icon: '💰', title: 'No Payment Required', description: 'Download your resume completely free. No credit card, no hidden fees, no trial periods.' },
      { icon: '📧', title: 'No Sign-Up Needed', description: 'Start building immediately without creating an account, verifying email, or filling out any forms.' },
      { icon: '📄', title: 'PDF & DOCX Formats', description: 'Download in PDF for applications or DOCX for further editing in Word or Google Docs.' },
      { icon: '🚫', title: 'No Watermarks', description: 'Your download is clean and professional. No branding, no watermarks, no "made with" badges.' },
      { icon: '✅', title: 'ATS-Friendly Templates', description: 'Every template passes Applicant Tracking Systems used by Fortune 500 companies.' },
      { icon: '♾️', title: 'Unlimited Downloads', description: 'Download as many resumes as you need. Create different versions for different jobs — all free.' },
    ],
    faqs: [
      { question: 'Is this resume builder really free to download?', answer: 'Yes, 100% free. You can build and download your resume as PDF or DOCX without paying anything. There is no trial period, no premium tier, and no credit card required. We sustain our service through ethical advertising, not by charging users.' },
      { question: 'Do I need to create an account to download my resume?', answer: 'No. You can build and download your resume without creating an account, providing an email, or signing up. Just pick a template, add your content, and download. Your data stays in your browser.' },
      { question: 'What file formats can I download my resume in?', answer: 'You can download your resume as PDF (recommended for job applications) or DOCX (for editing in Microsoft Word or Google Docs). Both formats are free with no watermarks.' },
      { question: 'Will my downloaded resume have any watermarks or branding?', answer: 'No. Your downloaded resume is completely clean — no watermarks, no "made with EasyFreeResume" badges, no branding of any kind. It looks like a professionally designed resume, because it is one.' },
      { question: 'Are the resume templates ATS-friendly?', answer: 'Yes. Every template is designed to pass Applicant Tracking Systems (ATS) used by companies like Amazon, Google, and major corporations. They use proper heading hierarchy, standard fonts, and clean formatting that ATS software can parse correctly.' },
      { question: 'How many resumes can I download for free?', answer: 'Unlimited. You can create and download as many resumes as you need. Many job seekers create multiple versions tailored to different positions — all completely free.' },
    ],
  },

  // /free-resume-builder-no-payment
  noPayment: {
    seo: {
      title: `Free Resume Builder — No Payment, No Sign Up, No Catch | EasyFreeResume`,
      description:
        '100% free resume builder with no payment, no sign-up, and no hidden charges. See why other builders charge and how EasyFreeResume stays free.',
      keywords: [
        'free resume builder no payment',
        'resume builder no charge',
        'free resume builder no credit card',
        'truly free resume builder',
        'free resume builder no hidden fees',
        'free resume builder no catch',
        `free resume builder ${CURRENT_YEAR}`,
      ],
      canonicalUrl: '/free-resume-builder-no-payment',
    },
    hero: {
      h1: '100% Free Resume Builder — No Payment, No Charge, No Catch',
      eyebrow: 'Truly Free',
      subtitle: 'What you see is what you get — a professional resume builder with zero cost',
      description:
        'Most "free" resume builders charge $2-$25 to download your resume. EasyFreeResume is different. Build, customize, and download your resume without ever entering payment information.',
      primaryCTA: { text: 'Build My Free Resume', href: '/templates' },
      secondaryCTA: { text: 'How We Stay Free', href: '/blog/how-why-easyfreeresume-completely-free', variant: 'outline' },
    },
    steps: [
      { number: 1, title: 'Choose a Template', description: 'Browse our full library of ATS-optimized templates. Every single template is available for free — no "premium" locks.' },
      { number: 2, title: 'Build Your Resume', description: 'Use our editor to add your experience, skills, and education. No feature is hidden behind a paywall.' },
      { number: 3, title: 'Download for Free', description: 'Download your polished resume as PDF. No surprise charges, no credit card pop-ups, no "upgrade to download" prompts.' },
    ],
    features: [
      { icon: '💳', title: 'No Credit Card Needed', description: 'We never ask for payment information. No credit card fields, no checkout pages, no billing forms.' },
      { icon: '🔓', title: 'All Features Unlocked', description: 'Every template, every format, every feature is available to everyone. There is no premium tier.' },
      { icon: '📥', title: 'Free Downloads Forever', description: 'Download unlimited resumes in PDF and DOCX. The download button works — no paywall surprise.' },
      { icon: '🚫', title: 'No "Freemium" Trap', description: 'Unlike Zety, Resume.io, and others, we will never let you build a resume then charge to download it.' },
      { icon: '🔒', title: 'No Data Monetization', description: 'We do not sell your personal data. Your resume content stays in your browser and is never stored on our servers.' },
      { icon: '📢', title: 'Ad-Supported Model', description: 'We keep the service free through non-intrusive advertising. You get a professional resume, we keep the lights on.' },
    ],
    comparison: [
      {
        name: 'EasyFreeResume',
        highlight: true,
        features: {
          'Truly Free': true,
          'No Sign-Up': true,
          'No Credit Card': true,
          'PDF Download': true,
          'All Templates Free': true,
          'No Watermarks': true,
          'ATS-Optimized': true,
        },
      },
      {
        name: 'Typical "Free" Builders',
        features: {
          'Truly Free': false,
          'No Sign-Up': false,
          'No Credit Card': false,
          'PDF Download': '$2-$25',
          'All Templates Free': false,
          'No Watermarks': false,
          'ATS-Optimized': 'Premium only',
        },
      },
    ],
    faqs: [
      { question: 'Why do most resume builders charge for downloads?', answer: 'Most resume builders use a "freemium" model: they let you build a resume for free, then charge $2-$25 to download it as PDF. They rely on the sunk-cost fallacy — after spending 30 minutes building your resume, you are more likely to pay. EasyFreeResume does not use this tactic.' },
      { question: 'How does EasyFreeResume stay free without charging?', answer: 'We use non-intrusive advertising to sustain the service. This lets us offer every feature, every template, and unlimited downloads for free. We believe a resume builder should not be a barrier to getting a job.' },
      { question: 'Is there a catch or hidden cost?', answer: 'No catch. No hidden cost. No premium tier. No trial period. No credit card. You build a resume, you download it, and you use it to get a job. That is it.' },
      { question: 'Will I be charged later or auto-subscribed?', answer: 'No. We never collect payment information, so there is nothing to charge. There are no subscriptions, no auto-renewals, and no surprise fees. Once you download your resume, it is yours forever.' },
      { question: 'How does this compare to Zety, Resume.io, and Resume Genius?', answer: 'Zety charges $2.70-$24.70 to download. Resume.io charges $2.95/week. Resume Genius charges $2.95-$7.95/month. EasyFreeResume charges nothing. All templates, all formats, unlimited downloads — genuinely free.' },
      { question: 'Do free resumes look less professional than paid ones?', answer: 'No. Our templates are designed by professionals and are ATS-optimized. The quality matches or exceeds paid alternatives. The "free" does not mean "lesser" — it means we chose a different business model.' },
    ],
  },

  // /ai-resume-builder-free
  aiResumeBuilder: {
    seo: {
      title: `Free AI Resume Builder | Use ChatGPT, Claude & Gemini | EasyFreeResume`,
      description:
        'Build a better resume with AI. Use ChatGPT, Claude, and Gemini with our free resume builder. AI-powered suggestions, prompts, and optimization tips.',
      keywords: [
        'ai resume builder free',
        'ai resume builder',
        'chatgpt resume builder',
        'free ai resume maker',
        'ai resume writer',
        'ai powered resume builder',
        `ai resume builder ${CURRENT_YEAR}`,
      ],
      canonicalUrl: '/ai-resume-builder-free',
    },
    hero: {
      h1: 'Free AI Resume Builder — Powered by ChatGPT, Claude & Gemini',
      eyebrow: 'AI-Powered',
      subtitle: 'Combine AI intelligence with professional templates for a standout resume',
      description:
        'Use the most powerful AI models — ChatGPT, Claude, and Gemini — alongside our free resume builder. Get AI-written bullet points, keyword optimization, and professional formatting without paying a cent.',
      primaryCTA: { text: 'Build My AI Resume', href: '/templates' },
      secondaryCTA: { text: 'See AI Prompts', href: '/blog/chatgpt-resume-prompts', variant: 'outline' },
    },
    steps: [
      { number: 1, title: 'Choose Your AI', description: 'Pick from ChatGPT, Claude, or Gemini. Each has unique strengths for different resume tasks — or use all three.' },
      { number: 2, title: 'Generate Content', description: 'Use our proven prompts to generate bullet points, summaries, and skills sections tailored to your target role.' },
      { number: 3, title: 'Build & Download', description: 'Paste AI-generated content into our free resume builder, pick a template, and download your polished resume instantly.' },
    ],
    features: [
      { icon: '🤖', title: 'ChatGPT Integration', description: 'Use ChatGPT to write compelling bullet points, professional summaries, and tailored cover letters for any role.' },
      { icon: '🧠', title: 'Claude for Analysis', description: 'Claude excels at analyzing job descriptions, extracting keywords, and matching your experience to requirements.' },
      { icon: '✨', title: 'Gemini for Research', description: 'Google Gemini can research industry-specific keywords and optimize your resume for specific companies and roles.' },
      { icon: '🎯', title: 'ATS Keyword Optimization', description: 'AI helps identify and incorporate the exact keywords ATS systems scan for in your target industry.' },
      { icon: '💰', title: 'Completely Free', description: 'Our resume builder is free. ChatGPT, Claude, and Gemini all offer free tiers. Professional resume building at zero cost.' },
      { icon: '📄', title: 'Professional Templates', description: 'AI-generated content goes into our ATS-optimized templates. The combination produces resumes that get interviews.' },
    ],
    faqs: [
      { question: 'What is an AI resume builder?', answer: 'An AI resume builder combines artificial intelligence (like ChatGPT, Claude, or Gemini) with a resume formatting tool. The AI generates and optimizes your content — bullet points, summaries, skills — while the builder provides professional templates and formatting. EasyFreeResume provides the builder; you bring the AI of your choice.' },
      { question: 'Which AI is best for writing a resume?', answer: 'Each AI has strengths. ChatGPT (GPT-4) is excellent for writing compelling bullet points and professional summaries. Claude excels at analyzing job descriptions and extracting keywords. Gemini is strong at researching industry trends and company-specific optimization. For the best results, use multiple AIs for different tasks.' },
      { question: 'Can I use ChatGPT to write my entire resume?', answer: 'You can, but the best results come from using AI as a writing partner, not a replacement. Give ChatGPT your real experience and target job description, then edit its output to sound authentic. Hiring managers can often detect fully AI-written resumes, so personalization is key.' },
      { question: 'Is using AI for resume writing considered cheating?', answer: 'No. Using AI for resume writing is widely accepted and increasingly expected. It is similar to using spell-check or grammar tools. The key is that your resume should accurately represent your real experience and qualifications — AI just helps you present them more effectively.' },
      { question: 'How do I use AI prompts with EasyFreeResume?', answer: 'Visit our AI prompt guides (ChatGPT, Claude, or Gemini) and copy the proven prompts. Paste them into your preferred AI along with your experience and target job description. Then copy the AI-generated content into our free resume builder, choose a template, and download your finished resume.' },
      { question: 'Do I need to pay for ChatGPT to use this?', answer: 'No. ChatGPT, Claude, and Gemini all offer free tiers that are sufficient for resume writing. Combined with our free resume builder, you can create an AI-optimized, professionally formatted resume at zero cost.' },
    ],
  },

  // /zety-free-alternative
  zetyAlternative: {
    seo: {
      title: `Free Alternative to Zety — Download Without Paying | EasyFreeResume`,
      description:
        'Frustrated with Zety paywall? EasyFreeResume is a free alternative to Zety. Download your resume as PDF without paying. Switch in 3 minutes.',
      keywords: [
        'zety free alternative',
        'zety alternative free',
        'free alternative to zety',
        'zety resume builder free',
        'like zety but free',
        'zety free download alternative',
      ],
      canonicalUrl: '/zety-free-alternative',
    },
    hero: {
      h1: 'Free Alternative to Zety — Download Your Resume Without Paying',
      eyebrow: 'Zety Alternative',
      subtitle: 'Frustrated by the Zety paywall? You are not alone',
      description:
        'Thousands of job seekers build their resume on Zety only to discover they need to pay $2.70-$24.70 to download it. EasyFreeResume lets you build, customize, and download your resume completely free — no payment, no sign-up, no catch.',
      primaryCTA: { text: 'Switch to Free', href: '/templates' },
      secondaryCTA: { text: 'See Comparison', href: '/easyfreeresume-vs-zety', variant: 'outline' },
    },
    steps: [
      { number: 1, title: 'Pick a Template', description: 'Choose from our ATS-optimized templates. All are free — no "premium" locks like Zety.' },
      { number: 2, title: 'Add Your Content', description: 'Paste your existing resume content or type it fresh. Our editor is just as intuitive as Zety.' },
      { number: 3, title: 'Download Free', description: 'Download your resume as PDF. No credit card prompt, no paywall surprise — just a clean download.' },
    ],
    features: [
      { icon: '💰', title: 'Actually Free Downloads', description: 'Zety charges $2.70-$24.70 to download. We charge nothing. Your download button actually works without a paywall.' },
      { icon: '📧', title: 'No Account Required', description: 'Zety requires an account and email. We do not. Start building immediately with zero friction.' },
      { icon: '✅', title: 'Same ATS Compatibility', description: 'Our templates pass the same ATS systems as Zety. Professional formatting, proper heading hierarchy, standard fonts.' },
      { icon: '🎨', title: 'Professional Templates', description: 'Clean, modern designs comparable to Zety. Multiple styles for different industries and career levels.' },
      { icon: '🔒', title: 'No Subscription Trap', description: 'Zety auto-enrolls you in a subscription. We have no subscriptions, no auto-renewals, no billing surprises.' },
      { icon: '⚡', title: 'Switch in 3 Minutes', description: 'Already built a resume on Zety? Pick a similar template here and paste your content. Done.' },
    ],
    comparison: [
      {
        name: 'EasyFreeResume',
        highlight: true,
        features: {
          'Price': 'Free',
          'PDF Download': 'Free',
          'Sign-Up Required': false,
          'Credit Card Required': false,
          'All Templates Free': true,
          'No Watermarks': true,
          'Auto-Subscription': false,
          'ATS-Optimized': true,
        },
      },
      {
        name: 'Zety',
        features: {
          'Price': '$2.70-$24.70',
          'PDF Download': 'Paid only',
          'Sign-Up Required': true,
          'Credit Card Required': true,
          'All Templates Free': false,
          'No Watermarks': 'Paid only',
          'Auto-Subscription': true,
          'ATS-Optimized': true,
        },
      },
    ],
    faqs: [
      { question: 'Why is Zety not free?', answer: 'Zety uses a freemium model: it lets you build a resume for free, then charges $2.70 for a 7-day trial or up to $24.70/month to download it as PDF. Many users do not realize this until they click "Download." EasyFreeResume is an alternative where downloading is always free.' },
      { question: 'Is EasyFreeResume as good as Zety?', answer: 'For most users, yes. Our templates are ATS-optimized, professionally designed, and comparable in quality. The main difference is the price: Zety charges for downloads, we do not. Zety does have more template variety, but our core templates cover the most popular styles.' },
      { question: 'Can I transfer my Zety resume to EasyFreeResume?', answer: 'Yes. Choose a similar template on EasyFreeResume, then copy and paste your content from Zety. The whole process takes about 3 minutes. You will have a professionally formatted resume you can download for free.' },
      { question: 'Does Zety automatically charge my credit card?', answer: 'Zety offers a $2.70 7-day trial that auto-renews at $24.70/month if not cancelled. Many users report unexpected charges. EasyFreeResume never collects payment information, so there is nothing to cancel or worry about.' },
      { question: 'Are EasyFreeResume templates ATS-friendly like Zety?', answer: 'Yes. Our templates use proper heading hierarchy, standard fonts, and clean HTML formatting that ATS systems can parse correctly. They pass the same Applicant Tracking Systems (Workday, Taleo, iCIMS) as Zety templates.' },
      { question: 'What do I lose by switching from Zety to EasyFreeResume?', answer: 'Honestly, Zety has a larger template library and a more polished AI writing assistant. What you gain is genuinely free downloads, no account requirement, no subscription, and no payment surprises. For most job seekers, that trade-off is worth it.' },
    ],
  },

  // /free-resume-builder-for-students
  forStudents: {
    seo: {
      title: `Free Resume Builder for Students (${CURRENT_YEAR}) | No Sign Up Required`,
      description: 'Build a professional student resume for free. ATS-friendly templates designed for college students, new graduates, and interns. No sign-up, no payment.',
      keywords: ['student resume builder', 'resume builder for college students', 'free student resume', 'new graduate resume builder', 'internship resume builder', 'entry level resume builder'],
      canonicalUrl: '/free-resume-builder-for-students',
    },
    breadcrumbs: [
      { label: 'Home', href: '/' },
      { label: 'Free Resume Builder for Students', href: '/free-resume-builder-for-students' },
    ],
    hero: {
      h1: 'Free Resume Builder for Students',
      subtitle: 'Build a professional resume even with no work experience',
      description: 'ATS-friendly templates designed for college students, new graduates, and interns. Emphasize projects, coursework, and skills — not just job history.',
      primaryCTA: { text: 'Build My Student Resume', href: '/templates' },
      secondaryCTA: { text: 'View Student Templates', href: '/templates/resume-templates-for-students' },
    },
    features: [
      { icon: '🎓', title: 'Student-Focused Layout', description: 'Templates that highlight education, projects, and skills over work history — perfect when you are just starting your career.' },
      { icon: '📋', title: 'ATS-Optimized', description: 'Every template passes Applicant Tracking Systems used by Fortune 500 companies and major employers.' },
      { icon: '✏️', title: 'Easy to Fill In', description: 'Guided sections for education, coursework, internships, volunteering, and projects. No guesswork.' },
      { icon: '📥', title: 'Free PDF Download', description: 'Download your resume instantly as a clean PDF. No sign-up, no payment, no watermarks.' },
      { icon: '🤖', title: 'AI Writing Help', description: 'Use AI to write compelling bullet points even when your experience is limited.' },
      { icon: '💰', title: '100% Free Forever', description: 'Unlike other "free" builders, we never lock features behind a paywall. Students deserve free tools.' },
    ],
    faqs: [
      { question: 'How do I write a resume with no work experience?', answer: 'Focus on education, academic projects, coursework, volunteering, clubs, and personal projects. Our student templates are designed to showcase these sections prominently. Use specific metrics where possible: "Led 5-person team for capstone project" or "Maintained 3.8 GPA."' },
      { question: 'Should I include my GPA on my student resume?', answer: 'Include your GPA if it is 3.5 or above (on a 4.0 scale). If your major GPA is higher than your overall GPA, list the major GPA instead. If neither is strong, leave it off and focus on projects and skills.' },
      { question: 'How long should a student resume be?', answer: 'One page is ideal for students and recent graduates. Employers expect concise resumes from candidates with limited experience. Focus on quality over quantity — every line should demonstrate a relevant skill or achievement.' },
      { question: 'What template should a college student use?', answer: 'Use a clean, single-column template that puts education and skills near the top. Avoid overly creative designs that may confuse ATS. Our student resume templates are specifically designed for this use case.' },
      { question: 'Can I use this for internship applications?', answer: 'Absolutely. Our templates work for internships, part-time jobs, full-time entry-level positions, and graduate school applications. Tailor the content for each application by adjusting your summary and highlighting relevant coursework.' },
    ],
  },

  // /free-resume-builder-for-veterans
  forVeterans: {
    seo: {
      title: `Free Resume Builder for Veterans (${CURRENT_YEAR}) | Military to Civilian`,
      description: 'Translate military experience into civilian resume language. Free ATS-friendly templates for veterans, service members, and military spouses. No sign-up required.',
      keywords: ['veteran resume builder', 'military resume builder', 'military to civilian resume', 'free resume builder for veterans', 'veteran resume template', 'military transition resume'],
      canonicalUrl: '/free-resume-builder-for-veterans',
    },
    breadcrumbs: [
      { label: 'Home', href: '/' },
      { label: 'Free Resume Builder for Veterans', href: '/free-resume-builder-for-veterans' },
    ],
    hero: {
      h1: 'Free Resume Builder for Veterans',
      subtitle: 'Translate your military experience into civilian career success',
      description: 'ATS-friendly templates and guidance designed for veterans and transitioning service members. Translate military skills, MOS codes, and DD-214 experience into language civilian employers understand.',
      primaryCTA: { text: 'Build My Veteran Resume', href: '/templates' },
    },
    features: [
      { icon: '🎖️', title: 'Military-to-Civilian Translation', description: 'Guidance on converting military jargon, MOS codes, and acronyms into civilian-friendly language that recruiters understand.' },
      { icon: '📋', title: 'ATS-Optimized Templates', description: 'Clean, professional templates that pass Applicant Tracking Systems at major civilian employers.' },
      { icon: '🔒', title: 'Security Clearance Highlighting', description: 'Properly formatted sections for active/inactive security clearances — a major asset for defense and government contractor roles.' },
      { icon: '📥', title: 'Free PDF Download', description: 'Download your resume instantly. No sign-up, no payment, no subscription. Completely free for those who served.' },
      { icon: '🤖', title: 'AI Writing Assistance', description: 'Use AI to rewrite military accomplishments in civilian terms and generate tailored bullet points for target roles.' },
      { icon: '💼', title: 'Transferable Skills Focus', description: 'Templates designed to highlight leadership, operations, logistics, security, and technical skills that translate to civilian roles.' },
    ],
    faqs: [
      { question: 'How do I translate military experience to a civilian resume?', answer: 'Replace military jargon with civilian equivalents: "platoon leader" becomes "team leader of 40+ personnel," "logistics NCO" becomes "supply chain coordinator." Focus on transferable skills: leadership, project management, operations, training, and security. Always quantify with metrics: budget managed, personnel supervised, processes improved.' },
      { question: 'Should I include my MOS or military job code?', answer: 'Include the civilian-friendly translation, not just the MOS code. Write "Combat Medic (68W)" or "IT Specialist (25B)" so civilian recruiters understand the role. In your experience bullets, describe what you actually did in terms any employer would recognize.' },
      { question: 'How do I list a security clearance on my resume?', answer: 'Add a "Security Clearance" section near the top of your resume. Include the clearance level (Secret, Top Secret, TS/SCI), status (Active/Inactive), and investigation date if active. An active security clearance is highly valuable for defense and government contractor positions.' },
      { question: 'Is this resume builder really free for veterans?', answer: 'Yes, 100% free for everyone including veterans. There are no premium tiers, no hidden fees, and no subscription. We believe tools for career transition should be accessible to all, especially those who have served.' },
    ],
  },

  // /free-resume-builder-for-it-professionals
  forITProfessionals: {
    seo: {
      title: `Free Resume Builder for IT Professionals (${CURRENT_YEAR}) | Tech Resume Templates`,
      description: 'Build a professional IT resume for free. ATS-optimized templates for software engineers, DevOps, cybersecurity, data analysts, and IT support. No sign-up required.',
      keywords: ['IT resume builder', 'tech resume builder', 'software engineer resume builder', 'IT professional resume template', 'free tech resume builder', 'developer resume builder'],
      canonicalUrl: '/free-resume-builder-for-it-professionals',
    },
    breadcrumbs: [
      { label: 'Home', href: '/' },
      { label: 'Free Resume Builder for IT Professionals', href: '/free-resume-builder-for-it-professionals' },
    ],
    hero: {
      h1: 'Free Resume Builder for IT Professionals',
      subtitle: 'Templates and tools designed for the tech industry',
      description: 'ATS-optimized templates for software engineers, DevOps engineers, data analysts, cybersecurity professionals, and IT support specialists. Showcase your technical skills effectively.',
      primaryCTA: { text: 'Build My Tech Resume', href: '/templates' },
      secondaryCTA: { text: 'View ATS Templates', href: '/templates/ats-friendly' },
    },
    features: [
      { icon: '💻', title: 'Tech-Focused Templates', description: 'Layouts designed to showcase technical skills, certifications, and project experience in a format that tech recruiters expect.' },
      { icon: '📋', title: 'ATS-Optimized', description: 'Pass Applicant Tracking Systems at Google, Amazon, Microsoft, and thousands of other tech employers.' },
      { icon: '🔧', title: 'Skills Section Optimized', description: 'Structured skills sections for programming languages, frameworks, cloud platforms, tools, and methodologies.' },
      { icon: '📥', title: 'Free PDF Download', description: 'Download your polished IT resume instantly. No sign-up, no payment, no limitations.' },
      { icon: '🤖', title: 'AI-Powered Bullets', description: 'Generate impactful bullet points with metrics: latency reduced, uptime achieved, users served.' },
      { icon: '🔑', title: 'Keyword Guidance', description: 'Built-in guidance for industry-specific keywords like CI/CD, Docker, Kubernetes, AWS, and more.' },
    ],
    faqs: [
      { question: 'What should an IT professional put on their resume?', answer: 'Lead with a technical skills section organized by category (languages, frameworks, cloud, tools). Follow with experience bullets that combine technology names with measurable impact: "Reduced API latency by 60% using Redis caching on AWS." Include certifications (AWS, Azure, Google Cloud) prominently.' },
      { question: 'How should I list programming languages on my resume?', answer: 'Group by proficiency or relevance, not alphabetically. Lead with languages in the job description. Show depth: "Python (5 years, production)" is better than just listing "Python." Alternatively, demonstrate proficiency through bullet points rather than a standalone list.' },
      { question: 'Should I include personal projects or GitHub on my IT resume?', answer: 'Yes, especially if they demonstrate skills relevant to the target role. Include a Projects section with the tech stack, your role, and measurable outcomes. Link to your GitHub profile if your repos show consistent, quality contributions.' },
      { question: 'How long should a tech resume be?', answer: 'One page for less than 10 years of experience, two pages maximum for senior engineers and architects. Focus on recent, relevant experience. A 15-year veteran does not need to list every technology they touched in 2010.' },
      { question: 'What resume keywords do IT recruiters look for?', answer: 'It depends on the role. For software engineers: specific languages, frameworks, cloud platforms, CI/CD, and system design. For DevOps: Terraform, Kubernetes, Docker, monitoring tools. For data: SQL, Python, Spark, machine learning. Always mirror the exact terms from the job description.' },
    ],
  },

  // /free-resume-builder-for-nurses
  forNurses: {
    seo: {
      title: `Free Resume Builder for Nurses (${CURRENT_YEAR}) | Nursing Resume Templates`,
      description: 'Build a professional nursing resume for free. ATS-friendly templates for RNs, LPNs, nurse practitioners, and nursing students. Highlight certifications and clinical skills.',
      keywords: ['nursing resume builder', 'nurse resume builder', 'RN resume builder', 'free nursing resume template', 'nurse resume template', 'nursing resume'],
      canonicalUrl: '/free-resume-builder-for-nurses',
    },
    breadcrumbs: [
      { label: 'Home', href: '/' },
      { label: 'Free Resume Builder for Nurses', href: '/free-resume-builder-for-nurses' },
    ],
    hero: {
      h1: 'Free Resume Builder for Nurses',
      subtitle: 'Professional templates designed for healthcare careers',
      description: 'ATS-friendly templates for registered nurses, LPNs, nurse practitioners, and nursing students. Properly showcase certifications (BLS, ACLS, PALS), clinical skills, and EHR experience.',
      primaryCTA: { text: 'Build My Nursing Resume', href: '/templates' },
    },
    features: [
      { icon: '🏥', title: 'Healthcare-Focused Layout', description: 'Templates designed for nursing professionals with dedicated sections for certifications, licensure, and clinical rotations.' },
      { icon: '📋', title: 'ATS-Optimized', description: 'Pass Applicant Tracking Systems at hospitals, health systems, and staffing agencies.' },
      { icon: '🎓', title: 'Certification Showcase', description: 'Properly formatted sections for BLS, ACLS, PALS, TNCC, and specialty certifications that hiring managers scan for first.' },
      { icon: '📥', title: 'Free PDF Download', description: 'Download your nursing resume instantly. No sign-up, no payment, no watermarks.' },
      { icon: '💊', title: 'EHR Skills Section', description: 'Highlight experience with Epic, Cerner, MEDITECH, and other electronic health record systems employers require.' },
      { icon: '🤖', title: 'AI Writing Help', description: 'Generate nursing-specific bullet points with patient outcomes, unit metrics, and clinical competencies.' },
    ],
    faqs: [
      { question: 'What certifications should a nurse list on their resume?', answer: 'Always include your active nursing license (RN, LPN/LVN) with state and license number. Add BLS (Basic Life Support) and ACLS (Advanced Cardiac Life Support) as these are required for most positions. Include specialty certifications: PALS, TNCC, CCRN, CEN, or wound care certification. List the certification body and expiration date.' },
      { question: 'How should a new graduate nurse write a resume?', answer: 'Lead with education and clinical rotations. List each clinical rotation with the unit type, facility, patient population, and skills practiced. Include capstone or preceptorship details, relevant coursework, and any certifications. Our student-focused templates are designed for exactly this situation.' },
      { question: 'Should I list EHR systems on my nursing resume?', answer: 'Absolutely. Most hospitals require proficiency in specific EHR systems. List every system you have used: Epic, Cerner, MEDITECH, Allscripts, or eClinicalWorks. If you are certified in Epic modules, include those certifications prominently.' },
      { question: 'How long should a nursing resume be?', answer: 'One page for new graduates and nurses with less than 5 years of experience. Two pages are acceptable for experienced nurses with extensive certifications, specializations, or leadership roles. Never exceed two pages.' },
      { question: 'What are the most important keywords for a nursing resume?', answer: 'Patient care, patient assessment, medication administration, vital signs, IV therapy, wound care, care planning, patient education, infection control, HIPAA compliance, and your specific specialty area (ICU, ER, OR, L&D, pediatrics). Always include the exact unit types and patient populations from the job description.' },
    ],
  },

  // ── ATS Keyword Scanner Tool ──────────────────────────────────────────
  keywordScanner: {
    seo: {
      title: `Free ATS Resume Keyword Scanner (${CURRENT_YEAR}) | Check Your Match Score`,
      description: 'Free ATS resume keyword scanner. Paste your resume and job description to see your keyword match score, missing keywords, and placement suggestions. No sign-up required.',
      keywords: ['resume keyword scanner', 'ATS keyword checker', 'resume keyword match', 'ATS score checker', 'resume scanner free', 'keyword match tool', 'ATS resume checker'],
      canonicalUrl: '/resume-keyword-scanner',
    },
    hero: {
      h1: 'Free ATS Resume Keyword Scanner',
      subtitle: 'Paste your resume and a job description to instantly see which keywords you are missing — and where to add them.',
      primaryCTA: { text: 'Scan Now', href: '#resume-text' },
      secondaryCTA: { text: 'Browse Keywords', href: '/resume-keywords' },
    },
    breadcrumbs: [
      { label: 'Home', href: '/' },
      { label: 'Resume Keywords', href: '/resume-keywords' },
      { label: 'Keyword Scanner', href: '/resume-keyword-scanner' },
    ],
    faqs: [
      { question: 'How does the ATS keyword scanner work?', answer: 'Our scanner uses an AI language model (MiniLM) that runs entirely in your browser. It extracts important keywords from the job description, then uses semantic similarity to check how well your resume covers each term — catching synonyms, related concepts, and phrasing variations that simple text matching would miss. Results are categorized as matched, partial match, or missing.' },
      { question: 'Is this keyword scanner free?', answer: 'Yes, completely free. There is no sign-up, no account required, and no limit on how many scans you can run. The AI model downloads once (~23 MB) and is cached by your browser for instant future use.' },
      { question: 'What is a good keyword match score?', answer: 'Aim for 70% or higher. A score above 70% means your resume covers most of the key terms from the job description, which significantly improves your chances of passing ATS screening. Below 40% suggests your resume needs substantial tailoring for this specific role. Pay special attention to "partial matches" — these are terms your resume nearly covers and are the easiest wins.' },
      { question: 'Does this tool store my resume or job description?', answer: 'No. The AI model and all processing run locally in your browser. Your resume text and job description are never uploaded to any server. When you close the page, all data is gone.' },
      { question: 'Should I add every missing keyword to my resume?', answer: 'Not necessarily. Focus on keywords that are genuinely relevant to your experience. Adding keywords you cannot back up in an interview will hurt you. Prioritize technical skills, tools, and certifications that you actually possess. For softer terms, weave them naturally into your experience bullet points.' },
      { question: 'How often should I scan my resume?', answer: 'Every time you apply to a new job. Each job description contains different keywords, so a resume that scores 80% for one role might score 40% for another. Spend 10 minutes tailoring your resume for each application.' },
    ],
  },
};
