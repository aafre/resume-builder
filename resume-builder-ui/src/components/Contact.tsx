import { Link } from "react-router-dom";
import { Mail, Clock, HelpCircle, CheckCircle2, AlertCircle } from "lucide-react";
import { useState, useEffect } from "react";
import SEOHead from "./SEOHead";

const getCookie = (name: string) => {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop()?.split(";").shift();
};

const setCookie = (name: string, value: string, hours: number) => {
  const expires = new Date(Date.now() + hours * 3600 * 1000).toUTCString();
  document.cookie = `${name}=${value}; expires=${expires}; path=/`;
};

const CONTACT_CHANNELS = [
  {
    Icon: Mail,
    title: "Email Support",
    body: "For technical help and general inquiries",
    action: (
      <a
        href="mailto:support@easyfreeresume.com"
        className="text-accent-text font-medium underline underline-offset-4 decoration-accent-text/30 hover:decoration-accent-text"
      >
        support@easyfreeresume.com
      </a>
    ),
  },
  {
    Icon: Clock,
    title: "Response Time",
    body: (
      <>
        We typically respond within 24 hours
        <span className="block text-sm mt-1">Monday - Friday, 9 AM - 6 PM EST</span>
      </>
    ),
    action: null,
  },
  {
    Icon: HelpCircle,
    title: "Help Center",
    body: "Find answers to common questions",
    action: (
      <Link
        to="/blog"
        className="text-accent-text font-medium underline underline-offset-4 decoration-accent-text/30 hover:decoration-accent-text"
      >
        Browse Career Resources <span aria-hidden="true">&rarr;</span>
      </Link>
    ),
  },
];

const FAQS: [string, string][] = [
  [
    "Is EasyFreeResume really free?",
    "Yes! Our resume builder is completely free with no hidden costs, subscriptions, or premium tiers. You can create and download unlimited resumes.",
  ],
  [
    "Do you store my personal information?",
    "No. We don't store your resume data on our servers. Everything stays local to your device, ensuring complete privacy and security.",
  ],
  [
    "Are your templates ATS-friendly?",
    "Absolutely! All our templates are designed to pass Applicant Tracking Systems (ATS) used by most employers today.",
  ],
  [
    "Can I edit my resume after downloading?",
    "Yes! You can save your work and return to edit anytime. We also provide guidance on editing downloaded files.",
  ],
];

