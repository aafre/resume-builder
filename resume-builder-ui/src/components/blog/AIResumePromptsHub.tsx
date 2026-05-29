import { Link } from "react-router-dom";
import BlogLayout from "../BlogLayout";
import RevealSection from "../shared/RevealSection";

const REVIEW_DATE = "2026-05-25";

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
    <span className="font-mono text-xs tracking-[0.15em] text-accent-text uppercase mb-3 block">
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
    bestFor: "Fast drafts with strict formatting",
    strengths:
      "ChatGPT was the most predictable tool when the prompt specified output shape: exact bullet counts, maximum word counts, tables, and before/after alternatives. In the review fixture, it scored 4/5 on bullet rewriting, summaries, JD tailoring, metric work, ATS keyword extraction, and cover letters. That pattern matters for job seekers who need controlled drafts more than a single polished answer. It is also useful when you want five variants of the same bullet, because it follows enumeration instructions cleanly and makes the tradeoffs between concise, metrics-led, leadership-led, and keyword-led versions easy to compare.",
    limitations:
      "The weaker ChatGPT outputs were technically correct but generic: bullets often kept the same verb, swapped in familiar resume language, and needed a second pass to remove filler like \"cross-functional\" or \"results-driven.\" Use it with a hard evidence rule: no invented metrics, no unsupported tools, and no claim stronger than the source bullet. For full resume rewrites, split the work into summary, experience, skills, then final QA.",
    before: "Managed a team project to improve reporting and helped stakeholders understand data.",
    after:
      "Led 6-person reporting rebuild that cut weekly status prep from 4 hours to 45 minutes and gave finance leaders a single KPI dashboard.",
  },
  {
    id: "claude",
    name: "Claude",
    bestFor: "Turning responsibilities into quantified achievement bullets",
    strengths:
      "Claude was the strongest writing editor in the review set. It was the only tool scored 5/5 for both rewriting experience bullets and quantifying achievements, which matches the practical difference job seekers notice: it keeps the source claim intact while making the outcome sharper. Claude is especially good when the original bullet has scattered facts, such as project scope in one sentence and business impact in another. It can combine them into a concise STAR-style bullet without sounding inflated.",
    limitations:
      "Claude needs explicit format constraints when the deliverable must be exact. Without a bullet count, word limit, or output template, it may give a thoughtful critique before the rewrite. That is useful during diagnosis but inefficient when you already know the target. Ask it to preserve every factual noun, flag missing metrics in brackets, and return only the final bullets when you need production-ready resume copy.",
    before: "Responsible for improving onboarding documentation for new engineers.",
    after:
      "Rebuilt engineering onboarding docs into a 30-day checklist, reducing repeated setup questions by 40% across 18 new-hire ramp plans.",
    cta: {
      text: "See the full Claude resume prompts guide",
      href: "/blog/claude-resume-prompts",
    },
  },
  {
    id: "gemini",
    name: "Gemini",
    bestFor: "Mapping a resume to a specific job description",
    strengths:
      "Gemini was the only tool rated 5/5 for tailoring a resume to a job description. Its advantage is not final prose polish; it is match analysis. When the prompt includes the resume, target role, and job description, Gemini is strong at surfacing language gaps, repeated requirements, and role-specific keywords that belong in the summary or skills section. It is useful before rewriting because it can tell you which bullets deserve attention and which keywords would be unsupported if you added them.",
    limitations:
      "Gemini rewrites can read more like an alignment memo than a finished resume. It may over-index on the job description and produce wording that sounds copied from the posting. Use it for the analysis step, then either ask for a plain-English rewrite or move the selected changes into Claude or ChatGPT for final copy. Keep a strict rule that every suggested keyword must map to a real resume fact.",
    before: "Worked on product analytics and created dashboards for business teams.",
    after:
      "Built self-serve product analytics dashboards for activation, retention, and funnel health, aligning roadmap decisions with Senior PM growth metrics.",
    cta: {
      text: "See the full Gemini resume prompts guide",
      href: "/blog/gemini-resume-prompts",
    },
  },
  {
    id: "grok",
    name: "Grok",
    bestFor: "Quick critique and alternate phrasings",
    strengths:
      "Grok is useful when the resume problem is speed: you need blunt feedback, a short list of stronger verbs, or alternate phrasings before choosing the final direction. In the review table, it lands in the middle tier because it can diagnose weak language quickly but does not consistently turn that diagnosis into the best final bullet. For early drafting, that is still useful. Ask Grok to identify what sounds generic, what is missing, and which bullet should be rewritten first.",
    limitations:
      "Grok's resume copy needs guardrails. Without source facts, it may reach for broad claims like \"optimized workflows\" or \"improved collaboration\" that do not help a recruiter. Treat it as a fast reviewer, not the final editor. Put the source bullet, target role, and forbidden words in the same prompt, then ask for three options rather than one definitive rewrite.",
    before: "Helped improve the sales process and worked with account managers.",
    after:
      "Mapped 14 sales handoff gaps with account managers and shipped a CRM checklist that reduced missed renewal tasks in the pilot region.",
  },
  {
    id: "copilot",
    name: "Copilot",
    bestFor: "Researching current role language before rewriting",
    strengths:
      "Copilot is strongest when the resume task starts with current market language. It can help compare live job postings, summarize repeated skill requirements, and identify language that is common across employers. That makes it helpful before ATS keyword extraction or when a candidate is moving into a role with unfamiliar terminology. In the review table, Copilot scored 3/5 across most writing tasks and 2/5 on quantifying achievements, so its best use is research and verification rather than final bullet writing.",
    limitations:
      "Copilot is less reliable as a final resume writer because the prose can stay broad and research-shaped. It may say what a resume should emphasize without producing a strong bullet. Use it to gather role patterns, then pass the specific supported changes into a rewrite prompt. For sensitive work material, business users should distinguish consumer Copilot from Microsoft 365 Copilot Chat with enterprise data protection.",
    before: "Used Excel and PowerPoint to support quarterly planning.",
    after:
      "Built Excel planning model and executive PowerPoint pack used by 12 regional leads to compare quarterly pipeline, risk, and staffing scenarios.",
  },
  {
    id: "deepseek",
    name: "DeepSeek",
    bestFor: "Low-cost first drafts that will be edited",
    strengths:
      "DeepSeek can be useful when cost or volume matters more than final polish. It is a reasonable first-draft generator for alternate summaries, skill groupings, and rough bullet rewrites. In the review table, it does not score above 3/5 on any editorial writing task and scores 2/5 on bullet rewriting, JD tailoring, quantifying achievements, and ATS keyword extraction. That does not make it useless. It means the human review pass matters more.",
    limitations:
      "DeepSeek needs the tightest constraints in this group. Ask for plain language, no invented metrics, no unsupported tools, and no buzzwords. It is best used upstream: generate many options, discard the generic ones, then put the strongest candidate through a QA prompt. For resumes with proprietary work, review DeepSeek's current privacy policy and your employer's rules before pasting full project details.",
    before: "Created reports and worked with team members to improve operations.",
    after:
      "Drafted weekly operations reports from 9 source files and flagged recurring inventory delays for the warehouse lead review.",
  },
];

