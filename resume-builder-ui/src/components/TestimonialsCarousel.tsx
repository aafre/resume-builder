import { useState, useEffect } from "react";
import {
  ArrowLeftIcon,
  ArrowRightIcon,
  StarIcon,
} from "@heroicons/react/24/solid";

const testimonialsData = [
  {
    img: "https://i.pravatar.cc/100?u=user1",
    quote: "Got my dream job within 2 weeks of using this resume builder!",
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
  {
    img: "https://i.pravatar.cc/100?u=user1",
    quote: "Got my dream job within 2 weeks of using this resume builder!",
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
  {
    img: "https://i.pravatar.cc/100?u=user1",
    quote: "Got my dream job within 2 weeks of using this resume builder!",
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
  // Add as many testimonials as needed
];

export default function TestimonialsCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const total = testimonialsData.length;

  // Auto-rotate every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % total);
    }, 5000);
    return () => clearInterval(interval);
  }, [total]);

  const goToPrevious = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + total) % total);
  };

  const goToNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % total);
  };

  return (
    <div className="container mx-auto max-w-2xl my-12 px-4">
      <h2 className="text-3xl md:text-4xl font-bold text-center mb-8">
        What Our Users Say
      </h2>
      <div className="relative">
        <div className="bg-white border border-gray-200 rounded-lg shadow transition-all duration-300 ease-in-out p-6">
          <div className="flex flex-col items-center">
            <img
              src={testimonialsData[currentIndex].img}
              alt="User"
              className="w-20 h-20 rounded-full border-2 border-blue-600 mb-4"
            />
            <p className="text-gray-700 text-center italic mb-4">
              “{testimonialsData[currentIndex].quote}”
            </p>
            <p className="font-semibold text-blue-600 text-sm mb-2">
              - {testimonialsData[currentIndex].name}
            </p>
            <div className="flex">
              {Array.from({ length: 5 }).map((_, i) => (
                <StarIcon key={i} className="w-5 h-5 text-yellow-500" />
              ))}
            </div>
          </div>
        </div>
        {/* Navigation Arrows */}
        <button
          onClick={goToPrevious}
          className="absolute top-1/2 left-0 transform -translate-y-1/2 p-2 bg-white rounded-full shadow-md hover:bg-gray-100 transition"
        >
          <ArrowLeftIcon className="w-6 h-6 text-blue-600" />
        </button>
        <button
          onClick={goToNext}
          className="absolute top-1/2 right-0 transform -translate-y-1/2 p-2 bg-white rounded-full shadow-md hover:bg-gray-100 transition"
        >
          <ArrowRightIcon className="w-6 h-6 text-blue-600" />
        </button>
      </div>
      {/* Navigation Dots */}
      <div className="flex justify-center mt-4 space-x-2">
        {testimonialsData.map((_, idx) => (
          <div
            key={idx}
            onClick={() => setCurrentIndex(idx)}
            className={`w-3 h-3 rounded-full cursor-pointer ${
              idx === currentIndex ? "bg-blue-600" : "bg-gray-300"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
