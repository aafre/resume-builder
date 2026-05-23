import { Link } from "react-router-dom";
import BlogLayout from "../BlogLayout";
import RevealSection from "../shared/RevealSection";

const REVIEW_DATE = "2026-05-13";

const PROVIDERS = ["Claude", "ChatGPT", "Gemini", "Grok", "Copilot", "DeepSeek"] as const;
type Provider = (typeof PROVIDERS)[number];
type Rating = 1 | 2 | 3 | 4 | 5;
type RatingRow = { kind: "rating"; useCase: string; cells: Record<Provider, Rating> };
type TextRow = { kind: "text"; useCase: string; cells: Record<Provider, string> };
type ComparisonRow = RatingRow | TextRow;

function StarRating({ value }: { value: Rating }) {
  return (
    <span
      role="img"
      aria-label={`${value} out of 5`}
      className="inline-flex gap-0.5 text-base leading-none"
    >
      {Array.from({ length: 5 }, (_, i) => (
        <span key={i} className={i < value ? "text-accent" : "text-black/15"} aria-hidden="true">
          ★
        </span>
      ))}
    </span>
  );
}

function SectionEyebrow({ children }: { children: string }) {
  return (
    <span className="font-mono text-xs tracking-[0.15em] text-accent uppercase mb-3 block">
      {children}
    </span>
  );
}

const HUB_FAQS = [
  {
    id: "faq-best-free-ai-2026",
    question: "What's the best free AI for resume writing in 2026?",
    answer:
      "Claude and Google Gemini both have generous free tiers and produce strong resume output in our review. ChatGPT's free tier is more limited for long-context inputs. For pure prompt quality on rewriting work, Claude is consistently the best free option as of 2026-05.",
  },
  {
    id: "faq-chatgpt-vs-claude",
    question: "ChatGPT vs Claude for resume writing - which is better?",
    answer:
      "Claude tends to produce more polished prose with better quantification of achievements; ChatGPT is faster and better at strict formatting, such as bulleted lists with exact word counts. For experience-bullet rewriting and professional summary work, Claude is stronger. For high-volume drafting, ChatGPT is faster.",
  },
  {
    id: "faq-is-gemini-good-for-resume",
    question: "Is Gemini good for resume writing?",
    answer:
      "Yes, particularly for tailoring a resume to a specific job description. Gemini's Google integration makes it useful for job-description context and role-specific language. It is a strong pick for JD-tailoring workflows. For pure rewriting it is solid but slightly behind Claude and ChatGPT.",
  },
  {
    id: "faq-grok-or-deepseek-for-resume",
    question: "Can I use Grok or DeepSeek for resume writing?",
    answer:
      "Yes, but with caveats. Grok is fast and free but produces more generic output, so it is better for first drafts than finishing work. DeepSeek is inexpensive through common aggregator workflows, but its instruction-following on specific resume formats can be weaker. Use them for high-volume initial drafts you will refine elsewhere.",
  },
  {
    id: "faq-best-ats-keyword-extraction",
    question: "Which AI handles ATS keyword extraction best?",
    answer:
      "Claude, ChatGPT, and Gemini are roughly equivalent on ATS keyword analysis when given a job description and a target resume. Grok and Copilot are usable but produce less reliable keyword priority ranking. For final ATS work, pair any of the top three with our free ATS keyword scanner.",
  },
  {
    id: "faq-do-i-need-to-pay",
    question: "Do I need to pay to use AI for resume writing?",
    answer:
      "No. The free tiers of Claude, Gemini, and Copilot are sufficient for most resume writing. ChatGPT's free tier works for shorter tasks. Paid tiers are mainly useful for very high volume, longer context windows, team controls, or specific integrations.",
  },
  {
    id: "faq-is-it-safe-to-put-resume-in-ai",
    question: "Is it safe to put my resume into an AI tool?",
    answer:
      "Privacy varies by tool. Claude.ai offers data controls, ChatGPT includes data controls, and Gemini privacy depends on the edition and account type. Strip PII such as full name, address, phone, and email before pasting resume content into any free AI tier if privacy matters.",
  },
  {
    id: "faq-best-prompt-structure",
    question: "What's the best prompt structure for AI resume writing?",
    answer:
      "Three elements every prompt needs: the target role and job description, the current resume content or section, and an explicit output format such as bullet count, word count, and tone. Without these details the AI produces generic output. See our Claude and Gemini guides for tested prompt templates.",
  },
];

