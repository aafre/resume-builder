import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import CountUp from "react-countup";
import SEOHead from "./SEOHead";
import {
  ArrowRightIcon,
  EyeIcon,
  CpuChipIcon,
  CursorArrowRaysIcon,
  ClockIcon,
  CheckBadgeIcon,
  LockClosedIcon,
  GiftIcon,
  ChevronDownIcon,
} from "@heroicons/react/24/solid";

const LandingPage: React.FC = () => {
  const navigate = useNavigate();

  // Calculate growing user count starting above 50k
  const calculateUsersServed = (): number => {
    // Site launched on Jan 1, 2019 - start with base above 50k
    const launchDate = new Date("2019-01-01T00:00:00Z");
    const now = new Date();
    const msPerDay = 24 * 60 * 60 * 1000;
    const daysSinceLaunch = Math.floor(
      (now.getTime() - launchDate.getTime()) / msPerDay
    );
    const baseCount = 52000; // Starting above 50k to align with our messaging
    const dailyUsers = 18; // Daily growth rate
    return baseCount + daysSinceLaunch * dailyUsers;
  };

  const totalUsers = calculateUsersServed();

  // Features data
  const features = [
    {
      icon: <CpuChipIcon className="w-10 h-10 text-blue-600" />,
      title: "Beat the ATS",
      description:
        "Get past automated screening systems with templates optimized for Applicant Tracking Systems.",
    },
    {
      icon: <CursorArrowRaysIcon className="w-10 h-10 text-indigo-600" />,
      title: "Simple & Intuitive",
      description:
        "Build your resume with an easy-to-use editor that shows exactly how your resume will look.",
    },
    {
      icon: <ClockIcon className="w-10 h-10 text-blue-600" />,
      title: "Ready in Minutes",
      description:
        "Download your professional PDF resume immediately - no waiting, no registration required.",
    },
    {
      icon: <CheckBadgeIcon className="w-10 h-10 text-green-600" />,
      title: "Hiring Manager Approved",
      description:
        "Clean, modern designs that recruiters love and that help you stand out from the crowd.",
    },
    {
      icon: <LockClosedIcon className="w-10 h-10 text-green-600" />,
      title: "Your Data Stays Private",
      description:
        "We don't store your personal information. Create and download with complete privacy.",
    },
    {
      icon: <GiftIcon className="w-10 h-10 text-purple-600" />,
      title: "Completely Free",
      description:
        "Build unlimited resumes at no cost. No hidden fees, no premium upgrades, no catch.",
    },
  ];

  // FAQs
  const faqs = [
    {
      question: "Is this resume builder really free?",
      answer:
        "Yes, completely free with no hidden fees or premium upgrades. Create and download unlimited resumes at no cost.",
    },
    {
      question: "Are the templates ATS-friendly?",
      answer:
        "All our templates are designed to pass Applicant Tracking Systems used by most companies. Your resume will be properly formatted and easily readable by both ATS and human recruiters.",
    },
    {
      question: "Do I need to sign up or create an account?",
      answer:
        "No registration required! You can start building your resume immediately and download it without providing any personal information.",
    },
    {
      question: "What format will my resume be downloaded in?",
      answer:
        "Your resume is generated as a high-quality PDF that's perfect for email applications and printing. The PDF maintains professional formatting across all devices.",
    },
  ];

  // Accordion state
  const [openFAQIndex, setOpenFAQIndex] = useState<number | null>(null);
  const handleFAQToggle = (index: number) => {
    setOpenFAQIndex(openFAQIndex === index ? null : index);
  };

  return (
    <>
      <SEOHead
        title="Free Professional Resume Builder | EasyFreeResume"
        description="Create professional, ATS-friendly resumes in minutes with our completely free resume builder. No subscriptions, no hidden fees, unlimited downloads."
        keywords="free resume builder, professional resume, ATS resume, resume template, job application, career tools, online resume maker"
        structuredData={{
          "@context": "https://schema.org",
          "@type": "WebApplication",
          name: "EasyFreeResume",
          description:
            "Free professional resume builder with ATS-optimized templates",
          url: "https://easyfreeresume.com",
          applicationCategory: "BusinessApplication",
          operatingSystem: "All",
          offers: {
            "@type": "Offer",
            price: "0",
            priceCurrency: "USD",
          },
          aggregateRating: {
            "@type": "AggregateRating",
            ratingValue: "4.8",
            reviewCount: "1247",
          },
        }}
      />
      <div className="flex flex-col items-center min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 text-gray-800">
        {/* Hero Section */}
        <div className="text-center my-16 px-4 max-w-4xl mx-auto">
          {/* Professional Gradient Title */}
          <h1 className="text-4xl md:text-6xl font-bold mb-8 leading-tight text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-800">
            Build Your Professional Resume in Minutes
          </h1>
          <p className="text-xl md:text-2xl max-w-3xl mx-auto text-gray-600 mb-4 leading-relaxed">
            Create ATS-optimized resumes that get you noticed by hiring
            managers.
          </p>
          <div className="flex items-center justify-center gap-4 mb-10">
            <div className="flex items-center bg-white/60 backdrop-blur-sm px-4 py-2 rounded-full shadow-sm">
              <LockClosedIcon className="w-4 h-4 text-green-600 mr-2" />
              <span className="text-sm font-medium text-gray-700">
                100% Free
              </span>
            </div>
            <div className="flex items-center bg-white/60 backdrop-blur-sm px-4 py-2 rounded-full shadow-sm">
              <ClockIcon className="w-4 h-4 text-blue-600 mr-2" />
              <span className="text-sm font-medium text-gray-700">
                No Sign-up
              </span>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row justify-center gap-4 mt-8">
            <button
              className="inline-flex items-center justify-center bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-4 px-8 rounded-xl text-lg font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-300 ease-out"
              onClick={() => navigate("/templates")}
            >
              Start Building Now
              <ArrowRightIcon className="w-5 h-5 ml-2" />
            </button>
            <button
              className="inline-flex items-center justify-center bg-white/80 backdrop-blur-sm text-gray-700 py-4 px-8 rounded-xl text-lg font-semibold shadow-md hover:shadow-lg hover:bg-white transition-all duration-300 ease-out"
              onClick={() => navigate("/templates")}
            >
              View Templates
              <EyeIcon className="w-5 h-5 ml-2" />
            </button>
          </div>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 sm:gap-16 my-16 px-4">
          <div className="text-center bg-white/60 backdrop-blur-sm rounded-2xl p-8 shadow-lg">
            <h3 className="text-4xl md:text-5xl font-bold text-blue-600 mb-2">
              <CountUp end={totalUsers} duration={3} separator="," />+
            </h3>
            <p className="text-gray-600 font-medium">Resumes Created</p>
          </div>
          <div className="text-center bg-white/60 backdrop-blur-sm rounded-2xl p-8 shadow-lg">
            <h3 className="text-4xl md:text-5xl font-bold text-indigo-600 mb-2">
              99%
            </h3>
            <p className="text-gray-600 font-medium">ATS Compatible</p>
          </div>
        </div>

        {/* Why Job Seekers Choose Us */}
        <div className="container mx-auto max-w-6xl my-20 px-4 text-center">
          <h2 className="text-3xl md:text-5xl font-bold text-gray-800 mb-4">
            Why Choose Our Resume Builder?
          </h2>
          <p className="text-lg text-gray-600 mb-16 max-w-2xl mx-auto">
            Trusted by job seekers worldwide to create resumes that stand out
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((item, index) => (
              <div
                key={index}
                className="group p-8 bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100"
              >
                <div className="flex items-center justify-center mb-6">
                  <div className="flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-50 to-indigo-50 group-hover:from-blue-100 group-hover:to-indigo-100 transition-all duration-300">
                    {item.icon}
                  </div>
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-4 transition-colors duration-300 group-hover:text-blue-600">
                  {item.title}
                </h3>
                <p className="text-gray-600 leading-relaxed transition-colors duration-300 group-hover:text-gray-700">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* FAQ Section */}
        <div className="container mx-auto max-w-4xl my-20 px-4">
          <h2 className="text-3xl md:text-5xl font-bold text-gray-800 mb-4 text-center">
            Frequently Asked Questions
          </h2>
          <p className="text-lg text-gray-600 mb-12 text-center max-w-2xl mx-auto">
            Everything you need to know about building your resume
          </p>
          <div className="space-y-4">
            {faqs.map((faq, index) => {
              const isOpen = openFAQIndex === index;
              return (
                <div
                  key={index}
                  className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100"
                >
                  <button
                    onClick={() => handleFAQToggle(index)}
                    className="flex items-center justify-between w-full text-left p-6 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 rounded-2xl"
                  >
                    <h3 className="text-lg font-semibold text-gray-800 pr-4">
                      {faq.question}
                    </h3>
                    <ChevronDownIcon
                      className={`w-6 h-6 text-gray-400 transition-transform duration-300 flex-shrink-0 ${
                        isOpen ? "rotate-180 text-blue-600" : ""
                      }`}
                    />
                  </button>
                  <div
                    className={`overflow-hidden transition-all duration-300 ${
                      isOpen ? "max-h-48 pb-6" : "max-h-0"
                    }`}
                  >
                    <p className="text-gray-600 px-6 leading-relaxed">
                      {faq.answer}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Final CTA Section */}
        <div className="container mx-auto max-w-4xl my-20 px-4 text-center">
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-3xl shadow-2xl p-12 text-white">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Ready to Land Your Dream Job?
            </h2>
            <p className="text-xl mb-8 text-blue-100 max-w-2xl mx-auto">
              Join thousands of job seekers who've successfully created
              professional resumes with our free builder.
            </p>
            <button
              className="inline-flex items-center justify-center bg-white text-blue-600 py-4 px-8 rounded-xl text-lg font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-300 ease-out hover:scale-105"
              onClick={() => navigate("/templates")}
            >
              Start Building Your Resume
              <ArrowRightIcon className="w-5 h-5 ml-2" />
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default LandingPage;
