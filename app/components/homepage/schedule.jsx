          "use client"

import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

export default function ExperienceSection() {
  const [openIndex, setOpenIndex] = useState(0);

  const data = [
    {
      title: "Schedule a Rent",
      content:
        "Contact us now for a schedule a rent and let us to help you to find your perfect car!",
      button: "Book NOW",
    },
    {
      title: "Visit Our Showroom",
      content: "",
    },
    {
      title: "Contact US",
      content: "",
    },
  ];

  const handleToggle = (index) => {
    setOpenIndex(index === openIndex ? null : index);
  };

  return (
    <section className="flex flex-col md:flex-row items-center justify-between gap-10 px-4 py-16 bg-black text-white">
      {/* Left side */}
      <div className="md:w-1/2">
        <h2 className="text-4xl md:text-5xl font-bruno mb-10 leading-tight text-center md:text-left">
          Don’t Wait any Longer <br /> to experience it !
        </h2>

        <div className="space-y-2">
          {data.map((item, index) => (
            <div
              key={index}
              className={`border border-gray-600 rounded-md transition-all ${
                openIndex === index ? "bg-[#1a1a1a]" : "bg-transparent"
              }`}
            >
              <button
                onClick={() => handleToggle(index)}
                className="w-full px-6 py-4 flex items-center justify-between font-playfair text-lg uppercase"
              >
                {item.title}
                {openIndex === index ? (
                  <ChevronUp size={20} />
                ) : (
                  <ChevronDown size={20} />
                )}
              </button>

              {openIndex === index && (
                <div className="px-6 pb-6 text-sm text-gray-300 font-light">
                  <p className="mb-4">{item.content}</p>
                  {item.button && (
                    <button className="bg-yellow-400 hover:bg-yellow-300 text-black font-bold px-6 py-2 rounded-md">
                      {item.button}
                    </button>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Right side */}
      <div className="md:w-1/2">
        <img
          src="/images/lamborghini-interior.jpg"
          alt="Lamborghini Interior"
          className="w-full h-auto rounded-md shadow-lg"
        />
      </div>
    </section>
  );
}
