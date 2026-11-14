/**
 * Best Free Resume Builder Reddit Page
 * URL: /best-free-resume-builder-reddit
 * Primary keyword: "free resume builder reddit" (also "reddit free resume builder")
 *
 * Every count, quote and thread on this page comes from data/redditEvidence.json, built by
 * bench/reddit_pull.py + bench/reddit_evidence.py. Never hand-edit that file or paraphrase a quote.
 */

import { Link } from 'react-router-dom';
import SEOPageLayout from '../shared/SEOPageLayout';
import PageHero from '../shared/PageHero';
import FAQSection from '../shared/FAQSection';
import DownloadCTA from '../shared/DownloadCTA';
import RevealSection from '../shared/RevealSection';
import { usePageSchema } from '../../hooks/usePageSchema';
import { SEO_PAGES } from '../../config/seoPages';
import CompareBuildersCrossLinks from '../blog/CompareBuildersCrossLinks';
import evidence from '../../data/redditEvidence.json';

type Quote = (typeof evidence.quotes)[number];

const PULLED = new Date(evidence.pulled_utc).toLocaleDateString('en-GB', {
  day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC',
});
const fmtMonth = (iso: string) =>
  new Date(iso).toLocaleDateString('en-GB', { month: 'short', year: 'numeric', timeZone: 'UTC' });

const EYEBROW = 'font-mono text-xs tracking-[0.15em] text-accent-text uppercase mb-4';
const H2 = 'font-display text-3xl md:text-4xl font-extrabold tracking-tight text-ink';
const SUB = 'text-lg md:text-xl font-extralight text-ink/60 max-w-3xl mx-auto leading-relaxed mt-5';

function QuoteCard({ q }: { q: Quote }) {
  return (
    <figure className="bg-white rounded-2xl shadow-premium border border-black/[0.06] p-6">
      <blockquote className="text-ink whitespace-pre-line leading-relaxed">{q.body}</blockquote>
      <figcaption className="mt-4 text-sm text-ink/60">
        r/{q.sub} · {q.score} {Math.abs(q.score) === 1 ? 'point' : 'points'} ·{' '}
        <a href={q.url} rel="nofollow noopener" target="_blank" className="text-accent-text underline">
          open the comment on Reddit
        </a>
      </figcaption>
    </figure>
  );
}

const quotes = (group: string) => evidence.quotes.filter((q) => q.group === group);

