import { Link } from 'react-router-dom';

interface BlogCTAProps {
  type?: 'resume' | 'interview' | 'general';
}

const BlogCTA = ({ type = 'general' }: BlogCTAProps) => {
  const getContent = () => {
    switch (type) {
      case 'resume':
        return {
          title: 'Ready to Create Your Perfect Resume?',
          subtitle: 'Transform your career prospects with a professionally designed resume',
          primaryAction: {
            text: 'Build Your Resume Free',
            link: '/templates',
            internal: true,
            description: 'Create an ATS-optimized resume in minutes'
          },
          secondaryAction: {
            text: 'Practice Interviews',
            link: 'https://prepai.co.uk',
            internal: false,
            description: 'Prepare for job interviews with AI coaching'
          }
        };
      case 'interview':
        return {
          title: 'Master Your Next Interview',
          subtitle: 'Get personalized practice and feedback to land your dream job',
          primaryAction: {
            text: 'Start Interview Practice',
            link: 'https://prepai.co.uk',
            internal: false,
            description: 'AI-powered interview coaching and feedback'
          },
          secondaryAction: {
            text: 'Optimize Your Resume',
            link: '/templates',
            internal: true,
            description: 'Create a resume that gets you interviews'
          }
        };
      default:
        return {
          title: 'Take Your Career to the Next Level',
          subtitle: 'Everything you need to land your dream job',
          primaryAction: {
            text: 'Create Your Resume',
            link: '/templates',
            internal: true,
            description: 'Professional resume builder with ATS optimization'
          },
          secondaryAction: {
            text: 'Practice Interviews',
            link: 'https://prepai.co.uk',
            internal: false,
            description: 'AI interview coach with personalized feedback'
          }
        };
    }
  };

  const content = getContent();

  const PrimaryButton = content.primaryAction.internal ? (
    <Link
      to={content.primaryAction.link}
      className="btn-primary py-3 px-6 text-sm"
    >
      {content.primaryAction.text}
      <svg className="w-4 h-4 ml-2" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
      </svg>
    </Link>
  ) : (
    <a
      href={content.primaryAction.link}
      target="_blank"
      rel="noopener noreferrer"
      className="btn-primary py-3 px-6 text-sm"
    >
      {content.primaryAction.text}
      <svg className="w-4 h-4 ml-2" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
      </svg>
    </a>
  );

  const SecondaryButton = content.secondaryAction.internal ? (
    <Link
      to={content.secondaryAction.link}
      className="btn-secondary py-3 px-6 text-sm"
    >
      {content.secondaryAction.text}
      <svg className="w-4 h-4 ml-2" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
      </svg>
    </Link>
  ) : (
    <a
      href={content.secondaryAction.link}
      target="_blank"
      rel="noopener noreferrer"
      className="btn-secondary py-3 px-6 text-sm"
    >
      {content.secondaryAction.text}
      <svg className="w-4 h-4 ml-2" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
      </svg>
    </a>
  );

  return (
    <section className="mt-12 mb-8">
      <div className="bg-chalk-dark rounded-2xl p-8 md:p-10 border border-black/[0.04]">
        <div className="text-center mb-8">
          <span className="font-mono text-[10px] tracking-[0.15em] text-accent uppercase">
            Next Steps
          </span>
          <h3 className="font-display text-2xl font-extrabold text-ink mt-2 mb-2">
            {content.title}
          </h3>
          <p className="font-display font-extralight text-stone-warm text-lg">
            {content.subtitle}
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Primary action card */}
          <div className="bg-white rounded-xl p-6 border border-transparent hover:border-black/[0.04] hover:shadow-lg transition-all duration-300">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 bg-accent/10 rounded-lg flex items-center justify-center flex-shrink-0">
                {content.primaryAction.internal ? (
                  <svg className="w-5 h-5 text-accent" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5 text-accent" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M7 4a3 3 0 016 0v4a3 3 0 11-6 0V4zm4 10.93A7.001 7.001 0 0017 8a1 1 0 10-2 0A5 5 0 015 8a1 1 0 00-2 0 7.001 7.001 0 006 6.93V17H6a1 1 0 100 2h8a1 1 0 100-2h-3v-2.07z" clipRule="evenodd" />
                  </svg>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="font-display font-bold text-ink mb-1">{content.primaryAction.text}</h4>
                <p className="font-display font-extralight text-stone-warm text-sm mb-4">{content.primaryAction.description}</p>
                {PrimaryButton}
              </div>
            </div>
          </div>

          {/* Secondary action card */}
          <div className="bg-white rounded-xl p-6 border border-transparent hover:border-black/[0.04] hover:shadow-lg transition-all duration-300">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 bg-accent/10 rounded-lg flex items-center justify-center flex-shrink-0">
                {content.secondaryAction.internal ? (
                  <svg className="w-5 h-5 text-accent" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5 text-accent" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z" clipRule="evenodd" />
                  </svg>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="font-display font-bold text-ink mb-1">{content.secondaryAction.text}</h4>
                <p className="font-display font-extralight text-stone-warm text-sm mb-4">{content.secondaryAction.description}</p>
                {SecondaryButton}
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-black/[0.06]">
          <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-6 md:gap-8 text-xs sm:text-sm">
            <div className="flex items-center gap-1.5 sm:gap-2">
              <svg className="w-4 h-4 text-accent" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              <span className="font-display font-extralight text-stone-warm">Completely Free</span>
            </div>
            <div className="flex items-center gap-1.5 sm:gap-2">
              <svg className="w-4 h-4 text-accent" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              <span className="font-display font-extralight text-stone-warm">No Account Required</span>
            </div>
            <div className="flex items-center gap-1.5 sm:gap-2">
              <svg className="w-4 h-4 text-accent" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              <span className="font-display font-extralight text-stone-warm">ATS Optimized</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BlogCTA;
