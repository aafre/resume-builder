import React, { useEffect, useMemo } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import CountUp from "react-countup";
import SEOHead from "./SEOHead";
import { generateSoftwareApplicationSchema, generateWebSiteSchema, generateFAQPageSchema, wrapInGraph } from "../utils/schemaGenerators";
import CompanyMarquee from "./CompanyMarquee";
import RevealSection from "./shared/RevealSection";
import { useAuth } from "../contexts/AuthContext";
import { useResumeCount } from "../hooks/useResumeCount";
import { InContentAd, AD_CONFIG } from "./ads";
import {
  ArrowRightIcon,
  ChevronDownIcon,
} from "@heroicons/react/24/solid";

const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { isAuthenticated, isAnonymous } = useAuth();
  const { data: resumeCount = 0 } = useResumeCount();

  // Check if user has resumes
  const hasResumes = isAuthenticated && !isAnonymous && resumeCount > 0;

  // Handle legacy URL redirects only
  useEffect(() => {
    // Handle legacy URL redirects (old bookmark format)
    const resumeIdFromUrl = searchParams.get("resumeId");
    const templateId = searchParams.get("template");

    if (resumeIdFromUrl) {
      // Old bookmark: /?resumeId=123 → redirect to /editor/123
      navigate(`/editor/${resumeIdFromUrl}`, { replace: true });
      return;
    }

    if (templateId) {
      // Old bookmark: /?template=modern → redirect to templates page
      navigate(`/templates`, { replace: true });
      return;
    }

    // No auto-redirect for authenticated users - let them see landing page
  }, [searchParams, navigate]);

  const resumeCountValue = useMemo(() => {
    const launchDate = new Date("2019-01-01T00:00:00Z");
    const now = new Date();
    const msPerDay = 24 * 60 * 60 * 1000;
    const daysSinceLaunch = Math.floor((now.getTime() - launchDate.getTime()) / msPerDay);
    return 52000 + daysSinceLaunch * 28;
  }, []);

  const prefersReducedMotion = useMemo(
    () =>
      typeof window.matchMedia === "function" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    [],
  );

  // Features data
  const features = [
    {
      title: "Beat the ATS",
      description:
        "Get past automated screening systems with templates optimized for Applicant Tracking Systems.",
    },
    {
      title: "Simple & Intuitive",
      description:
        "Build your resume with an easy-to-use editor that shows exactly how your resume will look.",
    },
    {
      title: "Ready in Minutes",
      description:
        "Download your professional PDF resume immediately - no waiting, no registration required.",
    },
    {
      title: "Hiring Manager Approved",
      description:
        "Clean, modern designs that recruiters love and that help you stand out from the crowd.",
    },
    {
      title: "No Sign-Up, No Data Collection",
      description:
        "Start building immediately without registration. We don't store your personal information - complete privacy guaranteed.",
    },
    {
      title: "100% Free & Unlimited",
      description:
        "Build unlimited resumes at no cost. No hidden fees, no premium upgrades, no catch.",
    },
  ];

  // FAQs
  const faqs = [
    {
      question: "Is this resume builder really free?",
      answer:
        "Yes, 100% free. There are no paywalls for downloading PDFs and no hidden subscriptions. Even our premium features like Cloud Auto-Save and the Multi-Resume Dashboard are completely free for registered users.",
    },
    {
      question: "Are the templates ATS-friendly?",
      answer:
        "All our templates are designed to pass Applicant Tracking Systems used by most companies. Your resume will be properly formatted and easily readable by both ATS and human recruiters.",
    },
    {
      question: "Do I need to sign up or create an account?",
      answer:
        "No! You can build and download your resume instantly as a guest without signing up. However, creating a free account unlocks Cloud Storage, allowing you to save your work securely, access it from any device, and manage multiple resume versions.",
    },
    {
      question: "Can I import my existing resume (PDF or DOCX)?",
      answer:
        "Yes! If you have an existing resume in PDF or Word format, you can upload it and our AI will automatically extract your information and populate the editor. This saves you time re-typing everything. After import, you can review and edit any details before downloading.",
    },
    {
      question: "How accurate is the AI resume import feature?",
      answer:
        "Our AI typically achieves 85-95% accuracy when importing resumes. After uploading, you'll see a confidence score and any warnings about potentially inaccurate information. We strongly recommend reviewing all imported details carefully before finalizing your resume, especially contact information, dates, and job descriptions.",
    },
    {
      question: "What file formats can I import?",
      answer:
        "You can upload PDF (.pdf) or Microsoft Word (.docx) files up to 10MB in size. The file must be a resume or CV - other document types will be rejected. For best results, use clearly formatted resumes with standard sections like work experience, education, and skills.",
    },
    {
      question: "Is my uploaded resume data secure and private?",
      answer:
        "Absolutely. Uploaded files are processed securely and temporarily to extract your information. We don't permanently store your uploaded resume files on our servers. The extracted data is saved only if you're signed in, and it's stored securely in your private cloud account that only you can access.",
    },
    {
      question: "What format will my resume be downloaded in?",
      answer:
        "Your resume is generated as a high-quality PDF that's perfect for email applications and printing. The PDF maintains professional formatting across all devices.",
    },
    {
      question: "How do I save my resume to edit it later?",
      answer:
        "We automatically save your progress as you type. As a guest, data is stored in your browser. For permanent safekeeping, simply sign in to sync your resume to the secure cloud. You can then log in from your phone or laptop anytime to continue editing.",
    },
    {
      question: "Can I create specific resumes for different jobs?",
      answer:
        "Yes! With a free account, you can create and manage up to 5 different resume versions in your Dashboard. This is perfect for tailoring your CV to specific job applications (e.g., one for Customer Service, one for Admin).",
    },
    {
      question: "I started a resume but didn't sign in. Did I lose my work?",
      answer:
        "Likely not! Our smart recovery system attempts to find your previous session when you return to the site. If we find unsaved work, we will prompt you to restore it. We recommend signing in to ensure you never lose your progress.",
    },
    {
      question: "How is EasyFreeResume different from other free resume builders?",
      answer:
        "Most 'free' resume builders lock PDF downloads behind a paywall or require a subscription. EasyFreeResume lets you build, edit, and download unlimited PDF resumes without ever paying or signing up. No watermarks, no trial limits, no credit card required.",
    },
    {
      question: "Can I use AI to help write my resume?",
      answer:
        "Yes! Our editor integrates AI features powered by ChatGPT, Claude, and Gemini to help you write stronger bullet points, tailor your resume to specific job descriptions, and improve phrasing. All AI features are free to use.",
    },
    {
      question: "What are resume keywords and why do they matter?",
      answer:
        "Resume keywords are specific terms and phrases that Applicant Tracking Systems (ATS) scan for when filtering candidates. Including the right keywords from the job description significantly increases your chances of passing the automated screening. Our Resume Keywords tool helps you find the best keywords for your industry.",
    },
    {
      question: "How does EasyFreeResume make money if it's free?",
      answer:
        "We're supported by non-intrusive advertising, which allows us to keep every feature — including PDF downloads, all templates, cloud storage, and AI tools — completely free for all users. We will never introduce paywalls or premium tiers.",
    },
  ];

  return (
    <>
      <SEOHead
        title="Free Resume Builder Online | No Sign Up, No Payment | EasyFreeResume"
        description="Build your resume for free online with ATS-friendly templates. Download PDF instantly — no sign up, no payment, no watermarks. Trusted by 100K+ job seekers."
        structuredData={wrapInGraph([
          generateSoftwareApplicationSchema(),
          generateWebSiteSchema(),
          generateFAQPageSchema(faqs),
        ])}
      />

      {/* ═══════════ HERO — light, asymmetric ═══════════ */}
      <section className="relative pt-12 pb-20 md:pt-20 md:pb-28">
        <div className="max-w-6xl mx-auto w-full grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left: text */}
          <div>
            <span className="font-mono text-xs tracking-[0.15em] text-accent uppercase mb-6 block">
              FREE FOREVER. NO SIGN-UP.
            </span>
            <h1 className="font-display text-[clamp(2.5rem,5.5vw,4.5rem)] font-extrabold leading-[1.08] tracking-tight text-ink mb-6">
              Free Resume Builder — Build Resumes That Get You Hired
            </h1>
            <p className="font-display text-lg md:text-xl font-extralight text-stone-warm max-w-lg leading-relaxed mb-8">
              Build your resume for free online with ATS-friendly templates. Download as PDF instantly — no sign up, no payment, no watermarks.
            </p>

            <div className="flex flex-wrap gap-4 mb-8">
              <button
                className="group inline-flex items-center justify-center bg-accent text-ink py-3.5 px-8 rounded-xl text-base font-bold shadow-lg hover:shadow-accent/25 hover:shadow-2xl transform hover:-translate-y-0.5 transition-all duration-300 active:scale-95 font-display"
                onClick={() => navigate(hasResumes ? "/my-resumes" : "/templates")}
              >
                {hasResumes ? "My Resumes" : "Build My Free Resume"}
                <ArrowRightIcon className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform duration-200" />
              </button>
              <button
                className="group inline-flex items-center justify-center border border-ink/15 text-ink py-3.5 px-8 rounded-xl text-base font-semibold hover:border-ink/30 hover:bg-ink/[0.03] transition-all duration-300 active:scale-95 font-display"
                onClick={() => navigate("/templates")}
              >
                View Templates
              </button>
            </div>

            <p className="font-mono text-xs tracking-wide text-stone-warm">
              100% free · No sign-up · {prefersReducedMotion ? (
                <>{resumeCountValue.toLocaleString("en-US")}+</>
              ) : (
                <CountUp end={resumeCountValue} separator="," suffix="+" duration={2.5} enableScrollSpy scrollSpyOnce />
              )} resumes created
            </p>
          </div>

          {/* Right: CSS-only floating resume mockup */}
          <div className="hidden lg:flex items-center justify-center" aria-hidden="true">
            <div className="relative" style={{ perspective: '1000px' }}>
              {/* Shadow copy behind */}
              <div
                className="absolute top-4 left-4 w-[280px] h-[380px] bg-ink/[0.04] rounded-xl"
                style={{ transform: 'rotateY(-3deg)' }}
              />
              {/* Main mockup */}
              <div
                className="hero-mockup relative w-[280px] h-[380px] bg-white rounded-xl p-6 flex flex-col gap-3 border border-black/[0.06]"
                style={{
                  animation: prefersReducedMotion ? 'none' : 'float 4s ease-in-out infinite',
                  transform: 'rotateY(-3deg)',
                  boxShadow: '0 8px 40px rgba(0,0,0,0.08), 0 2px 8px rgba(0,0,0,0.04)',
                }}
              >
                {/* Name bar */}
                <div className="h-5 w-32 bg-ink rounded-sm" />
                <div className="h-2.5 w-20 bg-accent/60 rounded-sm" />
                {/* Divider */}
                <div className="h-px w-full bg-gray-200 my-1" />
                {/* Section: experience */}
                <div className="h-2 w-16 bg-ink/40 rounded-sm" />
                <div className="space-y-1.5">
                  <div className="h-1.5 w-full bg-gray-200 rounded-sm" />
                  <div className="h-1.5 w-[90%] bg-gray-200 rounded-sm" />
                  <div className="h-1.5 w-[75%] bg-gray-200 rounded-sm" />
                </div>
                {/* Section: skills */}
                <div className="h-2 w-12 bg-ink/40 rounded-sm mt-2" />
                <div className="flex gap-1.5 flex-wrap">
                  <div className="h-4 w-14 bg-accent/15 rounded-full" />
                  <div className="h-4 w-10 bg-accent/15 rounded-full" />
                  <div className="h-4 w-16 bg-accent/15 rounded-full" />
                  <div className="h-4 w-12 bg-accent/15 rounded-full" />
                </div>
                {/* Section: education */}
                <div className="h-2 w-14 bg-ink/40 rounded-sm mt-2" />
                <div className="space-y-1.5">
                  <div className="h-1.5 w-[85%] bg-gray-200 rounded-sm" />
                  <div className="h-1.5 w-[60%] bg-gray-200 rounded-sm" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════ STATS ═══════════ */}
      <section className="py-12">
        <RevealSection stagger className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-center gap-8 sm:gap-0 sm:divide-x sm:divide-ink/10">
          <div className="text-center sm:px-16">
            <p className="font-mono text-3xl md:text-4xl font-normal text-ink mb-1">
              {prefersReducedMotion ? (
                <>{resumeCountValue.toLocaleString("en-US")}+</>
              ) : (
                <CountUp end={resumeCountValue} separator="," suffix="+" duration={2.5} enableScrollSpy scrollSpyOnce />
              )}
            </p>
            <p className="font-display text-sm font-extralight text-stone-warm tracking-wide">Resumes Created</p>
          </div>
          <div className="text-center sm:px-16">
            <p className="font-mono text-3xl md:text-4xl font-normal text-ink mb-1">
              {prefersReducedMotion ? (
                <>100%</>
              ) : (
                <CountUp end={100} suffix="%" duration={2} enableScrollSpy scrollSpyOnce />
              )}
            </p>
            <p className="font-display text-sm font-extralight text-stone-warm tracking-wide">ATS Compatible</p>
          </div>
        </RevealSection>
      </section>

      {/* ═══════════ AD SLOT ═══════════ */}
      <div className="container mx-auto max-w-4xl px-4">
        <InContentAd adSlot={AD_CONFIG.slots.landingIncontent} marginY={32} />
      </div>

      {/* ═══════════ COMPANY MARQUEE — light ═══════════ */}
      <section className="bg-chalk py-20 px-4" style={{ contentVisibility: 'auto', containIntrinsicSize: 'auto 400px' }}>
        <div className="max-w-6xl mx-auto">
          <RevealSection className="text-center mb-12">
            <span className="font-mono text-xs tracking-[0.15em] text-stone-warm uppercase mb-4 block">
              TRUSTED BY PROFESSIONALS FROM
            </span>
          </RevealSection>

          <CompanyMarquee speed={12} pauseOnHover={true} />

          <div className="text-center mt-8">
            <p className="text-xs text-stone-warm max-w-3xl mx-auto font-display font-extralight">
              * We respect user privacy and don't track employment details. The
              companies shown represent professionals who have chosen our
              platform for building their resumes.
            </p>
          </div>
        </div>
      </section>

      {/* ═══════════ FEATURES — light, numbered list ═══════════ */}
      <section className="bg-chalk py-20 px-4" style={{ contentVisibility: 'auto', containIntrinsicSize: 'auto 800px' }}>
        <div className="max-w-4xl mx-auto">
          <RevealSection>
            <span className="font-mono text-xs tracking-[0.15em] text-accent uppercase mb-4 block">
              WHY US
            </span>
            <h2 className="font-display text-3xl md:text-5xl font-extrabold text-ink mb-4 tracking-tight">
              Why Job Seekers Choose Our Free Resume Builder
            </h2>
            <p className="font-display text-lg font-extralight text-stone-warm mb-16 max-w-2xl">
              Trusted by job seekers worldwide to create resumes that stand out
            </p>
          </RevealSection>

          <RevealSection stagger>
            <div className="space-y-0">
              {features.map((item, index) => (
                <div
                  key={index}
                  className="group flex items-start gap-6 py-8 border-b border-black/[0.06] last:border-b-0 cursor-default"
                >
                  <span className="font-mono text-3xl md:text-4xl text-accent/30 group-hover:text-accent transition-colors duration-300 flex-shrink-0 leading-none mt-1 w-12 md:w-16 text-right">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <div>
                    <h3 className="font-display text-xl font-extrabold text-ink mb-2 group-hover:text-accent transition-colors duration-300">
                      {item.title}
                    </h3>
                    <p className="font-display font-extralight text-stone-warm leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </RevealSection>
        </div>
      </section>

      {/* ═══════════ INTERACTIVE DEMO ═══════════ */}
      <section className="bg-chalk py-24 px-4" style={{ contentVisibility: 'auto', containIntrinsicSize: 'auto 600px' }}>
        <div className="max-w-5xl mx-auto">
          <RevealSection className="text-center mb-16">
            <span className="font-mono text-xs tracking-[0.15em] text-accent uppercase mb-4 block">
              HOW IT WORKS
            </span>
            <h2 className="font-display text-3xl md:text-5xl font-extrabold text-ink tracking-tight">
              From blank page to polished PDF.
            </h2>
          </RevealSection>

          <RevealSection variant="fade-in">
            {/* Browser chrome mockup */}
            <div className="bg-ink-light rounded-2xl border border-white/10 overflow-hidden shadow-2xl max-w-3xl mx-auto">
              {/* Title bar */}
              <div className="flex items-center gap-2 px-4 py-3 border-b border-white/10">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-white/10" />
                  <div className="w-3 h-3 rounded-full bg-white/10" />
                  <div className="w-3 h-3 rounded-full bg-white/10" />
                </div>
                <div className="flex-1 flex justify-center">
                  <div className="bg-white/5 rounded-md px-4 py-1">
                    <span className="font-mono text-[11px] text-mist">easyfreeresume.com/editor</span>
                  </div>
                </div>
              </div>

              {/* Content area: two-panel */}
              <div className="grid md:grid-cols-2 divide-x divide-white/10">
                {/* Left: form panel */}
                <div className="p-6 space-y-4">
                  <div>
                    <span className="font-mono text-[10px] text-mist uppercase tracking-wider">Full Name</span>
                    <div className="mt-1 bg-white/5 rounded-lg px-3 py-2 overflow-hidden">
                      <span
                        className="demo-typing font-display text-sm text-white inline-block whitespace-nowrap overflow-hidden border-r-2 border-accent"
                        style={{
                          animation: prefersReducedMotion
                            ? 'none'
                            : 'typewriter 2s steps(14) 0.5s forwards, blink-caret 0.8s steps(1) infinite',
                          width: prefersReducedMotion ? 'auto' : '0',
                        }}
                      >
                        Sarah Johnson
                      </span>
                    </div>
                  </div>
                  <div>
                    <span className="font-mono text-[10px] text-mist uppercase tracking-wider">Job Title</span>
                    <div className="mt-1 bg-white/5 rounded-lg px-3 py-2 overflow-hidden">
                      <span
                        className="demo-typing font-display text-sm text-white inline-block whitespace-nowrap overflow-hidden border-r-2 border-transparent"
                        style={{
                          animation: prefersReducedMotion
                            ? 'none'
                            : 'typewriter 2.5s steps(17) 3s forwards, blink-caret 0.8s steps(1) 3s infinite',
                          width: prefersReducedMotion ? 'auto' : '0',
                        }}
                      >
                        Product Designer
                      </span>
                    </div>
                  </div>
                  <div>
                    <span className="font-mono text-[10px] text-mist uppercase tracking-wider">Company</span>
                    <div className="mt-1 bg-white/5 rounded-lg px-3 py-2 overflow-hidden">
                      <span
                        className="demo-typing font-display text-sm text-white inline-block whitespace-nowrap overflow-hidden border-r-2 border-transparent"
                        style={{
                          animation: prefersReducedMotion
                            ? 'none'
                            : 'typewriter 1.5s steps(10) 6s forwards, blink-caret 0.8s steps(1) 6s infinite',
                          width: prefersReducedMotion ? 'auto' : '0',
                        }}
                      >
                        Stripe Inc
                      </span>
                    </div>
                  </div>
                </div>

                {/* Right: mini resume preview */}
                <div className="p-6 flex items-center justify-center">
                  <div className="w-full max-w-[180px] bg-white rounded-lg shadow-lg p-4 flex flex-col gap-2">
                    <div className="h-3 w-20 bg-ink rounded-sm" />
                    <div className="h-1.5 w-14 bg-accent/50 rounded-sm" />
                    <div className="h-px w-full bg-gray-200 my-0.5" />
                    <div className="space-y-1">
                      <div className="h-1 w-full bg-gray-200 rounded-sm" />
                      <div className="h-1 w-[85%] bg-gray-200 rounded-sm" />
                      <div className="h-1 w-[70%] bg-gray-200 rounded-sm" />
                    </div>
                    <div className="flex gap-1 mt-1">
                      <div className="h-2.5 w-8 bg-accent/15 rounded-full" />
                      <div className="h-2.5 w-10 bg-accent/15 rounded-full" />
                      <div className="h-2.5 w-6 bg-accent/15 rounded-full" />
                    </div>
                    <button
                      className="mt-2 bg-accent text-ink text-[9px] font-bold py-1 px-2 rounded font-mono"
                      style={{
                        animation: prefersReducedMotion ? 'none' : 'pulse-accent 2s ease-in-out 8s 3',
                      }}
                      tabIndex={-1}
                      aria-hidden="true"
                    >
                      Download PDF
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </RevealSection>
        </div>
      </section>

      {/* ═══════════ RESOURCE CARDS — light ═══════════ */}
      <section className="bg-chalk py-20 px-4" style={{ contentVisibility: 'auto', containIntrinsicSize: 'auto 600px' }}>
        <div className="max-w-6xl mx-auto">
          <RevealSection>
            <span className="font-mono text-xs tracking-[0.15em] text-accent uppercase mb-4 block">
              RESOURCES
            </span>
            <h2 className="font-display text-3xl md:text-4xl font-extrabold text-ink mb-12 tracking-tight">
              Everything You Need to Succeed
            </h2>
          </RevealSection>
          <RevealSection stagger>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[
                {
                  href: "/actual-free-resume-builder",
                  title: "Actual Free Resume Builder",
                  desc: "Learn why our builder is truly free - no paywalls, no watermarks, no hidden fees.",
                },
                {
                  href: "/free-resume-builder-no-sign-up",
                  title: "No Sign Up Required",
                  desc: "Start building immediately. No registration, no account, just instant access to all features.",
                },
                {
                  href: "/ats-resume-templates",
                  title: "ATS-Friendly Templates",
                  desc: "Download professional templates designed to pass Applicant Tracking Systems.",
                },
                {
                  href: "/resume-keywords",
                  title: "Resume Keywords Guide",
                  desc: "Industry-specific keywords that help your resume pass ATS and impress recruiters.",
                },
                {
                  href: "/free-resume-builder-download",
                  title: "Free Resume Download",
                  desc: "Download your resume as PDF or DOCX instantly — no payment, no sign-up, no watermarks.",
                },
                {
                  href: "/free-resume-builder-no-payment",
                  title: "No Payment, No Catch",
                  desc: "See how we compare to builders that charge $2-$25 for downloads. We are truly free.",
                },
              ].map((resource, i) => (
                <a
                  key={i}
                  href={resource.href}
                  className="group bg-chalk-dark rounded-2xl p-6 border border-transparent hover:bg-white hover:shadow-lg hover:border-black/[0.04] transition-all duration-300"
                >
                  <h3 className="font-display text-lg font-extrabold text-ink mb-2 flex items-center justify-between">
                    {resource.title}
                    <ArrowRightIcon className="w-4 h-4 text-stone-warm group-hover:text-accent group-hover:translate-x-1 transition-all duration-200 flex-shrink-0" />
                  </h3>
                  <p className="font-display font-extralight text-stone-warm text-sm leading-relaxed">
                    {resource.desc}
                  </p>
                </a>
              ))}
            </div>
          </RevealSection>
        </div>
      </section>

      {/* ═══════════ WHY CHOOSE US — keyword-rich prose ═══════════ */}
      <section className="bg-chalk py-20 px-4" style={{ contentVisibility: 'auto', containIntrinsicSize: 'auto 700px' }}>
        <div className="max-w-4xl mx-auto">
          <RevealSection>
            <span className="font-mono text-xs tracking-[0.15em] text-accent uppercase mb-4 block">
              THE EASYFREERESUME DIFFERENCE
            </span>
            <h2 className="font-display text-3xl md:text-5xl font-extrabold text-ink mb-12 tracking-tight">
              Why Choose EasyFreeResume?
            </h2>
          </RevealSection>

          <RevealSection stagger>
            <div className="grid md:grid-cols-2 gap-10 lg:gap-14">
              <div>
                <h3 className="font-display text-xl font-extrabold text-ink mb-3">Truly Free Downloads — No Surprises</h3>
                <p className="font-display font-extralight text-stone-warm leading-relaxed">
                  Other resume builders advertise "free" but charge $2–$25 the moment you try to download your PDF. EasyFreeResume is different: every template, every download, and every feature is 100% free. No credit card, no trial, no paywall.{' '}
                  <Link to="/free-resume-builder-download" className="text-accent hover:underline">Download your resume for free</Link> as many times as you need.
                </p>
              </div>
              <div>
                <h3 className="font-display text-xl font-extrabold text-ink mb-3">No Sign-Up Required — Start Instantly</h3>
                <p className="font-display font-extralight text-stone-warm leading-relaxed">
                  Skip the forms and email verification. Our{' '}
                  <Link to="/free-resume-builder-no-sign-up" className="text-accent hover:underline">no sign-up resume builder</Link>{' '}
                  lets you start creating your resume the moment you arrive. Optionally create a free account later to save your work to the cloud and manage multiple versions.
                </p>
              </div>
              <div>
                <h3 className="font-display text-xl font-extrabold text-ink mb-3">ATS-Friendly Templates That Get Results</h3>
                <p className="font-display font-extralight text-stone-warm leading-relaxed">
                  Every template is engineered to pass{' '}
                  <Link to="/templates/ats-friendly" className="text-accent hover:underline">Applicant Tracking Systems</Link>{' '}
                  used by 99% of Fortune 500 companies. Clean formatting, proper heading hierarchy, and machine-readable layouts ensure your resume reaches a human recruiter.
                </p>
              </div>
              <div>
                <h3 className="font-display text-xl font-extrabold text-ink mb-3">AI-Powered Resume Writing</h3>
                <p className="font-display font-extralight text-stone-warm leading-relaxed">
                  Use built-in AI features to write compelling bullet points, tailor your resume to job descriptions, and find the right{' '}
                  <Link to="/resume-keywords" className="text-accent hover:underline">resume keywords</Link>{' '}
                  for your industry. Powered by{' '}
                  <Link to="/blog/claude-resume-prompts" className="text-accent hover:underline">Claude</Link>,{' '}
                  <Link to="/blog/gemini-resume-prompts" className="text-accent hover:underline">Gemini</Link>, and ChatGPT — all free.
                </p>
              </div>
            </div>
          </RevealSection>
        </div>
      </section>

      {/* ═══════════ HOW TO BUILD — keyword-rich steps ═══════════ */}
      <section className="bg-chalk-dark py-20 px-4" style={{ contentVisibility: 'auto', containIntrinsicSize: 'auto 500px' }}>
        <div className="max-w-4xl mx-auto">
          <RevealSection>
            <span className="font-mono text-xs tracking-[0.15em] text-accent uppercase mb-4 block text-center">
              GET STARTED
            </span>
            <h2 className="font-display text-3xl md:text-5xl font-extrabold text-ink mb-12 tracking-tight text-center">
              How to Build Your Free Resume
            </h2>
          </RevealSection>

          <RevealSection stagger>
            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  step: "01",
                  title: "Pick a Template",
                  desc: "Browse our collection of ATS-friendly, professional resume templates. Every template is free — no premium tiers or locked designs.",
                },
                {
                  step: "02",
                  title: "Add Your Details",
                  desc: "Fill in your experience, skills, and education using our intuitive editor. Use AI suggestions to write stronger bullet points and match job descriptions.",
                },
                {
                  step: "03",
                  title: "Download Your Resume",
                  desc: "Export your finished resume as a polished PDF — instantly and for free. No sign-up, no payment, no watermarks. Ready to send to employers.",
                },
              ].map((item, i) => (
                <div key={i} className="bg-white rounded-2xl p-8 border border-black/[0.04] shadow-sm">
                  <span className="font-mono text-3xl text-accent/30 mb-4 block">{item.step}</span>
                  <h3 className="font-display text-lg font-extrabold text-ink mb-2">{item.title}</h3>
                  <p className="font-display font-extralight text-stone-warm leading-relaxed text-sm">{item.desc}</p>
                </div>
              ))}
            </div>
            <div className="text-center mt-10">
              <button
                className="btn-primary py-3.5 px-8 font-display"
                onClick={() => navigate("/templates")}
              >
                Build My Free Resume
                <ArrowRightIcon className="w-4 h-4 ml-2 inline" />
              </button>
            </div>
          </RevealSection>
        </div>
      </section>

      {/* ═══════════ FAQ — light, minimal ═══════════ */}
      <section className="bg-chalk py-20 px-4" style={{ contentVisibility: 'auto', containIntrinsicSize: 'auto 800px' }}>
        <div className="max-w-3xl mx-auto">
          <RevealSection>
            <span className="font-mono text-xs tracking-[0.15em] text-accent uppercase mb-4 block text-center">
              FAQ
            </span>
            <h2 className="font-display text-3xl md:text-5xl font-extrabold text-ink mb-4 text-center tracking-tight">
              Frequently Asked Questions
            </h2>
            <p className="font-display text-lg font-extralight text-stone-warm mb-12 text-center max-w-2xl mx-auto">
              Everything you need to know about building your free resume
            </p>
          </RevealSection>
          <div className="space-y-0">
            {faqs.map((faq, index) => (
              <details
                key={index}
                className="border-b border-black/[0.06] last:border-b-0 group"
              >
                <summary className="flex items-center justify-between w-full text-left py-5 cursor-pointer list-none [&::-webkit-details-marker]:hidden focus:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 rounded-lg">
                  <h3 className="font-display text-base font-extrabold text-ink pr-4">
                    {faq.question}
                  </h3>
                  <ChevronDownIcon
                    className="w-5 h-5 text-stone-warm transition-all duration-300 flex-shrink-0 group-open:rotate-180 group-open:text-accent"
                  />
                </summary>
                <div className="faq-content">
                  <div>
                    <p className="font-display font-extralight text-stone-warm pb-5 leading-relaxed">
                      {faq.answer}
                    </p>
                  </div>
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════ FINAL CTA ═══════════ */}
      <section className="bg-chalk py-20 px-4" style={{ contentVisibility: 'auto', containIntrinsicSize: 'auto 400px' }}>
        <div className="max-w-4xl mx-auto">
          <RevealSection variant="scale-in">
            <div className="relative bg-ink rounded-3xl py-20 px-6 md:py-24 md:px-12 overflow-hidden text-center">
              {/* Subtle radial accent glow */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] rounded-full bg-accent/[0.07] blur-3xl pointer-events-none" />

              <div className="relative z-10">
                <span className="font-mono text-xs tracking-[0.15em] text-accent uppercase mb-6 block">
                  READY?
                </span>
                <h2 className="font-display text-3xl md:text-[3.5rem] font-extrabold text-white mb-6 tracking-tight leading-tight">
                  Ready to Land Your Dream Job?
                </h2>
                <p className="font-display text-lg font-extralight text-mist mb-10 max-w-xl mx-auto leading-relaxed">
                  Join thousands of job seekers who've successfully created
                  professional resumes with our free builder.
                </p>
                <button
                  className="group inline-flex items-center justify-center bg-accent text-ink py-4 px-10 rounded-xl text-lg font-bold shadow-lg hover:shadow-accent/25 hover:shadow-2xl transform hover:-translate-y-0.5 transition-all duration-300 active:scale-95 font-display"
                  onClick={() => navigate(hasResumes ? "/my-resumes" : "/templates")}
                >
                  {hasResumes ? "Go to My Resumes" : "Start Building Your Resume"}
                  <ArrowRightIcon className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform duration-200" />
                </button>
              </div>
            </div>
          </RevealSection>
        </div>
      </section>
    </>
  );
};

export default LandingPage;
