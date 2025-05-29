import { useState } from "react";
import { StarIcon } from "@heroicons/react/24/solid";

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
  // You can add more testimonials as needed.
];

export default function TestimonialsMarquee() {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div className="container mx-auto max-w-5xl my-12 px-4">
      <h2 className="text-3xl md:text-4xl font-bold text-center mb-8">
        What Our Users Say
      </h2>
      <div
        className="overflow-hidden"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div
          className="flex"
          style={{
            animation: `marquee 20s linear infinite`,
            animationPlayState: isHovered ? "paused" : "running",
          }}
        >
          {/*
            Duplicate the testimonials to create a seamless loop.
            Each card is fixed-width so the total width of this container
            is wide enough for the animation.
          */}
          {testimonialsData
            .concat(testimonialsData)
            .map((testimonial, index) => (
              <div
                key={index}
                className="flex-shrink-0 w-80 mr-4 bg-white border border-gray-200 rounded-lg shadow p-6"
              >
                <div className="flex flex-col items-center">
                  <img
                    src={testimonial.img}
                    alt="User"
                    className="w-16 h-16 rounded-full border-2 border-blue-600 mb-4"
                  />
                  <p className="text-gray-700 text-center italic mb-4">
                    “{testimonial.quote}”
                  </p>
                  <p className="font-semibold text-blue-600 text-sm mb-2">
                    - {testimonial.name}
                  </p>
                  <div className="flex">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <StarIcon key={i} className="w-5 h-5 text-yellow-500" />
                    ))}
                  </div>
                </div>
              </div>
            ))}
        </div>
        {/* Inline style for marquee keyframes */}
        <style>{`
          @keyframes marquee {
            0% { transform: translateX(0); }
            100% { transform: translateX(-50%); }
          }
        `}</style>
      </div>
    </div>
  );
}
