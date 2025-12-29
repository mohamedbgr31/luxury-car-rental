"use client";
import React, { useState } from "react";
import { Menu, X } from "lucide-react";
import { usePermissions } from "@/app/hooks/usePermissions";

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const { canAccessHome, canAccessRoles } = usePermissions();

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const closeSidebar = () => {
    setIsOpen(false);
  };

  return (
    <div>
      {/* Mobile Menu Button */}
      <button
        onClick={toggleSidebar}
        className="md:hidden fixed top-4 left-4 z-[60] bg-yellow-500 text-black p-3 rounded-lg shadow-xl hover:bg-yellow-400 transition-all duration-200 hover:scale-105"
        style={{
          position: 'fixed',
          top: '16px',
          left: '16px',
          zIndex: 60
        }}
        aria-label="Toggle menu"
      >
        {isOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="md:hidden fixed inset-0 bg-black bg-opacity-50 z-[40] transition-opacity duration-300"
          onClick={closeSidebar}
          style={{ zIndex: 40 }}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed top-0 left-0 h-screen z-[50]
          w-80 sm:w-72 bg-[#0d0d0d] text-white flex flex-col
          transition-transform duration-300 ease-in-out
          md:translate-x-0 md:rounded-r-[2.5rem]
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
          ${isOpen ? 'rounded-r-[2.5rem]' : 'rounded-r-none'}
          overflow-hidden shadow-2xl border-r border-gray-800/50
          flex-shrink-0
        `}
        style={{ zIndex: 50 }}
      >
        {/* Header */}
        <div className="text-yellow-400 text-xl font-bruno text-center pt-20 md:pt-6 pb-6 flex-shrink-0 border-b border-gray-800">
          ADMIN
        </div>

        {/* Navigation - Scrollable */}
        <nav className="flex-1 flex flex-col items-center gap-6 py-4 px-6 overflow-y-auto scrollbar-hide">
          {canAccessHome && (
            <a
              href="/admin/hp"
              onClick={closeSidebar}
              className="hover:text-yellow-400 font-bruno text-xl lg:text-2xl transition-all duration-200 hover:scale-105 text-center w-full py-2 flex-shrink-0"
            >
              HOME
            </a>
          )}
          <a
            href="/admin/dashboard"
            onClick={closeSidebar}
            className="hover:text-yellow-400 font-bruno text-xl lg:text-2xl transition-all duration-200 hover:scale-105 text-center w-full py-2 flex-shrink-0"
          >
            DASHBOARD
          </a>
          <a
            href="/admin/cars"
            onClick={closeSidebar}
            className="hover:text-yellow-400 font-bruno text-xl lg:text-2xl transition-all duration-200 hover:scale-105 text-center w-full py-2 flex-shrink-0"
          >
            CARS
          </a>
          <a
            href="/admin/contactpannel"
            onClick={closeSidebar}
            className="hover:text-yellow-400 font-bruno text-xl lg:text-2xl transition-all duration-200 hover:scale-105 text-center w-full py-2 flex-shrink-0"
          >
            CONTACTS
          </a>
          <a
            href="/admin/req"
            onClick={closeSidebar}
            className="hover:text-yellow-400 font-bruno text-xl lg:text-2xl transition-all duration-200 hover:scale-105 text-center w-full py-2 flex-shrink-0"
          >
            REQUESTS
          </a>
          {canAccessRoles && (
            <a
              href="/admin/ro"
              onClick={closeSidebar}
              className="hover:text-yellow-400 font-bruno text-xl lg:text-2xl transition-all duration-200 hover:scale-105 text-center w-full py-2 flex-shrink-0"
            >
              ROLES
            </a>
          )}
          <a
            href="/admin/faaq"
            onClick={closeSidebar}
            className="hover:text-yellow-400 font-bruno text-xl lg:text-2xl transition-all duration-200 hover:scale-105 text-center w-full py-2 flex-shrink-0"
          >
            F.A.Q
          </a>
        </nav>

        {/* Profile Section - Fixed at bottom */}
        <div className="flex-shrink-0 p-6 pt-4">
          <div className="flex items-center gap-4 mb-4">
            <div className="h-12 w-12 lg:h-14 lg:w-14 rounded-full cursor-pointer bg-yellow-600 hover:bg-yellow-500 transition-colors duration-200 flex-shrink-0"></div>
            <div className="min-w-0">
              <div className="text-sm lg:text-md text-gray-200 truncate">NOBLE LUX RENT</div>
              <div className="text-sm lg:text-md text-gray-200 truncate">+971 50 123 4567</div>
            </div>
          </div>

          {/* Logout Button */}
          <button className="w-full bg-yellow-500 hover:bg-red-600 hover:scale-105 text-black px-4 rounded-3xl py-2 transition-all duration-200 font-medium text-sm lg:text-base">
            LOG OUT
          </button>
        </div>
      </aside>

      {/* Custom scrollbar styles */}
      <style jsx>{`
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
}