"use client"
import { getApiUrl } from '@/lib/api-config';
import React, { useState, useEffect } from "react";
import { MapPin, Phone, Clock, Mail, ArrowRight, Car, Navigation, Star, Shield, Award, Sparkles, Users, MessageSquare, CheckCircle, Calendar } from "lucide-react";
import Link from "next/link";
import Navbar from "../components/homepage/navbar";

export default function FindUsPage() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hoveredAmenity, setHoveredAmenity] = useState(null);
  const [hoveredTestimonial, setHoveredTestimonial] = useState(null);
  const [contactData, setContactData] = useState(null);
  const [faqs, setFaqs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setIsLoaded(true);
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      // Fetch contact data
      const contactResponse = await fetch(getApiUrl('/api/contact'));
      const contactResult = await contactResponse.json();
      setContactData(contactResult);

      // Fetch FAQs
      const faqsResponse = await fetch(getApiUrl('/api/faqs'));
      const faqsResult = await faqsResponse.json();
      // Filter visible FAQs and limit to 4
      const visibleFaqs = faqsResult.filter(faq => faq.isVisible).slice(0, 4);
      setFaqs(visibleFaqs);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const location = {
    name: "Dubai Showroom",
    address: contactData?.contactInfo?.address?.value || "Sheikh Zayed Road, Near Emirates Towers, Dubai, UAE",
    phone: contactData?.contactInfo?.phone?.value || "+971 50 123 4567",
    email: contactData?.contactInfo?.email?.value || "dubai@luxeride.com",
    hours: contactData?.contactInfo?.hours?.value || "Mon-Sat: 9AM - 8PM | Sun: 10AM - 6PM",
    mapUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3609.752950588498!2d55.27363017598899!3d25.204849830457265!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3e5f428aa81f43df%3A0xb39cc63bfb65fdc0!2sSheikh%20Zayed%20Road%2C%20Dubai%20-%20United%20Arab%20Emirates!5e0!3m2!1sen!2s!4v1688986762139!5m2!1sen!2s",
    amenities: [
      { name: "Valet Parking", icon: Car, description: "Complimentary luxury valet service" },
      { name: "Test Drive Track", icon: Navigation, description: "Private track for test drives" },
      { name: "Luxury Lounge", icon: Star, description: "Exclusive VIP waiting area" },
      { name: "Concierge Service", icon: Shield, description: "Personal shopping assistance" }
    ]
  };

  // Sample testimonials data
  const testimonials = [
    {
      id: 1,
      name: "Ahmed Al-Rashid",
      role: "Business Executive",
      rating: 5,
      text: "Exceptional service and stunning vehicles. The showroom experience was beyond my expectations. Every detail was perfect.",
      image: getApiUrl("/api/placeholder/80/80")
    },
    {
      id: 2,
      name: "Sarah Johnson",
      role: "Entrepreneur",
      rating: 5,
      text: "The staff's attention to detail and professionalism is unmatched. They made the entire process seamless and enjoyable.",
      image: getApiUrl("/api/placeholder/80/80")
    },
    {
      id: 3,
      name: "Mohamed Hassan",
      role: "Investment Manager",
      rating: 5,
      text: "Premium quality vehicles and outstanding customer service. The private viewing was an incredible experience.",
      image: getApiUrl("/api/placeholder/80/80")
    }
  ];

  const handleGetDirections = () => {
    window.open(`https://maps.google.com/?q=${encodeURIComponent(location.address)}`, '_blank');
  };

  const handleCall = () => {
    window.location.href = `tel:${location.phone.replace(/\s/g, '')}`;
  };

  const handleBookVisit = () => {
    window.location.href = '/cars';
  };

  const handleBookAppointment = () => {
    window.location.href = '/cars';
  };

  if (loading) {
    return (
      <div className="bg-black min-h-screen flex items-center justify-center relative overflow-hidden">
        {/* Elegant loading background */}
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-amber-400/10 to-yellow-500/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-gradient-to-l from-yellow-600/10 to-amber-400/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        </div>

        <div className="text-center relative z-10">
          <div className="relative mb-8">
            <div className="w-20 h-20 border-4 border-transparent bg-gradient-to-r from-amber-400 via-yellow-500 to-amber-600 rounded-full mx-auto animate-spin">
              <div className="w-12 h-12 bg-black rounded-full m-1"></div>
            </div>
          </div>
          <h2 className="text-3xl lg:text-4xl xl:text-5xl font-bold bg-gradient-to-r from-amber-400 via-yellow-500 to-amber-400 bg-clip-text text-transparent mb-4 font-bruno">
            Loading Luxury
          </h2>
          <p className="text-gray-400 text-lg lg:text-xl">Preparing your exclusive experience...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-black min-h-screen text-white overflow-x-hidden font-bruno relative">

      {/* Enhanced ambient lighting */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-amber-500/5 via-transparent to-yellow-600/5"></div>
        <div className="absolute top-1/3 left-1/5 w-96 h-96 bg-gradient-to-r from-amber-400/8 to-yellow-500/8 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/3 right-1/5 w-80 h-80 bg-gradient-to-l from-yellow-600/6 to-amber-400/6 rounded-full blur-3xl animate-pulse delay-2000"></div>
      </div>

      {/* Navbar - Fixed on top with enhanced backdrop */}
      <div className="fixed top-0 left-0 right-0 z-50 backdrop-blur-xl bg-black/60">
        <Navbar />
      </div>

      {/* Floating particles */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[8%] left-[5%] w-2 h-2 bg-amber-400/40 rounded-full animate-pulse"></div>
        <div className="absolute top-[20%] right-[10%] w-1.5 h-1.5 bg-yellow-500/30 rounded-full animate-ping"></div>
        <div className="absolute bottom-[45%] left-[30%] w-2.5 h-2.5 bg-amber-300/20 rounded-full animate-pulse delay-1000"></div>
        <div className="absolute top-[60%] right-[25%] w-1 h-1 bg-yellow-400/50 rounded-full animate-ping delay-2000"></div>
      </div>

      {/* Enhanced Hero Section */}
      <div className={`relative h-screen w-full overflow-hidden transition-all duration-1500 ease-out ${isLoaded ? 'opacity-100' : 'opacity-0'}`}>
        {/* Multi-layered background gradients */}
        <div className="absolute inset-0 bg-gradient-to-b from-black via-black/70 to-black z-10" />
        <div className="absolute inset-0 bg-gradient-to-r from-amber-900/20 via-transparent to-yellow-900/20 z-20" />
        <div className="absolute inset-0 bg-gradient-to-br from-transparent via-amber-500/3 to-transparent z-25" />

        {/* Enhanced smooth shadow transition */}
        <div className="absolute bottom-0 left-0 right-0 h-32 lg:h-48 bg-gradient-to-t from-black via-black/95 to-transparent z-30 pointer-events-none"></div>

        <div className="absolute inset-0 z-30 flex flex-col items-center justify-center px-4 lg:px-8 text-center">
          <div className={`transform transition-all duration-1500 delay-500 ease-out ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-16 opacity-0'}`}>
            <div className="mb-6 lg:mb-8 flex items-center justify-center">
              <Sparkles className="text-amber-400 mr-3 lg:mr-4 animate-spin-slow" size={28} />
              <Award className="text-yellow-500 drop-shadow-lg" size={36} />
              <Sparkles className="text-amber-400 ml-3 lg:ml-4 animate-spin-slow" size={28} />
            </div>
            <h1 className="font-serif text-5xl lg:text-7xl xl:text-8xl 2xl:text-9xl font-bold mb-6 lg:mb-8 tracking-tight leading-tight">
              <span className="bg-gradient-to-r from-amber-400 via-yellow-500 to-amber-600 bg-clip-text text-transparent drop-shadow-2xl">
                Visit
              </span>
              <br />
              <span className="text-white drop-shadow-xl">Our Showroom</span>
            </h1>
            <p className="text-xl lg:text-2xl xl:text-3xl max-w-4xl text-gray-300 leading-relaxed mb-8 lg:mb-10 font-light">
              Experience automotive excellence in our exclusive Dubai destination
            </p>
            <div className="flex flex-col sm:flex-row gap-4 lg:gap-6 justify-center">
              <button
                onClick={handleGetDirections}
                className="group bg-gradient-to-r from-amber-400 via-yellow-500 to-amber-500 hover:from-amber-500 hover:via-yellow-600 hover:to-amber-600 text-black font-bold px-8 lg:px-12 py-4 lg:py-5 text-lg lg:text-xl rounded-2xl transition-all duration-400 transform hover:scale-105 hover:shadow-2xl shadow-amber-500/30 hover:shadow-amber-400/40"
              >
                <span className="flex items-center gap-3">
                  <Navigation size={20} className="group-hover:rotate-12 transition-transform duration-400" />
                  Get Directions
                </span>
              </button>
              <button
                onClick={handleBookVisit}
                className="group border-2 border-amber-500 text-amber-500 hover:bg-amber-500 hover:text-black font-bold px-8 lg:px-12 py-4 lg:py-5 text-lg lg:text-xl rounded-2xl transition-all duration-400 transform hover:scale-105 backdrop-blur-sm bg-black/20"
              >
                <span className="flex items-center gap-3">
                  <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform duration-400" />
                  Book Visit
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Main Content */}
      <div className="relative z-10 bg-black">
        <div className="max-w-7xl mx-auto px-4 lg:px-8 pb-20 lg:pb-32">
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-12 lg:gap-20 items-start">

            {/* Left Side - Enhanced Information */}
            <div className={`space-y-8 lg:space-y-12 transform transition-all duration-1500 delay-700 ease-out ${isLoaded ? 'translate-x-0 opacity-100' : '-translate-x-16 opacity-0'}`}>

              {/* Enhanced Location Card */}
              <div className="group relative bg-gradient-to-br from-zinc-900/60 via-neutral-900/40 to-stone-900/60 backdrop-blur-xl rounded-3xl lg:rounded-[2.5rem] p-8 lg:p-12 shadow-2xl border border-amber-500/20 hover:border-amber-400/40 transition-all duration-700 overflow-hidden">
                {/* Subtle glow effect */}
                <div className="absolute inset-0 bg-gradient-to-br from-amber-400/5 via-transparent to-yellow-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>

                <div className="flex items-center gap-4 lg:gap-6 mb-8 lg:mb-10 relative z-10">
                  <div className="bg-gradient-to-r from-amber-400 to-yellow-500 p-4 lg:p-5 rounded-2xl shadow-lg">
                    <MapPin className="text-black" size={24} />
                  </div>
                  <h2 className="text-3xl lg:text-5xl font-bold bg-gradient-to-r from-amber-400 via-yellow-500 to-amber-400 bg-clip-text text-transparent">
                    {location.name}
                  </h2>
                </div>

                <div className="space-y-6 lg:space-y-8 relative z-10">
                  <div className="flex items-start gap-4 lg:gap-6 group/item">
                    <div className="bg-amber-500/20 backdrop-blur-sm p-3 lg:p-4 rounded-xl mt-1 group-hover/item:bg-amber-400/30 transition-all duration-400 border border-amber-500/30">
                      <MapPin className="text-amber-400" size={18} />
                    </div>
                    <div>
                      <h3 className="font-semibold text-white text-lg lg:text-2xl mb-2">Address</h3>
                      <p className="text-gray-300 leading-relaxed text-base lg:text-lg">{location.address}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4 lg:gap-6 group/item">
                    <div className="bg-amber-500/20 backdrop-blur-sm p-3 lg:p-4 rounded-xl mt-1 group-hover/item:bg-amber-400/30 transition-all duration-400 border border-amber-500/30">
                      <Phone className="text-amber-400" size={18} />
                    </div>
                    <div>
                      <h3 className="font-semibold text-white text-lg lg:text-2xl mb-2">Contact</h3>
                      <button
                        onClick={handleCall}
                        className="text-amber-400 hover:text-amber-300 transition-colors duration-300 block mb-2 text-base lg:text-lg font-medium"
                      >
                        {location.phone}
                      </button>
                      <a
                        href={`mailto:${location.email}`}
                        className="text-gray-300 hover:text-amber-400 transition-colors duration-300 text-base lg:text-lg"
                      >
                        {location.email}
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start gap-4 lg:gap-6 group/item">
                    <div className="bg-amber-500/20 backdrop-blur-sm p-3 lg:p-4 rounded-xl mt-1 group-hover/item:bg-amber-400/30 transition-all duration-400 border border-amber-500/30">
                      <Clock className="text-amber-400" size={18} />
                    </div>
                    <div>
                      <h3 className="font-semibold text-white text-lg lg:text-2xl mb-2">Hours</h3>
                      <p className="text-gray-300 text-base lg:text-lg">{location.hours}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Enhanced Amenities */}
              <div className="bg-gradient-to-br from-neutral-900/60 via-zinc-900/40 to-gray-900/60 backdrop-blur-xl rounded-3xl lg:rounded-[2.5rem] p-8 lg:p-12 shadow-2xl border border-amber-500/20">
                <h3 className="text-2xl lg:text-4xl font-bold bg-gradient-to-r from-amber-400 via-yellow-500 to-amber-400 bg-clip-text text-transparent mb-6 lg:mb-8">
                  Premium Amenities
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 lg:gap-6">
                  {location.amenities.map((amenity, index) => {
                    const IconComponent = amenity.icon;
                    return (
                      <div
                        key={index}
                        className="group/amenity relative bg-gradient-to-br from-black/40 via-neutral-900/60 to-zinc-900/40 backdrop-blur-lg p-5 lg:p-6 rounded-2xl border border-amber-500/30 hover:border-amber-400/50 transition-all duration-500 cursor-pointer transform hover:scale-102 overflow-hidden"
                        onMouseEnter={() => setHoveredAmenity(index)}
                        onMouseLeave={() => setHoveredAmenity(null)}
                      >
                        <div className="absolute inset-0 bg-gradient-to-br from-amber-400/5 to-yellow-500/5 opacity-0 group-hover/amenity:opacity-100 transition-opacity duration-500"></div>

                        <div className="flex items-start gap-4 relative z-10">
                          <div className="bg-gradient-to-br from-amber-400/30 to-yellow-500/30 backdrop-blur-sm p-3 lg:p-4 rounded-xl group-hover/amenity:from-amber-400/40 group-hover/amenity:to-yellow-500/40 transition-all duration-500 border border-amber-500/30">
                            <IconComponent className="text-amber-400" size={20} />
                          </div>
                          <div className="flex-1">
                            <h4 className="text-white font-semibold text-base lg:text-lg mb-1">{amenity.name}</h4>
                            <p className={`text-gray-400 text-sm lg:text-base transition-all duration-500 ${hoveredAmenity === index ? 'opacity-100 max-h-20' : 'opacity-70 max-h-0 overflow-hidden'}`}>
                              {amenity.description}
                            </p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Enhanced Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 lg:gap-6">
                <button
                  onClick={handleGetDirections}
                  className="group flex items-center justify-center gap-3 bg-gradient-to-r from-amber-400 via-yellow-500 to-amber-500 hover:from-amber-500 hover:via-yellow-600 hover:to-amber-600 text-black font-bold px-8 lg:px-10 py-4 lg:py-5 text-base lg:text-lg rounded-2xl shadow-xl transition-all duration-500 transform hover:scale-105 hover:shadow-amber-400/30 flex-1"
                >
                  <Navigation size={20} className="group-hover:rotate-12 transition-transform duration-500" />
                  <span>Get Directions</span>
                </button>
                <button
                  onClick={handleCall}
                  className="group flex items-center justify-center gap-3 bg-gradient-to-r from-neutral-800/80 to-zinc-900/80 backdrop-blur-xl text-white border border-amber-500/30 hover:border-amber-400/50 hover:from-neutral-700/80 hover:to-zinc-800/80 font-bold px-8 lg:px-10 py-4 lg:py-5 text-base lg:text-lg rounded-2xl shadow-xl transition-all duration-500 transform hover:scale-105 flex-1"
                >
                  <Phone size={20} className="group-hover:scale-110 transition-transform duration-500" />
                  <span>Call Now</span>
                </button>
              </div>
            </div>

            {/* Right Side - Enhanced Map & Booking */}
            <div className={`space-y-8 lg:space-y-12 transform transition-all duration-1500 delay-900 ease-out ${isLoaded ? 'translate-x-0 opacity-100' : 'translate-x-16 opacity-0'}`}>

              {/* Enhanced Map */}
              <div className="group relative w-full h-80 lg:h-[500px] xl:h-[600px] shadow-2xl rounded-3xl lg:rounded-[2.5rem] overflow-hidden border border-amber-500/30 hover:border-amber-400/50 transition-all duration-700">
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-black/10 z-10 pointer-events-none" />
                <div className="absolute inset-0 bg-gradient-to-br from-amber-400/5 to-yellow-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700 z-5" />
                <iframe
                  className="w-full h-full transition-all duration-700 group-hover:scale-102"
                  src={location.mapUrl}
                  allowFullScreen=""
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  style={{ filter: 'brightness(0.9) contrast(1.1) saturate(0.8)' }}
                ></iframe>
              </div>

              {/* Enhanced Booking Card */}
              <div className="relative bg-gradient-to-br from-amber-500 via-yellow-500 to-amber-600 rounded-3xl lg:rounded-[2.5rem] p-8 lg:p-12 shadow-2xl overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 lg:w-48 lg:h-48 bg-white/10 rounded-full -translate-y-16 lg:-translate-y-24 translate-x-16 lg:translate-x-24" />
                <div className="absolute bottom-0 left-0 w-24 h-24 lg:w-36 lg:h-36 bg-black/10 rounded-full translate-y-12 lg:translate-y-18 -translate-x-12 lg:-translate-x-18" />
                <div className="absolute inset-0 bg-gradient-to-br from-transparent via-white/5 to-transparent" />

                <div className="relative z-10">
                  <div className="flex items-center gap-3 lg:gap-4 mb-4 lg:mb-6">
                    <Star className="text-black drop-shadow-sm" size={24} />
                    <h3 className="text-2xl lg:text-4xl font-bold text-black">Book Private Viewing</h3>
                  </div>
                  <p className="text-black/80 mb-6 lg:mb-8 text-base lg:text-xl leading-relaxed font-medium">
                    Schedule an exclusive appointment to explore our luxury collection with personalized service.
                  </p>
                  <button
                    onClick={handleBookAppointment}
                    className="group inline-flex items-center gap-3 bg-black hover:bg-gray-900 text-white font-bold px-8 lg:px-12 py-4 lg:py-5 text-base lg:text-xl rounded-2xl shadow-xl transition-all duration-500 transform hover:scale-105"
                  >
                    <span>Book Appointment</span>
                    <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform duration-500" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced FAQ Section */}
      <div className="relative bg-gradient-to-b from-black to-neutral-900 py-20 lg:py-32">
        <div className="max-w-6xl mx-auto px-4 lg:px-8">
          <div className={`text-center mb-16 lg:mb-24 transform transition-all duration-1500 delay-1100 ease-out ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-16 opacity-0'}`}>
            <h2 className="text-4xl lg:text-6xl xl:text-7xl font-bold bg-gradient-to-r from-amber-400 via-yellow-500 to-amber-400 bg-clip-text text-transparent mb-4 lg:mb-6 font-bruno">
              Frequently Asked Questions
            </h2>
            <p className="text-gray-300 max-w-3xl mx-auto text-lg lg:text-xl leading-relaxed font-light">
              Everything you need to know about visiting our luxury showroom
            </p>
          </div>

          <div className="space-y-6 lg:space-y-8">
            {faqs.length > 0 ? (
              faqs.map((faq, index) => (
                <div
                  key={faq._id || index}
                  className={`group relative overflow-hidden bg-gradient-to-br from-neutral-900/60 via-zinc-900/40 to-stone-900/60 backdrop-blur-xl rounded-3xl lg:rounded-[2.5rem] p-6 lg:p-10 border border-amber-500/20 hover:border-amber-400/40 shadow-xl hover:shadow-2xl hover:shadow-amber-400/10 transition-all duration-700 ease-out transform hover:scale-[1.01] ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-16 opacity-0'}`}
                  style={{ transitionDelay: `${1300 + index * 100}ms` }}
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-amber-400/5 via-transparent to-yellow-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                  <div className="absolute top-0 left-8 right-8 h-px bg-gradient-to-r from-transparent via-amber-400/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>

                  <div className="relative z-10">
                    <div className="flex items-start justify-between mb-4 lg:mb-6">
                      <h3 className="font-semibold font-bruno text-white text-lg lg:text-2xl leading-tight group-hover:text-amber-300 transition-colors duration-500 pr-4">
                        {faq.question}
                      </h3>
                      <div className="ml-4 mt-2 w-2.5 h-2.5 lg:w-3 lg:h-3 rounded-full bg-amber-400/60 group-hover:bg-amber-400 transition-colors duration-500 flex-shrink-0"></div>
                    </div>
                    <p className="text-gray-300 group-hover:text-gray-100 leading-relaxed text-base lg:text-lg font-bruno transition-colors duration-500">
                      {faq.answer}
                    </p>
                  </div>

                  <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-400/20 via-yellow-400/30 to-amber-400/20 opacity-0 group-hover:opacity-100 transition-opacity duration-700 rounded-b-3xl lg:rounded-b-[2.5rem]"></div>
                </div>
              ))
            ) : (
              // Fallback FAQs
              [
                {
                  q: "Do I need to make an appointment?",
                  a: "While walk-ins are always welcome during our business hours, we recommend scheduling an appointment for personalized service and to ensure the specific vehicles you're interested in are available for viewing and test driving."
                },
                {
                  q: "Is there parking available?",
                  a: "Yes, complimentary valet parking is available for all visitors. Our professional valet team will take care of your vehicle while you explore our collection in comfort."
                },
                {
                  q: "Can I test drive vehicles?",
                  a: "Absolutely! Test drives are available for serious buyers on our private track. Please bring your valid UAE driving license or international driving permit, and our team will arrange everything for you."
                },
                {
                  q: "What services do you offer?",
                  a: "Beyond vehicle sales, we offer comprehensive services including financing consultation, insurance assistance, maintenance scheduling, and exclusive access to limited edition models."
                }
              ].map((faq, index) => (
                <div
                  key={index}
                  className={`group relative overflow-hidden bg-gradient-to-br from-neutral-900/60 via-zinc-900/40 to-stone-900/60 backdrop-blur-xl rounded-3xl lg:rounded-[2.5rem] p-6 lg:p-10 border border-amber-500/20 hover:border-amber-400/40 shadow-xl hover:shadow-2xl hover:shadow-amber-400/10 transition-all duration-700 ease-out transform hover:scale-[1.01] ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-16 opacity-0'}`}
                  style={{ transitionDelay: `${1300 + index * 100}ms` }}
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-amber-400/5 via-transparent to-yellow-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                  <div className="absolute top-0 left-8 right-8 h-px bg-gradient-to-r from-transparent via-amber-400/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>

                  <div className="relative z-10">
                    <div className="flex items-start justify-between mb-4 lg:mb-6">
                      <h3 className="font-semibold font-bruno text-white text-lg lg:text-2xl leading-tight group-hover:text-amber-300 transition-colors duration-500 pr-4">
                        {faq.q}
                      </h3>
                      <div className="ml-4 mt-2 w-2.5 h-2.5 lg:w-3 lg:h-3 rounded-full bg-amber-400/60 group-hover:bg-amber-400 transition-colors duration-500 flex-shrink-0"></div>
                    </div>
                    <p className="text-gray-300 group-hover:text-gray-100 leading-relaxed text-base lg:text-lg font-bruno transition-colors duration-500">
                      {faq.a}
                    </p>
                  </div>

                  <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-400/20 via-yellow-400/30 to-amber-400/20 opacity-0 group-hover:opacity-100 transition-opacity duration-700 rounded-b-3xl lg:rounded-b-[2.5rem]"></div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* New Premium Testimonials Section */}
      <div className="relative bg-gradient-to-b from-neutral-900 to-black py-20 lg:py-32 overflow-hidden">
        {/* Background elements */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/4 left-1/6 w-64 h-64 bg-gradient-to-r from-amber-400/10 to-yellow-500/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-1/4 right-1/6 w-80 h-80 bg-gradient-to-l from-yellow-600/8 to-amber-400/8 rounded-full blur-3xl animate-pulse delay-2000"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 lg:px-8 relative z-10">
          <div className={`text-center mb-16 lg:mb-24 transform transition-all duration-1500 delay-1300 ease-out ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-16 opacity-0'}`}>
            <div className="flex items-center justify-center gap-3 mb-6">
              <Users className="text-amber-400" size={32} />
              <MessageSquare className="text-yellow-500" size={28} />
            </div>
            <h2 className="text-4xl lg:text-6xl xl:text-7xl font-bold bg-gradient-to-r from-amber-400 via-yellow-500 to-amber-400 bg-clip-text text-transparent mb-4 lg:mb-6 font-bruno">
              What Our Clients Say
            </h2>
            <p className="text-gray-300 max-w-3xl mx-auto text-lg lg:text-xl leading-relaxed font-light">
              Discover why discerning clients choose us for their luxury automotive needs
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
            {testimonials.map((testimonial, index) => (
              <div
                key={testimonial.id}
                className={`group relative bg-gradient-to-br from-neutral-900/60 via-zinc-900/40 to-stone-900/60 backdrop-blur-xl rounded-3xl lg:rounded-[2rem] p-6 lg:p-8 border border-amber-500/20 hover:border-amber-400/40 shadow-xl hover:shadow-2xl hover:shadow-amber-400/10 transition-all duration-700 ease-out transform hover:scale-105 cursor-pointer ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-16 opacity-0'}`}
                style={{ transitionDelay: `${1500 + index * 200}ms` }}
                onMouseEnter={() => setHoveredTestimonial(index)}
                onMouseLeave={() => setHoveredTestimonial(null)}
              >
                {/* Glow effect */}
                <div className="absolute inset-0 bg-gradient-to-br from-amber-400/5 via-transparent to-yellow-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700 rounded-3xl lg:rounded-[2rem]"></div>

                {/* Top accent */}
                <div className="absolute top-0 left-6 right-6 h-px bg-gradient-to-r from-transparent via-amber-400/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>

                <div className="relative z-10">
                  {/* Rating stars */}
                  <div className="flex gap-1 mb-4 lg:mb-6">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star
                        key={i}
                        size={18}
                        className="text-amber-400 fill-current"
                      />
                    ))}
                  </div>

                  {/* Testimonial text */}
                  <p className="text-gray-300 group-hover:text-gray-100 leading-relaxed text-base lg:text-lg mb-6 lg:mb-8 font-light transition-colors duration-500">
                    "{testimonial.text}"
                  </p>

                  {/* Client info */}
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 lg:w-16 lg:h-16 rounded-full bg-gradient-to-br from-amber-400 to-yellow-500 p-0.5">
                      <div className="w-full h-full rounded-full bg-gradient-to-br from-neutral-700 to-zinc-800 flex items-center justify-center">
                        <Users size={20} className="text-amber-400" />
                      </div>
                    </div>
                    <div>
                      <h4 className="text-white font-semibold text-base lg:text-lg group-hover:text-amber-300 transition-colors duration-500">
                        {testimonial.name}
                      </h4>
                      <p className="text-gray-400 text-sm lg:text-base">
                        {testimonial.role}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Bottom accent */}
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-400/20 via-yellow-400/30 to-amber-400/20 opacity-0 group-hover:opacity-100 transition-opacity duration-700 rounded-b-3xl lg:rounded-b-[2rem]"></div>
              </div>
            ))}
          </div>

          {/* Call-to-action */}
          <div className={`text-center mt-16 lg:mt-24 transform transition-all duration-1500 delay-2100 ease-out ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-16 opacity-0'}`}>
            <div className="bg-gradient-to-r from-amber-500 via-yellow-500 to-amber-600 rounded-3xl lg:rounded-[2rem] p-8 lg:p-12 max-w-4xl mx-auto relative overflow-hidden">
              {/* Background elements */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16"></div>
              <div className="absolute bottom-0 left-0 w-24 h-24 bg-black/10 rounded-full translate-y-12 -translate-x-12"></div>

              <div className="relative z-10">
                <div className="flex items-center justify-center gap-3 mb-6">
                  <CheckCircle className="text-black" size={32} />
                  <Calendar className="text-black" size={28} />
                </div>
                <h3 className="text-3xl lg:text-5xl font-bold text-black mb-4 lg:mb-6">
                  Ready to Experience Luxury?
                </h3>
                <p className="text-black/80 text-lg lg:text-xl mb-8 lg:mb-10 leading-relaxed font-medium max-w-2xl mx-auto">
                  Join our satisfied clients and discover the difference that true luxury service makes.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 lg:gap-6 justify-center">
                  <button
                    onClick={handleBookAppointment}
                    className="group bg-black hover:bg-gray-900 text-white font-bold px-8 lg:px-12 py-4 lg:py-5 text-base lg:text-xl rounded-2xl transition-all duration-500 transform hover:scale-105 shadow-xl"
                  >
                    <span className="flex items-center gap-3">
                      <Calendar size={20} />
                      Schedule Visit
                    </span>
                  </button>
                  <button
                    onClick={handleCall}
                    className="group border-2 border-black text-black hover:bg-black hover:text-white font-bold px-8 lg:px-12 py-4 lg:py-5 text-base lg:text-xl rounded-2xl transition-all duration-500 transform hover:scale-105"
                  >
                    <span className="flex items-center gap-3">
                      <Phone size={20} />
                      Call Now
                    </span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}