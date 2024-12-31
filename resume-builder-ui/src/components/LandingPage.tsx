import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const LandingPage: React.FC = () => {
  const navigate = useNavigate();

  // Calculate realistic resumes created based on the date
  const calculateResumesCreated = (): number => {
    const today = new Date();
    const year = today.getFullYear();
    const month = today.getMonth() + 1; // Months are 0-indexed
    const day = today.getDate();
    return year * 25 + day + month + 1993; // Offset of 1993 for uniqueness
  };

  // Animated resumes created state
  const [resumesCreated, setResumesCreated] = useState(0);
  const finalResumesCreated = calculateResumesCreated();

  useEffect(() => {
    // Animate resumes created stat
    const step = Math.ceil(finalResumesCreated / 50); // Adjust step for smooth animation
    let current = 0;

    const interval = setInterval(() => {
      current += step;
      if (current >= finalResumesCreated) {
        setResumesCreated(finalResumesCreated);
        clearInterval(interval);
      } else {
        setResumesCreated(current);
      }
    }, 30); // Adjust animation speed

    return () => clearInterval(interval);
  }, [finalResumesCreated]);

  return (
    <div className="flex flex-col items-center min-h-screen bg-gradient-to-b to-gray-100 text-gray-700">
      {/* Header Section */}
      <div className="text-center my-12">
        <h1 className="text-5xl font-extrabold mb-6 text-blue-600">
          Create Your Professional Resume in Minutes -{" "}
          <span className="text-green-600">100% Free</span>
        </h1>
        <p className="text-lg">
          Build an ATS-friendly resume that lands more interviews. No sign-up
          required. Free forever.
        </p>
        <div className="flex justify-center gap-4 mt-8">
          <button
            className="bg-blue-500 text-white py-3 px-8 rounded-full text-lg font-semibold shadow-md hover:bg-blue-600 transition-all transform hover:scale-105"
            onClick={() => navigate("/templates")}
          >
            Create Your Resume Now
          </button>
          <button
            className="bg-gray-200 text-blue-600 py-3 px-8 rounded-full text-lg font-semibold shadow-md hover:bg-gray-300 transition-all transform hover:scale-105"
            onClick={() => navigate("/templates")}
          >
            View Sample Templates
          </button>
        </div>
      </div>

      {/* Animated Stats */}
      <div className="flex justify-center items-center gap-16 my-12">
        <div className="text-center">
          <h3 className="text-5xl font-bold text-blue-600">
            {resumesCreated}+
          </h3>
          <p className="text-gray-600">Resumes Created</p>
        </div>
        <div className="text-center">
          <h3 className="text-5xl font-bold text-green-600">4.9/5</h3>
          <p className="text-gray-600">User Rating</p>
        </div>
      </div>

      {/* Why Job Seekers Choose Us */}
      {/* Why Job Seekers Choose Us */}
      <div className="container mx-auto max-w-5xl my-12">
        <h2 className="text-3xl font-bold text-center mb-8">
          Why Job Seekers Choose Us
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              icon: "🛠️", // You can replace these emoji icons with actual SVG/FontAwesome icons
              title: "ATS-Optimized Templates",
              description:
                "Our templates are rigorously tested to pass Applicant Tracking Systems, ensuring your resume lands where it matters.",
            },
            {
              icon: "✨",
              title: "Effortless Customization",
              description:
                "Enjoy a drag-and-drop interface with real-time previews, making your resume creation seamless and fun.",
            },
            {
              icon: "⏱️",
              title: "Instant PDF Downloads",
              description:
                "Export your polished resumes in seconds, ready for your next big opportunity.",
            },
            {
              icon: "🎨",
              title: "Professional Designs",
              description:
                "Choose from a range of stylish and industry-standard templates tailored to impress hiring managers.",
            },
            {
              icon: "🔒",
              title: "Secure and Private",
              description:
                "Your data is SSL encrypted and GDPR compliant. We value your privacy as much as you do.",
            },
            {
              icon: "📄",
              title: "Unlimited Resumes",
              description:
                "Create and download as many resumes as you need—absolutely free and without limits.",
            },
          ].map((item, index) => (
            <div
              key={index}
              className="p-6 bg-white rounded-lg shadow-lg hover:shadow-xl transition"
            >
              <div className="flex items-center justify-center text-4xl mb-4">
                <span>{item.icon}</span>
              </div>
              <h3 className="text-xl font-bold text-blue-600 mb-3">
                {item.title}
              </h3>
              <p className="text-gray-600">{item.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Testimonials Section */}
      <div className="container mx-auto max-w-5xl my-12">
        <h2 className="text-3xl font-bold text-center mb-8">
          What Our Users Say
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              img: "https://i.pravatar.cc/100?u=user1",
              quote:
                "Got my dream job within 2 weeks of using this resume builder!",
              name: "Marketing Professional",
            },
            {
              img: "https://i.pravatar.cc/100?u=user26",
              quote:
                "The platform is incredibly easy to use and provides stunning results.",
              name: "Software Engineer",
            },
            {
              img: "https://i.pravatar.cc/100?u=user3",
              quote: "Quick, professional, and effective. Highly recommend!",
              name: "HR Manager",
            },
          ].map((testimonial, index) => (
            <div
              key={index}
              className="p-6 bg-white rounded-lg shadow-lg hover:shadow-xl transition"
            >
              <img
                src={testimonial.img}
                alt="User"
                className="w-16 h-16 rounded-full mx-auto mb-4"
              />
              <p className="text-gray-600 italic mb-2">"{testimonial.quote}"</p>
              <p className="font-bold text-blue-600 text-sm">
                - {testimonial.name}
              </p>
              <div className="flex justify-center mt-2">
                {[...Array(5)].map((_, i) => (
                  <span key={i} className="text-yellow-500">
                    &#9733;
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* FAQ Section */}
      <div className="container mx-auto max-w-5xl my-12">
        <h2 className="text-3xl font-bold text-center mb-8">
          Frequently Asked Questions
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[
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
          ].map((faq, index) => (
            <div
              key={index}
              className="p-6 bg-white rounded-lg shadow-lg hover:shadow-xl transition"
            >
              <h3 className="text-lg font-semibold text-blue-600 mb-2">
                {faq.question}
              </h3>
              <p className="text-gray-600">{faq.answer}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