export default function Contact() {
  const [justSubmittedNow, setJustSubmittedNow] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<
    "idle" | "success" | "error"
  >("idle");
  const [formDisabled, setFormDisabled] = useState(false);
  const [previouslySubmitted, setPreviouslySubmitted] = useState(false);

  useEffect(() => {
    if (getCookie("formSubmitted") === "true") {
      setFormDisabled(true);
      setPreviouslySubmitted(true);
    }
  }, []);

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch(
        "https://formsubmit.co/ajax/support@easyfreeresume.com",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify(formData),
        }
      );

      const result = await response.json();

      if (result.success === "true" || response.ok) {
        setSubmitStatus("success");
        setJustSubmittedNow(true);
        setFormDisabled(true);
        setCookie("formSubmitted", "true", 1); // 1-hour cooldown
        setFormData({ name: "", email: "", subject: "", message: "" });
      } else {
        setSubmitStatus("error");
      }
    } catch (err) {
      console.error("Submission failed", err);
      setSubmitStatus("error");
    } finally {
      setIsSubmitting(false);
    }
  };


  const fieldClass =
    "w-full min-h-11 px-4 py-3 bg-white border border-gray-300 rounded-lg text-ink placeholder:text-ink/40 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-accent-text focus:border-accent disabled:bg-chalk-dark disabled:text-ink/40 disabled:cursor-not-allowed";

  return (
    <>
      <SEOHead
        title="Contact EasyFreeResume | Get Help With Your Resume and Career"
        description="Contact our team for support, feedback, or career guidance. We're here to help you succeed in your job search with free professional assistance."
        keywords="contact us, customer support, career help, resume assistance, technical support, feedback"
        structuredData={{
          "@context": "https://schema.org",
          "@type": "ContactPage",
          name: "Contact EasyFreeResume",
          description:
            "Get in touch with our team for support and career guidance",
        }}
      />

      <div className="min-h-screen bg-chalk">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20">
          <nav className="mb-8" aria-label="breadcrumb">
            <ol className="flex items-center space-x-2 text-sm text-ink/60">
              <li>
                <Link to="/" className="hover:text-accent-text transition-colors">
                  Home
                </Link>
              </li>
              <li className="text-ink/60">/</li>
              <li className="text-ink font-medium">Contact</li>
            </ol>
          </nav>

          <header className="text-center mb-12 md:mb-16">
            <p className="font-mono text-xs tracking-[0.15em] text-accent-text uppercase mb-4">
              Contact
            </p>
            <h1 className="font-display text-[clamp(2.5rem,5.5vw,4rem)] font-extrabold leading-[1.08] tracking-tight text-ink mb-6 [text-wrap:balance]">
              Get in Touch
            </h1>
            <p className="text-lg md:text-xl font-extralight text-ink/60 leading-relaxed max-w-2xl mx-auto [text-wrap:pretty]">
              Have questions, feedback, or need help with your resume? We're
              here to support your career journey every step of the way.
            </p>
          </header>

          <div className="grid lg:grid-cols-2 gap-12">
            {/* The form is the page's purpose, so it is the one surface here
                that keeps a card. Everything else sits on the ground. */}
            <div
              id="contact-form"
              className="bg-white rounded-2xl border border-black/[0.06] shadow-premium p-6 md:p-8 scroll-mt-[calc(var(--header-height-desktop)+2rem)]"
            >
              <h2 className="font-display text-2xl font-extrabold tracking-tight text-ink mb-6">
                Send us a Message
              </h2>

              {/* Status banners. Semantic colour is allowed inside a status
                  affordance and nowhere else; the emoji that stood in for the
                  status icons are Lucide marks now, at one stroke weight. */}
              <div aria-live="polite">
                {justSubmittedNow ? (
                  <div className="flex items-start gap-3 bg-emerald-50 border border-emerald-200 rounded-lg p-4 mb-6">
                    <CheckCircle2
                      className="w-5 h-5 mt-0.5 flex-none text-emerald-700"
                      strokeWidth={2}
                      aria-hidden="true"
                    />
                    <div>
                      <h3 className="font-semibold text-emerald-900">
                        Message Sent Successfully!
                      </h3>
                      <p className="text-emerald-800 text-sm mt-1">
                        We’ll respond within 24 hours. Thank you!
                      </p>
                    </div>
                  </div>
                ) : previouslySubmitted ? (
                  <div className="flex items-start gap-3 bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6">
                    <Clock
                      className="w-5 h-5 mt-0.5 flex-none text-amber-700"
                      strokeWidth={2}
                      aria-hidden="true"
                    />
                    <div>
                      <h3 className="font-semibold text-amber-900">Already Submitted</h3>
                      <p className="text-amber-800 text-sm mt-1">
                        You've already sent us a message. Please wait a while before
                        submitting another one, or email us directly at{" "}
                        <a
                          href="mailto:support@easyfreeresume.com"
                          className="font-medium underline underline-offset-4"
                        >
                          support@easyfreeresume.com
                        </a>
                        .
                      </p>
                    </div>
                  </div>
                ) : null}

                {submitStatus === "error" && (
                  <div className="flex items-start gap-3 bg-rose-50 border border-rose-200 rounded-lg p-4 mb-6">
                    <AlertCircle
                      className="w-5 h-5 mt-0.5 flex-none text-rose-700"
                      strokeWidth={2}
                      aria-hidden="true"
                    />
                    <div>
                      <h3 className="font-semibold text-rose-900">
                        Failed to send message
                      </h3>
                      <p className="text-rose-800 text-sm mt-1">
                        Please try again or contact us directly via email.
                      </p>
                    </div>
                  </div>
                )}
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <input type="hidden" name="_captcha" value="false" />
                <input type="hidden" name="_template" value="box" />

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label
                      htmlFor="name"
                      className="block text-sm font-medium text-ink mb-2"
                    >
                      Full Name <span className="text-ink/60">*</span>
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                      disabled={formDisabled}
                      className={fieldClass}
                      placeholder="Your full name"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="email"
                      className="block text-sm font-medium text-ink mb-2"
                    >
                      Email <span className="text-ink/60">*</span>
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      disabled={formDisabled}
                      className={fieldClass}
                      placeholder="you@example.com"
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="subject"
                    className="block text-sm font-medium text-ink mb-2"
                  >
                    Subject <span className="text-ink/60">*</span>
                  </label>
                  <select
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleInputChange}
                    required
                    disabled={formDisabled}
                    className={fieldClass}
                  >
                    <option value="">Select a topic</option>
                    <option value="technical-support">Technical Support</option>
                    <option value="feature-request">Feature Request</option>
                    <option value="career-advice">Career Advice</option>
                    <option value="partnership">Partnership Inquiry</option>
                    <option value="feedback">General Feedback</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div>
                  <label
                    htmlFor="message"
                    className="block text-sm font-medium text-ink mb-2"
                  >
                    Message <span className="text-ink/60">*</span>
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    required
                    disabled={formDisabled}
                    rows={6}
                    className={fieldClass}
                    placeholder="Tell us how we can help you..."
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting || formDisabled}
                  className="btn-primary w-full py-4 px-6 disabled:opacity-60 disabled:cursor-not-allowed disabled:shadow-none"
                >
                  {isSubmitting ? "Sending…" : "Send Message"}
                </button>
              </form>
            </div>

            {/* Contact Information & FAQ */}
            <div className="space-y-12">
              {/* Quick Contact. The three accent-tinted icon discs are gone —
                  three green circles in a column on a page that already has a
                  green submit button spends the accent on navigation. */}
              <section>
                <p className="font-mono text-xs tracking-[0.15em] text-accent-text uppercase mb-4">
                  Direct
                </p>
                <h2 className="font-display text-2xl font-extrabold tracking-tight text-ink mb-8">
                  Quick Contact
                </h2>

                <dl className="border-t border-ink/10">
                  {CONTACT_CHANNELS.map(({ Icon, title, body, action }) => (
                    <div key={title} className="flex items-start gap-4 py-5 border-b border-ink/10">
                      <Icon
                        className="w-5 h-5 mt-1 flex-none text-accent-text"
                        strokeWidth={1.75}
                        aria-hidden="true"
                      />
                      <div>
                        <dt className="font-bold text-ink mb-1">{title}</dt>
                        <dd className="font-extralight text-ink/60 leading-relaxed">
                          {body}
                          {action && <div className="mt-2">{action}</div>}
                        </dd>
                      </div>
                    </div>
                  ))}
                </dl>
              </section>

              {/* FAQ */}
              <section>
                <p className="font-mono text-xs tracking-[0.15em] text-accent-text uppercase mb-4">
                  Before you write
                </p>
                <h2 className="font-display text-2xl font-extrabold tracking-tight text-ink mb-8">
                  Frequently Asked Questions
                </h2>

                <dl className="border-t border-ink/10">
                  {FAQS.map(([q, a]) => (
                    <div key={q} className="py-5 border-b border-ink/10">
                      <dt className="font-bold text-ink mb-2">{q}</dt>
                      <dd className="font-extralight text-ink/60 text-sm leading-relaxed">{a}</dd>
                    </div>
                  ))}
                </dl>

                <p className="text-sm text-ink/60 mt-6">
                  Don't see your question?{" "}
                  {/* Was a <button> with no handler — a control that looked
                      operable and did nothing. It is an anchor to the form. */}
                  <a
                    href="#contact-form"
                    className="text-accent-text font-medium underline underline-offset-4 decoration-accent-text/30 hover:decoration-accent-text"
                  >
                    Send us a message
                  </a>{" "}
                  and we'll help you out.
                </p>
              </section>

              {/* Our Commitment. Was a solid bg-accent panel: the largest area
                  of Signal Green anywhere on the site, against a 10% ceiling,
                  and it left the actual CTA — the submit button — with nothing
                  louder than its own surroundings. */}
              <section className="bg-ink text-white rounded-2xl p-8 relative overflow-clip">
                <div
                  aria-hidden="true"
                  className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[420px] h-[280px] max-w-full rounded-full bg-accent/[0.07] blur-3xl pointer-events-none"
                />
                <div className="relative">
                  <p className="font-mono text-xs tracking-[0.15em] text-accent uppercase mb-4">
                    Our commitment
                  </p>
                  <h2 className="font-display text-2xl font-extrabold tracking-tight mb-4">
                    Our Commitment
                  </h2>
                  <p className="text-lg font-extralight leading-relaxed text-white/60 mb-8">
                    We're dedicated to helping you succeed in your career journey.
                    Every message is important to us, and we're committed to
                    providing helpful, timely responses.
                  </p>
                  <div className="flex items-center gap-3">
                    <CheckCircle2
                      className="w-5 h-5 flex-none text-accent"
                      strokeWidth={2}
                      aria-hidden="true"
                    />
                    <span className="font-medium">100% Free Career Support</span>
                  </div>
                </div>
              </section>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
