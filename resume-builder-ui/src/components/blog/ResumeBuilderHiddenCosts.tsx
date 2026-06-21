import { Link } from "react-router-dom";
import BlogLayout from "../BlogLayout";
import CompareBuildersCrossLinks from "./CompareBuildersCrossLinks";

const FAQS = [
  {
    question: "How much do 'free' resume builders actually cost in 2026?",
    answer:
      "Most 'free' resume builders cost between roughly $26 and $30 per billing cycle after a cheap trial. As of 2026, Resume.io advertises a 7-day trial near $2.95 that auto-renews at about $29.95 every 4 weeks, and Zety advertises a 14-day trial near $1.95 that converts to about $25.95 billed every 4 weeks (around 13 charges, or roughly $337 per year). The free tier on these platforms usually exports a watermarked or restricted file that is not usable for real applications. EasyFreeResume is genuinely free: no trial, no credit card, no watermark, and no sign-up. Always verify current prices on each provider's own site.",
  },
  {
    question: "Why is the annual cost higher than 12 times the monthly price?",
    answer:
      "Some builders bill every 4 weeks instead of once a month. A calendar year has about 52 weeks, so 4-week billing produces roughly 13 charges per year instead of 12. At about $25.95 per cycle (Zety's advertised rate as of 2026), 13 charges total around $337 per year, versus about $311 if you were billed 12 times. The extra cycle is easy to miss when you only see the per-cycle price.",
  },
  {
    question: "Are free resume downloads really watermarked?",
    answer:
      "On many paid platforms, yes. As of 2026, the free export on builders like Resume.io and Zety is typically watermarked or restricted (for example, limited to a plain-text file without formatting) in a way that makes it unsuitable for sending to employers. To get a clean PDF you usually have to start a paid trial. EasyFreeResume exports clean PDF and DOCX files with no watermark, for free.",
  },
  {
    question: "Is the trial price the same as the real price?",
    answer:
      "No. The trial price is an introductory rate that auto-converts to the full subscription unless you cancel in time. As of 2026, a roughly $1.95 to $2.95 trial converts to roughly $26 to $30 per 4-week cycle. Treat the trial price as a sign-up cost, not the ongoing cost.",
  },
  {
    question: "How hard is it to cancel a paid resume builder?",
    answer:
      "It varies by provider and changes over time. As of 2026, some Resume.io users report cancellation friction, including unexpected charges after the trial and difficulty completing or confirming a cancellation, which can require cancelling through the website or by contacting support rather than in the app. Always check the current cancellation steps on the provider's site before starting any trial.",
  },
  {
    question: "Is EasyFreeResume actually free, with no catch?",
    answer:
      "Yes. EasyFreeResume has no trial, no credit card requirement, no watermark, and no account. Your resume data stays in your browser, and you can export PDF and DOCX files for free. The service is supported by non-intrusive ads, not by paywalling your download.",
  },
  {
    question: "Why do prices in this article say 'as of 2026'?",
    answer:
      "Resume builder pricing, trial terms, and cancellation steps change frequently. The figures here reflect advertised terms observed as of 2026 and are hedged for that reason. Always verify the current price and terms on the provider's own website before signing up.",
  },
];