const WORKFLOW_STEPS = [
  {
    title: "Step 1: Set Up Your AI Context",
    description:
      "Use this as a project instruction, custom instruction, or first message. It turns the model from a generic writer into a resume editor with boundaries.",
    code: `You are a senior technical recruiter and resume editor.

Goal: rewrite resume content for [TARGET ROLE] without inventing facts.

Rules:
- Use the STAR method: situation, task, action, result.
- Preserve every factual claim from the source material.
- Never invent metrics, tools, employers, titles, certifications, or dates.
- If a metric is missing, write [METRIC NEEDED] instead of guessing.
- Reject passive voice, buzzwords, and vague verbs such as helped, managed, worked on, responsible for.
- Output exactly [NUMBER] bullets.
- Keep each bullet under [WORD LIMIT] words.
- Start every bullet with a strong past-tense action verb.
- Return only the requested resume content unless I ask for explanation.`,
  },
  {
    title: "Step 2: Prepare Your Source Material",
    description:
      "Paste structured inputs before asking for rewrites. The better the source material, the less the model has to guess.",
    code: `# Target role
[TARGET ROLE TITLE]

# Job description
[PASTE JOB DESCRIPTION OR JD URL TEXT]

# Current resume section
[PASTE CURRENT SUMMARY, EXPERIENCE BULLETS, AND SKILLS]

# Raw facts the resume does not yet show
- Team size: [TEAM SIZE]
- Scope: [PRODUCT, REGION, BUDGET, CUSTOMERS, USERS, SYSTEMS]
- Metrics I can verify: [REVENUE, COST, TIME, QUALITY, RISK, VOLUME]
- Tools and methods I used: [TOOLS, FRAMEWORKS, METHODS]

# Tone
[EXAMPLE: senior, direct, technical, measured, not salesy]

# Constraints
- Do not add unsupported keywords.
- Do not write a bullet I could not defend in an interview.
- Mark missing proof as [METRIC NEEDED].`,
  },
  {
    title: "Step 3: Analysis Prompt",
    description:
      "Run analysis before rewriting. This catches gaps, unsupported keywords, and places where your strongest facts are buried.",
    code: `Compare my resume source material with the target job description.

Return a markdown table with these columns:
1. JD requirement
2. Evidence already present in my resume
3. Evidence missing or weak
4. Match score from 1 to 5
5. Resume section to update

Then list:
- The 5 highest-priority changes.
- Keywords I should not add because my source material does not support them.
- Metrics that would strengthen the resume if I can verify them.

Use only the source material I provided.`,
  },
  {
    title: "Step 4: Rewriting Prompt",
    description:
      "Use the analysis output as the brief. This keeps the rewrite tied to the target role without copying the job post.",
    code: `Using the gap analysis above, rewrite my [SUMMARY OR EXPERIENCE SECTION].

Requirements:
- Keep only facts supported by my source material.
- Use the target job description for emphasis, not for copied phrasing.
- Replace weak verbs such as helped, managed, worked on, supported, responsible for.
- Include metrics only when the source gives them.
- If a metric is implied but not proven, write [METRIC NEEDED].
- Keep each experience bullet under 24 words.
- Do not use first person.
- Return:
  1. Final resume text
  2. A short "facts preserved" checklist
  3. A short "claims to verify" checklist`,
  },
  {
    title: "Step 5: QA and Refinement Prompt",
    description:
      "The QA pass is where many AI resume drafts improve. Ask the model to audit, not praise, its own output.",
    code: `Audit the rewritten resume content against this rubric.

Score each item from 1 to 5:
- Factual accuracy
- Metric preservation
- Action verb strength
- ATS keyword fit
- Readability
- Interview defensibility

Then return:
- Any unsupported claim to remove
- Any vague phrase to replace
- Any bullet over 24 words
- Any keyword that feels stuffed
- A final corrected version

Do not compliment the draft. Only flag problems and provide the corrected text.`,
  },
];

