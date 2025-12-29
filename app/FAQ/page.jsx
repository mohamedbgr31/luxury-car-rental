"use client"

import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { useFaqs } from "@/context/FaqContext";
import Navbar from "../components/homepage/navbar";
import FooterSection from "../components/homepage/footer";
import Link from "next/link";

const FaqPagee = () => {
  const [openIndex, setOpenIndex] = useState(null);
  const { getVisibleFaqs, loading } = useFaqs();
  
  // Get only visible FAQs for public display
  const faqs = getVisibleFaqs();

  const toggleFaq = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  if (loading) {
    return (
      <div className="relative w-full bg-[#1C1C1C] min-h-screen">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: "url('/img/lamboburjdxb.jpg')",
            opacity: 0.035,
            zIndex: 0,
          }}
        />
        <div className="relative z-10">
          <Navbar />
          <div className="flex items-center justify-center min-h-screen">
            <div className="text-white text-xl">Loading FAQs...</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full bg-[#1C1C1C]">
      {/* Background image with opacity */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: "url('/img/lamboburjdxb.jpg')",
          opacity: 0.035,
          zIndex: 0,
        }}
      />

      {/* Main content */}
      <div className="relative z-10">
        <Navbar />

        <section className="min-h-screen text-white py-12">
          <div className="container-responsive text-center">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-yellow-500 mb-2">F.A.Q</h1>
            <p className="text-base sm:text-lg lg:text-xl mb-8 sm:mb-10">Got Questions? We've Got You Covered</p>
          </div>

          {faqs.length === 0 ? (
            <div className="container-responsive text-center py-16">
              <p className="text-gray-400 text-xl">No FAQs available at the moment.</p>
              <p className="text-gray-500 text-sm mt-2">Please check back later or contact us directly.</p>
            </div>
          ) : (
            <div className="container-responsive spacing-responsive">
              {faqs.map((faq, index) => {
                const isOpen = openIndex === index;

                return (
                  <div
                    key={faq.id}
                    className="bg-[#282828] border border-yellow-500 rounded-3xl p-6 sm:p-7 lg:p-8 transition-all duration-300"
                  >
                    <div
                      onClick={() => toggleFaq(index)}
                      className="flex justify-between items-center cursor-pointer"
                    >
                      <div className="w-full">
                        <h3 className="text-base sm:text-lg lg:text-xl font-semibold">{faq.question}</h3>
                        {isOpen && (
                          <div className="w-full h-[1px] bg-yellow-400 mt-3 sm:mt-4" />
                        )}
                      </div>

                      <button className="ml-4 w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-yellow-500 flex items-center justify-center text-black transition-transform duration-200 hover:scale-105">
                        {isOpen ? (
                          <ChevronUp className="w-4 h-4 sm:w-5 sm:h-5" />
                        ) : (
                          <ChevronDown className="w-4 h-4 sm:w-5 sm:h-5" />
                        )}
                      </button>
                    </div>

                    <div
                      className={`transition-all duration-500 ease-in-out overflow-hidden ${
                        isOpen ? "max-h-96 mt-3 sm:mt-4" : "max-h-0"
                      }`}
                    >
                      <p className="text-gray-300 max-w-[85%] sm:max-w-[80%] mx-auto text-lg sm:text-xl lg:text-2xl leading-relaxed">
                        {faq.answer}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>

        <FooterSection />
      </div>
    </div>
  );
};

export default FaqPagee;