export default function BestFreeResumeBuilderReddit() {
  const config = SEO_PAGES.redditRecommended;
  const schemas = usePageSchema({ type: 'software', faqs: config.faqs });
  const us = quotes('us')[0];

  return (
    <SEOPageLayout seoConfig={config.seo} schemas={schemas}>
      <PageHero config={config.hero} />

      {/* Answer-first summary */}
      <div className="max-w-3xl mx-auto -mt-8 mb-16">
        <div className="text-lg text-ink leading-relaxed bg-white rounded-2xl p-6 shadow-premium border-l-4 border-l-accent space-y-3">
          <p>
            <strong>Short answer:</strong> the most upvoted replies on Reddit tell you to skip resume
            builders. Use a Google Docs or Word template, or LaTeX in Overleaf for tech jobs.
          </p>
          <p>
            When people do name a builder, Novoresume gets the most upvotes. Every other builder comes
            up in comments with only a few upvotes each.
          </p>
          <p className="text-sm text-ink/60">
            From {evidence.threads.length} threads and {evidence.comments_read} comments, pulled{' '}
            {PULLED}. Method and every thread are below.
          </p>
        </div>
      </div>

      {/* What the top replies say */}
      <RevealSection variant="fade-up">
        <div className="mb-16 cv-auto cv-h-800">
          <div className="text-center mb-12 md:mb-16">
            <p className={EYEBROW}>Verbatim · linked</p>
            <h2 className={H2}>What the top replies actually say</h2>
            <p className={SUB}>
              Copied word for word from the pulled threads, with the score each comment had on the pull
              date. Click through to check any of them.
            </p>
          </div>
          <div className="max-w-3xl mx-auto space-y-10">
            <div>
              <h3 className="font-display text-xl font-bold text-ink mb-4">&ldquo;You don&apos;t need a builder&rdquo;</h3>
              <div className="space-y-4">{quotes('skip').map((q) => <QuoteCard key={q.id} q={q} />)}</div>
            </div>
            <div>
              <h3 className="font-display text-xl font-bold text-ink mb-4">When someone names a builder</h3>
              <div className="space-y-4">{quotes('builder').map((q) => <QuoteCard key={q.id} q={q} />)}</div>
            </div>
          </div>
        </div>
      </RevealSection>

      {/* Mention table */}
      <RevealSection variant="fade-up">
        <div className="band band-bleed band-chalk-dark py-16 md:py-24 cv-auto cv-h-800">
          <div className="text-center mb-12 md:mb-16">
            <p className={EYEBROW}>Counted · {PULLED}</p>
            <h2 className={H2}>Every tool mentioned, counted</h2>
            <p className={SUB}>
              A mention is not a recommendation. Some of these mentions are warnings (&ldquo;don&apos;t
              use Canva&rdquo;), so read the upvotes column as how much attention a tool got, not how
              much people liked it.
            </p>
          </div>
          <div className="max-w-3xl mx-auto overflow-x-auto rounded-2xl shadow-premium border border-black/[0.06]">
            <table className="w-full text-sm text-left border-collapse bg-white">
              <caption className="sr-only">
                Resume tools mentioned in {evidence.threads.length} Reddit threads asking for a builder
              </caption>
              <thead className="bg-ink text-white">
                <tr>
                  <th scope="col" className="p-3 font-bold">Tool</th>
                  <th scope="col" className="p-3 font-bold text-right">Threads</th>
                  <th scope="col" className="p-3 font-bold text-right">Comments</th>
                  <th scope="col" className="p-3 font-bold text-right">Upvotes</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-black/[0.06]">
                {evidence.mentions.map((m) => (
                  <tr key={m.tool}>
                    <th scope="row" className="p-3 font-medium text-ink">{m.tool}</th>
                    <td className="p-3 text-right text-ink/80 tabular-nums">{m.threads}</td>
                    <td className="p-3 text-right text-ink/80 tabular-nums">{m.comments}</td>
                    <td className="p-3 text-right text-ink/80 tabular-nums">{m.upvotes}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-xs text-ink/60 text-center max-w-3xl mx-auto mt-4">
            Upvotes are summed, with negative scores counted as zero. A comment that names two tools
            counts for both. Comments copied and pasted word for word count once.
          </p>
        </div>
      </RevealSection>

      {/* Where we fit */}
      <RevealSection variant="fade-up">
        <div className="mb-16 mt-16 cv-auto cv-h-500">
          <div className="text-center mb-12 md:mb-16">
            <p className={EYEBROW}>Our own row</p>
            <h2 className={H2}>Where EasyFreeResume fits</h2>
            <p className={SUB}>
              We make EasyFreeResume, so you should weigh this section accordingly. In these threads
              we were mentioned once, and that comment was voted down.
            </p>
          </div>
          <div className="max-w-3xl mx-auto space-y-6">
            {us && <QuoteCard q={us} />}
            <div className="bg-white rounded-2xl shadow-premium border border-black/[0.06] p-6 text-ink/80 leading-relaxed space-y-3">
              <p>
                If the Reddit advice to use a plain template suits you, take it. If you want a builder
                anyway, this is what ours does, and what you can check yourself:
              </p>
              <ul className="list-disc pl-5 space-y-2">
                <li>
                  You can build and download a PDF with no account and no payment. We{' '}
                  <Link to="/free-resume-builder-no-sign-up" className="text-accent-text underline">
                    tested that logged out, with screenshots
                  </Link>
                  .
                </li>
                <li>
                  Without an account, your resume is saved in your browser. Making the PDF sends it to
                  our server. The site is paid for by Google ads, which can use cookies and ad partners;
                  you&apos;ll see a consent notice for them.
                </li>
              </ul>
            </div>
          </div>
        </div>
      </RevealSection>

      {/* Checklist */}
      <RevealSection variant="fade-up">
        <div className="mb-16 cv-auto cv-h-400">
          <div className="text-center mb-12 md:mb-16">
            <h2 className={H2}>How to check a builder is actually free</h2>
            <p className={SUB}>
              A complaint that keeps coming up in these threads is a builder that lets you write a whole
              resume, then asks for money at the download step. Check before you start typing:
            </p>
          </div>
          <ul className="max-w-3xl mx-auto bg-white rounded-2xl shadow-premium border-l-4 border-l-accent p-8 space-y-4 text-ink/80">
            <li><strong className="text-ink">Download first.</strong> Put in a fake name and export before you write anything real.</li>
            <li><strong className="text-ink">Open every page of the file.</strong> Look for a watermark or a &ldquo;made with&rdquo; footer.</li>
            <li><strong className="text-ink">No card for &ldquo;free&rdquo;.</strong> A free trial that needs a card is a subscription.</li>
            <li><strong className="text-ink">Check the format you need.</strong> A builder can give PDF free and charge for Word.</li>
          </ul>
        </div>
      </RevealSection>

      {/* Method */}
      <RevealSection variant="fade-up">
        <div className="mb-16 cv-auto cv-h-800">
          <div className="text-center mb-12 md:mb-16">
            <p className={EYEBROW}>Method</p>
            <h2 className={H2}>How we pulled and counted</h2>
          </div>
          <div className="max-w-3xl mx-auto text-ink/80 leading-relaxed space-y-4">
            <p>
              On {PULLED} we searched the{' '}
              <a href="https://github.com/ArthurHeitmann/arctic_shift" rel="nofollow noopener" target="_blank" className="text-accent-text underline">
                Arctic Shift
              </a>{' '}
              Reddit archive for post titles containing {evidence.queries.map((q) => `"${q}"`).join(', ')} in{' '}
              {evidence.subs.map((s) => `r/${s}`).join(', ')}, posted between {fmtMonth(evidence.from)} and{' '}
              {fmtMonth(evidence.to)}. We kept posts with 10 or more comments.
            </p>
            <p>
              From those we kept only the threads where the poster asks which builder to use, and read
              every comment in them. Tool names were matched by spelling, so a typo like
              &ldquo;Noveresume&rdquo; or a bare &ldquo;Docs&rdquo; is missed and the counts run low.{' '}
              {evidence.searches_skipped > 0 &&
                `${evidence.searches_skipped} searches timed out on the archive's side and are not included. `}
              The scripts are in our repository, so the numbers can be rebuilt.
            </p>
            <h3 className="font-display text-xl font-bold text-ink pt-4">The {evidence.threads.length} threads</h3>
            <ol className="list-decimal pl-5 space-y-2 text-sm">
              {evidence.threads.map((t) => (
                <li key={t.id}>
                  <a href={t.url} rel="nofollow noopener" target="_blank" className="text-accent-text underline">
                    {t.title}
                  </a>{' '}
                  <span className="text-ink/60">
                    r/{t.sub} · {fmtMonth(new Date(t.created_utc * 1000).toISOString())} · {t.comments} comments
                  </span>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </RevealSection>

      <RevealSection variant="fade-up">
        <div className="mb-16 max-w-4xl mx-auto cv-auto cv-h-300">
          <CompareBuildersCrossLinks
            title="See How Specific Builders Compare"
            description="Want a detailed breakdown of a specific resume builder? We've analyzed pricing, features, and hidden costs:"
            bgColor="bg-accent/[0.06]"
          />
        </div>
      </RevealSection>

      <FAQSection faqs={config.faqs} />

      <DownloadCTA
        title="Want a builder anyway?"
        description="Build and download a PDF resume. No account, no payment."
        primaryHref="/templates"
      />
    </SEOPageLayout>
  );
}
