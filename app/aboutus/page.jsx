"use client"
import { Star, Shield, Clock, MapPin, Phone, Car, Crown, Award, Zap, Diamond } from 'lucide-react';
import { useState, useEffect } from 'react';
import Navbar from "../components/homepage/navbar";
import FooterSection from "@/app/components/homepage/footer";

export default function AboutUs() {
  const [contactData, setContactData] = useState(null);
  const [phoneNumber, setPhoneNumber] = useState("+971 4 PRESTIGE");

  useEffect(() => {
    const fetchContactData = async () => {
      try {
        const response = await fetch('/api/contact');
        if (response.ok) {
          const data = await response.json();
          setContactData(data);
          // Extract phone number from the contact data
          if (data?.contactInfo?.phone?.value) {
            setPhoneNumber(data.contactInfo.phone.value);
          }
        }
      } catch (error) {
        console.error('Error fetching contact data:', error);
        // Keep the default phone number if fetch fails
      }
    };

    fetchContactData();
  }, []);
  return (
    <div className="bg-[#101012] text-white min-h-screen">
      <Navbar />
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden pt-2">
        
        <div className="absolute inset-0 bg-gradient-to-br from-black via-zinc-900 to-black pt-1"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-yellow-400/3 via-transparent to-yellow-400/3"></div>
        
        {/* Animated Background Elements - Responsive positioning */}
        <div className="absolute top-20 left-20 w-48 h-48 sm:w-64 sm:h-64 xl:w-80 xl:h-80 2xl:w-96 2xl:h-96 bg-gradient-to-r from-yellow-400/10 to-transparent rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-64 h-64 sm:w-80 sm:h-80 xl:w-96 xl:h-96 2xl:w-[28rem] 2xl:h-[28rem] bg-gradient-to-l from-yellow-400/8 to-transparent rounded-full blur-3xl animate-pulse delay-1000"></div>
        
        <div className="relative z-10 text-center px-4 container-responsive-xl">
          <div className="mb-6 sm:mb-8 xl:mb-12 p-4 sm:p-6 xl:p-8 2xl:p-10 rounded-3xl bg-zinc-800/30 backdrop-blur-sm border border-yellow-400/20 shadow-2xl shadow-yellow-400/10">
            <Crown className="w-16 h-16 sm:w-20 sm:h-20 xl:w-24 xl:h-24 2xl:w-28 2xl:h-28 text-yellow-400 mx-auto mb-4 sm:mb-6 xl:mb-8 animate-pulse drop-shadow-2xl" />
          </div>
          
          <h1 className="text-5xl sm:text-7xl md:text-8xl lg:text-9xl xl:text-[8rem] 2xl:text-[10rem] 4xl:text-[12rem] font-black responsive-margin bg-gradient-to-r from-yellow-300 via-yellow-400 to-yellow-500 bg-clip-text text-transparent leading-tight drop-shadow-2xl">
            PRESTIGE MOTORS
          </h1>
          
          <div className="p-6 sm:p-8 xl:p-10 2xl:p-12 rounded-2xl bg-zinc-800/20 backdrop-blur-sm border border-yellow-400/30 shadow-2xl shadow-yellow-400/20 mb-6 sm:mb-8 xl:mb-12">
            <p className="text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl 2xl:text-6xl text-zinc-200 font-light tracking-wider leading-relaxed">
              Dubai's Crown Jewel of Luxury Automotive Excellence
            </p>
          </div>
          
          <div className="flex justify-center">
            <div className="w-32 sm:w-40 xl:w-48 2xl:w-56 h-1.5 sm:h-2 xl:h-3 bg-gradient-to-r from-transparent via-yellow-400 to-transparent rounded-full shadow-lg shadow-yellow-400/50"></div>
          </div>
        </div>
        
        {/* Luxury Floating Elements - Responsive positioning */}
        <div className="absolute top-1/4 left-6 sm:left-10 xl:left-16 w-3 h-3 sm:w-4 sm:h-4 xl:w-5 xl:h-5 bg-yellow-400 rounded-full animate-ping shadow-lg shadow-yellow-400/50"></div>
        <div className="absolute bottom-1/3 right-16 sm:right-20 xl:right-32 w-4 h-4 sm:w-6 sm:h-6 xl:w-8 xl:h-8 bg-gradient-to-r from-yellow-300 to-yellow-500 rounded-full animate-pulse shadow-xl shadow-yellow-400/60"></div>
        <div className="absolute top-1/2 left-1/4 w-2 h-2 sm:w-3 sm:h-3 xl:w-4 xl:h-4 bg-yellow-400 rounded-full animate-bounce shadow-lg shadow-yellow-400/40"></div>
      </section>

      {/* Our Story */}
      <section className="py-16 sm:py-24 xl:py-32 2xl:py-40 px-4 relative bg-gradient-to-b from-black to-zinc-900">
        <div className="absolute inset-0 bg-gradient-to-r from-yellow-400/2 via-transparent to-yellow-400/2"></div>
        
        <div className="max-w-4xl lg:max-w-5xl xl:max-w-6xl 2xl:max-w-7xl mx-auto text-center relative z-10">
          <div className="mb-8 sm:mb-12 xl:mb-16">
            <h2 className="text-4xl sm:text-6xl xl:text-7xl 2xl:text-8xl font-black mb-4 sm:mb-6 xl:mb-8 bg-gradient-to-r from-yellow-300 to-yellow-500 bg-clip-text text-transparent">
              Our Legacy
            </h2>
            <div className="w-24 sm:w-32 xl:w-40 2xl:w-48 h-1.5 sm:h-2 xl:h-3 bg-gradient-to-r from-yellow-400 to-yellow-600 mx-auto rounded-full shadow-lg shadow-yellow-400/50"></div>
          </div>
          
          <div className="p-8 sm:p-12 xl:p-16 2xl:p-20 rounded-3xl bg-zinc-800/30 backdrop-blur-sm border-2 border-yellow-400/20 shadow-2xl shadow-yellow-400/10 hover:shadow-yellow-400/20 transition-all duration-500">
            <Diamond className="w-8 h-8 sm:w-12 sm:h-12 xl:w-16 xl:h-16 text-yellow-400 mx-auto mb-6 sm:mb-8 xl:mb-10" />
            
            <p className="text-lg sm:text-2xl xl:text-3xl 2xl:text-4xl leading-relaxed text-zinc-200 mb-6 sm:mb-8 xl:mb-10 font-light">
              Forged in the golden heart of Dubai, Prestige Motors represents the ultimate fusion of automotive artistry and 
              uncompromising luxury. We don't just rent vehicles—we curate experiences that define excellence.
            </p>
            
            <p className="text-base sm:text-xl xl:text-2xl 2xl:text-3xl leading-relaxed text-zinc-300 mb-6 sm:mb-8 xl:mb-10">
              Every supercar in our collection tells a story of precision engineering and breathtaking design. 
              From the moment you contact us, you enter a world where ordinary doesn't exist, and extraordinary is merely the beginning.
            </p>
            
            <div className="p-4 sm:p-6 xl:p-8 2xl:p-10 rounded-2xl bg-zinc-700/20 border border-yellow-400/30 shadow-inner">
              <p className="text-lg sm:text-2xl xl:text-3xl 2xl:text-4xl text-yellow-400 italic font-medium">
                "Where automotive dreams become reality, and every journey becomes legend."
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* What Sets Us Apart */}
      <section className="py-16 sm:py-24 xl:py-32 2xl:py-40 bg-gradient-to-b from-zinc-900 to-black">
        <div className="max-w-6xl xl:max-w-7xl 2xl:max-w-8xl mx-auto px-4">
          <div className="text-center mb-12 sm:mb-20 xl:mb-24">
            <h2 className="text-4xl sm:text-6xl xl:text-7xl 2xl:text-8xl font-black mb-4 sm:mb-6 xl:mb-8 bg-gradient-to-r from-yellow-300 to-yellow-500 bg-clip-text text-transparent">
              The Prestige Difference
            </h2>
            <div className="w-24 sm:w-32 xl:w-40 2xl:w-48 h-1.5 sm:h-2 xl:h-3 bg-gradient-to-r from-yellow-400 to-yellow-600 mx-auto rounded-full shadow-lg shadow-yellow-400/50"></div>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-3 gap-6 sm:gap-8 xl:gap-10 2xl:gap-12">
            {[
              {
                icon: <Car className="w-8 h-8 sm:w-10 sm:h-10 xl:w-12 xl:h-12 2xl:w-14 2xl:h-14" />,
                title: "Supercar Collection",
                description: "Lamborghini Aventador, Ferrari 488, Rolls-Royce Phantom—only the world's finest automotive masterpieces"
              },
              {
                icon: <Clock className="w-8 h-8 sm:w-10 sm:h-10 xl:w-12 xl:h-12 2xl:w-14 2xl:h-14" />,
                title: "24/7 Platinum Concierge",
                description: "Round-the-clock white-glove service with dedicated luxury consultants who anticipate your every need"
              },
              {
                icon: <Zap className="w-8 h-8 sm:w-10 sm:h-10 xl:w-12 xl:h-12 2xl:w-14 2xl:h-14" />,
                title: "Instant Luxury Delivery",
                description: "Private jet terminals, 7-star hotels, exclusive residences—we bring excellence directly to you"
              },
              {
                icon: <Crown className="w-8 h-8 sm:w-10 sm:h-10 xl:w-12 xl:h-12 2xl:w-14 2xl:h-14" />,
                title: "Master Chauffeurs",
                description: "Elite drivers trained in luxury hospitality, defensive driving, and Dubai's most exclusive destinations"
              },
              {
                icon: <Phone className="w-8 h-8 sm:w-10 sm:h-10 xl:w-12 xl:h-12 2xl:w-14 2xl:h-14" />,
                title: "Global Communication",
                description: "Fluent service in 8+ languages including Arabic, English, French, Russian, Mandarin, and Japanese"
              },
              {
                icon: <Shield className="w-8 h-8 sm:w-10 sm:h-10 xl:w-12 xl:h-12 2xl:w-14 2xl:h-14" />,
                title: "Platinum Protection",
                description: "Comprehensive insurance, 24/7 roadside assistance, and complete peace of mind for every journey"
              }
            ].map((feature, index) => (
              <div key={index} className="group relative">
                <div className="p-6 sm:p-10 xl:p-12 2xl:p-14 rounded-3xl bg-zinc-800/40 backdrop-blur-sm border-2 border-yellow-400/20 hover:border-yellow-400/60 transition-all duration-500 hover:transform hover:scale-105 shadow-2xl shadow-black/50 hover:shadow-yellow-400/20 h-full">
                  
                  {/* Glow Effect */}
                  <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-yellow-400/5 to-yellow-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  
                  <div className="relative z-10 h-full flex flex-col">
                    <div className="text-yellow-400 mb-4 sm:mb-6 xl:mb-8 group-hover:scale-125 transition-transform duration-500 drop-shadow-lg flex-shrink-0">
                      {feature.icon}
                    </div>
                    
                    <h3 className="text-xl sm:text-2xl xl:text-3xl 2xl:text-4xl font-bold mb-3 sm:mb-4 xl:mb-6 text-yellow-400 group-hover:text-yellow-300 transition-colors flex-shrink-0">
                      {feature.title}
                    </h3>
                    
                    <p className="text-zinc-300 leading-relaxed text-base sm:text-lg xl:text-xl 2xl:text-2xl group-hover:text-zinc-200 transition-colors flex-grow">
                      {feature.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-16 sm:py-24 xl:py-32 2xl:py-40 px-4 bg-gradient-to-b from-black to-zinc-900">
        <div className="max-w-5xl xl:max-w-6xl 2xl:max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-8 sm:gap-12 xl:gap-16 2xl:gap-20">
            <div className="group">
              <div className="p-8 sm:p-12 xl:p-16 2xl:p-20 rounded-3xl bg-zinc-800/30 backdrop-blur-sm border-2 border-yellow-400/30 hover:border-yellow-400/60 transition-all duration-500 shadow-2xl shadow-yellow-400/10 hover:shadow-yellow-400/25 hover:transform hover:scale-105 h-full">
                <div className="text-center">
                  <div className="p-3 sm:p-4 xl:p-6 2xl:p-8 rounded-2xl bg-yellow-400/10 inline-block mb-6 sm:mb-8 xl:mb-10 shadow-inner">
                    <Award className="w-12 h-12 sm:w-16 sm:h-16 xl:w-20 xl:h-20 2xl:w-24 2xl:h-24 text-yellow-400 drop-shadow-lg" />
                  </div>
                  
                  <h3 className="text-3xl sm:text-4xl xl:text-5xl 2xl:text-6xl font-black mb-6 sm:mb-8 xl:mb-10 text-yellow-400">Our Mission</h3>
                  
                  <p className="text-lg sm:text-xl xl:text-2xl 2xl:text-3xl text-zinc-200 leading-relaxed">
                    To redefine luxury mobility by delivering unparalleled automotive experiences that exceed every expectation, 
                    creating unforgettable moments for Dubai's most distinguished clientele through precision, passion, and perfection.
                  </p>
                </div>
              </div>
            </div>
            
            <div className="group">
              <div className="p-8 sm:p-12 xl:p-16 2xl:p-20 rounded-3xl bg-zinc-800/30 backdrop-blur-sm border-2 border-yellow-400/30 hover:border-yellow-400/60 transition-all duration-500 shadow-2xl shadow-yellow-400/10 hover:shadow-yellow-400/25 hover:transform hover:scale-105 h-full">
                <div className="text-center">
                  <div className="p-3 sm:p-4 xl:p-6 2xl:p-8 rounded-2xl bg-yellow-400/10 inline-block mb-6 sm:mb-8 xl:mb-10 shadow-inner">
                    <Star className="w-12 h-12 sm:w-16 sm:h-16 xl:w-20 xl:h-20 2xl:w-24 2xl:h-24 text-yellow-400 drop-shadow-lg" />
                  </div>
                  
                  <h3 className="text-3xl sm:text-4xl xl:text-5xl 2xl:text-6xl font-black mb-6 sm:mb-8 xl:mb-10 text-yellow-400">Our Vision</h3>
                  
                  <p className="text-lg sm:text-xl xl:text-2xl 2xl:text-3xl text-zinc-200 leading-relaxed">
                    To establish the global benchmark for luxury automotive services, becoming the world's most coveted brand 
                    for premium mobility experiences while maintaining our crown as Dubai's ultimate luxury destination.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Service Coverage */}
      <section className="py-16 sm:py-24 xl:py-32 2xl:py-40 px-4 bg-gradient-to-b from-black to-zinc-900">
        <div className="max-w-5xl xl:max-w-6xl 2xl:max-w-7xl mx-auto text-center">
          <div className="mb-12 sm:mb-16 xl:mb-20">
            <h2 className="text-4xl sm:text-6xl xl:text-7xl 2xl:text-8xl font-black mb-4 sm:mb-6 xl:mb-8 bg-gradient-to-r from-yellow-300 to-yellow-500 bg-clip-text text-transparent">
              Elite Destinations
            </h2>
            <div className="w-24 sm:w-32 xl:w-40 2xl:w-48 h-1.5 sm:h-2 xl:h-3 bg-gradient-to-r from-yellow-400 to-yellow-600 mx-auto rounded-full shadow-lg shadow-yellow-400/50 mb-6 sm:mb-8 xl:mb-10"></div>
            
            <p className="text-lg sm:text-2xl xl:text-3xl 2xl:text-4xl text-zinc-200 mb-8 sm:mb-12 xl:mb-16 font-light">
              Serving Dubai's most prestigious locations with unmatched sophistication
            </p>
          </div>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-4 2xl:grid-cols-4 gap-4 sm:gap-6 xl:gap-8">
            {[
              "Palm Jumeirah", "Downtown Dubai", "Dubai Marina", "Burj Al Arab",
              "DXB Airport", "Jumeirah Beach", "Dubai Mall", "Atlantis Resort",
              "DIFC", "Emirates Hills", "Dubai Creek", "Business Bay",
              "Madinat Jumeirah", "JBR Walk", "City Walk", "La Mer"
            ].map((location, index) => (
              <div key={index} className="group">
                <div className="p-4 sm:p-6 xl:p-8 2xl:p-10 rounded-2xl bg-zinc-800/30 backdrop-blur-sm border border-yellow-400/20 hover:border-yellow-400/60 transition-all duration-300 hover:bg-zinc-700/30 shadow-lg shadow-black/30 hover:shadow-yellow-400/20 hover:transform hover:scale-105 h-full flex flex-col items-center justify-center">
                  <MapPin className="w-5 h-5 sm:w-6 sm:h-6 xl:w-7 xl:h-7 2xl:w-8 2xl:h-8 text-yellow-400 mx-auto mb-2 sm:mb-3 xl:mb-4 group-hover:scale-110 transition-transform flex-shrink-0" />
                  <p className="text-zinc-200 font-semibold group-hover:text-yellow-400 transition-colors text-sm sm:text-base xl:text-lg 2xl:text-xl text-center">{location}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 sm:py-24 xl:py-32 2xl:py-40 bg-gradient-to-r from-black via-zinc-900 to-black relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-yellow-400/3 to-yellow-600/3"></div>
        
        {/* Animated Background */}
        <div className="absolute top-10 left-10 w-64 h-64 sm:w-96 sm:h-96 xl:w-[28rem] xl:h-[28rem] 2xl:w-[32rem] 2xl:h-[32rem] bg-gradient-to-r from-yellow-400/10 to-transparent rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-10 right-10 w-48 h-48 sm:w-80 sm:h-80 xl:w-96 xl:h-96 2xl:w-[28rem] 2xl:h-[28rem] bg-gradient-to-l from-yellow-400/8 to-transparent rounded-full blur-3xl animate-pulse delay-1000"></div>
        
        <div className="relative z-10 max-w-4xl xl:max-w-5xl 2xl:max-w-6xl mx-auto text-center px-4">
          <div className="p-10 sm:p-16 xl:p-20 2xl:p-24 rounded-3xl bg-zinc-800/20 backdrop-blur-sm border-2 border-yellow-400/30 shadow-2xl shadow-yellow-400/20">
            <Crown className="w-16 h-16 sm:w-20 sm:h-20 xl:w-24 xl:h-24 2xl:w-28 2xl:h-28 text-yellow-400 mx-auto mb-6 sm:mb-8 xl:mb-10 animate-pulse drop-shadow-2xl" />
            
            <h2 className="text-4xl sm:text-6xl xl:text-7xl 2xl:text-8xl font-black mb-6 sm:mb-8 xl:mb-10 bg-gradient-to-r from-yellow-300 to-yellow-500 bg-clip-text text-transparent">
              Begin Your Legend
            </h2>
            
            <p className="text-lg sm:text-2xl xl:text-3xl 2xl:text-4xl text-zinc-200 mb-8 sm:mb-12 xl:mb-16 leading-relaxed font-light">
              Step into a world where automotive excellence meets uncompromising luxury. 
              Your extraordinary journey of a lifetime awaits.
            </p>
            
            <div className="flex flex-col md:flex-row gap-6 sm:gap-8 xl:gap-10 justify-center mb-8 sm:mb-12 xl:mb-16">
              <button className="group px-12 sm:px-16 xl:px-20 2xl:px-24 py-4 sm:py-6 xl:py-8 2xl:py-10 bg-gradient-to-r from-yellow-400 to-yellow-500 text-black font-black text-lg sm:text-xl xl:text-2xl 2xl:text-3xl rounded-2xl hover:from-yellow-300 hover:to-yellow-400 transition-all duration-300 hover:scale-110 shadow-2xl shadow-yellow-400/30 hover:shadow-yellow-400/50">
                <span className="group-hover:scale-105 transition-transform inline-block">Explore Our Fleet</span>
              </button>
            </div>
            
            <div className="flex flex-col lg:flex-row justify-center items-center space-y-4 lg:space-y-0 lg:space-x-8 xl:space-x-12 2xl:space-x-16 text-zinc-300">
              <div className="flex items-center space-x-3 xl:space-x-4 p-4 sm:p-6 xl:p-8 rounded-xl bg-zinc-800/30 backdrop-blur-sm border border-yellow-400/20 shadow-lg">
                <Phone className="w-5 h-5 sm:w-6 sm:h-6 xl:w-7 xl:h-7 2xl:w-8 2xl:h-8 text-yellow-400" />
                <span className="text-base sm:text-lg xl:text-xl 2xl:text-2xl font-medium">{phoneNumber}</span>
              </div>
              
              <div className="flex items-center space-x-3 xl:space-x-4 p-4 sm:p-6 xl:p-8 rounded-xl bg-zinc-800/30 backdrop-blur-sm border border-yellow-400/20 shadow-lg">
                <MapPin className="w-5 h-5 sm:w-6 sm:h-6 xl:w-7 xl:h-7 2xl:w-8 2xl:h-8 text-yellow-400" />
                <span className="text-base sm:text-lg xl:text-xl 2xl:text-2xl font-medium">Dubai, UAE</span>
              </div>
            </div>
          </div>
        </div>
      </section>
      <FooterSection />
    </div>
  );
}