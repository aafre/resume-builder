import { Link } from "react-router-dom";
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
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20">
          <nav className="mb-8" aria-label="breadcrumb">
            <ol className="flex items-center space-x-2 text-sm text-stone-warm">
              <li>
                <Link to="/" className="hover:text-accent transition-colors">
                  Home
                </Link>
              </li>
              <li className="text-mist">/</li>
              <li className="text-ink font-medium">Contact</li>
            </ol>
          </nav>

          <header className="text-center mb-12">
            <h1 className="font-display text-4xl md:text-5xl font-extrabold tracking-tight text-ink mb-6">
              Get in Touch
            </h1>
            <p className="text-lg md:text-xl font-extralight text-stone-warm leading-relaxed max-w-2xl mx-auto">
              Have questions, feedback, or need help with your resume? We're
              here to support your career journey every step of the way.
            </p>
          </header>

          <div className="grid lg:grid-cols-2 gap-12">
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-premium p-8 border border-black/[0.06]">
              <h2 className="font-display text-2xl font-extrabold tracking-tight text-ink mb-6">
                Send us a Message
              </h2>

              {justSubmittedNow ? (
                <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-6">
                  <div className="flex items-center gap-3">
                    <span className="text-green-600 text-xl">✅</span>
                    <div>
                      <h3 className="font-medium text-green-800">
                        Message Sent Successfully!
                      </h3>
                      <p className="text-green-700 text-sm">
                        We’ll respond within 24 hours. Thank you!
                      </p>
                    </div>
                  </div>
                </div>
              ) : previouslySubmitted ? (
                <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 mb-6">
                  <div className="flex items-center gap-3">
                    <span className="text-yellow-600 text-xl">⏰</span>
                    <div>
                      <h3 className="font-medium text-yellow-800">
                        Already Submitted
                      </h3>
                      <p className="text-yellow-700 text-sm">
                        You've already sent us a message. Please wait a while before
                        submitting another one, or email us directly at{" "}
                        <a
                          href="mailto:support@easyfreeresume.com"
                          className="text-accent underline hover:text-ink/80"
                        >
                          support@easyfreeresume.com
                        </a>
                        .
                      </p>
                    </div>
                  </div>
                </div>
              ) : null}

              {submitStatus === "error" && (
                <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6">
                  <div className="flex items-center gap-3">
                    <span className="text-red-600 text-xl">❌</span>
                    <div>
                      <h3 className="font-medium text-red-800">
                        Failed to send message
                      </h3>
                      <p className="text-red-700 text-sm">
                        Please try again or contact us directly via email.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <input type="hidden" name="_captcha" value="false" />
                <input type="hidden" name="_template" value="box" />

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label
                      htmlFor="name"
                      className="block text-sm font-medium text-stone-warm mb-2"
                    >
                      Full Name *
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                      disabled={formDisabled}
                      className="w-full px-4 py-3 border rounded-xl"
                      placeholder="Your full name"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="email"
                      className="block text-sm font-medium text-stone-warm mb-2"
                    >
                      Email *
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      disabled={formDisabled}
                      className="w-full px-4 py-3 border rounded-xl"
                      placeholder="you@example.com"
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="subject"
                    className="block text-sm font-medium text-stone-warm mb-2"
                  >
                    Subject *
                  </label>
                  <select
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleInputChange}
                    required
                    disabled={formDisabled}
                    className="w-full px-4 py-3 border rounded-xl"
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
                    className="block text-sm font-medium text-stone-warm mb-2"
                  >
                    Message *
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    required
                    disabled={formDisabled}
                    rows={6}
                    className="w-full px-4 py-3 border rounded-xl"
                    placeholder="Tell us how we can help you..."
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting || formDisabled}
                  className={`w-full bg-accent text-ink py-4 px-6 rounded-xl font-semibold shadow-lg ${
                    isSubmitting || formDisabled
                      ? "opacity-60 cursor-not-allowed"
                      : "hover:shadow-xl"
                  }`}
                >
                  {isSubmitting ? "Sending..." : "Send Message"}
                </button>
              </form>
            </div>

            {/* Contact Information & FAQ */}
            <div className="space-y-8">
              {/* Quick Contact */}
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-premium p-8 border border-black/[0.06]">
                <h2 className="font-display text-2xl font-extrabold tracking-tight text-ink mb-6">
                  Quick Contact
                </h2>

                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="bg-accent/10 rounded-full p-3">
                      <svg
                        className="w-6 h-6 text-accent"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                        />
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-semibold text-ink mb-1">
                        Email Support
                      </h3>
                      <p className="text-stone-warm mb-2">
                        For technical help and general inquiries
                      </p>
                      <a
                        href="mailto:support@easyfreeresume.com"
                        className="text-accent hover:text-ink/80 transition-colors"
                      >
                        support@easyfreeresume.com
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="bg-accent/10 rounded-full p-3">
                      <svg
                        className="w-6 h-6 text-accent"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-semibold text-ink mb-1">
                        Response Time
                      </h3>
                      <p className="text-stone-warm">
                        We typically respond within 24 hours
                      </p>
                      <p className="text-sm text-mist mt-1">
                        Monday - Friday, 9 AM - 6 PM EST
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="bg-accent/10 rounded-full p-3">
                      <svg
                        className="w-6 h-6 text-accent"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-semibold text-ink mb-1">
                        Help Center
                      </h3>
                      <p className="text-stone-warm mb-2">
                        Find answers to common questions
                      </p>
                      <Link
                        to="/blog"
                        className="text-accent hover:text-ink/80 transition-colors"
                      >
                        Browse Career Resources →
                      </Link>
                    </div>
                  </div>
                </div>
              </div>

              {/* FAQ */}
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-premium p-8 border border-black/[0.06]">
                <h2 className="font-display text-2xl font-extrabold tracking-tight text-ink mb-6">
                  Frequently Asked Questions
                </h2>

                <div className="space-y-6">
                  <div>
                    <h3 className="font-semibold text-ink mb-2">
                      Is EasyFreeResume really free?
                    </h3>
                    <p className="text-stone-warm text-sm">
                      Yes! Our resume builder is completely free with no hidden
                      costs, subscriptions, or premium tiers. You can create and
                      download unlimited resumes.
                    </p>
                  </div>

                  <div>
                    <h3 className="font-semibold text-ink mb-2">
                      Do you store my personal information?
                    </h3>
                    <p className="text-stone-warm text-sm">
                      No. We don't store your resume data on our servers.
                      Everything stays local to your device, ensuring complete
                      privacy and security.
                    </p>
                  </div>

                  <div>
                    <h3 className="font-semibold text-ink mb-2">
                      Are your templates ATS-friendly?
                    </h3>
                    <p className="text-stone-warm text-sm">
                      Absolutely! All our templates are designed to pass
                      Applicant Tracking Systems (ATS) used by most employers
                      today.
                    </p>
                  </div>

                  <div>
                    <h3 className="font-semibold text-ink mb-2">
                      Can I edit my resume after downloading?
                    </h3>
                    <p className="text-stone-warm text-sm">
                      Yes! You can save your work and return to edit anytime. We
                      also provide guidance on editing downloaded files.
                    </p>
                  </div>
                </div>

                <div className="mt-6 pt-6 border-t border-black/[0.06]">
                  <p className="text-sm text-stone-warm">
                    Don't see your question?{" "}
                    <button className="text-accent hover:text-ink/80 transition-colors">
                      Send us a message
                    </button>{" "}
                    and we'll help you out.
                  </p>
                </div>
              </div>

              {/* Office Information */}
              <div className="bg-accent text-ink rounded-2xl shadow-lg p-8">
                <h2 className="text-2xl font-bold mb-4">Our Commitment</h2>
                <p className="text-lg leading-relaxed opacity-90 mb-6">
                  We're dedicated to helping you succeed in your career journey.
                  Every message is important to us, and we're committed to
                  providing helpful, timely responses.
                </p>
                <div className="flex items-center gap-3">
                  <div className="bg-white/20 rounded-full p-2">
                    <svg
                      className="w-5 h-5"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <span className="font-medium">100% Free Career Support</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
