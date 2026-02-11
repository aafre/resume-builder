import { Link } from 'react-router-dom';

export default function AuthorBio() {
  return (
    <section className="mt-10">
      <div className="bg-chalk-dark rounded-2xl border border-black/[0.04] p-6 md:p-8">
        <div className="flex items-start gap-5">
          <div className="w-14 h-14 bg-ink rounded-xl flex items-center justify-center flex-shrink-0 shadow-md">
            <svg className="w-7 h-7 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
            </svg>
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-mono text-[10px] tracking-[0.15em] text-stone-warm uppercase mb-1">Written by</p>
            <h3 className="font-display text-lg font-extrabold text-ink mb-2">The EasyFreeResume Team</h3>
            <p className="font-display font-extralight text-stone-warm leading-relaxed mb-4">
              We're a team of career coaches, HR professionals, and developers dedicated to making professional resume building accessible to everyone — completely free, no strings attached.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link
                to="/blog"
                className="text-sm font-medium text-accent hover:text-ink transition-colors"
              >
                More articles &rarr;
              </Link>
              <span className="text-mist">|</span>
              <Link
                to="/templates"
                className="text-sm font-medium text-accent hover:text-ink transition-colors"
              >
                Browse templates &rarr;
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
