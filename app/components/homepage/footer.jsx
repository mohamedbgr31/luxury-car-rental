"use client"
import { getApiUrl } from '@/lib/api-config';;
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowUp,
  Facebook,
  Instagram,
  Twitter,
  Youtube,
  Mail,
  MapPin,
  Phone,
  ChevronRight,
  Clock
} from "lucide-react";
import { useContactData } from "../data/contactdata";

export default function FooterSection() {
  const { contactInfo, socialMedia } = useContactData();
  const [logoData, setLogoData] = useState(null);

  const phone = contactInfo?.phone?.value || "+971 50 123 4567";
  const email = contactInfo?.email?.value || "info@luxurydriverentals.com";
  const address = contactInfo?.address?.value || "Sheikh Zayed Road, Dubai, UAE";
  const hours = contactInfo?.hours?.value || "Daily: 9:00 AM - 10:00 PM";

  useEffect(() => {
    const fetchLogo = async () => {
      try {
        const res = await fetch(getApiUrl('/api/logo'));
        if (res.ok) {
          const data = await res.json();
          setLogoData(data);
        }
      } catch (error) {
        console.error('Failed to fetch logo:', error);
      }
    };
    fetchLogo();
  }, []);

  const footerLinks = {
    company: [
      { name: "About Us", href: "/aboutus" },
      { name: "Our Fleet", href: "/cars" },
      { name: "Services", href: "/services" },
      { name: "Contact", href: "/contact" },
    ],
    support: [
      { name: "FAQ", href: "/faq" },
      { name: "Terms & Conditions", href: "/terms" },
      { name: "Privacy Policy", href: "/privacy" },
      { name: "Rental Requirements", href: "/requirements" },
    ]
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: "easeOut" }
    },
  };

  return (
    <footer className="relative bg-[#050505] text-white pt-24 pb-10 overflow-hidden border-t border-white/5 font-sans">
      {/* Decorative Top Gradient Line */}
      <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-yellow-500/50 to-transparent" />

      {/* Golden Glow Effects */}
      <div className="absolute top-0 left-1/4 w-64 h-64 bg-yellow-500/5 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-amber-500/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={containerVariants}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 lg:gap-8 mb-20"
        >
          {/* Brand Column (4 cols) */}
          <motion.div variants={itemVariants} className="lg:col-span-4 space-y-8">
            <Link href="/" className="inline-block group">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="absolute inset-0 bg-yellow-500 blur-lg opacity-20 group-hover:opacity-40 transition-opacity duration-500" />
                  <img
                    src={logoData?.navbarLogo || "/img/noblelogo.png"}
                    alt="Noble Luxury Car Rental"
                    className="relative w-14 h-14 object-contain"
                  />
                </div>
                <div>
                  <span className="block font-playfair font-bold text-2xl tracking-wide bg-gradient-to-r from-amber-200 via-yellow-400 to-amber-500 bg-clip-text text-transparent">
                    NOBLE
                  </span>
                  <span className="text-[10px] tracking-[0.3em] text-gray-400 uppercase">
                    Luxury Car Rental
                  </span>
                </div>
              </div>
            </Link>

            <p className="text-gray-400 leading-relaxed text-sm max-w-sm">
              Experience the thrill of the extraordinary. We provide an exclusive fleet of premium vehicles for those who demand excellence in every journey. Elevate your drive today.
            </p>

            <div className="flex items-center gap-4 pt-2">
              {(socialMedia || []).filter(sm => sm.active).map((sm, idx) => {
                const Icon = sm.icon ? sm.icon : undefined;
                const label = sm.platform || 'social';
                const DefaultIcon =
                  label.toLowerCase() === 'facebook' ? Facebook :
                    label.toLowerCase() === 'instagram' ? Instagram :
                      label.toLowerCase() === 'twitter' ? Twitter : Youtube;

                const IconComp = Icon || DefaultIcon;

                return (
                  <a
                    key={sm._id || idx}
                    href={sm.link || '#'}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 rounded-full border border-gray-800 bg-gray-900/50 flex items-center justify-center text-gray-400 hover:text-black hover:bg-yellow-400 hover:border-yellow-400 transition-all duration-300 group"
                    aria-label={label}
                  >
                    <IconComp size={18} className="transform group-hover:scale-110 transition-transform duration-300" />
                  </a>
                );
              })}
            </div>
          </motion.div>

          {/* Quick Links (2 cols) */}
          <motion.div variants={itemVariants} className="lg:col-span-2 lg:pl-4">
            <h4 className="font-playfair text-lg text-white mb-6 flex items-center gap-2">
              Explore
              <span className="w-1.5 h-1.5 rounded-full bg-yellow-500 inline-block" />
            </h4>
            <ul className="space-y-4">
              {footerLinks.company.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-gray-400 hover:text-yellow-400 text-sm transition-colors duration-300 flex items-center gap-2 group"
                  >
                    <ChevronRight size={12} className="opacity-0 -ml-4 group-hover:opacity-100 group-hover:ml-0 transition-all duration-300 text-yellow-500" />
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Support Links (3 cols) */}
          <motion.div variants={itemVariants} className="lg:col-span-3">
            <h4 className="font-playfair text-lg text-white mb-6 flex items-center gap-2">
              Contact & Support
              <span className="w-1.5 h-1.5 rounded-full bg-yellow-500 inline-block" />
            </h4>
            <ul className="space-y-5 text-sm text-gray-400">
              <li className="flex items-start gap-3 group cursor-pointer hover:text-white transition-colors duration-300">
                <MapPin size={18} className="text-yellow-500 shrink-0 mt-0.5" />
                <span className="leading-relaxed max-w-[200px]">{address}</span>
              </li>
              <li className="flex items-center gap-3 group cursor-pointer hover:text-white transition-colors duration-300">
                <Phone size={18} className="text-yellow-500 shrink-0" />
                <span>{phone}</span>
              </li>
              <li className="flex items-center gap-3 group cursor-pointer hover:text-white transition-colors duration-300">
                <Mail size={18} className="text-yellow-500 shrink-0" />
                <span>{email}</span>
              </li>
            </ul>
          </motion.div>

          {/* Working Hours (3 cols) */}
          <motion.div variants={itemVariants} className="lg:col-span-3">
            <h4 className="font-playfair text-lg text-white mb-6 flex items-center gap-2">
              Working Hours
              <span className="w-1.5 h-1.5 rounded-full bg-yellow-500 inline-block" />
            </h4>
            <p className="text-gray-400 text-sm mb-6 leading-relaxed">
              Visit our showroom or contact our team during these hours for immediate assistance.
            </p>

            <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-6 hover:border-yellow-500/30 transition-colors duration-300">
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-full bg-yellow-500/10 text-yellow-500">
                  <Clock size={20} />
                </div>
                <div>
                  <h5 className="text-white font-medium mb-1">Business Hours</h5>
                  <p className="text-gray-400 text-sm">{hours}</p>
                  <p className="text-yellow-500 text-xs mt-2 font-medium tracking-wide uppercase">
                    Open 7 Days a Week
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>

        {/* Footer Bottom */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
          className="pt-8 border-t border-gray-800/50 flex flex-col md:flex-row items-center justify-between gap-6"
        >
          <p className="text-gray-500 text-xs md:text-sm text-center md:text-left">
            © {new Date().getFullYear()} Noble Luxury Car Rental. All rights reserved.
          </p>

          <div className="flex items-center gap-6">
            <button
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="group flex items-center gap-2 text-xs font-bold tracking-widest uppercase text-gray-500 hover:text-yellow-400 transition-all duration-300"
            >
              Back to Top
              <span className="w-8 h-8 rounded-full border border-gray-700 flex items-center justify-center group-hover:border-yellow-400 group-hover:bg-yellow-400 group-hover:text-black transition-all duration-300">
                <ArrowUp size={14} />
              </span>
            </button>
          </div>
        </motion.div>
      </div>
    </footer>
  );
}