const COMPARISON_ROWS: ComparisonRow[] = [
  {
    kind: "rating",
    useCase: "Rewriting experience bullets",
    cells: { Claude: 5, ChatGPT: 4, Gemini: 3, Grok: 3, Copilot: 3, DeepSeek: 2 },
  },
  {
    kind: "rating",
    useCase: "Writing a professional summary",
    cells: { Claude: 5, ChatGPT: 4, Gemini: 4, Grok: 3, Copilot: 3, DeepSeek: 3 },
  },
  {
    kind: "rating",
    useCase: "Tailoring resume to a JD",
    cells: { Claude: 4, ChatGPT: 4, Gemini: 5, Grok: 3, Copilot: 3, DeepSeek: 2 },
  },
  {
    kind: "rating",
    useCase: "Quantifying achievements",
    cells: { Claude: 5, ChatGPT: 4, Gemini: 3, Grok: 3, Copilot: 2, DeepSeek: 2 },
  },
  {
    kind: "rating",
    useCase: "ATS keyword extraction",
    cells: { Claude: 4, ChatGPT: 4, Gemini: 4, Grok: 3, Copilot: 3, DeepSeek: 2 },
  },
  {
    kind: "rating",
    useCase: "Cover letter drafts",
    cells: { Claude: 5, ChatGPT: 4, Gemini: 4, Grok: 3, Copilot: 3, DeepSeek: 3 },
  },
  {
    kind: "text",
    useCase: "Free tier availability",
    cells: {
      Claude: "Yes",
      ChatGPT: "Limited",
      Gemini: "Yes",
      Grok: "Yes",
      Copilot: "Yes",
      DeepSeek: "Yes",
    },
  },
  {
    kind: "text",
    useCase: "Privacy / no training on your input",
    cells: {
      Claude: "Claude.ai opt-out",
      ChatGPT: "Data controls",
      Gemini: "Workspace edition",
      Grok: "Limited controls",
      Copilot: "Commercial controls",
      DeepSeek: "Limited controls",
    },
  },
];

