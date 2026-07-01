import BlogLayout from "../BlogLayout";
import { Link } from "react-router-dom";

const FAQS = [
  {
    question: "What is the most important ATS formatting rule?",
    answer:
      "Use a single-column layout with standard section headings. Multi-column designs are the single most common reason a resume parses incorrectly, because the parser reads across columns and scrambles your experience into unreadable fragments. A clean single column read top to bottom is the safest structure.",
  },
  {
    question: "Do tables and text boxes break ATS parsers?",
    answer:
      "Often, yes. Many applicant tracking systems ignore or misread content inside tables and text boxes, so any skills, dates, or job titles you place there can be dropped entirely. Keep all important information in the normal body text flow rather than in tables or floating boxes.",
  },
  {
    question: "Should I put my contact information in the header or footer?",
    answer:
      "Put it in the body of the document, not in the page header or footer. Some parsers do not read the header and footer regions, which means your name, email, and phone number can be lost. Place your contact details as normal text at the top of the first page.",
  },
  {
    question: "Is PDF or Word (.docx) better for ATS?",
    answer:
      "Follow what the job posting or application form asks for. When there is no instruction, a text-based PDF is widely accepted by modern systems and preserves your layout. If a listing specifically requests .docx, submit .docx. Never submit a resume saved as an image, and never scan a printed copy.",
  },
  {
    question: "Can I use icons, graphics, or a photo on my resume?",
    answer:
      "Avoid relying on them for meaning. Parsers read text, not images, so any information carried only inside an icon, chart, logo, or photo is invisible to the system. If you like a small amount of visual styling, make sure every fact also appears as plain text.",
  },
  {
    question: "Do creative section names like 'My Journey' hurt my resume?",
    answer:
      "They can. Parsers map your content into fields by recognizing standard headings such as Experience, Education, and Skills. Non-standard labels like 'My Journey' or 'What I Bring' may not be recognized, so the section beneath them may not be categorized correctly. Use conventional headings.",
  },
  {
    question: "How can I check if my resume is ATS-friendly?",
    answer:
      "Copy your resume and paste it into a plain-text editor. If the text comes out in a clean, logical top-to-bottom order with nothing scrambled or missing, a parser will likely read it well. You can also run it through our free resume keyword scanner to confirm it contains the terms the job posting is looking for.",
  },
];