const PRIVACY_ROWS = [
  {
    provider: "Claude",
    freeTier: "Claude Free, Pro, and Max users control whether chats help improve Claude through privacy settings; incognito chats are not used for improvement.",
    optOut: "Check Claude privacy settings before pasting sensitive details; safety-flagged conversations can still be used for trust and safety work.",
    enterprise: "Team and Enterprise plans add administrative controls.",
  },
  {
    provider: "ChatGPT",
    freeTier: "Personal Free, Plus, and Pro workspaces can use chats to improve models unless data sharing is turned off.",
    optOut: "Settings > Data Controls > Improve the model for everyone: off. Temporary Chats are not used for training and are deleted after 30 days.",
    enterprise: "Business, Enterprise, Edu, and API inputs and outputs are not used to train models by default.",
  },
  {
    provider: "Gemini",
    freeTier: "Gemini Apps collect prompts, uploaded files, feedback, and related app data under Google's Gemini Apps Privacy Notice.",
    optOut: "Review Gemini Apps Activity and Google account privacy settings before uploading a resume.",
    enterprise: "Google Workspace editions provide separate admin and data controls.",
  },
  {
    provider: "Grok",
    freeTier: "X lets users control whether Grok interactions, inputs, and results are used for training and fine-tuning.",
    optOut: "X settings > Privacy and safety > Data sharing and personalization > Grok and third-party collaborators.",
    enterprise: "Enterprise controls depend on the xAI or X product surface used.",
  },
  {
    provider: "Copilot",
    freeTier: "Consumer Copilot conversations are handled under Microsoft's consumer privacy terms.",
    optOut: "Review Copilot history and Microsoft privacy settings before pasting sensitive resume data.",
    enterprise: "Microsoft 365 Copilot Chat prompts and responses stay in the Microsoft 365 service boundary and are not used to train foundation models.",
  },
  {
    provider: "DeepSeek",
    freeTier: "DeepSeek publishes separate platform privacy terms; assume limited consumer controls unless your account settings show otherwise.",
    optOut: "Do not paste proprietary resume details unless the current policy and your employer allow it.",
    enterprise: "Use API or enterprise agreements when contractual data handling matters.",
  },
];

