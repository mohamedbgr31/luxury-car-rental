"use client"
import { getApiUrl } from '@/lib/api-config';
import React, { useState, useEffect } from "react";
import { MapPin, Phone, Clock, Mail, ArrowRight, Car, Navigation, Star, Shield, Award, Sparkles } from "lucide-react";
import Link from "next/link";
import Navbar from "../components/homepage/navbar";

export default function FindUsPage() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hoveredAmenity, setHoveredAmenity] = useState(null);
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

  const handleGetDirections = () => {
    window.open(`https://maps.google.com/?q=${encodeURIComponent(location.address)}`, '_blank');
  };

  const handleCall = () => {
    window.location.href = `tel:${location.phone.replace(/\s/g, '')}`;
  };

  const handleBookVisit = () => {
    // Navigate to cars page
    window.location.href = '/cars';
  };

  const handleBookAppointment = () => {
    // Navigate to cars page
    window.location.href = '/cars';
  };

  if (loading) {
    return (
      <div className="bg-black min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-yellow-400 border-t-transparent rounded-full mx-auto mb-8 animate-spin"></div>
          <h2 className="text-2xl lg:text-3xl xl:text-4xl 2xl:text-5xl font-bold text-white mb-4 font-bruno">Loading...</h2>
          <p className="text-gray-400 text-base lg:text-lg xl:text-xl 2xl:text-2xl">Please wait while we fetch the information...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-black min-h-screen text-white overflow-x-hidden font-bruno">

      {/* Navbar - Fixed on top with high z-index */}
      <div className="fixed top-0 left-0 right-0 z-50">
        <Navbar />
      </div>

      {/* Animated Background Elements - Responsive positioning */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[5%] left-[3%] w-1 h-1 lg:w-2 lg:h-2 xl:w-2.5 xl:h-2.5 2xl:w-3 2xl:h-3 bg-yellow-400 rounded-full animate-pulse opacity-30"></div>
        <div className="absolute top-[15%] right-[8%] w-0.5 h-0.5 lg:w-1 lg:h-1 xl:w-1.5 xl:h-1.5 2xl:w-2 2xl:h-2 bg-yellow-500 rounded-full animate-ping opacity-40"></div>
        <div className="absolute bottom-[40%] left-[25%] w-1 h-1 lg:w-1.5 lg:h-1.5 xl:w-2 xl:h-2 2xl:w-2.5 2xl:h-2.5 bg-yellow-300 rounded-full animate-pulse opacity-20"></div>
      </div>

      {/* Hero Section - Responsive heights and spacing */}
      <div className={`relative h-screen w-full overflow-hidden transition-all duration-1000 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}>
        <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/60 to-black z-10" />
        <div className="absolute inset-0 bg-gradient-to-r from-yellow-500/10 via-transparent to-yellow-500/10 z-20" />

        {/* Animated gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-45 from-transparent via-yellow-500/5 to-transparent animate-pulse z-15" />

        {/* Smooth shadow transition to main content */}
        <div className="absolute bottom-0 left-0 right-0 h-24 lg:h-32 xl:h-40 2xl:h-48 bg-gradient-to-t from-black via-black/80 to-transparent z-30 pointer-events-none"></div>

        <div className="absolute inset-0 z-30 flex flex-col items-center justify-center px-4 lg:px-8 xl:px-12 2xl:px-16 text-center">
          <div className={`transform transition-all duration-1000 delay-300 ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
            <div className="mb-4 lg:mb-6 xl:mb-8 2xl:mb-10 flex items-center justify-center">
              <Sparkles className="text-yellow-400 mr-2 lg:mr-3 xl:mr-4 animate-spin-slow" size={24} />
              <Award className="text-yellow-500" size={32} />
              <Sparkles className="text-yellow-400 ml-2 lg:ml-3 xl:ml-4 animate-spin-slow" size={24} />
            </div>
            <h1 className="font-serif text-4xl lg:text-6xl xl:text-7xl 2xl:text-8xl 3xl:text-9xl font-bold mb-4 lg:mb-6 xl:mb-8 2xl:mb-10 tracking-tight leading-tight">
              <span className="bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-600 bg-clip-text text-transparent">
                Visit
              </span>
              <br />
              <span className="text-white">Our Showroom</span>
            </h1>
            <p className="text-lg lg:text-xl xl:text-2xl 2xl:text-3xl 3xl:text-4xl max-w-2xl lg:max-w-3xl xl:max-w-4xl 2xl:max-w-5xl text-gray-300 leading-relaxed mb-6 lg:mb-8 xl:mb-10 2xl:mb-12">
              Experience automotive excellence in our exclusive Dubai destination
            </p>
            <div className="flex flex-col sm:flex-row gap-3 lg:gap-4 xl:gap-5 2xl:gap-6 justify-center">
              <button
                onClick={handleGetDirections}
                className="group bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 text-black font-bold px-6 lg:px-8 xl:px-10 2xl:px-12 py-3 lg:py-4 xl:py-5 2xl:py-6 text-sm lg:text-base xl:text-lg 2xl:text-xl rounded-full transition-all duration-300 transform hover:scale-105 hover:shadow-2xl shadow-yellow-500/25"
              >
                <span className="flex items-center gap-2">
                  <Navigation size={16} className="lg:w-5 lg:h-5 xl:w-6 xl:h-6 2xl:w-7 2xl:h-7 group-hover:rotate-12 transition-transform duration-300" />
                  Get Directions
                </span>
              </button>
              <button
                onClick={handleBookVisit}
                className="group border-2 border-yellow-500 text-yellow-500 hover:bg-yellow-500 hover:text-black font-bold px-6 lg:px-8 xl:px-10 2xl:px-12 py-3 lg:py-4 xl:py-5 2xl:py-6 text-sm lg:text-base xl:text-lg 2xl:text-xl rounded-full transition-all duration-300 transform hover:scale-105"
              >
                <span className="flex items-center gap-2">
                  <ArrowRight size={16} className="lg:w-5 lg:h-5 xl:w-6 xl:h-6 2xl:w-7 2xl:h-7 group-hover:translate-x-1 transition-transform duration-300" />
                  Book Visit
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content - Responsive container and grid */}
      <div className="relative z-10 bg-black">
        <div className="max-w-7xl 2xl:max-w-[1600px] 3xl:max-w-[2000px] mx-auto px-4 lg:px-8 xl:px-12 2xl:px-16 3xl:px-20 pb-12 lg:pb-20 xl:pb-24 2xl:pb-32">
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 lg:gap-12 xl:gap-16 2xl:gap-20 3xl:gap-24 items-start">

            {/* Left Side - Information */}
            <div className={`space-y-6 lg:space-y-8 xl:space-y-10 2xl:space-y-12 transform transition-all duration-1000 delay-500 ${isLoaded ? 'translate-x-0 opacity-100' : '-translate-x-10 opacity-0'}`}>

              {/* Location Card */}
              <div className="group bg-gradient-to-br from-[#070707] to-[#1A1A1A] rounded-2xl lg:rounded-3xl xl:rounded-[2rem] 2xl:rounded-[2.5rem] p-6 lg:p-8 xl:p-10 2xl:p-12 shadow-2xl border border-gray-700 hover:border-yellow-500/30 transition-all duration-500 hover:shadow-yellow-500/10">
                <div className="flex items-center gap-3 lg:gap-4 xl:gap-5 2xl:gap-6 mb-6 lg:mb-8 xl:mb-10 2xl:mb-12">
                  <div className="bg-gradient-to-r from-yellow-400 to-yellow-500 p-2.5 lg:p-3 xl:p-3.5 2xl:p-4 rounded-xl lg:rounded-2xl xl:rounded-2xl 2xl:rounded-3xl">
                    <MapPin className="text-black" size={20} />
                  </div>
                  <h2 className="text-2xl lg:text-3xl xl:text-4xl 2xl:text-5xl 3xl:text-6xl font-bold bg-gradient-to-r from-yellow-400 to-yellow-500 bg-clip-text text-transparent">
                    {location.name}
                  </h2>
                </div>

                <div className="space-y-4 lg:space-y-6 xl:space-y-7 2xl:space-y-8">
                  <div className="flex items-start gap-3 lg:gap-4 xl:gap-5 2xl:gap-6 group/item">
                    <div className="bg-yellow-500/20 p-2.5 lg:p-3 xl:p-3.5 2xl:p-4 rounded-lg lg:rounded-xl xl:rounded-xl 2xl:rounded-2xl mt-1 group-hover/item:bg-yellow-500/30 transition-colors duration-300">
                      <MapPin className="text-yellow-400" size={16} />
                    </div>
                    <div>
                      <h3 className="font-semibold text-white text-base lg:text-lg xl:text-xl 2xl:text-2xl mb-1 lg:mb-2">Address</h3>
                      <p className="text-gray-300 leading-relaxed text-sm lg:text-base xl:text-lg 2xl:text-xl">{location.address}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 lg:gap-4 xl:gap-5 2xl:gap-6 group/item">
                    <div className="bg-yellow-500/20 p-2.5 lg:p-3 xl:p-3.5 2xl:p-4 rounded-lg lg:rounded-xl xl:rounded-xl 2xl:rounded-2xl mt-1 group-hover/item:bg-yellow-500/30 transition-colors duration-300">
                      <Phone className="text-yellow-400" size={16} />
                    </div>
                    <div>
                      <h3 className="font-semibold text-white text-base lg:text-lg xl:text-xl 2xl:text-2xl mb-1 lg:mb-2">Contact</h3>
                      <button
                        onClick={handleCall}
                        className="text-yellow-400 hover:text-yellow-300 transition-colors duration-200 block mb-1 text-sm lg:text-base xl:text-lg 2xl:text-xl"
                      >
                        {location.phone}
                      </button>
                      <a
                        href={`mailto:${location.email}`}
                        className="text-gray-300 hover:text-yellow-400 transition-colors duration-200 text-sm lg:text-base xl:text-lg 2xl:text-xl"
                      >
                        {location.email}
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 lg:gap-4 xl:gap-5 2xl:gap-6 group/item">
                    <div className="bg-yellow-500/20 p-2.5 lg:p-3 xl:p-3.5 2xl:p-4 rounded-lg lg:rounded-xl xl:rounded-xl 2xl:rounded-2xl mt-1 group-hover/item:bg-yellow-500/30 transition-colors duration-300">
                      <Clock className="text-yellow-400" size={16} />
                    </div>
                    <div>
                      <h3 className="font-semibold text-white text-base lg:text-lg xl:text-xl 2xl:text-2xl mb-1 lg:mb-2">Hours</h3>
                      <p className="text-gray-300 text-sm lg:text-base xl:text-lg 2xl:text-xl">{location.hours}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Amenities */}
              <div className="bg-gradient-to-br from-[#131313] to-[#1E1E1E] rounded-2xl lg:rounded-3xl xl:rounded-[2rem] 2xl:rounded-[2.5rem] p-6 lg:p-8 xl:p-10 2xl:p-12 shadow-2xl border border-gray-700">
                <h3 className="text-xl lg:text-2xl xl:text-3xl 2xl:text-4xl 3xl:text-5xl font-bold bg-gradient-to-r from-yellow-400 to-yellow-500 bg-clip-text text-transparent mb-4 lg:mb-6 xl:mb-8 2xl:mb-10">
                  Premium Amenities
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 lg:gap-4 xl:gap-5 2xl:gap-6">
                  {location.amenities.map((amenity, index) => {
                    const IconComponent = amenity.icon;
                    return (
                      <div
                        key={index}
                        className="group/amenity relative bg-gradient-to-r from-[#070707] to-[#1A1A1A] p-3 lg:p-4 xl:p-5 2xl:p-6 rounded-lg lg:rounded-2xl xl:rounded-2xl 2xl:rounded-3xl border border-gray-700 hover:border-yellow-500/30 transition-all duration-300 cursor-pointer transform hover:scale-105"
                        onMouseEnter={() => setHoveredAmenity(index)}
                        onMouseLeave={() => setHoveredAmenity(null)}
                      >
                        <div className="flex items-center gap-2 lg:gap-3 xl:gap-4 2xl:gap-5">
                          <div className="bg-gradient-to-r from-yellow-400/20 to-yellow-500/20 p-2 lg:p-3 xl:p-3.5 2xl:p-4 rounded-lg lg:rounded-xl xl:rounded-xl 2xl:rounded-2xl group-hover/amenity:from-yellow-400/30 group-hover/amenity:to-yellow-500/30 transition-all duration-300">
                            <IconComponent className="text-yellow-400" size={14} />
                          </div>
                          <div>
                            <span className="text-white font-medium text-sm lg:text-base xl:text-lg 2xl:text-xl">{amenity.name}</span>
                            <p className={`text-gray-400 text-xs lg:text-sm xl:text-base 2xl:text-lg mt-1 transition-all duration-300 ${hoveredAmenity === index ? 'opacity-100 max-h-20' : 'opacity-0 max-h-0 overflow-hidden'}`}>
                              {amenity.description}
                            </p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 lg:gap-4 xl:gap-5 2xl:gap-6">
                <button
                  onClick={handleGetDirections}
                  className="group flex items-center justify-center gap-2 lg:gap-3 xl:gap-4 bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 text-black font-bold px-6 lg:px-8 xl:px-10 2xl:px-12 py-3 lg:py-4 xl:py-5 2xl:py-6 text-sm lg:text-base xl:text-lg 2xl:text-xl rounded-lg lg:rounded-2xl xl:rounded-2xl 2xl:rounded-3xl shadow-lg transition-all duration-300 transform hover:scale-105 hover:shadow-yellow-500/25 flex-1"
                >
                  <Navigation size={16} className="lg:w-5 lg:h-5 xl:w-6 xl:h-6 2xl:w-7 2xl:h-7 group-hover:rotate-12 transition-transform duration-300" />
                  <span>Get Directions</span>
                </button>
                <button
                  onClick={handleCall}
                  className="group flex items-center justify-center gap-2 lg:gap-3 xl:gap-4 bg-gradient-to-r from-gray-800 to-gray-900 hover:from-gray-700 hover:to-gray-800 text-white border border-gray-700 hover:border-yellow-500/30 font-bold px-6 lg:px-8 xl:px-10 2xl:px-12 py-3 lg:py-4 xl:py-5 2xl:py-6 text-sm lg:text-base xl:text-lg 2xl:text-xl rounded-lg lg:rounded-2xl xl:rounded-2xl 2xl:rounded-3xl shadow-lg transition-all duration-300 transform hover:scale-105 flex-1"
                >
                  <Phone size={16} className="lg:w-5 lg:h-5 xl:w-6 xl:h-6 2xl:w-7 2xl:h-7 group-hover:scale-110 transition-transform duration-300" />
                  <span>Call Now</span>
                </button>
              </div>
            </div>

            {/* Right Side - Map & Booking */}
            <div className={`space-y-6 lg:space-y-8 xl:space-y-10 2xl:space-y-12 transform transition-all duration-1000 delay-700 ${isLoaded ? 'translate-x-0 opacity-100' : 'translate-x-10 opacity-0'}`}>

              {/* Map */}
              <div className="group relative w-full h-72 lg:h-96 xl:h-[500px] 2xl:h-[600px] 3xl:h-[700px] shadow-2xl rounded-2xl lg:rounded-3xl xl:rounded-[2rem] 2xl:rounded-[2.5rem] overflow-hidden border border-gray-700 hover:border-yellow-500/30 transition-all duration-500">
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent z-10 pointer-events-none" />
                <iframe
                  className="w-full h-full transition-all duration-500 group-hover:scale-105"
                  src={location.mapUrl}
                  allowFullScreen=""
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  style={{ filter: 'grayscale(0.3) contrast(1.1)' }}
                ></iframe>
              </div>

              {/* Booking Card */}
              <div className="relative bg-gradient-to-br from-yellow-500 via-yellow-400 to-yellow-600 rounded-2xl lg:rounded-3xl xl:rounded-[2rem] 2xl:rounded-[2.5rem] p-6 lg:p-8 xl:p-10 2xl:p-12 shadow-2xl overflow-hidden">
                <div className="absolute top-0 right-0 w-24 h-24 lg:w-32 lg:h-32 xl:w-40 xl:h-40 2xl:w-48 2xl:h-48 bg-white/10 rounded-full -translate-y-12 lg:-translate-y-16 xl:-translate-y-20 2xl:-translate-y-24 translate-x-12 lg:translate-x-16 xl:translate-x-20 2xl:translate-x-24" />
                <div className="absolute bottom-0 left-0 w-18 h-18 lg:w-24 lg:h-24 xl:w-30 xl:h-30 2xl:w-36 2xl:h-36 bg-black/10 rounded-full translate-y-9 lg:translate-y-12 xl:translate-y-15 2xl:translate-y-18 -translate-x-9 lg:-translate-x-12 xl:-translate-x-15 2xl:-translate-x-18" />

                <div className="relative z-10">
                  <div className="flex items-center gap-2 lg:gap-3 xl:gap-4 2xl:gap-5 mb-3 lg:mb-4 xl:mb-5 2xl:mb-6">
                    <Star className="text-black" size={20} />
                    <h3 className="text-xl lg:text-2xl xl:text-3xl 2xl:text-4xl 3xl:text-5xl font-bold text-black">Book Private Viewing</h3>
                  </div>
                  <p className="text-black/80 mb-4 lg:mb-6 xl:mb-7 2xl:mb-8 text-base lg:text-lg xl:text-xl 2xl:text-2xl leading-relaxed">
                    Schedule an exclusive appointment to explore our luxury collection with personalized service.
                  </p>
                  <button
                    onClick={handleBookAppointment}
                    className="group inline-flex items-center gap-2 lg:gap-3 xl:gap-4 bg-black hover:bg-gray-900 text-white font-bold px-6 lg:px-8 xl:px-10 2xl:px-12 py-3 lg:py-4 xl:py-5 2xl:py-6 text-sm lg:text-base xl:text-lg 2xl:text-xl rounded-lg lg:rounded-2xl xl:rounded-2xl 2xl:rounded-3xl shadow-lg transition-all duration-300 transform hover:scale-105"
                  >
                    <span>Book Appointment</span>
                    <ArrowRight size={14} className="lg:w-5 lg:h-5 xl:w-6 xl:h-6 2xl:w-7 2xl:h-7 group-hover:translate-x-1 transition-transform duration-300" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="relative bg-black py-12 lg:py-20 xl:py-24 2xl:py-32">
        <div className="max-w-6xl 2xl:max-w-7xl 3xl:max-w-[1400px] mx-auto px-4 lg:px-8 xl:px-12 2xl:px-16 3xl:px-20">
          <div className={`text-center mb-10 lg:mb-16 xl:mb-20 2xl:mb-24 transform transition-all duration-1000 delay-900 ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
            <h2 className="text-3xl lg:text-4xl xl:text-5xl 2xl:text-6xl 3xl:text-7xl font-bold bg-gradient-to-r from-yellow-400 via-yellow-500 to-amber-400 bg-clip-text text-transparent mb-3 lg:mb-4 xl:mb-5 2xl:mb-6 font-bruno">
              Frequently Asked Questions
            </h2>
            <p className="text-gray-300 max-w-2xl xl:max-w-3xl 2xl:max-w-4xl mx-auto text-base lg:text-lg xl:text-xl 2xl:text-2xl leading-relaxed font-bruno">
              Everything you need to know about visiting our luxury showroom
            </p>
          </div>

          <div className="space-y-4 lg:space-y-6 xl:space-y-7 2xl:space-y-8">
            {faqs.length > 0 ? (
              faqs.map((faq, index) => (
                <div
                  key={faq._id || index}
                  className={`group relative overflow-hidden bg-gradient-to-br from-neutral-800/40 via-zinc-800/30 to-stone-800/40 backdrop-blur-lg rounded-2xl lg:rounded-3xl xl:rounded-[2rem] 2xl:rounded-[2.5rem] p-4 lg:p-6 xl:p-7 2xl:p-8 border border-neutral-700/30 hover:border-yellow-400/50 shadow-lg shadow-neutral-900/30 hover:shadow-xl hover:shadow-yellow-400/10 transition-all duration-500 ease-out transform hover:scale-[1.01] ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-100'}`}
                  style={{ transitionDelay: `${1000 + index * 100}ms` }}
                >
                  {/* Soft background glow */}
                  <div className="absolute inset-0 rounded-2xl lg:rounded-3xl xl:rounded-[2rem] 2xl:rounded-[2.5rem] bg-gradient-to-br from-yellow-400/5 via-amber-400/3 to-orange-400/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                  {/* Top accent line */}
                  <div className="absolute top-0 left-4 lg:left-6 xl:left-7 2xl:left-8 right-4 lg:right-6 xl:right-7 2xl:right-8 h-px bg-gradient-to-r from-transparent via-yellow-400/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                  <div className="relative z-10">
                    <div className="flex items-start justify-between mb-3 lg:mb-4 xl:mb-5 2xl:mb-6">
                      <h3 className="font-semibold font-bruno text-white text-base lg:text-xl xl:text-2xl 2xl:text-3xl leading-tight group-hover:text-yellow-300 transition-colors duration-300 pr-4">
                        {faq.question}
                      </h3>
                      <div className="ml-3 lg:ml-4 xl:ml-5 2xl:ml-6 mt-1 lg:mt-2 w-1.5 h-1.5 lg:w-2 lg:h-2 xl:w-2.5 xl:h-2.5 2xl:w-3 2xl:h-3 rounded-full bg-yellow-400/60 group-hover:bg-yellow-400 transition-colors duration-300 flex-shrink-0"></div>
                    </div>
                    <p className="text-gray-300 group-hover:text-gray-100 leading-relaxed text-sm lg:text-base xl:text-lg 2xl:text-xl font-bruno transition-colors duration-300 pl-1">
                      {faq.answer}
                    </p>
                  </div>

                  {/* Subtle bottom accent */}
                  <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-yellow-400/20 via-amber-400/30 to-yellow-400/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-b-2xl lg:rounded-b-3xl xl:rounded-b-[2rem] 2xl:rounded-b-[2.5rem]"></div>
                </div>
              ))
            ) : (
              // Fallback FAQs if no data from database
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
                  className={`group relative overflow-hidden bg-gradient-to-br from-neutral-800/40 via-zinc-800/30 to-stone-800/40 backdrop-blur-lg rounded-2xl lg:rounded-3xl xl:rounded-[2rem] 2xl:rounded-[2.5rem] p-4 lg:p-6 xl:p-7 2xl:p-8 border border-neutral-700/30 hover:border-yellow-400/50 shadow-lg shadow-neutral-900/30 hover:shadow-xl hover:shadow-yellow-400/10 transition-all duration-500 ease-out transform hover:scale-[1.01] ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-100'}`}
                  style={{ transitionDelay: `${1000 + index * 100}ms` }}
                >
                  {/* Soft background glow */}
                  <div className="absolute inset-0 rounded-2xl lg:rounded-3xl xl:rounded-[2rem] 2xl:rounded-[2.5rem] bg-gradient-to-br from-yellow-400/5 via-amber-400/3 to-orange-400/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                  {/* Top accent line */}
                  <div className="absolute top-0 left-4 lg:left-6 xl:left-7 2xl:left-8 right-4 lg:right-6 xl:right-7 2xl:right-8 h-px bg-gradient-to-r from-transparent via-yellow-400/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                  <div className="relative z-10">
                    <div className="flex items-start justify-between mb-3 lg:mb-4 xl:mb-5 2xl:mb-6">
                      <h3 className="font-semibold font-bruno text-white text-base lg:text-xl xl:text-2xl 2xl:text-3xl leading-tight group-hover:text-yellow-300 transition-colors duration-300 pr-4">
                        {faq.q}
                      </h3>
                      <div className="ml-3 lg:ml-4 xl:ml-5 2xl:ml-6 mt-1 lg:mt-2 w-1.5 h-1.5 lg:w-2 lg:h-2 xl:w-2.5 xl:h-2.5 2xl:w-3 2xl:h-3 rounded-full bg-yellow-400/60 group-hover:bg-yellow-400 transition-colors duration-300 flex-shrink-0"></div>
                    </div>
                    <p className="text-gray-300 group-hover:text-gray-100 leading-relaxed text-sm lg:text-base xl:text-lg 2xl:text-xl font-bruno transition-colors duration-300 pl-1">
                      {faq.a}
                    </p>
                  </div>

                  {/* Subtle bottom accent */}
                  <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-yellow-400/20 via-amber-400/30 to-yellow-400/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-b-2xl lg:rounded-3xl xl:rounded-b-[2rem] 2xl:rounded-b-[2.5rem]"></div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}