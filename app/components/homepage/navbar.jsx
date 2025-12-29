"use client"
import { getApiUrl } from '@/lib/api-config';;
import React, { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";

export default function Navbar() {
    const pathname = usePathname();
    const router = useRouter();
    const [user, setUser] = useState(null);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const dropdownRef = useRef(null);
    const mobileMenuRef = useRef(null);
    const dropdownTimeoutRef = useRef(null);

    useEffect(() => {
        async function fetchUser() {
            try {
                const res = await fetch(getApiUrl('/api/auth/me'), { credentials: 'include' });
                const data = await res.json();
                setUser(data.user);
            } catch (e) {
                setUser(null);
            }
        }
        fetchUser();
    }, [pathname]);

    // Close dropdown and mobile menu on outside click
    useEffect(() => {
        function handleClickOutside(event) {
            // Only close dropdown on click, not on mouse move
            // This allows mouse hover to work properly
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                // Add a small delay to allow click events to fire first
                setTimeout(() => {
                    setDropdownOpen(false);
                }, 100);
            }
            if (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target)) {
                setMobileMenuOpen(false);
            }
        }

        if (mobileMenuOpen) {
            document.addEventListener("mousedown", handleClickOutside);
            document.addEventListener("touchstart", handleClickOutside);
        }

        // For dropdown, only close on click outside, not on mouse leave
        // Mouse leave is handled by the mouse event handlers
        if (dropdownOpen) {
            const timeoutId = setTimeout(() => {
                document.addEventListener("click", handleClickOutside, true);
            }, 0);

            return () => {
                clearTimeout(timeoutId);
                document.removeEventListener("click", handleClickOutside, true);
            };
        }

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
            document.removeEventListener("touchstart", handleClickOutside);
        };
    }, [dropdownOpen, mobileMenuOpen]);

    // Close mobile menu on route change
    useEffect(() => {
        setMobileMenuOpen(false);
    }, [pathname]);

    // Prevent body scroll when mobile menu is open
    useEffect(() => {
        if (mobileMenuOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }

        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [mobileMenuOpen]);

    const handleLogout = () => {
        localStorage.removeItem("token");
        setUser(null);
        setDropdownOpen(false);
        setMobileMenuOpen(false);
        router.push("/login");
    };

    // Get initials from name (first letter of first and last name)
    const getInitials = (name) => {
        if (!name) return "U";
        const parts = name.trim().split(" ");
        if (parts.length === 1) return parts[0][0].toUpperCase();
        return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    };

    // Handle profile interactions for desktop
    const handleProfileMouseEnter = () => {
        if (window.innerWidth >= 1024) {
            // Clear any pending close timeout
            if (dropdownTimeoutRef.current) {
                clearTimeout(dropdownTimeoutRef.current);
                dropdownTimeoutRef.current = null;
            }
            setDropdownOpen(true);
        }
    };

    const handleProfileMouseLeave = () => {
        if (window.innerWidth >= 1024) {
            // Delay closing to allow mouse to move to dropdown
            dropdownTimeoutRef.current = setTimeout(() => {
                setDropdownOpen(false);
            }, 200);
        }
    };

    const handleDropdownMouseEnter = () => {
        if (window.innerWidth >= 1024) {
            // Clear any pending close timeout
            if (dropdownTimeoutRef.current) {
                clearTimeout(dropdownTimeoutRef.current);
                dropdownTimeoutRef.current = null;
            }
            setDropdownOpen(true);
        }
    };

    const handleDropdownMouseLeave = () => {
        if (window.innerWidth >= 1024) {
            // Delay closing to allow mouse to move back to button
            dropdownTimeoutRef.current = setTimeout(() => {
                setDropdownOpen(false);
            }, 200);
        }
    };

    // Cleanup timeout on unmount
    useEffect(() => {
        return () => {
            if (dropdownTimeoutRef.current) {
                clearTimeout(dropdownTimeoutRef.current);
            }
        };
    }, []);

    const toggleMobileMenu = () => {
        setMobileMenuOpen(!mobileMenuOpen);
    };

    const navLinks = [
        { href: "/hp", label: "Home" },
        { href: "/cars", label: "Cars" },
        { href: "/contact", label: "Contact us" },
        { href: "/aboutus", label: "about us" }
    ];

    return (
        <>
            <nav className=" w-full bg-gray-800/0 backdrop-blur-md border-b border-gray-800/50 flex justify-between items-center px-4 sm:px-6 lg:px-8 py-4 text-white transition-all duration-300 relative" style={{ zIndex: 1000 }}>
                {/* Logo */}
                <div className="flex items-center gap-2 flex-shrink-0">
                    <img src="/img/noblelogo.png" alt="Noble Logo" className="w-8 sm:w-10 lg:w-12" />
                    <span className="font-playfair text-base sm:text-lg lg:text-xl font-bold text-yellow-500">
                        <span className="hidden sm:inline">lux Car Rental</span>
                        <span className="sm:hidden">lux</span>
                    </span>
                </div>

                {/* Desktop Navigation */}
                <ul className="hidden lg:flex gap-8 text-lg">
                    {navLinks.map((link) => (
                        <li key={link.href} className="font-playfair">
                            <Link
                                href={link.href}
                                className={`hover:text-yellow-400 transition-colors duration-200 pb-1 border-b-2 border-transparent hover:border-yellow-400 ${pathname === link.href ? 'text-yellow-400 border-yellow-400' : ''
                                    }`}
                            >
                                {link.label}
                            </Link>
                        </li>
                    ))}
                    {/* Garage Icon */}
                    <li className="font-playfair">
                        <Link
                            href="/garage"
                            className={`hover:text-yellow-400 transition-colors duration-200 pb-1 border-b-2 border-transparent hover:border-yellow-400 ${pathname === '/garage' ? 'text-yellow-400 border-yellow-400' : ''
                                }`}
                        >
                            <img
                                src="/img/garageicone.png"
                                alt="Garage"
                                className="w-8 h-8"
                            />
                        </Link>
                    </li>
                </ul>

                {/* Desktop User Profile or Login */}
                <div className="hidden lg:block relative" style={{ zIndex: 9999 }}>
                    {user ? (
                        <div
                            className="relative"
                            ref={dropdownRef}
                            onMouseEnter={handleProfileMouseEnter}
                            onMouseLeave={handleProfileMouseLeave}
                        >
                            <button
                                className="flex items-center gap-3 px-4 py-2 rounded-full bg-gray-800/80 hover:bg-gray-700/80 transition-all duration-200 shadow-lg focus:outline-none focus:ring-2 focus:ring-yellow-500/50 relative z-10"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setDropdownOpen(!dropdownOpen);
                                }}
                                aria-haspopup="true"
                                aria-expanded={dropdownOpen}
                            >
                                <span className="flex items-center justify-center w-10 h-10 rounded-full bg-yellow-500 text-black font-bold text-sm">
                                    {getInitials(user.name || user.phone || "U")}
                                </span>
                                <span className="flex flex-col items-start">
                                    <span className="font-bold text-sm text-white">
                                        {user.name || user.phone || "User"}
                                    </span>
                                    <span className="text-xs text-gray-400 capitalize">
                                        {user.role || "User"}
                                    </span>
                                </span>
                                <svg
                                    className={`ml-2 w-4 h-4 text-gray-400 transition-transform duration-200 ${dropdownOpen ? 'rotate-180' : ''}`}
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    viewBox="0 0 24 24"
                                >
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                                </svg>
                            </button>

                            {/* Invisible bridge area to prevent gap issues - larger area */}
                            {dropdownOpen && (
                                <div
                                    className="absolute right-0 top-full w-full h-3"
                                    onMouseEnter={handleDropdownMouseEnter}
                                    style={{ zIndex: 9998 }}
                                />
                            )}

                            <div
                                className={`absolute right-0 top-full pt-3 w-56 transition-all duration-200 transform origin-top-right ${dropdownOpen
                                        ? 'opacity-100 scale-100 translate-y-0 pointer-events-auto'
                                        : 'opacity-0 scale-95 -translate-y-2 pointer-events-none'
                                    }`}
                                style={{ zIndex: 10000 }}
                                onMouseEnter={handleDropdownMouseEnter}
                                onMouseLeave={handleDropdownMouseLeave}
                                onClick={(e) => e.stopPropagation()}
                            >
                                <div className="bg-neutral-800 border border-neutral-700 rounded-xl shadow-2xl overflow-hidden">
                                    <div className="p-2">
                                        {user.role === 'admin' || user.role === 'manager' || user.role === 'agent' ? (
                                            <button
                                                className="w-full flex items-center gap-3 p-2.5 rounded-lg text-gray-200 hover:bg-neutral-700 transition-colors text-left"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    setDropdownOpen(false);
                                                    router.push('/admin/hp');
                                                }}
                                                onMouseDown={(e) => e.stopPropagation()}
                                            >
                                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#F59E0B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                    <path d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0h6" />
                                                </svg>
                                                <span className="text-sm font-medium text-gray-200">Admin Panel</span>
                                            </button>
                                        ) : null}
                                        {user.role === 'admin' || user.role === 'manager' || user.role === 'agent' ? (
                                            <div className="border-t border-neutral-700 my-1"></div>
                                        ) : null}
                                        <button
                                            className="w-full flex items-center gap-3 p-2.5 rounded-lg text-red-400 hover:bg-red-900/30 transition-colors text-left"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleLogout();
                                            }}
                                            onMouseDown={(e) => e.stopPropagation()}
                                        >
                                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#FCA5A5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4" />
                                                <path d="M16 17l5-5-5-5" />
                                                <path d="M21 12H9" />
                                            </svg>
                                            <span className="text-sm font-medium">Logout</span>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <Link href={`/login?redirect=${pathname}`}>
                            <button className="font-playfair bg-yellow-600 hover:bg-yellow-500 px-6 py-2 text-white rounded-full shadow-md transition-all duration-200 hover:shadow-lg hover:scale-105 focus:outline-none focus:ring-2 focus:ring-yellow-500/50">
                                Login
                            </button>
                        </Link>
                    )}
                </div>

                {/* Mobile Menu Button */}
                <button
                    className="lg:hidden flex items-center justify-center w-10 h-10 rounded-lg bg-gray-800/80 hover:bg-gray-700/80 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-yellow-500/50"
                    onClick={toggleMobileMenu}
                    aria-label="Toggle mobile menu"
                >
                    <div className="flex flex-col justify-center items-center w-6 h-6">
                        <span className={`block w-6 h-0.5 bg-white transition-all duration-300 ${mobileMenuOpen ? 'rotate-45 translate-y-1.5' : ''}`}></span>
                        <span className={`block w-6 h-0.5 bg-white mt-1 transition-all duration-300 ${mobileMenuOpen ? 'opacity-0' : ''}`}></span>
                        <span className={`block w-6 h-0.5 bg-white mt-1 transition-all duration-300 ${mobileMenuOpen ? '-rotate-45 -translate-y-1.5' : ''}`}></span>
                    </div>
                </button>
            </nav>

            {/* Mobile Menu Overlay */}
            <div
                className={`fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden transition-opacity duration-300 ${mobileMenuOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
                    }`}
                onClick={() => setMobileMenuOpen(false)}
            />

            {/* Mobile Menu */}
            <div
                ref={mobileMenuRef}
                className={`fixed top-0 right-0 h-full w-80 max-w-[85vw] bg-gray-900/95 backdrop-blur-md border-l border-gray-800/50 z-50 lg:hidden transform transition-transform duration-300 ease-in-out ${mobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
                    }`}
            >
                <div className="flex flex-col p-6 pt-20">
                    {/* Mobile Navigation Links */}
                    <div className="space-y-4 mb-8">
                        {navLinks.map((link, index) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                className={`block font-playfair text-lg py-3 px-4 rounded-lg transition-all duration-200 ${pathname === link.href
                                        ? 'text-yellow-400 bg-yellow-500/10 border-l-4 border-yellow-400'
                                        : 'text-white hover:text-yellow-400 hover:bg-gray-800/50'
                                    }`}
                                style={{ animationDelay: `${index * 50}ms` }}
                                onClick={() => setMobileMenuOpen(false)}
                            >
                                {link.label}
                            </Link>
                        ))}
                        {/* Mobile Find Us Link */}
                        <Link
                            href="/findus"
                            className={`block font-playfair text-lg py-3 px-4 rounded-lg transition-all duration-200 ${pathname === '/findus'
                                    ? 'text-yellow-400 bg-yellow-500/10 border-l-4 border-yellow-400'
                                    : 'text-white hover:text-yellow-400 hover:bg-gray-800/50'
                                }`}
                            style={{ animationDelay: '200ms' }}
                            onClick={() => setMobileMenuOpen(false)}
                        >
                            Find Us
                        </Link>
                        {/* Mobile Garage Link */}
                        <Link
                            href="/garage"
                            className={`block font-playfair text-lg py-3 px-4 rounded-lg transition-all duration-200 ${pathname === '/garage'
                                    ? 'text-yellow-400 bg-yellow-500/10 border-l-4 border-yellow-400'
                                    : 'text-white hover:text-yellow-400 hover:bg-gray-800/50'
                                }`}
                            style={{ animationDelay: '200ms' }}
                            onClick={() => setMobileMenuOpen(false)}
                        >
                            <div className="flex items-center gap-3">
                                <img
                                    src="/img/garageicone.png"
                                    alt="Garage"
                                    className="w-6 h-6"
                                />
                                <span>Garage</span>
                            </div>
                        </Link>
                    </div>

                    {/* Mobile User Profile or Login */}
                    {user ? (
                        <div className="border-t border-gray-800/50 pt-6">
                            <div className="flex items-center gap-3 mb-4 p-4 bg-gray-800/50 rounded-lg">
                                <span className="flex items-center justify-center w-12 h-12 rounded-full bg-yellow-500 text-black font-bold text-lg">
                                    {getInitials(user.name || user.phone || "U")}
                                </span>
                                <div className="flex flex-col">
                                    <span className="font-bold text-white">
                                        {user.name || user.phone || "User"}
                                    </span>
                                    <span className="text-sm text-gray-400 capitalize">
                                        {user.role || "User"}
                                    </span>
                                </div>
                            </div>
                            <button
                                className="w-full text-center py-3 px-4 text-red-400 font-medium hover:bg-red-500/10 hover:text-red-300 transition-colors duration-200 rounded-lg focus:outline-none focus:bg-red-500/10"
                                onClick={handleLogout}
                            >
                                Logout
                            </button>
                        </div>
                    ) : (
                        <div className="border-t border-gray-800/50 pt-6">
                            <Link href={`/login?redirect=${pathname}`}>
                                <button
                                    className="w-full font-playfair bg-yellow-600 hover:bg-yellow-500 py-3 px-4 text-white rounded-lg shadow-md transition-all duration-200 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-yellow-500/50"
                                    onClick={() => setMobileMenuOpen(false)}
                                >
                                    Login
                                </button>
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}