export default function ATSFormattingRules() {
  return (
    <BlogLayout
      title="ATS Formatting Rules 2026: The Invisible Rejection"
      description="The ATS formatting rules that decide whether a recruiter ever sees your resume. Learn what breaks parsers, the exact rules to follow, and how to avoid the invisible rejection in 2026."
      publishDate="2026-07-01"
      lastUpdated="2026-07-01"
      readTime="9 min"
      keywords={[
        "ats resume formatting rules 2026",
        "how to beat ats screener",
        "ats friendly resume format",
        "ats formatting",
        "resume parsing",
        "single column resume",
      ]}
      ctaType="resume"
      faqs={FAQS}
    >
      <div className="space-y-8">
        {/* Answer-first intro (<= 50 words) */}
        <p className="text-xl leading-relaxed text-stone-warm font-medium">
          The core ATS formatting rule for 2026: use a single-column layout,
          standard section headings (Experience, Education, Skills), and standard
          fonts. Avoid tables, text boxes, and information in headers or footers.
          Keep contact details in the body. Break these rules and the parser
          rejects you before a human ever reads a word.
        </p>

        <div className="bg-accent/[0.06] border border-accent/20 rounded-xl p-6">
          <h2 className="font-bold text-ink mb-4 text-lg">On this page</h2>
          <ol className="space-y-2 text-ink/80 list-decimal list-inside">
            <li><a href="#mechanism" className="text-accent hover:underline">How an ATS actually reads your resume</a></li>
            <li><a href="#what-breaks" className="text-accent hover:underline">What breaks the parser</a></li>
            <li><a href="#the-rules" className="text-accent hover:underline">The rules: do this</a></li>
            <li><a href="#do-dont" className="text-accent hover:underline">Do / Don't at a glance</a></li>
            <li><a href="#file-format" className="text-accent hover:underline">PDF vs .docx: the honest answer</a></li>
            <li><a href="#faq" className="text-accent hover:underline">Frequently asked questions</a></li>
          </ol>
        </div>

        <h2 id="mechanism" className="text-3xl font-bold text-ink mt-12 mb-6">
          How an ATS Actually Reads Your Resume
        </h2>
        <p className="text-lg leading-relaxed text-stone-warm">
          An applicant tracking system does not "look" at your resume the way a
          person does. It runs a <strong>parser</strong> — software that reads
          your file and tries to break it apart into structured fields: your
          name, your contact details, each job in your work history with its
          title, employer, and dates, your education, and your list of skills.
          Those fields get written into a database that recruiters search and
          filter.
        </p>
        <p className="text-lg leading-relaxed text-stone-warm">
          When the layout is clean, this works. The parser reads top to bottom,
          recognizes your headings, and files each piece of information where it
          belongs. When the layout confuses it, the parser guesses — and a wrong
          guess is expensive. A job title lands in the wrong company. Half your
          experience section disappears. Your skills never make it into the
          skills field, so a keyword search for that exact skill never returns
          your name.
        </p>
        <div className="bg-chalk-dark border-l-4 border-red-500 p-6 my-6">
          <h3 className="font-bold text-ink mb-2">The invisible rejection</h3>
          <p className="text-stone-warm">
            This is the failure mode that costs qualified people interviews. Your
            resume was never "rejected" by a recruiter — it was quietly misfiled
            or filtered out at the parsing stage. Nobody read it and decided you
            weren't a fit. Nobody read it at all. That's the invisible rejection,
            and formatting is what causes it.
          </p>
        </div>
        <p className="text-lg leading-relaxed text-stone-warm">
          For a broader look at how these systems score and rank candidates once
          your resume parses correctly, see our{" "}
          <Link to="/blog/ats-resume-optimization" className="text-accent hover:underline font-medium">
            ATS resume optimization guide
          </Link>. This page focuses on the earlier, more fundamental step: making
          sure the parser can read you at all.
        </p>

        <h2 id="what-breaks" className="text-3xl font-bold text-ink mt-12 mb-6">
          What Breaks the Parser
        </h2>
        <p className="text-lg leading-relaxed text-stone-warm mb-6">
          Most parsing failures come from a small set of design choices — usually
          the ones that make a resume look impressive in a template preview.
          Here's what to watch for.
        </p>

        <div className="space-y-6">
          <div className="bg-white border border-black/[0.06] rounded-xl p-6 shadow-sm">
            <h3 className="text-xl font-bold text-ink mb-2">Multi-column layouts</h3>
            <p className="text-stone-warm">
              The biggest offender. A parser reads across the page, not down one
              column at a time. A sidebar of skills next to a main column of
              experience can be interleaved line by line, turning both into
              nonsense. If you take away one rule, take away this: use a single
              column.
            </p>
          </div>
          <div className="bg-white border border-black/[0.06] rounded-xl p-6 shadow-sm">
            <h3 className="text-xl font-bold text-ink mb-2">Tables</h3>
            <p className="text-stone-warm">
              Tables look tidy but are read inconsistently. Some systems flatten
              them incorrectly; others skip cell contents. Dates, skills, or job
              titles arranged in a table can be dropped or reordered. Keep your
              content in normal paragraphs and bullet lists.
            </p>
          </div>
          <div className="bg-white border border-black/[0.06] rounded-xl p-6 shadow-sm">
            <h3 className="text-xl font-bold text-ink mb-2">Text boxes and floating shapes</h3>
            <p className="text-stone-warm">
              Content inside a text box often sits outside the main document flow,
              and many parsers ignore it entirely. Anything important placed in a
              text box — a summary, a set of skills — may simply never be read.
            </p>
          </div>
          <div className="bg-white border border-black/[0.06] rounded-xl p-6 shadow-sm">
            <h3 className="text-xl font-bold text-ink mb-2">Information in headers and footers</h3>
            <p className="text-stone-warm">
              This one traps people constantly. Putting your name, email, and
              phone number in the page header feels natural, but some parsers do
              not read the header or footer region. Your contact information can
              vanish, leaving a recruiter with no way to reach you even if the
              rest of your resume scores well.
            </p>
          </div>
          <div className="bg-white border border-black/[0.06] rounded-xl p-6 shadow-sm">
            <h3 className="text-xl font-bold text-ink mb-2">Images, icons, and charts carrying real information</h3>
            <p className="text-stone-warm">
              Parsers read text, not pictures. A skill bar graphic, a logo, an
              icon standing in for a phone number, or a "90% Python" rating chart
              conveys nothing to the system. If a fact only exists as an image,
              it is invisible.
            </p>
          </div>
          <div className="bg-white border border-black/[0.06] rounded-xl p-6 shadow-sm">
            <h3 className="text-xl font-bold text-ink mb-2">Graphics-heavy templates</h3>
            <p className="text-stone-warm">
              Beautiful design-tool templates (the kind popular on Canva and
              similar builders) frequently combine several of the problems above:
              columns, text boxes, and image-based text. They win the visual
              contest and lose the parsing one. See our{" "}
              <Link to="/blog/canva-resume-vs-easy-free-resume" className="text-accent hover:underline">
                Canva resume vs. ATS breakdown
              </Link>{" "}
              for why.
            </p>
          </div>
          <div className="bg-white border border-black/[0.06] rounded-xl p-6 shadow-sm">
            <h3 className="text-xl font-bold text-ink mb-2">Decorative fonts and creative section names</h3>
            <p className="text-stone-warm">
              Unusual display fonts can render as garbled characters when parsed.
              And creative headings — "Where I've Been," "My Toolkit" — may not be
              recognized as the Experience or Skills sections they're meant to
              label, so the content underneath goes uncategorized.
            </p>
          </div>
        </div>

        <h2 id="the-rules" className="text-3xl font-bold text-ink mt-12 mb-6">
          The Rules: Do This
        </h2>
        <p className="text-lg leading-relaxed text-stone-warm mb-6">
          Every rule below exists to make the parser's job trivial. None of them
          cost you anything a recruiter values — a clean, readable resume looks
          professional to humans too.
        </p>
        <div className="bg-green-50 border border-green-200 rounded-xl p-6 my-6">
          <h3 className="font-bold text-green-800 mb-3">The ATS-safe formatting checklist</h3>
          <ul className="list-disc pl-6 space-y-3 text-green-700">
            <li>
              <strong>Use a single column.</strong> One vertical flow of content,
              read top to bottom. No sidebars.
            </li>
            <li>
              <strong>Use standard section headings.</strong> "Experience" (or
              "Work Experience"), "Education", "Skills", "Certifications",
              "Summary". Plain labels the parser already knows.
            </li>
            <li>
              <strong>Left-align your text.</strong> Avoid centered or justified
              blocks for body content; left alignment reads most reliably.
            </li>
            <li>
              <strong>Use standard fonts.</strong> Arial, Calibri, Times New
              Roman, Georgia, Helvetica — anything common and clean. Skip
              decorative or downloaded display fonts.
            </li>
            <li>
              <strong>Put contact info in the body.</strong> Name, email, phone,
              and location as normal text at the top of page one — never in the
              header or footer region.
            </li>
            <li>
              <strong>Use simple bullet points.</strong> Standard round or square
              bullets, not custom symbols or image bullets.
            </li>
            <li>
              <strong>Write dates consistently.</strong> Pick one format ("Jan
              2023 – Mar 2025" or "01/2023 – 03/2025") and use it everywhere.
            </li>
            <li>
              <strong>Spell out acronyms once.</strong> "Search Engine
              Optimization (SEO)" catches both the abbreviation and the full term.
            </li>
            <li>
              <strong>Save in the requested format.</strong> Match what the
              posting asks for — more on this below.
            </li>
          </ul>
        </div>
        <p className="text-lg leading-relaxed text-stone-warm">
          The simplest way to follow all of these at once is to start from a
          layout that was built for parsing. Our{" "}
          <Link to="/templates/ats-friendly" className="text-accent hover:underline font-medium">
            ATS-friendly resume templates
          </Link>{" "}
          are single-column, use standard headings and fonts, and keep every
          fact in readable text — so the structure is correct before you type a
          single word.
        </p>

        <h2 id="do-dont" className="text-3xl font-bold text-ink mt-12 mb-6">
          Do / Don't at a Glance
        </h2>
        <div className="grid md:grid-cols-2 gap-6 my-8">
          <div className="bg-green-50 border border-green-200 rounded-xl p-6">
            <h3 className="font-bold text-green-800 mb-3">Do</h3>
            <ul className="list-disc pl-6 space-y-2 text-green-700">
              <li>Single column, top-to-bottom</li>
              <li>Standard headings (Experience, Education, Skills)</li>
              <li>Contact details in the body text</li>
              <li>Standard fonts, left-aligned</li>
              <li>Plain bullet points</li>
              <li>Skills written as text</li>
              <li>One consistent date format</li>
            </ul>
          </div>
          <div className="bg-red-50 border border-red-200 rounded-xl p-6">
            <h3 className="font-bold text-red-800 mb-3">Don't</h3>
            <ul className="list-disc pl-6 space-y-2 text-red-700">
              <li>Two or three columns / sidebars</li>
              <li>Creative headings ("My Journey")</li>
              <li>Contact info in the header or footer</li>
              <li>Decorative or downloaded fonts</li>
              <li>Icons or images carrying key facts</li>
              <li>Skills shown as rating bars/graphics</li>
              <li>Tables and text boxes for content</li>
            </ul>
          </div>
        </div>

        <div className="bg-chalk-dark border border-black/[0.06] rounded-xl p-6 my-8">
          <h3 className="font-bold text-ink mb-3">Before and after</h3>
          <p className="text-stone-warm mb-4">
            <strong>Before (parser-hostile):</strong> A two-column template with
            your name and email in a colored header, a left sidebar of skill
            rating bars, and section labels like "My Story" and "What I Do."
            After parsing, the recruiter's database shows a jumbled experience
            field, no skills, and no email address.
          </p>
          <p className="text-stone-warm">
            <strong>After (parser-friendly):</strong> A single column. Your name,
            email, and phone as text on the first line. Headings that read
            "Experience," "Skills," and "Education." Skills listed as plain text.
            After parsing, every field is populated correctly — and a recruiter
            searching for your top skill finds you.
          </p>
        </div>

        <h2 id="file-format" className="text-3xl font-bold text-ink mt-12 mb-6">
          PDF vs .docx: The Honest Answer
        </h2>
        <p className="text-lg leading-relaxed text-stone-warm">
          There is no universal winner, and anyone who tells you "always use PDF"
          or "always use Word" is oversimplifying. The honest guidance:
        </p>
        <div className="bg-accent/[0.06] border border-accent/20 rounded-xl p-6 my-6">
          <ul className="list-disc pl-6 space-y-3 text-ink/80">
            <li>
              <strong>Do what the posting says.</strong> If the application form
              or job listing specifies a format, follow it exactly. This overrides
              every other rule.
            </li>
            <li>
              <strong>No instruction? A text-based PDF is a safe default.</strong>{" "}
              Modern applicant tracking systems parse text-based PDFs well, and
              PDF preserves your layout across devices so nothing shifts.
            </li>
            <li>
              <strong>Submit .docx when asked for it.</strong> Some systems and
              some recruiters still prefer Word, and a few older parsers handle it
              more predictably. If the form requests Word, give it Word.
            </li>
            <li>
              <strong>Never submit an image or a scan.</strong> A resume saved as
              a JPG or PNG, or a scanned printout, is unreadable to a parser. The
              PDF must contain real, selectable text — not a picture of text.
            </li>
          </ul>
        </div>
        <p className="text-lg leading-relaxed text-stone-warm">
          A quick self-test: open your resume and try to select and copy the
          text. If you can highlight it as words, the file is text-based. If it
          selects like an image, it's not — and you need to re-export it.
        </p>

        <div className="bg-green-50 border border-green-200 rounded-xl p-6 my-8">
          <h3 className="font-bold text-green-800 mb-2">Test it in two minutes</h3>
          <p className="text-green-700">
            Paste your resume into a plain-text editor. If it reads in a clean,
            logical order with nothing scrambled, a parser will too. Then run it
            through our free{" "}
            <Link to="/resume-keyword-scanner" className="text-accent hover:underline font-medium">
              resume keyword scanner
            </Link>{" "}
            to confirm it contains the exact terms the job posting is scanning
            for — no sign-up required.
          </p>
        </div>

        <h2 id="faq" className="text-3xl font-bold text-ink mt-12 mb-6">
          Frequently Asked Questions
        </h2>
        <div className="space-y-4 my-6">
          {FAQS.map((faq, i) => (
            <div key={i} className="bg-chalk-dark border border-black/[0.06] rounded-lg p-5">
              <h3 className="font-bold text-ink mb-2">{faq.question}</h3>
              <p className="text-stone-warm">{faq.answer}</p>
            </div>
          ))}
        </div>

        <h2 className="text-3xl font-bold text-ink mt-12 mb-6">The Bottom Line</h2>
        <p className="text-lg leading-relaxed text-stone-warm">
          Great formatting for an ATS isn't about tricks — it's about getting out
          of the parser's way. A single column, standard headings, standard
          fonts, contact details in the body, and no tables, text boxes, or
          image-based text will carry your resume cleanly into the recruiter's
          database. Do that, and your qualifications get the chance they deserve:
          to be read by a person.
        </p>
        <p className="text-lg leading-relaxed text-stone-warm mt-4">
          Start from an{" "}
          <Link to="/templates/ats-friendly" className="text-accent hover:underline font-medium">
            ATS-friendly template
          </Link>, keep the layout simple, and{" "}
          <Link to="/resume-keyword-scanner" className="text-accent hover:underline font-medium">
            scan your resume for free
          </Link>{" "}
          before you apply.
        </p>
      </div>
    </BlogLayout>
  );
}