const MODEL_SECTIONS = [
  {
    id: "chatgpt",
    name: "ChatGPT",
    strengths:
      "ChatGPT is fast, flexible, and strong at exact formatting instructions. It works well when you need five alternate bullets, a 50-word professional summary, or a clean first draft you can quickly revise.",
    limitations:
      "Compared to Claude, ChatGPT can sound flatter unless you provide tone, seniority, and measurable outcome constraints. Its free tier is best for shorter sections rather than full resume rewrites.",
    prompts: [
      "Rewrite these 3 experience bullets for a [target role]. Keep each under 22 words, start with a strong action verb, and add measurable impact where the source material supports it: [paste bullets].",
      "Write a 3-sentence professional summary for a [target role] using this resume: [paste resume]. Avoid buzzwords, include 2 strengths, and keep it under 70 words.",
      "Extract the top ATS keywords from this job description, group them by skill category, and show which ones are missing from my resume: [paste JD] [paste resume].",
    ],
  },
  {
    id: "claude",
    name: "Claude",
    strengths:
      "Claude is the strongest option for rewriting bullets and adding specific, credible impact language. It handles long resume context well and is especially useful for senior candidates who need concise narrative polish.",
    limitations:
      "Compared to ChatGPT, Claude is less rigid about exact formatting unless the prompt is explicit. Use it for quality rewriting, then ask for a strict final format if you need precise bullet counts.",
    prompts: [
      "Turn these responsibilities into accomplishment bullets for a [target role]. Preserve facts, do not invent metrics, and suggest where a metric would strengthen the point: [paste content].",
      "Rewrite this summary to sound confident but not inflated. Keep it under 65 words and anchor it to the target role: [paste summary] [paste JD].",
      "Find weak or generic phrases in this resume section and replace them with clearer, outcome-focused wording: [paste section].",
    ],
    cta: {
      text: "See the full Claude resume prompts guide",
      href: "/blog/claude-resume-prompts",
    },
  },
  {
    id: "gemini",
    name: "Gemini",
    strengths:
      "Gemini is the best fit for tailoring a resume to a job description. Its strength is connecting role language, company context, and resume phrasing into a targeted application draft.",
    limitations:
      "Compared to Claude, Gemini is usually better for alignment and research context than final prose polish. Use it to identify what to tailor, then refine the final wording.",
    prompts: [
      "Compare this resume with this job description. Return the 10 highest-priority changes, grouped by summary, experience, and skills: [paste resume] [paste JD].",
      "Rewrite my professional summary for this exact role using keywords from the job description without keyword stuffing: [paste summary] [paste JD].",
      "List the role-specific skills I should add or emphasize for this application, but only if they are supported by my resume: [paste resume] [paste JD].",
    ],
    cta: {
      text: "See the full Gemini resume prompts guide",
      href: "/blog/gemini-resume-prompts",
    },
  },
  {
    id: "grok",
    name: "Grok",
    strengths:
      "Grok is useful for quick iteration, brainstorming alternate phrasing, and getting direct feedback on weak resume language. It is strongest when speed matters more than final polish.",
    limitations:
      "Compared to Claude and ChatGPT, Grok tends to produce more generic resume copy unless you give it concrete resume facts, role context, and strict output constraints.",
    prompts: [
      "Give me 5 sharper versions of this bullet. Make version 1 action-oriented, version 2 metrics-focused, version 3 concise, version 4 leadership-focused, and version 5 ATS-friendly: [paste bullet].",
      "Write a quick professional summary for a [target role] based on these facts. Avoid generic claims and keep it under 60 words: [paste facts].",
      "Review this resume section bluntly. What sounds generic, what is missing, and what would make it stronger for [target role]? [paste section].",
    ],
  },
  {
    id: "copilot",
    name: "Copilot",
    strengths:
      "Copilot is strongest for web-grounded workflows, such as checking current job-posting language before you revise a resume. It is useful for research-heavy steps and quick keyword discovery.",
    limitations:
      "Compared to Claude and ChatGPT, Copilot is less consistent for final resume prose. Use it to gather role context, then polish the final bullets in a writing-focused model.",
    prompts: [
      "Search current job postings for [target role] and summarize the skills and tools that appear most often. Then map them to this resume: [paste resume].",
      "Rewrite these bullets for a [target role], keeping each under 24 words and preserving only facts present in the original: [paste bullets].",
      "Extract ATS keywords from this job description and rank them by importance for the resume skills section: [paste JD].",
    ],
  },
  {
    id: "deepseek",
    name: "DeepSeek",
    strengths:
      "DeepSeek can be cost-effective for high-volume first drafts, especially when you need many variations of summaries, skills lists, or bullet rewrites before human editing.",
    limitations:
      "Compared to ChatGPT and Claude, DeepSeek needs tighter instructions for resume format and tone. Treat it as a draft generator, not the final resume editor.",
    prompts: [
      "Generate 6 versions of this resume bullet for a [target role]. Keep the facts unchanged and vary the action verb in each version: [paste bullet].",
      "Draft a concise professional summary from these resume facts. Use plain language, no hype, and keep it under 65 words: [paste facts].",
      "Identify ATS keywords in this job description and suggest where each could fit in my resume without adding unsupported experience: [paste JD] [paste resume].",
    ],
  },
];

const INTERNAL_LINKS = [
  { href: "/templates", label: "Browse resume templates" },
  { href: "/free-resume-builder-no-sign-up", label: "Build a resume without sign-up" },
  { href: "/blog/claude-resume-prompts", label: "Claude resume prompts" },
  { href: "/blog/gemini-resume-prompts", label: "Gemini resume prompts" },
  { href: "/blog/best-free-resume-builders-2026", label: "Best free resume builders" },
  { href: "/blog/ai-cover-letter-prompts", label: "AI cover letter prompts" },
  { href: "/blog/ai-resume-writing-guide", label: "AI resume writing guide" },
  { href: "/resume-keyword-scanner", label: "ATS keyword scanner" },
];