const ATS_ROWS = [
  { provider: "Claude", rating: "Strong", note: "Good at plain-language bullets when told to avoid tables, icons, columns, and decorative formatting." },
  { provider: "ChatGPT", rating: "Strong", note: "Best at strict output templates; ask for plain text bullets and a separate keyword checklist." },
  { provider: "Gemini", rating: "Good", note: "Strong keyword mapping, but final wording can mirror the job post if the prompt is loose." },
  { provider: "Grok", rating: "Adequate", note: "Useful for critique, but needs explicit rules against generic language and keyword stuffing." },
  { provider: "Copilot", rating: "Adequate", note: "Useful for current role language; less consistent as a final ATS-safe prose editor." },
  { provider: "DeepSeek", rating: "Weak", note: "Can draft options, but needs human review for unsupported keywords and formatting discipline." },
];

const TOKEN_ROWS = [
  { provider: "Claude", limit: "Claude API docs list up to 1M tokens for newer long-context models; some other Claude models use 200K. Claude.ai chat may use rolling context.", resumeUse: "Best fit for full resume plus JD plus critique history, but still split final edits by section." },
  { provider: "ChatGPT", limit: "OpenAI API model limits vary by model; current GPT-5 family API pages list large windows such as 400K. ChatGPT free UI limits are not the same as API limits.", resumeUse: "Good for one resume section at a time. Use projects or saved instructions for repeat workflows." },
  { provider: "Gemini", limit: "Gemini 2.5 Pro and Flash API docs list 1,048,576 input tokens.", resumeUse: "Strong for long JD comparison and keyword mapping across a full resume." },
  { provider: "Grok", limit: "xAI docs list large API windows for current Grok models, including 1M and 2M variants depending on model.", resumeUse: "Enough room for long resumes in API contexts; consumer app behavior can differ." },
  { provider: "Copilot", limit: "Microsoft does not publish one universal consumer Copilot resume-sized context limit.", resumeUse: "Use concise excerpts for consumer chat; use Microsoft 365 surfaces when work data governance matters." },
  { provider: "DeepSeek", limit: "DeepSeek API pricing docs list 64K context for deepseek-chat and deepseek-reasoner.", resumeUse: "Enough for most resumes and a JD, but avoid long chat history before the final rewrite." },
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
      readTime="18 min"
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
              <strong>Short answer:</strong> In our 6-tool, 108-output review, Claude was
              the only tool that scored 5/5 for both bullet rewrites and quantifying
              achievements. Gemini was the only 5/5 for tailoring a resume to a job
              description. ChatGPT was the most consistent strict-format drafter. Use
              Grok, Copilot, and DeepSeek for faster upstream work, then QA every claim.
            </p>
          </section>

          <RevealSection variant="fade-up">
            <section>
              <SectionEyebrow>Tool × Use Case</SectionEyebrow>
              <h2 id="comparison" className="font-display text-3xl md:text-4xl font-extrabold tracking-tight text-ink">AI Resume Prompts Comparison</h2>
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
            <section className="space-y-6">
              <div className="grid md:grid-cols-[1fr_2fr] gap-6 md:gap-10 items-start">
                <div>
                  <SectionEyebrow>Methodology</SectionEyebrow>
                  <h2 id="methodology" className="font-display text-3xl md:text-4xl font-extrabold tracking-tight text-ink">How We Reviewed These AIs</h2>
                </div>
                <div className="md:mt-9 space-y-4 text-stone-warm leading-relaxed">
                  <p>
                    <strong>How we reviewed:</strong> We tested the six tools with the same
                    fixture: a mid-career software engineer resume with 8 experience bullets
                    and a target Senior Product Manager job description from a Fortune
                    500-style company. Each tool handled 6 task types: bullet rewriting,
                    professional summaries, JD tailoring, metric strengthening, ATS keyword
                    extraction, and cover letter intros.
                  </p>
                  <p>
                    The scorecard used 3 runs per task per tool, for 108 total outputs. We
                    scored the best usable output from each run set on factual preservation,
                    action verb strength, metric handling, ATS keyword fit, readability, and
                    interview defensibility. The comparison table above is the public summary
                    of that rubric. We did not publish percentage claims for metric
                    preservation because the current evidence file stores rubric scores, not
                    a token-level metric retention audit.
                  </p>
                  <p>
                    For free-tier notes, we tested public chat experiences and checked
                    provider documentation where model, privacy, and context-window details
                    were published. When a consumer chat product did not expose the exact
                    model or context window, we say so instead of treating API limits as
                    identical to the free web UI.
                  </p>
                </div>
              </div>
              <div className="grid gap-6 md:grid-cols-3">
                <div className="bg-white rounded-2xl p-8 card-gradient-border shadow-premium shadow-premium-hover hover:-translate-y-1 transition-all duration-300">
                  <h3 className="font-display text-xl font-bold text-ink">Best for bullet rewrites</h3>
                  <p className="mt-3 text-stone-warm leading-relaxed">
                    Claude scored 5/5 because it most consistently turned responsibility
                    statements into specific outcome bullets without inventing unsupported
                    metrics.
                  </p>
                </div>
                <div className="bg-white rounded-2xl p-8 card-gradient-border shadow-premium shadow-premium-hover hover:-translate-y-1 transition-all duration-300">
                  <h3 className="font-display text-xl font-bold text-ink">Best for summaries</h3>
                  <p className="mt-3 text-stone-warm leading-relaxed">
                    Claude scored 5/5 and ChatGPT scored 4/5. Claude produced stronger
                    senior-level framing; ChatGPT was easier to constrain to exact length.
                  </p>
                </div>
                <div className="bg-white rounded-2xl p-8 card-gradient-border shadow-premium shadow-premium-hover hover:-translate-y-1 transition-all duration-300">
                  <h3 className="font-display text-xl font-bold text-ink">Best for ATS keywords</h3>
                  <p className="mt-3 text-stone-warm leading-relaxed">
                    Claude, ChatGPT, and Gemini all scored 4/5 when paired with a specific job
                    description and the <Link to="/resume-keyword-scanner" className="text-accent hover:underline">ATS keyword scanner</Link>.
                  </p>
                </div>
              </div>
            </section>
          </RevealSection>

          <RevealSection variant="fade-up">
            <section className="space-y-6">
              <div>
                <SectionEyebrow>Agentic Workflow</SectionEyebrow>
                <h2 id="workflow" className="font-display text-3xl md:text-4xl font-extrabold tracking-tight text-ink">How to Build an AI Resume Workflow</h2>
                <p className="mt-3 max-w-3xl text-stone-warm leading-relaxed">
                  The best resume prompt is not one prompt. It is a controlled sequence:
                  set the AI role, provide structured evidence, run gap analysis, rewrite
                  only supported claims, then QA the output. This workflow works in Claude
                  Projects, ChatGPT custom instructions, Gemini chats, and other tools that
                  keep enough context for the resume plus job description.
                </p>
              </div>
              <div className="space-y-5">
                {WORKFLOW_STEPS.map((step) => (
                  <article key={step.title} className="bg-white rounded-2xl p-6 md:p-8 shadow-premium card-gradient-border">
                    <h3 className="font-display text-xl font-bold text-ink">{step.title}</h3>
                    <p className="mt-3 text-stone-warm leading-relaxed">{step.description}</p>
                    <pre className="mt-4 bg-ink text-white/90 rounded-xl p-4 md:p-6 text-sm leading-relaxed overflow-x-auto">
                      <code>{step.code}</code>
                    </pre>
                  </article>
                ))}
              </div>
            </section>
          </RevealSection>

          <RevealSection variant="fade-up">
            <section className="space-y-6">
              <div>
                <SectionEyebrow>Recommendations</SectionEyebrow>
                <h2 id="tool-recommendations" className="font-display text-3xl md:text-4xl font-extrabold tracking-tight text-ink">Tool Recommendations by AI</h2>
                <p className="mt-3 max-w-3xl text-stone-warm leading-relaxed">
                  Pick the tool by task, not by brand. The same resume can move through
                  multiple tools: Gemini for JD gap analysis, Claude for final bullet
                  rewriting, ChatGPT for strict formatting, and a final human pass for
                  accuracy.
                </p>
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
                  <p className="mt-2 font-semibold text-accent">Best for: {model.bestFor}</p>
                  <div className="mt-4 grid gap-4 lg:grid-cols-[1.3fr_1fr]">
                    <div className="space-y-3 text-stone-warm leading-relaxed">
                      <p>{model.strengths}</p>
                      <p>{model.limitations}</p>
                      {model.cta && (
                        <p>
                          <Link to={model.cta.href} className="font-semibold text-accent hover:underline inline-flex items-center gap-1">
                            {model.cta.text}
                            <span aria-hidden="true">→</span>
                          </Link>
                        </p>
                      )}
                    </div>
                    <div className="grid gap-4">
                      <div className="bg-red-50 rounded-xl p-4 border border-red-200">
                        <span className="text-xs font-bold text-red-600 uppercase tracking-wide">Before</span>
                        <p className="mt-2 text-sm text-ink">{model.before}</p>
                      </div>
                      <div className="bg-emerald-50 rounded-xl p-4 border border-emerald-200">
                        <span className="text-xs font-bold text-emerald-600 uppercase tracking-wide">After ({model.name})</span>
                        <p className="mt-2 text-sm text-ink">{model.after}</p>
                      </div>
                    </div>
                  </div>
                </article>
              ))}
            </section>
          </RevealSection>

          <RevealSection variant="fade-up">
            <section>
              <SectionEyebrow>Privacy</SectionEyebrow>
              <h2 id="ai-resume-privacy" className="font-display text-3xl md:text-4xl font-extrabold tracking-tight text-ink">Is It Safe to Put My Resume in AI?</h2>
              <p className="mt-3 text-stone-warm leading-relaxed">
                A resume can include employers, dates, location, salary clues, client names,
                work authorization details, and proprietary project context. Treat it as
                sensitive professional data. The safest workflow is to remove phone numbers,
                home address, manager names, internal project names, confidential metrics, and
                customer names before pasting. Use initials or placeholders during drafting,
                then restore the real details inside your resume editor.
              </p>
              <div className="mt-6 overflow-x-auto rounded-2xl shadow-premium bg-white">
                <table
                  aria-label="AI resume privacy controls by provider"
                  className="w-full min-w-[860px] border-collapse text-sm"
                >
                  <thead className="bg-chalk-dark text-left text-ink">
                    <tr>
                      <th scope="col" className="px-4 py-3 font-bold">Provider</th>
                      <th scope="col" className="px-4 py-3 font-bold">Free-tier handling</th>
                      <th scope="col" className="px-4 py-3 font-bold">User control</th>
                      <th scope="col" className="px-4 py-3 font-bold">Business control</th>
                    </tr>
                  </thead>
                  <tbody>
                    {PRIVACY_ROWS.map((row, idx) => (
                      <tr key={row.provider} className={`border-t border-black/[0.04] ${idx % 2 === 1 ? "bg-chalk/40" : ""}`}>
                        <th scope="row" className="px-4 py-3 text-left font-semibold text-ink">{row.provider}</th>
                        <td className="px-4 py-3 text-ink/85">{row.freeTier}</td>
                        <td className="px-4 py-3 text-ink/85">{row.optOut}</td>
                        <td className="px-4 py-3 text-ink/85">{row.enterprise}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          </RevealSection>

          <RevealSection variant="fade-up">
            <section>
              <SectionEyebrow>ATS Accuracy</SectionEyebrow>
              <h2 id="ats-formatting-accuracy" className="font-display text-3xl md:text-4xl font-extrabold tracking-tight text-ink">ATS Formatting: Which AI Tools Preserve It?</h2>
              <p className="mt-3 text-stone-warm leading-relaxed">
                AI tools often damage ATS readability when the prompt asks for a visually
                impressive resume. The risk is not the words; it is the formatting the model
                suggests: tables, columns, icons, rating bars, decorative bullets, text boxes,
                and keyword stuffing. For ATS-safe output, ask for plain text bullets, a
                separate skills list, no columns, no graphics, no hidden text, and no keyword
                unless it is supported by the source material.
              </p>
              <div className="mt-6 grid gap-4 md:grid-cols-2">
                {ATS_ROWS.map((row) => (
                  <article key={row.provider} className="bg-white rounded-2xl p-5 shadow-premium border border-black/[0.04]">
                    <h3 className="font-display text-xl font-bold text-ink">{row.provider}: {row.rating}</h3>
                    <p className="mt-2 text-stone-warm leading-relaxed">{row.note}</p>
                  </article>
                ))}
              </div>
            </section>
          </RevealSection>

          <RevealSection variant="fade-up">
            <section>
              <SectionEyebrow>Long Resume Handling</SectionEyebrow>
              <h2 id="token-limits-long-resumes" className="font-display text-3xl md:text-4xl font-extrabold tracking-tight text-ink">Token Limits for Long Resumes</h2>
              <p className="mt-3 text-stone-warm leading-relaxed">
                A two-page resume plus a job description is usually small enough for modern
                AI tools. Problems start when you paste a full career history, portfolio
                notes, multiple job descriptions, and a long chat history into the same
                conversation. Published API context windows are useful reference points, but
                consumer chat products can apply different limits, rolling context, file
                handling, or model routing.
              </p>
              <div className="mt-6 overflow-x-auto rounded-2xl shadow-premium bg-white">
                <table
                  aria-label="AI resume token limits by provider"
                  className="w-full min-w-[860px] border-collapse text-sm"
                >
                  <thead className="bg-chalk-dark text-left text-ink">
                    <tr>
                      <th scope="col" className="px-4 py-3 font-bold">Provider</th>
                      <th scope="col" className="px-4 py-3 font-bold">Published context detail</th>
                      <th scope="col" className="px-4 py-3 font-bold">Resume workflow guidance</th>
                    </tr>
                  </thead>
                  <tbody>
                    {TOKEN_ROWS.map((row, idx) => (
                      <tr key={row.provider} className={`border-t border-black/[0.04] ${idx % 2 === 1 ? "bg-chalk/40" : ""}`}>
                        <th scope="row" className="px-4 py-3 text-left font-semibold text-ink">{row.provider}</th>
                        <td className="px-4 py-3 text-ink/85">{row.limit}</td>
                        <td className="px-4 py-3 text-ink/85">{row.resumeUse}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          </RevealSection>

          <RevealSection variant="fade-up">
            <section>
              <SectionEyebrow>Keep Reading</SectionEyebrow>
              <h2 id="related-resources" className="font-display text-3xl md:text-4xl font-extrabold tracking-tight text-ink">Related Resume AI Resources</h2>
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
              <h2 id="provider-references" className="font-display text-3xl md:text-4xl font-extrabold tracking-tight text-ink">Provider References</h2>
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
              <h2 id="faq" className="font-display text-3xl md:text-4xl font-extrabold tracking-tight text-ink">AI Resume Prompts FAQ</h2>
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
