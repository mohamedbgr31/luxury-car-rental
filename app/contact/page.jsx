"use client"
import React from "react";
import {
  FaPhoneAlt,
  FaEnvelope,
  FaCalendarAlt,
  FaMapMarkerAlt,
  FaWhatsapp,
  FaInstagram,
  FaTelegramPlane,
  FaFacebookF,
  FaArrowUp,
} from "react-icons/fa";
import Navbar from "../components/homepage/navbar";
import { useContactData } from "../components/data/contactdata";
import FooterSection from "@/app/components/homepage/footer";

export default function ContactUs() {
  const { contactInfo, socialMedia, lastUpdated } = useContactData();

  const formattedLastUpdated = lastUpdated
    ? new Date(lastUpdated).toLocaleDateString() + ' • ' + new Date(lastUpdated).toLocaleTimeString()
    : '';

  return (
    <div className="bg-black">
      <Navbar />
      <div className="bg-black text-white py-6 sm:py-8 lg:py-10 font-sans">
        <div className="container-responsive-lg">
        {/* Header */}
        <div className="text-center font-bruno responsive-margin">
          <h2 className="responsive-heading font-semibold responsive-margin leading-tight">
            Get in Touch with{" "}
            <span className="text-yellow-500 block sm:inline mt-2 sm:mt-0">
              Noble Car Rental
            </span>
          </h2>
          <p className="text-gray-300 max-w-xs sm:max-w-lg md:max-w-xl lg:max-w-2xl responsive-text mx-auto leading-relaxed px-2">
            Whether you have a question about our luxury fleet, pricing, or availability – our team is ready to assist you. Reach out and we'll respond as soon as possible.
          </p>
        </div>

        {/* Contact Info */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 spacing-responsive text-center font-bruno responsive-margin">
          <div className="border border-yellow-500 rounded-xl responsive-padding hover:bg-yellow-500/5 transition-colors">
            <FaPhoneAlt className="text-2xl sm:text-3xl text-yellow-500 mx-auto mb-4 sm:mb-6 lg:mb-10" />
            <h4 className="font-semibold mb-3 sm:mb-4 lg:mb-7 text-sm sm:text-base">Phone Number</h4>
            <p className="text-xs sm:text-sm lg:text-base break-all">{contactInfo?.phone?.value || "-"}</p>
          </div>
          <div className="border border-yellow-500 rounded-xl responsive-padding hover:bg-yellow-500/5 transition-colors">
            <FaEnvelope className="text-2xl sm:text-3xl text-yellow-500 mx-auto mb-4 sm:mb-6 lg:mb-8" />
            <h4 className="font-semibold mb-3 sm:mb-4 lg:mb-7 text-sm sm:text-base">Email</h4>
            <p className="mb-2 text-xs sm:text-sm lg:text-base break-all">{contactInfo?.email?.value || "-"}</p>
          </div>
          <div className="border border-yellow-500 rounded-xl responsive-padding hover:bg-yellow-500/5 transition-colors">
            <FaCalendarAlt className="text-2xl sm:text-3xl text-yellow-500 mx-auto mb-4 sm:mb-6 lg:mb-8" />
            <h4 className="font-semibold mb-2 sm:mb-3 lg:mb-4 text-sm sm:text-base">Working Hours</h4>
            <p className="mb-2 text-xs sm:text-sm lg:text-base">{contactInfo?.hours?.value || "-"}</p>
          </div>
          <div className="border border-yellow-500 rounded-xl responsive-padding hover:bg-yellow-500/5 transition-colors">
            <FaMapMarkerAlt className="text-2xl sm:text-3xl text-yellow-500 mx-auto mb-4 sm:mb-6 lg:mb-8" />
            <h4 className="font-semibold mb-3 sm:mb-4 lg:mb-5 text-sm sm:text-base">Address</h4>
            <p className="mb-2 text-xs sm:text-sm lg:text-base leading-relaxed">{contactInfo?.address?.value || "-"}</p>
          </div>
        </div>

        {/* Social Icons */}
        <div className="flex justify-center flex-wrap gap-4 sm:gap-8 lg:gap-16 text-yellow-500 text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-8xl mt-12 sm:mt-16 lg:mt-20">
          {socialMedia?.filter(sm => sm.active).map((sm, idx) => {
            const Icon = sm.icon || FaWhatsapp;
            return (
              <a 
                key={sm._id || idx} 
                href={sm.link} 
                target="_blank" 
                rel="noopener noreferrer"
                className="hover:text-yellow-400 transition-colors transform hover:scale-110 duration-200"
              >
                <Icon />
              </a>
            );
          })}
        </div>

          {/* Footer */}
          <FooterSection />
        </div>
      </div>
    </div>
  );
}