const PROVIDER_LINKS = [
  { href: "https://support.anthropic.com/", label: "Anthropic Claude support" },
  { href: "https://openai.com/policies/row-privacy-policy/", label: "OpenAI privacy policy" },
  { href: "https://gemini.google.com/", label: "Google Gemini" },
  { href: "https://support.microsoft.com/copilot", label: "Microsoft Copilot support" },
  { href: "https://grok.com/", label: "Grok" },
  { href: "https://api-docs.deepseek.com/", label: "DeepSeek API docs" },
];

export default function AIResumePromptsHub() {
  return (
    <BlogLayout
      title="AI Resume Prompts Hub: Best Prompts for ChatGPT, Claude, Gemini & More"
      description="Compare Claude, ChatGPT, Gemini, Grok, Copilot, and DeepSeek for resume writing. Pick the best AI prompt for bullets, summaries, ATS keywords, and cover letters."
      publishDate={REVIEW_DATE}
      lastUpdated={REVIEW_DATE}
      readTime="12 min"
      keywords={[
        "ai resume prompts",
        "best ai for resume writing",
        "chatgpt resume prompts",
        "claude resume prompts",
        "gemini resume prompts",
        "ats keyword prompts",
      ]}
      ctaType="resume"
      faqs={HUB_FAQS}
    >
        <div className="space-y-10">
          <section className="relative bg-white rounded-2xl shadow-premium card-gradient-border p-6 md:p-8 border-l-4 border-accent">
            <SectionEyebrow>The Short Answer</SectionEyebrow>
            <time
              dateTime={REVIEW_DATE}
              className="font-mono text-[11px] tracking-[0.15em] text-mist uppercase block mb-3"
            >
              Last reviewed {REVIEW_DATE} · Refresh cadence: Quarterly
            </time>
            <p className="text-base md:text-lg leading-relaxed text-ink/90">
              <strong>Short answer:</strong> For resume writing in 2026, Claude and ChatGPT
              produce the strongest output for rewriting bullets and crafting summaries. Gemini
              wins for tailoring to a specific job description thanks to Google integration.
              Grok and Copilot are fast and free but more generic. DeepSeek is cheapest but
              limited. Choose based on your task and privacy preferences.
            </p>
          </section>

          <RevealSection variant="fade-up">
            <section>
              <SectionEyebrow>Tool × Use Case</SectionEyebrow>
              <h2 className="font-display text-3xl md:text-4xl font-extrabold tracking-tight text-ink">AI Resume Prompts Comparison</h2>
              <div className="mt-6 overflow-x-auto rounded-2xl shadow-premium bg-white">
                <table
                  aria-label="AI resume prompts comparison"
                  className="w-full min-w-[760px] border-collapse text-sm"
                >
                  <thead className="bg-chalk-dark text-left text-ink">
                    <tr>
                      <th scope="col" className="px-4 py-3 font-bold">Use case</th>
                      {PROVIDERS.map((provider) => (
                        <th key={provider} scope="col" className="px-4 py-3 font-bold">{provider}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {COMPARISON_ROWS.map((row, idx) => (
                      <tr
                        key={row.useCase}
                        className={`border-t border-black/[0.04] ${idx % 2 === 1 ? "bg-chalk/40" : ""}`}
                      >
                        <th scope="row" className="px-4 py-3 text-left font-semibold text-ink">{row.useCase}</th>
                        {PROVIDERS.map((provider) => (
                          <td key={provider} className="px-4 py-3 text-ink/85">
                            {row.kind === "rating"
                              ? <StarRating value={row.cells[provider]} />
                              : row.cells[provider]}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          </RevealSection>

          <RevealSection variant="fade-up">
            <section className="grid md:grid-cols-[1fr_2fr] gap-6 md:gap-10 items-start">
              <div>
                <SectionEyebrow>Methodology</SectionEyebrow>
                <h2 className="font-display text-3xl md:text-4xl font-extrabold tracking-tight text-ink">How We Reviewed These AIs</h2>
              </div>
              <p className="md:mt-9 leading-relaxed text-stone-warm">
                <strong>How we reviewed:</strong> We compared the six tools against common
                resume-writing tasks: rewriting experience bullets, writing a professional summary,
                tailoring to a job description, quantifying achievements, extracting ATS keywords,
                and drafting a cover letter intro. The sections below describe the documented
                strengths and limitations of each tool based on our 2026 review cycle.
              </p>
            </section>
            <section className="mt-8 grid gap-6 md:grid-cols-3">
              <div className="bg-white rounded-2xl p-8 card-gradient-border shadow-premium shadow-premium-hover hover:-translate-y-1 transition-all duration-300">
                <h3 className="font-display text-xl font-bold text-ink">Best for bullet rewrites</h3>
                <p className="mt-3 text-stone-warm leading-relaxed">
                  Claude is the strongest choice when the goal is clearer, more quantified
                  experience bullets.
                </p>
              </div>
              <div className="bg-white rounded-2xl p-8 card-gradient-border shadow-premium shadow-premium-hover hover:-translate-y-1 transition-all duration-300">
                <h3 className="font-display text-xl font-bold text-ink">Best for summaries</h3>
                <p className="mt-3 text-stone-warm leading-relaxed">
                  Claude and ChatGPT are the best starting points for short professional summaries
                  with controlled tone.
                </p>
              </div>
              <div className="bg-white rounded-2xl p-8 card-gradient-border shadow-premium shadow-premium-hover hover:-translate-y-1 transition-all duration-300">
                <h3 className="font-display text-xl font-bold text-ink">Best for ATS keywords</h3>
                <p className="mt-3 text-stone-warm leading-relaxed">
                  Claude, ChatGPT, and Gemini all work well when paired with a specific job
                  description and the <Link to="/resume-keyword-scanner" className="text-accent hover:underline">ATS keyword scanner</Link>.
                </p>
              </div>
            </section>
          </RevealSection>

          <RevealSection variant="fade-up">
            <section className="space-y-6">
              <div>
                <SectionEyebrow>Prompts by Tool</SectionEyebrow>
                <h2 className="font-display text-3xl md:text-4xl font-extrabold tracking-tight text-ink">Best AI Resume Prompts by Tool</h2>
              </div>
              {MODEL_SECTIONS.map((model, idx) => (
                <article
                  key={model.id}
                  id={model.id}
                  className="bg-white rounded-2xl p-6 md:p-8 shadow-premium shadow-premium-hover hover:-translate-y-0.5 transition-all duration-300"
                >
                  <span className="font-mono text-[11px] tracking-[0.15em] text-mist uppercase block mb-2">
                    {String(idx + 1).padStart(2, "0")} / {String(MODEL_SECTIONS.length).padStart(2, "0")}
                  </span>
                  <h3 className="font-display text-xl font-bold text-ink">{model.name}</h3>
                  <p className="mt-3 text-stone-warm leading-relaxed">{model.strengths}</p>
                  <p className="mt-3 text-stone-warm leading-relaxed">{model.limitations}</p>
                  {model.cta && (
                    <p className="mt-4">
                      <Link to={model.cta.href} className="font-semibold text-accent hover:underline inline-flex items-center gap-1">
                        {model.cta.text}
                        <span aria-hidden="true">→</span>
                      </Link>
                    </p>
                  )}
                  <div className="mt-5">
                    <h4 className="font-bold text-ink text-sm uppercase tracking-wide">Reference prompts</h4>
                    <ol className="mt-3 list-decimal space-y-2 pl-5 text-sm text-stone-warm leading-relaxed marker:text-accent marker:font-bold">
                      {model.prompts.map((prompt) => (
                        <li key={prompt}>{prompt}</li>
                      ))}
                    </ol>
                  </div>
                </article>
              ))}
            </section>
          </RevealSection>

          <RevealSection variant="fade-up">
            <section>
              <SectionEyebrow>Keep Reading</SectionEyebrow>
              <h2 className="font-display text-3xl md:text-4xl font-extrabold tracking-tight text-ink">Related Resume AI Resources</h2>
              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                {INTERNAL_LINKS.map((link) => (
                  <Link
                    key={link.href}
                    to={link.href}
                    className="bg-chalk-dark rounded-2xl p-5 font-semibold text-ink hover:bg-white hover:shadow-lg border border-transparent hover:border-black/[0.04] transition-all duration-300 inline-flex items-center justify-between gap-2"
                  >
                    <span>{link.label}</span>
                    <span aria-hidden="true" className="text-accent">→</span>
                  </Link>
                ))}
              </div>
            </section>
          </RevealSection>

          <RevealSection variant="fade-in">
            <section>
              <SectionEyebrow>Sources</SectionEyebrow>
              <h2 className="font-display text-3xl md:text-4xl font-extrabold tracking-tight text-ink">Provider References</h2>
              <p className="mt-3 text-stone-warm leading-relaxed">
                Use provider documentation and account settings before pasting sensitive resume data
                into any AI tool.
              </p>
              <ul className="mt-4 flex flex-wrap gap-2">
                {PROVIDER_LINKS.map((link) => (
                  <li key={link.href}>
                    <a
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 rounded-full bg-chalk-dark px-4 py-2 font-mono text-xs tracking-wide text-ink/80 hover:bg-white hover:text-accent border border-transparent hover:border-black/[0.06] transition-all duration-200"
                    >
                      {link.label}
                      <span aria-hidden="true">↗</span>
                    </a>
                  </li>
                ))}
              </ul>
            </section>
          </RevealSection>

          <RevealSection variant="fade-up">
            <section>
              <SectionEyebrow>Questions</SectionEyebrow>
              <h2 className="font-display text-3xl md:text-4xl font-extrabold tracking-tight text-ink">AI Resume Prompts FAQ</h2>
              <div className="mt-6 space-y-3">
                {HUB_FAQS.map((faq) => (
                  <details
                    key={faq.question}
                    id={faq.id}
                    className="group rounded-2xl border border-black/[0.06] bg-white px-5 py-4 hover:border-accent/30 transition-colors duration-200"
                  >
                    <summary className="cursor-pointer list-none flex items-start justify-between gap-4">
                      <h3 className="font-display text-xl font-bold text-ink">{faq.question}</h3>
                      <span
                        aria-hidden="true"
                        className="text-accent text-2xl leading-none flex-shrink-0 transition-transform duration-300 group-open:rotate-45 mt-1"
                      >
                        +
                      </span>
                    </summary>
                    <div className="faq-content">
                      <div>
                        <p className="mt-3 text-stone-warm leading-relaxed">{faq.answer}</p>
                      </div>
                    </div>
                  </details>
                ))}
              </div>
            </section>
          </RevealSection>

          <RevealSection variant="scale-in">
            <section className="relative bg-ink rounded-3xl py-16 px-6 md:py-20 md:px-12 overflow-hidden text-center text-white">
              <div
                aria-hidden="true"
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] rounded-full bg-accent/[0.07] blur-3xl pointer-events-none"
              />
              <div className="relative z-10">
                <span className="font-mono text-xs tracking-[0.15em] text-accent uppercase mb-6 block">
                  Ready?
                </span>
                <h2 className="font-display text-3xl md:text-4xl font-extrabold tracking-tight leading-tight mb-4">
                  Turn the Prompt Output Into a Finished Resume
                </h2>
                <p className="text-white/80 max-w-xl mx-auto mb-8 leading-relaxed">
                  Pick a template, paste your strongest AI-assisted bullets, and export a clean PDF
                  without creating an account.
                </p>
                <Link
                  to="/templates"
                  className="btn-primary px-8 py-3.5"
                >
                  Browse resume templates
                </Link>
              </div>
            </section>
          </RevealSection>
        </div>
    </BlogLayout>
  );
}
