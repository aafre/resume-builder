import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import CountUp from "react-countup";
import {
  ArrowRightIcon,
  EyeIcon,
  WrenchScrewdriverIcon,
  SparklesIcon,
  ClockIcon,
  PaintBrushIcon,
  LockClosedIcon,
  DocumentTextIcon,
  ChevronDownIcon,
} from "@heroicons/react/24/solid";
import TestimonialsMarquee from "./TestimonialsMarquee";

const LandingPage: React.FC = () => {
  const navigate = useNavigate();

  // Calculate realistic resumes created
  const calculateResumesCreated = (): number => {
    // Example: site launched on Jan 1, 2019
    const launchDate = new Date("2019-01-01T00:00:00Z");
    const now = new Date();
    const msPerDay = 24 * 60 * 60 * 1000;
    const daysSinceLaunch = Math.floor(
      (now.getTime() - launchDate.getTime()) / msPerDay
    );
    const baseCount = 500; // Starting resumes
    const dailyResumes = 15; // Growth rate
    return baseCount + daysSinceLaunch * dailyResumes;
  };

  const finalResumesCreated = calculateResumesCreated();

  // Features data
  const features = [
    {
      icon: <WrenchScrewdriverIcon className="w-10 h-10 text-blue-600" />,
      title: "ATS-Optimized Templates",
      description:
        "Our templates are rigorously tested to pass Applicant Tracking Systems, ensuring your resume lands where it matters.",
    },
    {
      icon: <SparklesIcon className="w-10 h-10 text-blue-600" />,
      title: "Effortless Customization",
      description:
        "Enjoy a drag-and-drop interface with real-time previews, making your resume creation seamless and fun.",
    },
    {
      icon: <ClockIcon className="w-10 h-10 text-blue-600" />,
      title: "Instant PDF Downloads",
      description:
        "Export your polished resumes in seconds, ready for your next big opportunity.",
    },
    {
      icon: <PaintBrushIcon className="w-10 h-10 text-blue-600" />,
      title: "Professional Designs",
      description:
        "Choose from a range of stylish and industry-standard templates tailored to impress hiring managers.",
    },
    {
      icon: <LockClosedIcon className="w-10 h-10 text-blue-600" />,
      title: "Secure & Private",
      description:
        "Your data is SSL encrypted and GDPR compliant. We value your privacy as much as you do.",
    },
    {
      icon: <DocumentTextIcon className="w-10 h-10 text-blue-600" />,
      title: "Unlimited Resumes",
      description:
        "Create and download as many resumes as you need—absolutely free and without limits.",
    },
  ];

  // FAQs
  const faqs = [
    {
      question: "Is EasyFreeResume really free?",
      answer:
        "Yes, our resume builder is 100% free with no hidden costs. Create and download as many resumes as you need.",
    },
    {
      question: "How do I create an ATS-friendly resume?",
      answer:
        "Our templates are specifically designed to pass ATS systems. Just choose a template and fill in your details.",
    },
    {
      question: "Can I download my resume as PDF?",
      answer:
        "Yes, you can download your resume in PDF format, which is perfect for job applications.",
    },
    {
      question: "Do I need to create an account?",
      answer:
        "No account needed! Start creating your resume right away without any sign-up process.",
    },
  ];

  // Accordion state
  const [openFAQIndex, setOpenFAQIndex] = useState<number | null>(null);
  const handleFAQToggle = (index: number) => {
    setOpenFAQIndex(openFAQIndex === index ? null : index);
  };

  return (
    <div className="flex flex-col items-center min-h-screen bg-gradient-to-b from-white to-gray-50 text-gray-800">
      {/* Hero Section */}
      <div className="text-center my-12 px-4">
        {/* Rainbow Gradient Title */}
        <h1
          className="
            text-4xl md:text-5xl font-extrabold mb-6 leading-tight
            text-transparent bg-clip-text
            bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500
          "
        >
          Create Your Professional Resume in Minutes - 100% Free
        </h1>
        <p className="text-lg md:text-xl max-w-2xl mx-auto text-gray-700">
          Build an ATS-friendly resume that lands more interviews.
          <br className="hidden md:block" />
          No sign-up required. Free forever.
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4 mt-8">
          <button
            className="inline-flex items-center justify-center bg-blue-600 text-white py-3 px-6 rounded-full text-lg font-semibold shadow-md
                       hover:bg-blue-700 transition-colors duration-300 ease-in-out"
            onClick={() => navigate("/templates")}
          >
            Create Your Resume Now
            <ArrowRightIcon className="w-5 h-5 ml-2" />
          </button>
          <button
            className="inline-flex items-center justify-center bg-gray-200 text-blue-600 py-3 px-6 rounded-full text-lg font-semibold shadow-md
                       hover:bg-gray-300 transition-colors duration-300 ease-in-out"
            onClick={() => navigate("/templates")}
          >
            View Sample Templates
            <EyeIcon className="w-5 h-5 ml-2" />
          </button>
        </div>
      </div>

      {/* Stats Section */}
      <div className="flex justify-center items-center gap-16 my-12">
        <div className="text-center">
          <h3 className="text-5xl font-bold text-blue-600">
            <CountUp end={finalResumesCreated} duration={3} separator="," />+
          </h3>
          <p className="text-gray-700 mt-1">Resumes Created</p>
        </div>
        <div className="text-center">
          <h3 className="text-5xl font-bold text-green-600">4.9/5</h3>
          <p className="text-gray-700 mt-1">User Rating</p>
        </div>
      </div>

      {/* Why Job Seekers Choose Us */}
      <div className="container mx-auto max-w-5xl my-12 px-4 text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-blue-700 mb-8">
          Why Job Seekers Choose Us
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((item, index) => (
            <div
              key={index}
              className="group p-6 bg-white rounded-lg shadow-lg transition-transform duration-300 transform hover:-translate-y-1 hover:scale-105"
            >
              <div className="flex items-center justify-center mb-4">
                <div className="flex items-center justify-center w-16 h-16 rounded-full bg-blue-50 group-hover:bg-blue-100 transition-colors duration-300">
                  {item.icon}
                </div>
              </div>
              <h3 className="text-xl font-bold text-blue-600 mb-3 transition-colors duration-300 group-hover:text-blue-700">
                {item.title}
              </h3>
              <p className="text-gray-600 transition-colors duration-300 group-hover:text-gray-700">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Testimonials Section */}
      <TestimonialsMarquee />

      {/* FAQ Section */}
      <div className="container mx-auto max-w-5xl my-12 px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-blue-700 mb-8">
          Frequently Asked Questions
        </h2>
        <div className="grid grid-cols-1 gap-6">
          {faqs.map((faq, index) => {
            const isOpen = openFAQIndex === index;
            return (
              <div
                key={index}
                className="p-6 bg-white rounded-lg shadow-lg transition-shadow hover:shadow-xl"
              >
                <button
                  onClick={() => handleFAQToggle(index)}
                  className="flex items-center justify-between w-full text-left"
                >
                  <h3 className="text-lg font-semibold text-blue-600">
                    {faq.question}
                  </h3>
                  <ChevronDownIcon
                    className={`w-5 h-5 ml-2 transition-transform duration-300 ${
                      isOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>
                <div
                  className={`overflow-hidden transition-all duration-300 ${
                    isOpen ? "max-h-40 mt-2" : "max-h-0"
                  }`}
                >
                  <p className="text-gray-600">{faq.answer}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
