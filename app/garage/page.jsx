"use client"
import { getApiUrl } from '@/lib/api-config';
import React, { useState, useEffect } from "react";
import Navbar from "../components/homepage/navbar";
import FooterSection from "../components/homepage/footer";
import Link from "next/link";
// Favorites will be loaded per-user from the API
import { decodeJWT } from "@/lib/utils";
import { useRouter } from "next/navigation";

export default function Garage() {
  const router = useRouter();
  // State to track which tab is active (0 = Bookings, 1 = Favorites)
  const [activeTab, setActiveTab] = useState(0);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Helper function to get status badge styling
  const getStatusBadge = (status) => {
    const statusStyles = {
      "Accepted": "bg-green-500 text-white",
      "Pending": "bg-yellow-400 text-black",
      "Rejected": "bg-red-500 text-white"
    };

    return `${statusStyles[status] || "bg-gray-500"} px-3 py-1 rounded-full text-sm font-semibold`;
  };

  const [favoritesCars, setFavoritesCars] = useState([]);

  // Fetch bookings for the logged-in user
  useEffect(() => {
    const fetchBookings = async () => {
      setLoading(true);
      setError("");
      try {
        const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
        if (!token) {
          // Redirect to login if no token
          router.push('/login?redirect=/garage');
          return;
        }
        // Debug: log token and decoded user
        try {
          const user = decodeJWT(token);
          console.log('Decoded user:', user);
        } catch (e) {
          console.log('Failed to decode token:', e);
        }
        const res = await fetch(getApiUrl("/api/requests/my"), {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (!res.ok) {
          const data = await res.json();
          setError(data.error || "Failed to fetch bookings.");
          setLoading(false);
          return;
        }
        const data = await res.json();
        setBookings(data);
        // Also fetch favorites for this user
        try {
          const favRes = await fetch(getApiUrl('/api/favorites'), { credentials: 'include' });
          const favData = await favRes.json();
          setFavoritesCars(favData.favorites || []);
        } catch (_e) { }
      } catch (err) {
        setError("Failed to fetch bookings.");
      } finally {
        setLoading(false);
      }
    };
    fetchBookings();
  }, [router]);

  return (
    <div className="bg-black min-h-screen">
      <Navbar />
      <div className="container-responsive-xl pb-16">
        {/* Header */}
        <div className="flex flex-col items-center my-10">
          <h1 className="font-playfair text-4xl md:text-5xl text-white">
            Your Dream <span className="text-yellow-500">Garage</span>
          </h1>
          <h2 className="font-playfair text-lg md:text-xl text-gray-300 text-center mt-3">
            View your selected cars and favorites
            <br /> Manage your rentals and get ready to drive in style.
          </h2>
        </div>

        {/* Tabs */}
        <div className="flex justify-center mb-10">
          <div className="border-b border-gray-700 flex space-x-8">
            <button
              onClick={() => setActiveTab(0)}
              className={`pb-4 relative font-bruno text-2xl transition-colors duration-300 ${activeTab === 0 ? "text-yellow-500" : "text-white hover:text-yellow-400"
                }`}
            >
              Bookings
              {activeTab === 0 && (
                <div className="absolute bottom-0 left-0 w-full h-1 bg-yellow-500 rounded-t-md"></div>
              )}
            </button>
            <button
              onClick={() => setActiveTab(1)}
              className={`pb-4 relative font-bruno text-2xl transition-colors duration-300 ${activeTab === 1 ? "text-yellow-500" : "text-white hover:text-yellow-400"
                }`}
            >
              Favorites
              {activeTab === 1 && (
                <div className="absolute bottom-0 left-0 w-full h-1 bg-yellow-500 rounded-t-md"></div>
              )}
            </button>
          </div>
        </div>

        {/* Content based on active tab */}
        {activeTab === 0 ? (
          // Bookings Tab Content
          <div className="space-y-8">
            {loading ? (
              <div className="flex flex-col items-center py-16">
                <div className="text-gray-500 text-6xl mb-6">🚗</div>
                <h3 className="text-white text-xl font-bruno">Loading...</h3>
              </div>
            ) : error ? (
              <div className="flex flex-col items-center py-16">
                <div className="text-red-500 text-6xl mb-6">❌</div>
                <h3 className="text-white text-xl font-bruno">{error}</h3>
                <button
                  className="mt-6 px-6 py-2 bg-gradient-to-r from-[#FFBB00] to-[#FF9D00] text-black rounded-3xl font-bruno"
                  onClick={() => router.push('/login?redirect=/garage')}
                >
                  Login
                </button>
              </div>
            ) : bookings.length > 0 ? (
              bookings.map((booking, index) => (
                <div
                  key={`booking-${booking._id || index}`}
                  className="bg-[#121212] rounded-xl overflow-hidden shadow-md shadow-yellow-500"
                >
                  {/* Booking Info Section - Hidden on Desktop */}
                  <div className="px-6 py-4 border-b border-gray-800 lg:hidden">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-bruno text-yellow-400 text-base">Booking Info</h3>
                      <span className={getStatusBadge(booking.status)}>
                        {booking.status}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                      <div>
                        <p className="text-gray-400 text-xs">From</p>
                        <p className="text-white font-bruno text-sm">{booking.dateFrom ? new Date(booking.dateFrom).toLocaleDateString() : '-'}</p>
                      </div>
                      <div>
                        <p className="text-gray-400 text-xs">To</p>
                        <p className="text-white font-bruno text-sm">{booking.dateTo ? new Date(booking.dateTo).toLocaleDateString() : '-'}</p>
                      </div>
                      <div>
                        <p className="text-gray-400 text-xs">Total</p>
                        <p className="text-white font-bruno">
                          {typeof booking.totalPrice === 'number' && !isNaN(booking.totalPrice) && booking.totalPrice > 0
                            ? `AED ${booking.totalPrice.toLocaleString()}`
                            : (typeof booking.price === 'number' && !isNaN(booking.price) && booking.price > 0
                              ? `AED ${booking.price.toLocaleString()}`
                              : (booking.carId?.pricing?.daily && !isNaN(Number(booking.carId.pricing.daily)) && Number(booking.carId.pricing.daily) > 0
                                ? `AED ${Number(booking.carId.pricing.daily).toLocaleString()}`
                                : '-'))}
                          <span className="text-sm text-gray-500">{booking.totalDays ? ` for ${booking.totalDays} day${booking.totalDays > 1 ? 's' : ''}` : ''}</span>
                        </p>
                      </div>
                    </div>

                    <div className="flex justify-center">
                      <button className={`px-6 py-2 rounded-3xl font-bruno text-sm ${booking.status === "Accepted"
                          ? "bg-gradient-to-r from-[#FFBB00] to-[#FF9D00] text-black"
                          : "bg-gray-800 text-white hover:bg-gray-700"
                        }`}>
                        {booking.status === "Accepted" ? "TRACK ORDER" :
                          booking.status === "Pending" ? "VIEW DETAILS" : "BOOK AGAIN"}
                      </button>
                    </div>
                  </div>

                  {/* Enhanced Car Card - Using cars page design */}
                  <div className="p-4">
                    <div className="bg-[#171616] rounded-xl overflow-hidden shadow-lg hover:shadow-amber-500/10 transition-shadow duration-300">
                      {/* Mobile Layout (Portrait - Stacked) */}
                      <div className="block md:hidden">
                        {/* Mobile Image */}
                        <div className="relative w-full h-56 overflow-hidden rounded-t-lg group transition-all duration-500">
                          <img
                            src={booking.carId?.mainImage || booking.image || '/img/default-car.jpg'}
                            alt={booking.carId?.title || booking.title}
                            className="w-full h-full object-cover transform transition-transform duration-500 group-hover:scale-105"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-[#141215]/50 to-transparent z-10 transition-opacity duration-500 group-hover:opacity-15 opacity-75" />
                          <div
                            className="absolute inset-0 z-20 pointer-events-none transition-all duration-500"
                            style={{ boxShadow: 'inset 0 0 100px 41px #141215' }}
                          />
                          <div
                            className="absolute inset-0 z-20 pointer-events-none opacity-0 group-hover:opacity-50 transition-opacity duration-500"
                            style={{ boxShadow: 'inset 0 0 30px 10px #141215' }}
                          />
                        </div>

                        {/* Mobile Content */}
                        <div className="p-4">
                          {/* Title and Logo */}
                          <div className="flex items-center mb-3">
                            {booking.carId?.logo && (
                              <img src={booking.carId.logo} alt="logo" className="h-8 w-8 mr-3 object-contain" />
                            )}
                            <h3 className="text-lg font-bold text-white font-bruno truncate">
                              {booking.carId?.title || booking.title || `${booking.carId?.brand} ${booking.carId?.model}`}
                            </h3>
                          </div>

                          {/* Features List */}
                          <ul className="text-xs text-gray-300 space-y-1 mb-4">
                            {(booking.carId?.features || booking.features || []).slice(0, 4).map((feature, index) => (
                              <li key={index} className="tracking-wide uppercase text-[10px]">
                                {feature}
                              </li>
                            ))}
                          </ul>

                          {/* Horizontal Specs for Mobile */}
                          <div className="flex bg-[#232323] border border-gray-600 rounded-2xl w-full h-16 overflow-hidden mb-4">
                            {[0, 1, 2].map((i) => (
                              <div key={i} className={`flex flex-col items-center justify-center flex-1 py-2 ${i < 2 ? 'border-r border-gray-600' : ''}`}>
                                <img
                                  src={booking.carId?.specs && booking.carId.specs[i] && booking.carId.specs[i].icon ? booking.carId.specs[i].icon :
                                    i === 0 ? '/img/car-engine.png' :
                                      i === 1 ? '/img/big-black-horse-walking-side-silhouette-avec-queue-et-un-pied-vers-le-haut.png' :
                                        '/img/fuel-station.png'}
                                  alt={booking.carId?.specs && booking.carId.specs[i] && booking.carId.specs[i].label}
                                  className="h-4 mb-1"
                                />
                                <span className="text-xs font-bold text-white">
                                  {booking.carId?.specs && booking.carId.specs[i] && booking.carId.specs[i].label ? booking.carId.specs[i].label : '-'}
                                  {i === 1 && <span className="text-[10px] font-normal ml-1">HP</span>}
                                  {i === 2 && <span className="text-[10px] font-normal ml-1">L</span>}
                                </span>
                              </div>
                            ))}
                          </div>

                          {/* Price and Button */}
                          <div className="flex justify-between items-center">
                            <div>
                              <span className="text-amber-400 text-xl font-bruno">
                                {(booking.carId?.pricing?.daily || booking.price) + " $"}
                              </span>
                              <span className="text-xs text-gray-400 block">PER DAY</span>
                            </div>
                            <button className="font-bruno text-sm text-black py-3 px-6 bg-gradient-to-r from-[#FFBB00] to-[#FF9D00] hover:opacity-90 transition duration-300 rounded-full shadow-md">
                              {booking.status?.toLowerCase() === "accepted" ? "BOOKED" :
                                booking.status?.toLowerCase() === "pending" ? "PENDING" : "REJECTED"}
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* Tablet Layout (Horizontal) */}
                      <div className="hidden md:flex lg:hidden">
                        {/* Tablet Image */}
                        <div className="relative w-2/5 overflow-hidden rounded-l-lg group transition-all duration-500">
                          <img
                            src={booking.carId?.mainImage || booking.image || '/img/default-car.jpg'}
                            alt={booking.carId?.title || booking.title}
                            className="w-full h-full object-cover transform transition-transform duration-500 group-hover:scale-105"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-[#141215]/50 to-transparent z-10 transition-opacity duration-500 group-hover:opacity-15 opacity-75" />
                          <div
                            className="absolute inset-0 z-20 pointer-events-none transition-all duration-500"
                            style={{ boxShadow: 'inset 0 0 100px 41px #141215' }}
                          />
                          <div
                            className="absolute inset-0 z-20 pointer-events-none opacity-0 group-hover:opacity-50 transition-opacity duration-500"
                            style={{ boxShadow: 'inset 0 0 30px 10px #141215' }}
                          />
                        </div>

                        {/* Tablet Content Container */}
                        <div className="flex-1 p-4 flex">
                          {/* Left Side: Car Info */}
                          <div className="flex-1 text-white font-bruno">
                            <div className="flex items-center mb-3">
                              {booking.carId?.logo && (
                                <img src={booking.carId.logo} alt="logo" className="h-10 w-10 mr-3 object-contain" />
                              )}
                              <h3 className="text-xl font-bold truncate">
                                {booking.carId?.title || booking.title || `${booking.carId?.brand} ${booking.carId?.model}`}
                              </h3>
                            </div>

                            <ul className="text-sm text-gray-300 space-y-1">
                              {(booking.carId?.features || booking.features || []).slice(0, 4).map((feature, index) => (
                                <li key={index} className="tracking-wide uppercase text-xs">
                                  {feature}
                                </li>
                              ))}
                            </ul>
                          </div>

                          {/* Center: Vertical Specs */}
                          <div className="flex justify-center items-center mx-4">
                            <div className="flex flex-col bg-[#232323] border border-gray-600 rounded-2xl w-20 h-48 overflow-hidden">
                              {[0, 1, 2].map((i) => (
                                <div key={i} className={`flex flex-col items-center justify-center flex-1 py-2 ${i < 2 ? 'border-b border-gray-600' : ''}`} style={{ minHeight: '48px' }}>
                                  <img
                                    src={booking.carId?.specs && booking.carId.specs[i] && booking.carId.specs[i].icon ? booking.carId.specs[i].icon :
                                      i === 0 ? '/img/car-engine.png' :
                                        i === 1 ? '/img/big-black-horse-walking-side-silhouette-avec-queue-et-un-pied-vers-le-haut.png' :
                                          '/img/fuel-station.png'}
                                    alt={booking.carId?.specs && booking.carId.specs[i] && booking.carId.specs[i].label}
                                    className="h-5 mb-1"
                                  />
                                  <span className="text-sm font-bold text-white text-center">
                                    {booking.carId?.specs && booking.carId.specs[i] && booking.carId.specs[i].label ? booking.carId.specs[i].label : '-'}
                                    {i === 1 && <span className="text-xs font-normal ml-1">HP</span>}
                                    {i === 2 && <span className="text-xs font-normal ml-1">L</span>}
                                  </span>
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* Right Side: Price and Button */}
                          <div className="flex flex-col justify-center items-end text-right font-bruno min-w-[150px]">
                            <div className="mb-4">
                              <span className="text-amber-400 text-xl font-bruno block">
                                {(booking.carId?.pricing?.daily || booking.price) + " $"}
                              </span>
                              <span className="text-xs text-gray-400">PER DAY</span>
                            </div>
                            <button className="font-bruno text-sm text-black py-3 px-6 bg-gradient-to-r from-[#FFBB00] to-[#FF9D00] hover:opacity-90 transition duration-300 rounded-full shadow-md">
                              {booking.status?.toLowerCase() === "accepted" ? "BOOKED" :
                                booking.status?.toLowerCase() === "pending" ? "PENDING" : "REJECTED"}
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* Desktop Layout (Original) */}
                      <div className="hidden lg:flex h-[230px]">
                        {/* Desktop Booking Info - Left Side */}
                        <div className="w-[20%] flex flex-col justify-center items-center text-white font-bruno border-r border-gray-700 pr-4">
                          <div className="text-center">
                            <h4 className="text-yellow-400 text-sm font-bold mb-3">BOOKING INFO</h4>
                            <div className="space-y-3">
                              <div>
                                <p className="text-gray-400 text-xs">From</p>
                                <p className="text-white text-sm">{booking.dateFrom ? new Date(booking.dateFrom).toLocaleDateString() : '-'}</p>
                              </div>
                              <div>
                                <p className="text-gray-400 text-xs">To</p>
                                <p className="text-white text-sm">{booking.dateTo ? new Date(booking.dateTo).toLocaleDateString() : '-'}</p>
                              </div>
                              <div>
                                <p className="text-gray-400 text-xs">Total</p>
                                <p className="text-white text-sm">
                                  {typeof booking.totalPrice === 'number' && !isNaN(booking.totalPrice) && booking.totalPrice > 0
                                    ? `AED ${booking.totalPrice.toLocaleString()}`
                                    : (typeof booking.price === 'number' && !isNaN(booking.price) && booking.price > 0
                                      ? `AED ${booking.price.toLocaleString()}`
                                      : (booking.carId?.pricing?.daily && !isNaN(Number(booking.carId.pricing.daily)) && Number(booking.carId.pricing.daily) > 0
                                        ? `AED ${Number(booking.carId.pricing.daily).toLocaleString()}`
                                        : '-'))}
                                </p>
                                <p className="text-gray-500 text-xs">{booking.totalDays ? `for ${booking.totalDays} day${booking.totalDays > 1 ? 's' : ''}` : ''}</p>
                              </div>
                            </div>
                            <div className="mt-4">
                              <span className={getStatusBadge(booking.status)}>
                                {booking.status}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Desktop Image */}
                        <div className="relative w-[30%] overflow-hidden rounded-lg group transition-all duration-500">
                          <img
                            src={booking.carId?.mainImage || booking.image || '/img/default-car.jpg'}
                            alt={booking.carId?.title || booking.title}
                            className="w-full h-full object-cover transform transition-transform duration-500 group-hover:scale-105"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-[#141215]/50 to-transparent z-10 transition-opacity duration-500 group-hover:opacity-15 opacity-75" />
                          <div
                            className="absolute inset-0 z-20 pointer-events-none transition-all duration-500"
                            style={{ boxShadow: 'inset 0 0 100px 41px #141215' }}
                          />
                          <div
                            className="absolute inset-0 z-20 pointer-events-none opacity-0 group-hover:opacity-50 transition-opacity duration-500"
                            style={{ boxShadow: 'inset 0 0 30px 10px #141215' }}
                          />
                        </div>

                        {/* Desktop Specs */}
                        <div className="pl-3 flex flex-col items-center justify-center text-white h-full">
                          <div className="flex flex-col bg-[#232323] border border-gray-600 rounded-2xl w-20 h-[230px] overflow-hidden">
                            {[0, 1, 2].map((i) => (
                              <div key={i} className={`flex flex-col items-center justify-center flex-1 py-1 ${i < 2 ? 'border-b border-gray-600' : ''}`} style={{ minHeight: '80px' }}>
                                <img
                                  src={booking.carId?.specs && booking.carId.specs[i] && booking.carId.specs[i].icon ? booking.carId.specs[i].icon :
                                    i === 0 ? '/img/car-engine.png' :
                                      i === 1 ? '/img/big-black-horse-walking-side-silhouette-avec-queue-et-un-pied-vers-le-haut.png' :
                                        '/img/fuel-station.png'}
                                  alt={booking.carId?.specs && booking.carId.specs[i] && booking.carId.specs[i].label}
                                  className="h-7 mb-1"
                                />
                                <span className="text-sm font-bold text-white">
                                  {booking.carId?.specs && booking.carId.specs[i] && booking.carId.specs[i].label ? booking.carId.specs[i].label : '-'}
                                  {i === 1 && <span className="text-xs font-normal ml-1">HP</span>}
                                  {i === 2 && <span className="text-xs font-normal ml-1">L</span>}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Desktop Info */}
                        <div className="w-[35%] pb-6 mt-4 text-white font-bruno flex flex-col justify-between">
                          <div>
                            <div className="flex items-center mb-4">
                              {booking.carId?.logo && <img src={booking.carId.logo} alt="logo" className="h-12 w-12 mx-4 object-contain" />}
                              <h3 className="text-xl font-bold">{booking.carId?.title || booking.title}</h3>
                            </div>
                            <ul className="text-sm text-gray-300 space-y-1 mb-6 ml-7">
                              {(booking.carId?.features || booking.features || []).map((feature, index) => (
                                <li key={index} className="tracking-wide uppercase text-[10px]">
                                  {feature}
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>

                        {/* Desktop Price and Button */}
                        <div className="text-right font-bruno flex-col flex mt-10 mr-3">
                          <span className="text-amber-400 text-xl mr-3 font-bruno">
                            {(booking.carId?.pricing?.daily || booking.price) + " $"}
                          </span>
                          <span className="text-xs text-gray-400 mr-1">PER DAY</span>
                          <button className="font-bruno w-32 text-xs text-black py-2 bg-gradient-to-r from-[#FFBB00] to-[#FF9D00] hover:opacity-90 transition duration-300 rounded-3xl mt-20 shadow-md">
                            {booking.status?.toLowerCase() === "accepted" ? "BOOKED" :
                              booking.status?.toLowerCase() === "pending" ? "PENDING" : "REJECTED"}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="flex flex-col items-center py-16">
                <div className="text-gray-500 text-6xl mb-6">🚗</div>
                <h3 className="text-white text-xl font-bruno">No bookings yet</h3>
                <p className="text-gray-400 mt-2 text-center">
                  Start browsing our collection and book your dream car
                </p>
                <Link href="/cars">
                  <button className="mt-6 px-6 py-2 bg-gradient-to-r from-[#FFBB00] to-[#FF9D00] text-black rounded-3xl font-bruno">
                    BROWSE CARS
                  </button>
                </Link>
              </div>
            )}
          </div>
        ) : (
          // Favorites Tab Content
          <div className="space-y-6 md:space-y-10">
            {favoritesCars.length > 0 ? (
              favoritesCars.map((car) => (
                <div
                  key={`favorite-${car._id || car.id}`}
                  className="bg-[#171616] rounded-xl overflow-hidden shadow-lg hover:shadow-amber-500/10 transition-shadow duration-300 mx-2 lg:mx-0"
                >
                  {/* Mobile Layout (Portrait - Stacked) */}
                  <div className="block md:hidden">
                    {/* Mobile Image */}
                    <div className="relative w-full h-56 overflow-hidden rounded-t-lg group transition-all duration-500">
                      <img
                        src={car.mainImage || car.image || '/img/default-car.jpg'}
                        alt={car.title}
                        className="w-full h-full object-cover transform transition-transform duration-500 group-hover:scale-105"
                      />
                      {/* Favorite Button */}
                      <button className="absolute top-3 right-3 z-30 bg-black/60 hover:bg-black/80 p-2 rounded-full">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="h-5 w-5">
                          <path
                            d="M12 21s-6.716-4.238-9.193-6.716C.804 12.28.5 9.5 2.343 7.657a5 5 0 017.071 0L12 10.243l2.586-2.586a5 5 0 017.071 7.071C18.716 16.762 12 21 12 21z"
                            className="fill-red-500"
                            strokeWidth="2"
                            stroke="currentColor"
                          />
                        </svg>
                      </button>
                      <div className="absolute inset-0 bg-gradient-to-t from-[#141215]/50 to-transparent z-10 transition-opacity duration-500 group-hover:opacity-15 opacity-75" />
                      <div
                        className="absolute inset-0 z-20 pointer-events-none transition-all duration-500"
                        style={{ boxShadow: 'inset 0 0 100px 41px #141215' }}
                      />
                      <div
                        className="absolute inset-0 z-20 pointer-events-none opacity-0 group-hover:opacity-50 transition-opacity duration-500"
                        style={{ boxShadow: 'inset 0 0 30px 10px #141215' }}
                      />
                    </div>

                    {/* Mobile Content */}
                    <div className="p-4">
                      {/* Title and Logo */}
                      <div className="flex items-center mb-3">
                        {car.logo && (
                          <img src={car.logo} alt="logo" className="h-8 w-8 mr-3 object-contain" />
                        )}
                        <h3 className="text-lg font-bold text-white font-bruno truncate">
                          {car.title || `${car.brand} ${car.model}`}
                        </h3>
                      </div>

                      {/* Features List */}
                      <ul className="text-xs text-gray-300 space-y-1 mb-4">
                        {car.features?.slice(0, 4).map((feature, index) => (
                          <li key={index} className="tracking-wide uppercase text-[10px]">
                            {feature}
                          </li>
                        ))}
                      </ul>

                      {/* Horizontal Specs for Mobile */}
                      <div className="flex bg-[#232323] border border-gray-600 rounded-2xl w-full h-16 overflow-hidden mb-4">
                        {[0, 1, 2].map((i) => (
                          <div key={i} className={`flex flex-col items-center justify-center flex-1 py-2 ${i < 2 ? 'border-r border-gray-600' : ''}`}>
                            <img
                              src={car.specs && car.specs[i] && car.specs[i].icon ? car.specs[i].icon :
                                i === 0 ? '/img/car-engine.png' :
                                  i === 1 ? '/img/big-black-horse-walking-side-silhouette-avec-queue-et-un-pied-vers-le-haut.png' :
                                    '/img/fuel-station.png'}
                              alt={car.specs && car.specs[i] && car.specs[i].label}
                              className="h-4 mb-1"
                            />
                            <span className="text-xs font-bold text-white">
                              {car.specs && car.specs[i] && car.specs[i].label ? car.specs[i].label : '-'}
                              {i === 1 && <span className="text-[10px] font-normal ml-1">HP</span>}
                              {i === 2 && <span className="text-[10px] font-normal ml-1">L</span>}
                            </span>
                          </div>
                        ))}
                      </div>

                      {/* Price and Button */}
                      <div className="flex justify-between items-center">
                        <div>
                          <span className="text-amber-400 text-xl font-bruno">
                            {(car.pricing?.daily || car.price) + " $"}
                          </span>
                          <span className="text-xs text-gray-400 block">PER DAY</span>
                        </div>
                        <Link href={`/cars/${car._id}`}>
                          <button className="font-bruno text-sm text-black py-3 px-6 bg-gradient-to-r from-[#FFBB00] to-[#FF9D00] hover:opacity-90 transition duration-300 rounded-full shadow-md">
                            BOOK NOW!
                          </button>
                        </Link>
                      </div>
                    </div>
                  </div>

                  {/* Tablet Layout (Horizontal) */}
                  <div className="hidden md:flex lg:hidden">
                    {/* Tablet Image */}
                    <div className="relative w-2/5 overflow-hidden rounded-l-lg group transition-all duration-500">
                      <img
                        src={car.mainImage || car.image || '/img/default-car.jpg'}
                        alt={car.title}
                        className="w-full h-full object-cover transform transition-transform duration-500 group-hover:scale-105"
                      />
                      {/* Favorite Button */}
                      <button className="absolute top-3 right-3 z-30 bg-black/60 hover:bg-black/80 p-2 rounded-full">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="h-5 w-5">
                          <path
                            d="M12 21s-6.716-4.238-9.193-6.716C.804 12.28.5 9.5 2.343 7.657a5 5 0 017.071 0L12 10.243l2.586-2.586a5 5 0 017.071 7.071C18.716 16.762 12 21 12 21z"
                            className="fill-red-500"
                            strokeWidth="2"
                            stroke="currentColor"
                          />
                        </svg>
                      </button>
                      <div className="absolute inset-0 bg-gradient-to-t from-[#141215]/50 to-transparent z-10 transition-opacity duration-500 group-hover:opacity-15 opacity-75" />
                      <div
                        className="absolute inset-0 z-20 pointer-events-none transition-all duration-500"
                        style={{ boxShadow: 'inset 0 0 100px 41px #141215' }}
                      />
                      <div
                        className="absolute inset-0 z-20 pointer-events-none opacity-0 group-hover:opacity-50 transition-opacity duration-500"
                        style={{ boxShadow: 'inset 0 0 30px 10px #141215' }}
                      />
                    </div>

                    {/* Tablet Content Container */}
                    <div className="flex-1 p-4 flex">
                      {/* Left Side: Car Info */}
                      <div className="flex-1 text-white font-bruno">
                        <div className="flex items-center mb-3">
                          {car.logo && (
                            <img src={car.logo} alt="logo" className="h-10 w-10 mr-3 object-contain" />
                          )}
                          <h3 className="text-xl font-bold truncate">
                            {car.title || `${car.brand} ${car.model}`}
                          </h3>
                        </div>

                        <ul className="text-sm text-gray-300 space-y-1">
                          {car.features?.slice(0, 4).map((feature, index) => (
                            <li key={index} className="tracking-wide uppercase text-xs">
                              {feature}
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Center: Vertical Specs */}
                      <div className="flex justify-center items-center mx-4">
                        <div className="flex flex-col bg-[#232323] border border-gray-600 rounded-2xl w-20 h-48 overflow-hidden">
                          {[0, 1, 2].map((i) => (
                            <div key={i} className={`flex flex-col items-center justify-center flex-1 py-2 ${i < 2 ? 'border-b border-gray-600' : ''}`} style={{ minHeight: '48px' }}>
                              <img
                                src={car.specs && car.specs[i] && car.specs[i].icon ? car.specs[i].icon :
                                  i === 0 ? '/img/car-engine.png' :
                                    i === 1 ? '/img/big-black-horse-walking-side-silhouette-avec-queue-et-un-pied-vers-le-haut.png' :
                                      '/img/fuel-station.png'}
                                alt={car.specs && car.specs[i] && car.specs[i].label}
                                className="h-5 mb-1"
                              />
                              <span className="text-sm font-bold text-white text-center">
                                {car.specs && car.specs[i] && car.specs[i].label ? car.specs[i].label : '-'}
                                {i === 1 && <span className="text-xs font-normal ml-1">HP</span>}
                                {i === 2 && <span className="text-xs font-normal ml-1">L</span>}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Right Side: Price and Button */}
                      <div className="flex flex-col justify-center items-end text-right font-bruno min-w-[150px]">
                        <div className="mb-4">
                          <span className="text-amber-400 text-xl font-bruno block">
                            {(car.pricing?.daily || car.price) + " $"}
                          </span>
                          <span className="text-xs text-gray-400">PER DAY</span>
                        </div>
                        <Link href={`/cars/${car._id}`}>
                          <button className="font-bruno text-sm text-black py-3 px-6 bg-gradient-to-r from-[#FFBB00] to-[#FF9D00] hover:opacity-90 transition duration-300 rounded-full shadow-md">
                            BOOK NOW!
                          </button>
                        </Link>
                      </div>
                    </div>
                  </div>

                  {/* Desktop Layout (Original) */}
                  <div className="hidden lg:flex h-[230px]">
                    {/* Desktop Image */}
                    <div className="relative w-[42%] overflow-hidden rounded-lg group transition-all duration-500">
                      <img
                        src={car.mainImage || car.image || '/img/default-car.jpg'}
                        alt={car.title}
                        className="w-full h-full object-cover transform transition-transform duration-500 group-hover:scale-105"
                      />
                      {/* Favorite Button */}
                      <button className="absolute top-3 right-3 z-30 bg-black/60 hover:bg-black/80 p-2 rounded-full">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="h-5 w-5">
                          <path
                            d="M12 21s-6.716-4.238-9.193-6.716C.804 12.28.5 9.5 2.343 7.657a5 5 0 017.071 0L12 10.243l2.586-2.586a5 5 0 017.071 7.071C18.716 16.762 12 21 12 21z"
                            className="fill-red-500"
                            strokeWidth="2"
                            stroke="currentColor"
                          />
                        </svg>
                      </button>
                      <div className="absolute inset-0 bg-gradient-to-t from-[#141215]/50 to-transparent z-10 transition-opacity duration-500 group-hover:opacity-15 opacity-75" />
                      <div
                        className="absolute inset-0 z-20 pointer-events-none transition-all duration-500"
                        style={{ boxShadow: 'inset 0 0 100px 41px #141215' }}
                      />
                      <div
                        className="absolute inset-0 z-20 pointer-events-none opacity-0 group-hover:opacity-50 transition-opacity duration-500"
                        style={{ boxShadow: 'inset 0 0 30px 10px #141215' }}
                      />
                    </div>

                    {/* Desktop Specs */}
                    <div className="pl-3 flex flex-col items-center justify-center text-white h-full">
                      <div className="flex flex-col bg-[#232323] border border-gray-600 rounded-2xl w-20 h-[230px] overflow-hidden">
                        {[0, 1, 2].map((i) => (
                          <div key={i} className={`flex flex-col items-center justify-center flex-1 py-1 ${i < 2 ? 'border-b border-gray-600' : ''}`} style={{ minHeight: '80px' }}>
                            <img
                              src={car.specs && car.specs[i] && car.specs[i].icon ? car.specs[i].icon :
                                i === 0 ? '/img/car-engine.png' :
                                  i === 1 ? '/img/big-black-horse-walking-side-silhouette-avec-queue-et-un-pied-vers-le-haut.png' :
                                    '/img/fuel-station.png'}
                              alt={car.specs && car.specs[i] && car.specs[i].label}
                              className="h-7 mb-1"
                            />
                            <span className="text-sm font-bold text-white">
                              {car.specs && car.specs[i] && car.specs[i].label ? car.specs[i].label : '-'}
                              {i === 1 && <span className="text-xs font-normal ml-1">HP</span>}
                              {i === 2 && <span className="text-xs font-normal ml-1">L</span>}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Desktop Info */}
                    <div className="w-[52%] pb-6 mt-4 text-white font-bruno flex flex-col justify-between">
                      <div>
                        <div className="flex items-center mb-4">
                          {car.logo && <img src={car.logo} alt="logo" className="h-12 w-12 mx-4 object-contain" />}
                          <h3 className="text-xl font-bold">{car.title}</h3>
                        </div>
                        <ul className="text-sm text-gray-300 space-y-1 mb-6 ml-7">
                          {car.features?.map((feature, index) => (
                            <li key={index} className="tracking-wide uppercase text-[10px]">
                              {feature}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    {/* Desktop Price and Button */}
                    <div className="text-right font-bruno flex-col flex mt-10 mr-3">
                      <span className="text-amber-400 text-xl mr-3 font-bruno">
                        {(car.pricing?.daily || car.price) + " $"}
                      </span>
                      <span className="text-xs text-gray-400 mr-1">PER DAY</span>
                      <Link href={`/cars/${car._id}`}>
                        <button className="font-bruno w-32 text-xs text-black py-2 bg-gradient-to-r from-[#FFBB00] to-[#FF9D00] hover:opacity-90 transition duration-300 rounded-3xl mt-20 shadow-md">
                          BOOK NOW!
                        </button>
                      </Link>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="flex flex-col items-center py-16">
                <div className="text-gray-500 text-6xl mb-6">❤️</div>
                <h3 className="text-white text-xl font-bruno">No favorites yet</h3>
                <p className="text-gray-400 mt-2 text-center">
                  Add cars to your favorites to keep track of them
                </p>
                <Link href="/cars">
                  <button className="mt-6 px-6 py-2 bg-gradient-to-r from-[#FFBB00] to-[#FF9D00] text-black rounded-3xl font-bruno">
                    EXPLORE CARS
                  </button>
                </Link>
              </div>
            )}
          </div>
        )}
      </div>
      <FooterSection />
    </div>
  );
}