export default function ResumeBuilderHiddenCosts() {
  return (
    <BlogLayout
      title='The Real Cost of "Free" Resume Builders (2026)'
      description='How much do "free" resume builders actually cost in 2026? Real trial prices, post-trial charges, the 13-charge billing trap, and a genuinely free, no-watermark alternative.'
      publishDate="2026-06-18"
      readTime="11 min"
      keywords={[
        "cost of free resume builders",
        "are free resume builders really free",
        "resume builder hidden costs",
        "resume.io price",
        "zety price",
        "free resume builder no watermark",
        "free resume builder no credit card",
        "resume builder free trial cost",
      ]}
      ctaType="resume"
      faqs={FAQS}
    >
      <div className="space-y-8">
        {/* ANSWER-FIRST BLOCK (~100 words, self-contained, quote-ready) */}
        <div className="bg-accent/[0.06] border border-accent/20 rounded-xl p-6 my-2">
          <h2 className="font-bold text-ink text-xl mb-3">
            The short answer
          </h2>
          <p className="text-lg leading-relaxed text-ink/90">
            Most "free" resume builders actually cost roughly{" "}
            <strong>$26&ndash;$30 per 4-week cycle</strong> after a cheap trial.
            As of 2026, Resume.io advertises a 7-day trial near{" "}
            <strong>$2.95</strong> that auto-renews at about{" "}
            <strong>$29.95 every 4 weeks</strong>, and Zety advertises a 14-day
            trial near <strong>$1.95</strong> that converts to about{" "}
            <strong>$25.95 every 4 weeks</strong> &mdash; roughly{" "}
            <strong>13 charges a year</strong>, or about{" "}
            <strong>$337 annually</strong>. The "free" export is usually
            watermarked or restricted and unusable for real applications.
            EasyFreeResume is
            the genuinely free contrast: no trial, no credit card, no
            watermark, no sign-up.
          </p>
        </div>

        <p className="text-xl leading-relaxed text-stone-warm font-medium">
          "Free resume builder" is one of the most misleading phrases in the job
          search. You can build a resume for free on most popular platforms
          &mdash; you just can't download a usable copy without paying. This is a
          data-driven look at what that actually costs in 2026, and why the math
          is worse than the sticker price suggests.
        </p>

        <p className="text-sm leading-relaxed text-stone-warm italic">
          Note: Prices, trial terms, and cancellation steps change often. The
          figures below reflect terms advertised as of 2026 and are described as
          observed, not guaranteed. Always verify the current price on the
          provider's own website before signing up.
        </p>

        {/* CENTERPIECE COMPARISON TABLE */}
        <h2 className="text-3xl font-bold text-ink mt-12 mb-6">
          The real cost of "free" resume builders, side by side
        </h2>

        <p className="text-lg leading-relaxed text-stone-warm">
          The table below compares advertised trial prices, what they convert
          to, billing cadence, and estimated annual cost. EasyFreeResume is
          included as the genuinely-free reference point.
        </p>

        <div className="overflow-x-auto my-8">
          <table className="w-full bg-white border border-black/[0.06] rounded-xl shadow-sm text-sm overflow-hidden">
            <thead>
              <tr className="bg-chalk-dark">
                <th className="px-4 py-4 text-left font-bold text-ink">
                  Builder
                </th>
                <th className="px-4 py-4 text-left font-bold text-ink">
                  Advertised trial
                </th>
                <th className="px-4 py-4 text-left font-bold text-ink">
                  Auto-converts to
                </th>
                <th className="px-4 py-4 text-left font-bold text-ink">
                  Billing cadence
                </th>
                <th className="px-4 py-4 text-left font-bold text-ink">
                  Est. annual cost
                </th>
                <th className="px-4 py-4 text-left font-bold text-ink">
                  Free export watermarked?
                </th>
                <th className="px-4 py-4 text-left font-bold text-ink">
                  Cancellation friction
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black/[0.06]">
              <tr>
                <td className="px-4 py-4 font-medium text-ink">Resume.io</td>
                <td className="px-4 py-4 text-stone-warm">
                  ~$2.95 / 7-day trial
                </td>
                <td className="px-4 py-4 text-stone-warm">~$29.95 / 4 weeks</td>
                <td className="px-4 py-4 text-stone-warm">
                  Every 4 weeks (~13/yr)
                </td>
                <td className="px-4 py-4 text-stone-warm">~$389/year</td>
                <td className="px-4 py-4 text-red-700">Yes (typical)</td>
                <td className="px-4 py-4 text-stone-warm">
                  Users report cancellation friction
                </td>
              </tr>
              <tr className="bg-chalk-dark">
                <td className="px-4 py-4 font-medium text-ink">Zety</td>
                <td className="px-4 py-4 text-stone-warm">
                  ~$1.95 / 14-day trial
                </td>
                <td className="px-4 py-4 text-stone-warm">~$25.95 / 4 weeks</td>
                <td className="px-4 py-4 text-stone-warm">
                  Every 4 weeks (~13/yr)
                </td>
                <td className="px-4 py-4 text-stone-warm">~$337/year</td>
                <td className="px-4 py-4 text-red-700">Yes (typical)</td>
                <td className="px-4 py-4 text-stone-warm">
                  Cancel before trial ends
                </td>
              </tr>
              <tr>
                <td className="px-4 py-4 font-medium text-ink">
                  Canva Pro
                </td>
                <td className="px-4 py-4 text-stone-warm">
                  ~30-day Pro trial
                </td>
                <td className="px-4 py-4 text-stone-warm">
                  ~$15/month (~$120/yr annual)
                </td>
                <td className="px-4 py-4 text-stone-warm">
                  Monthly or annual
                </td>
                <td className="px-4 py-4 text-stone-warm">~$120/year (Pro)</td>
                <td className="px-4 py-4 text-yellow-800">
                  Free tier limited, not watermarked
                </td>
                <td className="px-4 py-4 text-stone-warm">
                  Standard subscription cancel
                </td>
              </tr>
              <tr className="bg-green-50">
                <td className="px-4 py-4 font-bold text-accent">
                  EasyFreeResume
                </td>
                <td className="px-4 py-4 text-accent font-medium">
                  None (no trial)
                </td>
                <td className="px-4 py-4 text-accent font-medium">
                  Nothing &mdash; stays free
                </td>
                <td className="px-4 py-4 text-accent font-medium">
                  No billing
                </td>
                <td className="px-4 py-4 text-accent font-bold">$0/year</td>
                <td className="px-4 py-4 text-accent font-medium">
                  No &mdash; clean export
                </td>
                <td className="px-4 py-4 text-accent font-medium">
                  None (no account)
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <p className="text-sm text-stone-warm italic">
          Canva Pro is a general design subscription, not a resume-only paywall;
          its free tier lets you export without a watermark but with limited
          features. Figures are estimates observed as of 2026 and vary by region
          and promotion.
        </p>

        {/* PER-COMPETITOR BREAKDOWNS */}
        <h2 className="text-3xl font-bold text-ink mt-12 mb-6">
          Resume.io: a $2.95 trial that becomes $29.95 every 4 weeks
        </h2>

        <p className="text-lg leading-relaxed text-stone-warm">
          Resume.io's "free" entry point is a short trial. As of 2026, Resume.io
          advertises a 7-day trial priced around $2.95 that auto-renews at
          roughly $29.95 every 4 weeks unless you cancel first.
        </p>

        <p className="text-lg leading-relaxed text-stone-warm">
          The catch most people miss is cancellation. As of 2026, some Resume.io
          users report cancellation friction &mdash; unexpected charges after
          the trial and difficulty completing or confirming a cancellation
          &mdash; which can mean cancelling through the website or support rather
          than in the app. At about $29.95 every 4 weeks, billed roughly 13
          times a year, a forgotten subscription runs around $389 over a year.
          For a full
          breakdown, see our{" "}
          <Link
            to="/blog/resume-io-vs-easy-free-resume"
            className="text-accent hover:underline"
          >
            Resume.io vs EasyFreeResume comparison
          </Link>
          .
        </p>

        <h2 className="text-3xl font-bold text-ink mt-12 mb-6">
          Zety: the "13th charge" billing trap
        </h2>

        <p className="text-lg leading-relaxed text-stone-warm">
          Zety's pricing looks monthly but isn't. As of 2026, Zety advertises a
          14-day trial near $1.95 that converts to about $25.95 charged every 4
          weeks &mdash; not every calendar month.
        </p>

        {/* "THE 13TH CHARGE" MATH CALLOUT */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6 my-8">
          <h3 className="text-xl font-bold text-yellow-800 mb-3">
            The "13th charge" math
          </h3>
          <p className="text-yellow-800 mb-3">
            A calendar year has about 52 weeks. Billing every 4 weeks means:
          </p>
          <ul className="space-y-2 text-yellow-800">
            <li className="flex gap-3 items-start">
              <span className="mt-1.5">&#x2022;</span>
              <span>52 &divide; 4 = 13 billing cycles per year (not 12)</span>
            </li>
            <li className="flex gap-3 items-start">
              <span className="mt-1.5">&#x2022;</span>
              <span>
                13 &times; ~$25.95 &asymp; <strong>~$337 per year</strong>
              </span>
            </li>
            <li className="flex gap-3 items-start">
              <span className="mt-1.5">&#x2022;</span>
              <span>
                If it were billed 12 times: 12 &times; ~$25.95 &asymp; ~$311 per
                year
              </span>
            </li>
            <li className="flex gap-3 items-start">
              <span className="mt-1.5">&#x2022;</span>
              <span>
                The 4-week cadence quietly adds roughly <strong>$26</strong> a
                year &mdash; one extra charge you never saw coming
              </span>
            </li>
          </ul>
        </div>

        <p className="text-lg leading-relaxed text-stone-warm">
          See the full numbers in our{" "}
          <Link
            to="/easyfreeresume-vs-zety"
            className="text-accent hover:underline"
          >
            Zety pricing breakdown
          </Link>
          .
        </p>

        <h2 className="text-3xl font-bold text-ink mt-12 mb-6">
          Canva Pro: cheaper, but a subscription you may not need
        </h2>

        <p className="text-lg leading-relaxed text-stone-warm">
          Canva is different: its free tier lets you export resumes without a
          watermark. The cost shows up when you want premium templates or
          elements, which require Canva Pro at roughly $15 per month, or about
          $120 per year on the annual plan as of 2026 (Canva raised Pro from
          $12.99 to $15/month in 2025).
        </p>

        <p className="text-lg leading-relaxed text-stone-warm">
          Canva is a strong general design tool, but a resume rarely needs a
          design subscription, and Canva's free resume layouts can confuse
          applicant tracking systems. Our{" "}
          <Link
            to="/blog/canva-resume-vs-easy-free-resume"
            className="text-accent hover:underline"
          >
            Canva vs EasyFreeResume comparison
          </Link>{" "}
          covers the ATS trade-offs.
        </p>

        {/* CANCELLATION FRICTION */}
        <h2 className="text-3xl font-bold text-ink mt-12 mb-6">
          Cancellation friction: where the real cost hides
        </h2>

        <p className="text-lg leading-relaxed text-stone-warm">
          The advertised price is rarely the whole story &mdash; the cost of
          forgetting to cancel is. Trials auto-convert, and the friction to stop
          them is often higher than the friction to start them.
        </p>

        <ul className="space-y-3 text-lg text-stone-warm">
          <li className="flex gap-3 items-start">
            <span className="text-accent mt-1.5">&#x2022;</span>
            <span>
              <strong>Auto-renewal is the default.</strong> A trial near $1.95 to
              $2.95 silently becomes a roughly $26&ndash;$30 charge every 4 weeks
              if you miss the cancellation window.
            </span>
          </li>
          <li className="flex gap-3 items-start">
            <span className="text-accent mt-1.5">&#x2022;</span>
            <span>
              <strong>Cancellation paths can be obscured.</strong> As of 2026,
              some Resume.io users report friction cancelling &mdash; unexpected
              post-trial charges and trouble confirming a cancellation &mdash;
              which may push you to cancel via the website or support rather than
              in the app.
            </span>
          </li>
          <li className="flex gap-3 items-start">
            <span className="text-accent mt-1.5">&#x2022;</span>
            <span>
              <strong>The sunk-cost trap.</strong> After 30&ndash;60 minutes of
              building, hitting a paywall makes paying feel easier than starting
              over &mdash; which is the point of the design.
            </span>
          </li>
        </ul>

        {/* HOW EASYFREERESUME IS GENUINELY FREE */}
        <h2 className="text-3xl font-bold text-ink mt-12 mb-6">
          How EasyFreeResume is genuinely free
        </h2>

        <p className="text-lg leading-relaxed text-stone-warm">
          EasyFreeResume removes the paywall entirely. There is no trial, no
          credit card, no watermark, and no account &mdash; you build and you
          download.
        </p>

        <div className="bg-green-50 border border-green-200 rounded-xl p-6 my-8">
          <h3 className="text-xl font-bold text-green-800 mb-4">
            What "free" actually means here
          </h3>
          <ul className="space-y-2 text-green-800">
            <li>&#x2713; No free trial &mdash; nothing to convert into a charge</li>
            <li>&#x2713; No credit card required, ever</li>
            <li>&#x2713; No watermark on PDF or DOCX exports</li>
            <li>&#x2713; No sign-up or account creation</li>
            <li>
              &#x2713; Your resume data stays in your browser, not on our servers
            </li>
          </ul>
        </div>

        <p className="text-lg leading-relaxed text-stone-warm">
          The service is funded by non-intrusive advertising rather than by
          locking your download behind a subscription. If you want to understand
          the model in more depth, read{" "}
          <Link
            to="/blog/how-why-easyfreeresume-completely-free"
            className="text-accent hover:underline"
          >
            how and why EasyFreeResume is completely free
          </Link>{" "}
          or jump straight to the{" "}
          <Link to="/templates" className="text-accent hover:underline">
            free templates
          </Link>
          .
        </p>

        {/* CTA */}
        <div className="my-12 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-2xl shadow-xl p-5 sm:p-8 md:p-12 text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">
            Skip the trial. Skip the paywall.
          </h2>
          <p className="text-xl mb-6 opacity-90">
            Build a clean, watermark-free resume in minutes &mdash; no card, no
            sign-up, $0.
          </p>
          <Link
            to="/templates"
            className="inline-block bg-white text-accent px-8 py-4 rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-300"
          >
            Build Your Free Resume Now
          </Link>
        </div>

        {/* VISIBLE FAQ (schema is emitted separately via the faqs prop) */}
        <h2 className="text-3xl font-bold text-ink mt-12 mb-6">
          Frequently asked questions
        </h2>

        <div className="space-y-4 mb-12">
          {FAQS.map(({ question, answer }) => (
            <div key={question} className="bg-chalk-dark rounded-xl p-5">
              <h3 className="font-bold text-ink mb-2">{question}</h3>
              <p className="text-stone-warm text-sm leading-relaxed">{answer}</p>
            </div>
          ))}
        </div>

        <CompareBuildersCrossLinks excludePath="/blog/resume-builder-hidden-costs" />
      </div>
    </BlogLayout>
  );
}
