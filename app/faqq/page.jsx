"use client"

import { useState } from "react";
import { ChevronDown, ChevronUp, Sparkles, HelpCircle } from "lucide-react";
import { useFaqs } from "@/context/FaqContext";
import Navbar from "../components/homepage/navbar";
import FooterSection from "../components/homepage/footer";
import Link from "next/link";

const FaqPage = () => {
  const [openIndex, setOpenIndex] = useState(null);
  const { getVisibleFaqs, loading } = useFaqs();
  
  // Get only visible FAQs for public display
  const faqs = getVisibleFaqs();

  const toggleFaq = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  if (loading) {
    return (
      <div className="relative w-full bg-gradient-to-br from-black via-gray-900 to-black min-h-screen">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: "url('/img/lamboburjdxb.jpg')",
            opacity: 0.05,
            zIndex: 0,
          }}
        />
        
        {/* Elegant overlay pattern */}
        <div className="absolute inset-0 opacity-10" style={{
          backgroundImage: `radial-gradient(circle at 25% 25%, #FFD700 0%, transparent 50%),
                           radial-gradient(circle at 75% 75%, #FFA500 0%, transparent 50%)`,
          zIndex: 1,
        }} />
        
        <div className="relative z-10">
          <Navbar />
          <div className="flex items-center justify-center min-h-screen">
            <div className="text-center">
              <div className="animate-spin w-12 h-12 border-4 border-amber-500 border-t-transparent rounded-full mx-auto mb-4"></div>
              <div className="text-amber-400 text-xl font-light tracking-wide">Loading FAQs...</div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full bg-gradient-to-br from-black via-gray-900 to-black">
      {/* Background image with enhanced opacity */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: "url('/img/lamboburjdxb.jpg')",
          opacity: 0.05,
          zIndex: 0,
        }}
      />

      {/* Luxury overlay pattern */}
      <div className="absolute inset-0 opacity-10" style={{
        backgroundImage: `radial-gradient(circle at 20% 20%, #FFD700 0%, transparent 40%),
                         radial-gradient(circle at 80% 80%, #FFA500 0%, transparent 40%),
                         radial-gradient(circle at 60% 20%, #FFD700 0%, transparent 30%)`,
        zIndex: 1,
      }} />

      {/* Animated gold particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none" style={{ zIndex: 2 }}>
        <div className="absolute top-1/4 left-1/4 w-1 h-1 bg-amber-400 rounded-full animate-pulse opacity-60"></div>
        <div className="absolute top-1/3 right-1/3 w-0.5 h-0.5 bg-yellow-300 rounded-full animate-pulse opacity-40" style={{ animationDelay: '1s' }}></div>
        <div className="absolute bottom-1/3 left-1/5 w-1 h-1 bg-amber-500 rounded-full animate-pulse opacity-50" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-1/2 right-1/4 w-0.5 h-0.5 bg-yellow-400 rounded-full animate-pulse opacity-70" style={{ animationDelay: '3s' }}></div>
      </div>

      {/* Main content */}
      <div className="relative z-10">
        <Navbar />

        <section className="min-h-screen text-white py-16 sm:py-20">
          {/* Hero Section */}
          <div className="container-responsive text-center mb-16 sm:mb-20">
            <div className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-r from-amber-400 to-yellow-500 rounded-full mb-6 sm:mb-8 shadow-2xl shadow-amber-500/30">
              <HelpCircle className="w-8 h-8 sm:w-10 sm:h-10 text-black" />
            </div>
            
            <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold bg-gradient-to-r from-amber-400 via-yellow-500 to-amber-400 bg-clip-text text-transparent mb-4 sm:mb-6 tracking-tight">
              Frequently Asked Questions
            </h1>
            
            <div className="flex items-center justify-center gap-2 mb-6">
              <Sparkles className="w-5 h-5 text-amber-400" />
              <p className="text-lg sm:text-xl lg:text-2xl text-gray-300 font-light tracking-wide">
                Your Premium Experience, Clarified
              </p>
              <Sparkles className="w-5 h-5 text-amber-400" />
            </div>
            
            <div className="w-32 h-0.5 bg-gradient-to-r from-transparent via-amber-400 to-transparent mx-auto"></div>
          </div>

          {faqs.length === 0 ? (
            <div className="container-responsive text-center py-20">
              <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm border border-amber-500/20 rounded-3xl p-12 shadow-2xl">
                <div className="w-20 h-20 bg-gradient-to-r from-amber-400 to-yellow-500 rounded-full flex items-center justify-center mx-auto mb-6">
                  <HelpCircle className="w-10 h-10 text-black" />
                </div>
                <p className="text-gray-300 text-2xl font-light mb-4">No FAQs Available</p>
                <p className="text-gray-500 text-lg">We're curating premium content for you. Please check back soon or contact our concierge team directly.</p>
                <div className="w-24 h-0.5 bg-gradient-to-r from-transparent via-amber-400 to-transparent mx-auto mt-6"></div>
              </div>
            </div>
          ) : (
            <div className="container-responsive spacing-responsive">
              <div className="grid gap-6 sm:gap-8">
                {faqs.map((faq, index) => {
                  const isOpen = openIndex === index;

                  return (
                    <div
                      key={faq.id}
                      className={`group relative bg-gradient-to-br from-amber-500/10 to-yellow-500/10 backdrop-blur-sm border-2 rounded-3xl overflow-hidden transition-all duration-500 hover:shadow-2xl hover:shadow-amber-500/20 hover:scale-[1.02] ${
                        isOpen 
                          ? 'border-amber-400 shadow-2xl shadow-amber-500/30' 
                          : 'border-amber-500/30 hover:border-amber-400/60'
                      }`}
                    >
                      {/* Luxury gradient overlay */}
                      <div className={`absolute inset-0 bg-gradient-to-r from-amber-500/5 to-yellow-500/5 transition-opacity duration-500 ${
                        isOpen ? 'opacity-100' : 'opacity-0'
                      }`} />
                      
                      {/* Top accent line */}
                      <div className={`h-1 bg-gradient-to-r from-amber-400 to-yellow-500 transition-all duration-500 ${
                        isOpen ? 'opacity-100' : 'opacity-0'
                      }`} />

                      <div className="relative p-8 sm:p-10 ">
                        <div
                          onClick={() => toggleFaq(index)}
                          className="flex justify-between items-start cursor-pointer group"
                        >
                          <div className="flex-1 pr-6">
                            <div className="flex items-start gap-4 mb-2">
                              <div className="flex-shrink-0 w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-r from-amber-400 to-yellow-500 rounded-full flex items-center justify-center text-black font-bold text-sm sm:text-base shadow-lg">
                                {index + 1}
                              </div>
                              <h3 className="text-xl sm:text-2xl lg:text-3xl font-semibold text-white leading-tight group-hover:text-amber-100 transition-colors duration-300">
                                {faq.question}
                              </h3>
                            </div>
                            
                            {isOpen && (
                              <div className="ml-12 sm:ml-14">
                                <div className="w-full h-px bg-gradient-to-r from-amber-400 via-yellow-500 to-amber-400 my-6 animate-pulse" />
                              </div>
                            )}
                          </div>

                          <button className={`flex-shrink-0 w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-gradient-to-r from-amber-400 to-yellow-500 flex items-center justify-center text-black transition-all duration-300 shadow-lg hover:shadow-xl hover:shadow-amber-500/40 ${
                            isOpen ? 'rotate-180 scale-110' : 'hover:scale-105'
                          }`}>
                            <ChevronDown className="w-6 h-6 sm:w-7 sm:h-7 transition-transform duration-300" />
                          </button>
                        </div>

                        <div
                          className={`transition-all duration-700 ease-out overflow-hidden ${
                            isOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
                          }`}
                        >
                          <div className="ml-12 sm:ml-14 pt-2">
                            <p className="text-gray-200 text-lg sm:text-xl lg:text-2xl leading-relaxed font-light">
                              {faq.answer}
                            </p>
                            
                            {/* Bottom accent */}
                            <div className="flex items-center gap-2 mt-8 pt-6 border-t border-amber-500/20">
                              <Sparkles className="w-4 h-4 text-amber-400" />
                              <span className="text-amber-400 text-sm font-medium tracking-wide">Premium Support</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
              
              {/* Contact CTA */}
              <div className="mt-16 sm:mt-20 text-center">
                <div className="bg-gradient-to-br from-amber-500/10 to-yellow-500/10 backdrop-blur-sm border border-amber-500/30 rounded-3xl p-8 sm:p-12 shadow-2xl">
                  <h3 className="text-2xl sm:text-3xl font-semibold text-white mb-4">
                    Still Have Questions?
                  </h3>
                  <p className="text-gray-300 text-lg mb-8">
                    Our luxury concierge team is available 24/7 to assist you with any inquiries.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                    <button className="px-8 py-4 bg-gradient-to-r from-amber-400 to-yellow-500 text-black font-semibold rounded-full hover:shadow-xl hover:shadow-amber-500/40 transition-all duration-300 hover:scale-105">
                      Contact Premium Support
                    </button>
                    <button className="px-8 py-4 border-2 border-amber-400 text-amber-400 font-semibold rounded-full hover:bg-amber-400 hover:text-black transition-all duration-300">
                      Live Chat Available
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </section>

        <FooterSection />
      </div>
    </div>
  );
};

export default FaqPage;