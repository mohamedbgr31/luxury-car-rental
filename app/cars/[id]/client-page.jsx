"use client"
import { getApiUrl } from '@/lib/api-config';
import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import Navbar from "@/app/components/homepage/navbar";
import FooterSection from "@/app/components/homepage/footer";
import GalleryModal from "@/components/ui/gallery";
import { CalendarIcon, MessageSquare, PhoneCall, Check, ChevronLeft, ChevronRight, X, Send } from "lucide-react";
import { useParams } from "next/navigation";
import { decodeJWT } from "@/lib/utils";
import { motion } from "framer-motion";

// For demo purposes, we'll simulate the service call
// In your actual implementation, uncomment the line below:
import { submitRentalRequest } from "@/app/components/data/requestService";


const BookingModal = React.memo(({
    showBookingModal,
    setShowBookingModal,
    submitSuccess,
    handleSubmitBooking,
    car,
    startDate,
    endDate,
    calculateDays,
    rentalOption,
    calculatePrice,
    formatDisplayDate,
    customerName,
    setCustomerName,
    customerPhone,
    setCustomerPhone,
    customerMessage,
    setCustomerMessage,
    isSubmitting
}) => {
    // Compose car name as 'brand + model' if available
    const carName = car?.brand && car?.model ? `${car.brand} ${car.model}` : car?.title || '';
    return (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
            <div className="bg-zinc-900 rounded-2xl p-8 max-w-md w-full max-h-[90vh] overflow-y-auto">
                {submitSuccess ? (
                    <div className="text-center">
                        <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Check size={32} className="text-white" />
                        </div>
                        <h3 className="text-2xl font-bold text-white mb-2">Request Submitted!</h3>
                        <p className="text-gray-300 mb-4">We'll contact you within 24 hours to confirm your booking.</p>
                        <p className="text-sm text-gray-400">Closing automatically...</p>
                    </div>
                ) : (
                    <form onSubmit={handleSubmitBooking}>
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-2xl font-bold text-white">Complete Your Booking</h3>
                            <button
                                type="button"
                                onClick={() => setShowBookingModal(false)}
                                className="text-gray-400 hover:text-white"
                            >
                                <X size={24} />
                            </button>
                        </div>

                        {/* Booking Summary */}
                        <div className="bg-zinc-800 rounded-lg p-4 mb-6">
                            <h4 className="font-semibold text-white mb-2">Booking Summary</h4>
                            <div className="space-y-2 text-sm text-gray-300">
                                <div>Car: <span className="text-white">{carName}</span></div>
                                <div>Dates: <span className="text-white">{formatDisplayDate(startDate)} - {formatDisplayDate(endDate)}</span></div>
                                <div>Duration: <span className="text-white">{calculateDays()} days</span></div>
                                <div>Rental Type: <span className="text-white capitalize">{rentalOption}</span></div>
                                <div>Total: <span className="text-yellow-400 font-semibold">{calculatePrice()}</span></div>
                            </div>
                        </div>

                        {/* Customer Information */}
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">
                                    Full Name *
                                </label>
                                <input
                                    type="text"
                                    value={customerName}
                                    onChange={(e) => setCustomerName(e.target.value)}
                                    className="w-full bg-zinc-700 border border-zinc-600 rounded-lg py-3 px-4 text-white placeholder-gray-400 focus:outline-none focus:border-yellow-500"
                                    placeholder="Enter your full name"
                                    required
                                    autoComplete="name"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">
                                    Phone Number *
                                </label>
                                <input
                                    type="tel"
                                    value={customerPhone}
                                    onChange={(e) => setCustomerPhone(e.target.value)}
                                    className="w-full bg-zinc-700 border border-zinc-600 rounded-lg py-3 px-4 text-white placeholder-gray-400 focus:outline-none focus:border-yellow-500"
                                    placeholder="+971 50 123 4567"
                                    required
                                    autoComplete="tel"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">
                                    Additional Message
                                </label>
                                <textarea
                                    value={customerMessage}
                                    onChange={(e) => setCustomerMessage(e.target.value)}
                                    rows={4}
                                    className="w-full bg-zinc-700 border border-zinc-600 rounded-lg py-3 px-4 text-white placeholder-gray-400 focus:outline-none focus:border-yellow-500 resize-none"
                                    placeholder="Any special requests or questions..."
                                />
                            </div>
                        </div>

                        {/* Submit Button */}
                        <div className="flex gap-3 pt-4">
                            <button
                                type="button"
                                onClick={() => setShowBookingModal(false)}
                                className="flex-1 py-3 px-6 bg-zinc-700 hover:bg-zinc-600 text-white rounded-lg transition-colors"
                                disabled={isSubmitting}
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="flex-1 py-3 px-6 bg-gradient-to-r from-yellow-400 to-yellow-600 hover:from-yellow-500 hover:to-yellow-700 text-black font-bold rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                            >
                                {isSubmitting ? (
                                    <>
                                        <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
                                        Submitting...
                                    </>
                                ) : (
                                    <>
                                        <Send size={18} />
                                        Submit Request
                                    </>
                                )}
                            </button>
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
});


export default function CarDetailsClient({ id }) {
    const carId = id;
    const [car, setCar] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showGallery, setShowGallery] = useState(false);
    const [showBookingModal, setShowBookingModal] = useState(false);
    const [rentalOption, setRentalOption] = useState("daily");
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [showFaq, setShowFaq] = useState({});
    const [showStartCalendar, setShowStartCalendar] = useState(false);
    const [showEndCalendar, setShowEndCalendar] = useState(false);
    const [currentMonth, setCurrentMonth] = useState(new Date());
    const [selectedCalendar, setSelectedCalendar] = useState(null);
    const [logoData, setLogoData] = useState(null);
    // Booking form states
    const [customerName, setCustomerName] = useState("");
    const [customerPhone, setCustomerPhone] = useState("");
    const [customerMessage, setCustomerMessage] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitSuccess, setSubmitSuccess] = useState(false);
    const [favoriteIds, setFavoriteIds] = useState(new Set());

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

    // Fetch current user's favorites
    useEffect(() => {
        const fetchFavorites = async () => {
            try {
                const res = await fetch(getApiUrl('/api/favorites'), { credentials: 'include' });
                if (!res.ok) return;
                const data = await res.json();
                const ids = new Set((data.favorites || []).map((c) => c._id || c.id));
                setFavoriteIds(ids);
            } catch (e) {
                // ignore
            }
        };
        fetchFavorites();
    }, []);

    const toggleFavorite = async (carId) => {
        try {
            const res = await fetch(getApiUrl('/api/favorites'), {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({ carId }),
            });
            if (!res.ok) {
                // optionally redirect to login if 401
                return;
            }
            const data = await res.json();
            const ids = new Set((data.favorites || []).map((c) => c._id || c.id));
            setFavoriteIds(ids);
        } catch (e) {
            // ignore errors for now
        }
    };

    const handleShare = async () => {
        if (navigator.share) {
            try {
                await navigator.share({
                    title: `${car?.brand} ${car?.model} - Noble Car Rental`,
                    text: `Check out this amazing ${car?.brand} ${car?.model} available for rent!`,
                    url: window.location.href,
                });
            } catch (error) {
                console.log('Error sharing:', error);
            }
        } else {
            // Fallback: copy to clipboard
            try {
                await navigator.clipboard.writeText(window.location.href);
                alert('Link copied to clipboard!');
            } catch (error) {
                console.log('Error copying to clipboard:', error);
            }
        }
    };

    useEffect(() => {
        if (!carId) return;
        const fetchCar = async () => {
            try {
                setLoading(true);
                const res = await fetch(getApiUrl(`/api/cars/${carId}`));
                if (!res.ok) throw new Error("Car not found");
                const data = await res.json();
                setCar(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchCar();
    }, [carId]);

    const toggleFaq = (idx) => {
        setShowFaq(prev => ({ ...prev, [idx]: !prev[idx] }));
    };

    const handleBookNow = (e) => {
        e.preventDefault();
        // A real implementation would check for dates first
        setShowBookingModal(true);
    };

    const handleSubmitBooking = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        // Compose car name as 'brand + model' if available
        const carName = car?.brand && car?.model ? `${car.brand} ${car.model}` : car?.title || '';

        // Get user info from JWT
        let userId = null;
        let userPhone = null;
        if (typeof window !== 'undefined') {
            const token = localStorage.getItem('token');
            const user = decodeJWT(token);
            userId = user?.id || null;
            userPhone = user?.phone || null;
        }

        // Prepare the request data
        const requestData = {
            name: customerName,
            contact: customerPhone,
            car: carName,
            carId: car?._id,
            dateFrom: startDate,
            dateTo: endDate,
            totalDays: calculateDays(),
            rentalType: rentalOption,
            totalPrice: calculatePriceRaw(),
            message: customerMessage,
            status: "pending",
            urgent: false,
            userId,
            userPhone,
        };

        // Call the backend API
        const result = await submitRentalRequest(requestData);

        setIsSubmitting(false);

        if (result.success) {
            setSubmitSuccess(true);
            setTimeout(() => {
                setShowBookingModal(false);
                setSubmitSuccess(false); // Reset for next time
            }, 3000);
        } else {
            alert("Failed to submit request: " + (result.error || "Unknown error"));
        }
    };

    // Helper function to create date without timezone issues
    function createDateOnly(year, month, date) {
        const d = new Date();
        d.setFullYear(year, month, date);
        d.setHours(0, 0, 0, 0);
        return d;
    }

    // Helper function to get today's date without time
    function getTodayDate() {
        const today = new Date();
        return createDateOnly(today.getFullYear(), today.getMonth(), today.getDate());
    }

    function formatDateToString(date) {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    }

    function formatDisplayDate(dateStr) {
        if (!dateStr) return "";
        const date = new Date(dateStr + 'T00:00:00');
        return date.toLocaleDateString('en-AE', { day: 'numeric', month: 'short', year: 'numeric' });
    }

    function changeMonth(amount) {
        const newMonth = new Date(currentMonth);
        newMonth.setMonth(newMonth.getMonth() + amount);
        setCurrentMonth(newMonth);
    }

    function isDateInRange(date, start, end) {
        if (!start || !end) return false;
        const checkDate = new Date(date + 'T00:00:00');
        const startDateObj = new Date(start + 'T00:00:00');
        const endDateObj = new Date(end + 'T00:00:00');
        return checkDate > startDateObj && checkDate < endDateObj;
    }

    function isDateAvailable(date) {
        const dateStr = formatDateToString(date); // 'YYYY-MM-DD'
        // Block out unavailable dates from car.unavailableDates
        if (car?.unavailableDates && Array.isArray(car.unavailableDates)) {
            for (const range of car.unavailableDates) {
                if (range.from && range.to) {
                    // Always compare only the date part
                    const from = new Date(range.from.length > 10 ? range.from.slice(0, 10) : range.from + 'T00:00:00');
                    const to = new Date(range.to.length > 10 ? range.to.slice(0, 10) : range.to + 'T00:00:00');
                    if (date >= from && date <= to) {
                        return false;
                    }
                }
            }
        }
        return true;
    }

    function isDateSelectable(date) {
        const today = getTodayDate();
        const checkDate = createDateOnly(date.getFullYear(), date.getMonth(), date.getDate());
        if (checkDate < today) return false;
        if (!isDateAvailable(checkDate)) return false;
        if (selectedCalendar === 'start') {
            return true;
        }
        if (selectedCalendar === 'end' && startDate) {
            const startDateObj = new Date(startDate + 'T00:00:00');
            return checkDate > startDateObj;
        }
        return true;
    }

    function handleDateSelect(date, type) {
        const cleanDate = createDateOnly(date.getFullYear(), date.getMonth(), date.getDate());
        const dateStr = formatDateToString(cleanDate);
        if (type === 'start') {
            setStartDate(dateStr);
            if (endDate && new Date(endDate + 'T00:00:00') < cleanDate) {
                setEndDate("");
            }
            setShowStartCalendar(false);
            setShowEndCalendar(true);
            setSelectedCalendar('end');
        } else if (type === 'end') {
            setEndDate(dateStr);
            setShowEndCalendar(false);
            setSelectedCalendar(null);
        }
    }

    function renderCalendar() {
        const monthStart = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1);
        const monthEnd = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0);
        const startDay = monthStart.getDay() === 0 ? 6 : monthStart.getDay() - 1;
        const days = [];
        const dayNames = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
        const dayNamesRow = (
            <div className="grid grid-cols-7 mb-2">
                {dayNames.map(day => (
                    <div key={day} className="text-center text-xs text-gray-400 py-1">{day}</div>
                ))}
            </div>
        );
        for (let i = 0; i < startDay; i++) {
            days.push(<div key={`empty-${i}`} className="p-2"></div>);
        }
        for (let day = 1; day <= monthEnd.getDate(); day++) {
            const currentDate = createDateOnly(currentMonth.getFullYear(), currentMonth.getMonth(), day);
            const dateStr = formatDateToString(currentDate);
            const isSelected = dateStr === (selectedCalendar === 'start' ? startDate : endDate);
            const inSelectedRange = startDate && endDate ? isDateInRange(dateStr, startDate, endDate) : false;
            const isAvailable = isDateAvailable(currentDate);
            const isSelectable = isDateSelectable(currentDate);
            const isToday = dateStr === formatDateToString(getTodayDate());
            let cellClasses = "p-2 text-center rounded-full mx-auto w-8 h-8 flex items-center justify-center text-sm transition-colors ";
            if (!isAvailable) {
                cellClasses += "line-through bg-red-500 bg-opacity-30 font-bold cursor-not-allowed ";
            } else if (isSelected) {
                cellClasses += "bg-yellow-500 text-black font-bold ";
            } else if (inSelectedRange) {
                cellClasses += "bg-yellow-200 bg-opacity-20 text-yellow-200 ";
            } else if (isSelectable) {
                cellClasses += "hover:bg-yellow-600 hover:text-black cursor-pointer text-green-200 ";
            } else {
                cellClasses += "text-gray-500 cursor-not-allowed ";
            }
            if (isToday && !isSelected) {
                cellClasses += "ring-2 ring-blue-400 ";
            }
            days.push(
                <div
                    key={day}
                    className={cellClasses}
                    style={!isAvailable ? { color: '#ef4444', fontWeight: 'bold' } : {}}
                    onClick={() => {
                        if (isSelectable) {
                            handleDateSelect(currentDate, selectedCalendar);
                        }
                    }}
                >
                    {day}
                </div>
            );
        }
        const weeks = [];
        for (let i = 0; i < days.length; i += 7) {
            weeks.push(
                <div key={`week-${i}`} className="grid grid-cols-7 gap-1 mb-1">
                    {days.slice(i, i + 7)}
                </div>
            );
        }
        return (
            <div className="bg-zinc-800 rounded-lg p-4 shadow-xl border border-zinc-700 w-full max-w-sm">
                <div className="flex justify-between items-center mb-4">
                    <button
                        onClick={(e) => { e.preventDefault(); changeMonth(-1); }}
                        type="button"
                        className="p-1 rounded-full hover:bg-zinc-700"
                    >
                        <ChevronLeft size={20} />
                    </button>
                    <h3 className="font-medium">
                        {currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                    </h3>
                    <button
                        onClick={(e) => { e.preventDefault(); changeMonth(1); }}
                        type="button"
                        className="p-1 rounded-full hover:bg-zinc-700"
                    >
                        <ChevronRight size={20} />
                    </button>
                </div>
                {dayNamesRow}
                {weeks}
                <div className="mt-4 flex flex-wrap gap-2 text-xs">
                    <div className="flex items-center">
                        <div className="w-3 h-3 rounded-full bg-green-500 bg-opacity-50 mr-1"></div>
                        <span>Available</span>
                    </div>
                    <div className="flex items-center">
                        <div className="w-3 h-3 rounded-full bg-red-500 bg-opacity-50 mr-1"></div>
                        <span>Unavailable</span>
                    </div>
                    <div className="flex items-center">
                        <div className="w-3 h-3 rounded-full bg-yellow-500 mr-1"></div>
                        <span>Selected</span>
                    </div>
                    <div className="flex items-center">
                        <div className="w-3 h-3 rounded-full border-2 border-blue-400 mr-1"></div>
                        <span>Today</span>
                    </div>
                </div>
            </div>
        );
    }

    function calculatePrice() {
        if (!startDate || !endDate) return "Select dates";
        const start = new Date(startDate + 'T00:00:00');
        const end = new Date(endDate + 'T00:00:00');
        const diffTime = end.getTime() - start.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        if (diffDays <= 0) return "Invalid date range";
        let price;
        if (rentalOption === "daily") {
            price = diffDays * parseInt(car?.pricing?.daily || 0);
        } else if (rentalOption === "weekly") {
            const weeks = Math.ceil(diffDays / 7);
            price = weeks * parseInt(car?.pricing?.weekly || 0);
        } else {
            const months = Math.ceil(diffDays / 30);
            price = months * parseInt(car?.pricing?.monthly || 0);
        }
        return price ? `AED ${price.toLocaleString()}` : 'N/A';
    }

    function calculateDays() {
        if (!startDate || !endDate) return 0;
        const start = new Date(startDate + 'T00:00:00');
        const end = new Date(endDate + 'T00:00:00');
        const diffTime = end.getTime() - start.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return Math.max(0, diffDays);
    }

    function calculatePriceRaw() {
        if (!startDate || !endDate) return 0;
        const start = new Date(startDate + 'T00:00:00');
        const end = new Date(endDate + 'T00:00:00');
        const diffTime = end.getTime() - start.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        if (diffDays <= 0) return 0;
        let price = 0;
        if (rentalOption === "daily") {
            price = diffDays * parseInt(car?.pricing?.daily || 0);
        } else if (rentalOption === "weekly") {
            const weeks = Math.ceil(diffDays / 7);
            price = weeks * parseInt(car?.pricing?.weekly || 0);
        } else {
            const months = Math.ceil(diffDays / 30);
            price = months * parseInt(car?.pricing?.monthly || 0);
        }
        return price;
    }

    // Helper to find the nearest available date after today
    function getNearestAvailableDate() {
        const today = getTodayDate();
        let date = new Date(today);
        // Search up to 2 years ahead to avoid infinite loop
        for (let i = 0; i < 730; i++) {
            if (isDateAvailable(date)) {
                return new Date(date); // Return a copy
            }
            date.setDate(date.getDate() + 1);
        }
        return null; // No available date found
    }

    if (loading) return (
        <div className="bg-black min-h-screen flex items-center justify-center">
            <div className="text-center">
                <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    className="w-16 h-16 border-4 border-yellow-400 border-t-transparent rounded-full mx-auto mb-8"
                />
                <h2 className="text-3xl font-bold text-white mb-4 font-bruno">Loading Car Details</h2>
                <p className="text-gray-400 text-lg">Please wait while we fetch the details...</p>
            </div>
        </div>
    );
    if (error) return <div className="bg-black text-white text-center p-12 text-xl text-red-500">Error: {error}</div>;
    if (!car) return <div className="bg-black text-white text-center p-12 text-xl">Car not found.</div>;

    // A more robust way to get specs, falling back to array order
    const carSpecs = [
        { label: "Engine", value: car.specs?.find(s => s.icon?.includes('engine'))?.label || car.specs?.[0]?.label },
        { label: "Power", value: car.specs?.find(s => s.icon?.includes('horse'))?.label ? `${car.specs.find(s => s.icon?.includes('horse')).label} HP` : (car.specs?.[1]?.label ? `${car.specs[1].label} HP` : null) },
        { label: "Year", value: car.year },
        { label: "Transmission", value: car.transmission },
        { label: "Top Speed", value: car.topspeed ? `${car.topspeed} km/h` : null },
        { label: "Capacity", value: car.specs?.find(s => s.icon?.includes('fuel'))?.label || car.specs?.[2]?.label },
        { label: "Drive", value: car.drive },
        { label: "Seats", value: car.seats }
    ].filter(spec => spec.value);

    return (
        <div className="bg-black text-white min-h-screen font-sans relative">
            {/* Header */}
            <Navbar />

            <main className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
                {/* Car Title and Availability */}
                <div className="mb-6">
                    <div className="flex items-center gap-4 mb-2">
                        <img
                            src={car?.logo}
                            alt={car?.brand}
                            style={{ height: "48px", width: "auto" }}
                            className="rounded"
                        />
                        <span className="text-3xl md:text-4xl font-bruno">
                            {car?.brand} {car?.model}
                        </span>
                    </div>
                    <div className="inline-flex items-center mt-2 bg-yellow-600 bg-opacity-20 px-3 py-1 rounded-lg">
                        <div className="w-2 h-2 rounded-full bg-green-500 mr-2"></div>
                        {(() => {
                            const nearest = getNearestAvailableDate();
                            return nearest ? (
                                <span className="text-green-400 font-medium">
                                    Available on {formatDisplayDate(formatDateToString(nearest))}
                                </span>
                            ) : (
                                <span className="text-red-400 font-medium">No available dates</span>
                            );
                        })()}
                    </div>
                </div>

                {/* Image Gallery */}
                <div className="relative mb-12">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        <div className="md:col-span-2 h-96">
                            <img
                                src={car?.mainImage || (car?.galleryImages && car.galleryImages[0])}
                                alt={car?.title}
                                className="w-full h-full object-cover rounded-lg"
                            />
                        </div>
                        <div className="grid grid-rows-2 gap-3 h-96">
                            {(car?.galleryImages || []).slice(0, 2).map((img, idx) => (
                                <div key={idx} className="h-full">
                                    <img
                                        src={img}
                                        alt={`${car?.title} view ${idx + 1}`}
                                        className="w-full h-full object-cover rounded-lg"
                                    />
                                </div>
                            ))}
                        </div>
                    </div>
                    <button
                        className="absolute right-4 bottom-4 bg-yellow-600 hover:bg-yellow-700 transition-colors duration-300 text-black font-bruno py-2 px-4 rounded-lg flex items-center"
                        onClick={() => setShowGallery(true)}
                    >
                        VIEW ALL IMAGES
                    </button>

                    {/* Favorite and Share Buttons */}
                    <div className="absolute right-4 bottom-16 flex flex-col gap-2">
                        {/* Favorite Button */}
                        <button
                            title="Toggle favorite"
                            aria-pressed={favoriteIds.has(car?._id)}
                            onClick={(e) => { e.stopPropagation(); toggleFavorite(car?._id); }}
                            className="bg-black/60 hover:bg-black/80 p-3 rounded-full transition-colors duration-300"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="h-5 w-5">
                                <path
                                    d="M12 21s-6.716-4.238-9.193-6.716C.804 12.28.5 9.5 2.343 7.657a5 5 0 017.071 0L12 10.243l2.586-2.586a5 5 0 017.071 7.071C18.716 16.762 12 21 12 21z"
                                    className={favoriteIds.has(car?._id) ? 'fill-red-500' : 'fill-transparent'}
                                    strokeWidth="2"
                                    stroke="currentColor"
                                />
                            </svg>
                        </button>

                        {/* Share Button */}
                        <button
                            title="Share this car"
                            onClick={handleShare}
                            className="bg-black/60 hover:bg-black/80 p-3 rounded-full transition-colors duration-300"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="h-5 w-5 fill-current">
                                <path d="M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.05-4.11c.54.5 1.25.81 2.04.81 1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3c0 .24.04.47.09.7L8.04 9.81C7.5 9.31 6.79 9 6 9c-1.66 0-3 1.34-3 3s1.34 3 3 3c.79 0 1.5-.31 2.04-.81l7.12 4.16c-.05.21-.08.43-.08.65 0 1.61 1.31 2.92 2.92 2.92s2.92-1.31 2.92-2.92-1.31-2.92-2.92-2.92z" />
                            </svg>
                        </button>
                    </div>

                    <GalleryModal
                        isOpen={showGallery}
                        onClose={() => setShowGallery(false)}
                        images={[car?.mainImage, ...(car?.galleryImages || [])].filter(Boolean)}
                        videos={car?.galleryVideos || []}
                    />
                </div>

                {/* Main Content Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Column: Car Details */}
                    <div className="lg:col-span-2 space-y-12">
                        {/* Car Description */}
                        <section>
                            <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center">
                                    <div className="w-12 h-1.5 rounded-full bg-yellow-600 mr-4"></div>
                                    <h2 className="text-2xl md:text-3xl font-bruno">About This Car</h2>
                                </div>

                                {/* Favorite and Share Buttons - Desktop */}
                                <div className="hidden md:flex items-center gap-3">
                                    {/* Favorite Button */}
                                    <button
                                        title="Toggle favorite"
                                        aria-pressed={favoriteIds.has(car?._id)}
                                        onClick={(e) => { e.stopPropagation(); toggleFavorite(car?._id); }}
                                        className={`p-3 rounded-full transition-colors duration-300 ${favoriteIds.has(car?._id)
                                            ? 'bg-red-500/20 hover:bg-red-500/30'
                                            : 'bg-gray-800/60 hover:bg-gray-700/80'
                                            }`}
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="h-5 w-5">
                                            <path
                                                d="M12 21s-6.716-4.238-9.193-6.716C.804 12.28.5 9.5 2.343 7.657a5 5 0 017.071 0L12 10.243l2.586-2.586a5 5 0 017.071 7.071C18.716 16.762 12 21 12 21z"
                                                className={favoriteIds.has(car?._id) ? 'fill-red-500' : 'fill-transparent'}
                                                strokeWidth="2"
                                                stroke="currentColor"
                                            />
                                        </svg>
                                    </button>

                                    {/* Share Button */}
                                    <button
                                        title="Share this car"
                                        onClick={handleShare}
                                        className="bg-gray-800/60 hover:bg-gray-700/80 p-3 rounded-full transition-colors duration-300"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="h-5 w-5 fill-current">
                                            <path d="M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.05-4.11c.54.5 1.25.81 2.04.81 1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3c0 .24.04.47.09.7L8.04 9.81C7.5 9.31 6.79 9 6 9c-1.66 0-3 1.34-3 3s1.34 3 3 3c.79 0 1.5-.31 2.04-.81l7.12 4.16c-.05.21-.08.43-.08.65 0 1.61 1.31 2.92 2.92 2.92s2.92-1.31 2.92-2.92-1.31-2.92-2.92-2.92z" />
                                        </svg>
                                    </button>
                                </div>
                            </div>

                            {/* Favorite and Share Buttons - Mobile */}
                            <div className="md:hidden flex items-center gap-3 mb-4">
                                <button
                                    title="Toggle favorite"
                                    aria-pressed={favoriteIds.has(car?._id)}
                                    onClick={(e) => { e.stopPropagation(); toggleFavorite(car?._id); }}
                                    className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors duration-300 ${favoriteIds.has(car?._id)
                                        ? 'bg-red-500/20 text-red-400 hover:bg-red-500/30'
                                        : 'bg-gray-800/60 text-gray-300 hover:bg-gray-700/80'
                                        }`}
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="h-4 w-4">
                                        <path
                                            d="M12 21s-6.716-4.238-9.193-6.716C.804 12.28.5 9.5 2.343 7.657a5 5 0 017.071 0L12 10.243l2.586-2.586a5 5 0 017.071 7.071C18.716 16.762 12 21 12 21z"
                                            className={favoriteIds.has(car?._id) ? 'fill-red-500' : 'fill-transparent'}
                                            strokeWidth="2"
                                            stroke="currentColor"
                                        />
                                    </svg>
                                    <span className="text-sm font-medium">
                                        {favoriteIds.has(car?._id) ? 'Favorited' : 'Favorite'}
                                    </span>
                                </button>

                                <button
                                    title="Share this car"
                                    onClick={handleShare}
                                    className="flex items-center gap-2 px-4 py-2 bg-gray-800/60 hover:bg-gray-700/80 rounded-lg text-gray-300 transition-colors duration-300"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="h-4 w-4 fill-current">
                                        <path d="M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.05-4.11c.54.5 1.25.81 2.04.81 1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3c0 .24.04.47.09.7L8.04 9.81C7.5 9.31 6.79 9 6 9c-1.66 0-3 1.34-3 3s1.34 3 3 3c.79 0 1.5-.31 2.04-.81l7.12 4.16c-.05.21-.08.43-.08.65 0 1.61 1.31 2.92 2.92 2.92s2.92-1.31 2.92-2.92-1.31-2.92-2.92-2.92z" />
                                    </svg>
                                    <span className="text-sm font-medium">Share</span>
                                </button>
                            </div>

                            <div className="bg-zinc-900 rounded-xl p-6 text-gray-300 leading-relaxed border border-zinc-800">
                                <p>{car.description || "No description avaiable."}</p>
                            </div>
                        </section>

                        {/* Specifications */}
                        <section>
                            <div className="flex items-center mb-6">
                                <div className="w-12 h-1.5 rounded-full bg-yellow-600 mr-4"></div>
                                <h2 className="text-2xl md:text-3xl font-bruno">Specifications</h2>
                            </div>

                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                {carSpecs.map((spec, index) => (
                                    <div key={index} className="bg-zinc-900 p-4 rounded-xl border border-zinc-800 flex flex-col items-center text-center hover:border-yellow-600 transition-colors duration-300">
                                        <span className="text-gray-400 text-sm mb-1">{spec.label}</span>
                                        <span className="text-lg font-bold text-white">{spec.value}</span>
                                    </div>
                                ))}
                            </div>
                        </section>

                        {/* Features */}
                        <section>
                            <div className="flex items-center mb-6">
                                <div className="w-12 h-1.5 rounded-full bg-yellow-600 mr-4"></div>
                                <h2 className="text-2xl md:text-3xl font-bruno">Features</h2>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                {(car?.features || []).map((feature, index) => (
                                    <div key={index} className="flex items-center bg-zinc-900 p-3 rounded-lg border border-zinc-800">
                                        <Check className="text-yellow-500 mr-3" size={20} />
                                        <span className="text-gray-300">{feature}</span>
                                    </div>
                                ))}
                            </div>
                        </section>

                        {/* FAQ Section */}
                        {(car?.faqs && car.faqs.length > 0) && (
                            <section>
                                <div className="flex items-center mb-6">
                                    <div className="w-12 h-1.5 rounded-full bg-yellow-600 mr-4"></div>
                                    <h2 className="text-2xl md:text-3xl font-bruno">FAQ</h2>
                                </div>

                                <div className="space-y-4">
                                    {car.faqs.map((faq, idx) => (
                                        <div key={idx} className="bg-zinc-900 rounded-xl border border-zinc-800 overflow-hidden">
                                            <button
                                                onClick={() => toggleFaq(idx)}
                                                className="w-full flex justify-between items-center p-4 text-left font-bold text-white hover:bg-zinc-800 transition-colors"
                                            >
                                                {faq.question}
                                                {showFaq[idx] ? <ChevronLeft className="rotate-90 transition-transform" /> : <ChevronRight className="transition-transform" />}
                                            </button>

                                            {showFaq[idx] && (
                                                <div className="p-4 pt-0 text-gray-400 border-t border-zinc-800 mt-2">
                                                    {faq.answer}
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}
                    </div>

                    {/* Right Column: Booking Widget */}
                    <div className="relative">
                        <div className="lg:sticky lg:top-24 space-y-6">
                            <div className="bg-zinc-900 rounded-2xl p-6 border border-zinc-800 shadow-xl">
                                <div className="text-center mb-6 border-b border-zinc-800 pb-6">
                                    <p className="text-gray-400 mb-1">Daily Rate</p>
                                    <div className="flex items-baseline justify-center">
                                        <span className="text-3xl font-bold text-yellow-500">
                                            AED {parseInt(car?.pricing?.daily).toLocaleString()}
                                        </span>
                                        <span className="text-gray-500 ml-1">/ day</span>
                                    </div>
                                </div>

                                {/* Rental Option Selector */}
                                <div className="grid grid-cols-3 gap-2 mb-6 bg-black p-1 rounded-lg">
                                    {['daily', 'weekly', 'monthly'].map((opt) => (
                                        <button
                                            key={opt}
                                            onClick={() => setRentalOption(opt)}
                                            className={`py-2 text-xs md:text-sm font-medium rounded-md capitalize transition-colors ${rentalOption === opt ? 'bg-zinc-800 text-white shadow-sm' : 'text-gray-500 hover:text-gray-300'
                                                }`}
                                        >
                                            {opt}
                                        </button>
                                    ))}
                                </div>

                                {/* Date Selection */}
                                <div className="space-y-4 mb-6 relative">
                                    <div>
                                        <label className="block text-sm text-gray-400 mb-1">Pick-up Date</label>
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setShowStartCalendar(!showStartCalendar);
                                                setShowEndCalendar(false);
                                                setSelectedCalendar('start');
                                            }}
                                            className="w-full bg-black border border-zinc-700 rounded-lg py-3 px-4 text-left flex justify-between items-center hover:border-yellow-600 transition-colors"
                                        >
                                            <span className={startDate ? "text-white" : "text-gray-500"}>
                                                {startDate ? formatDisplayDate(startDate) : "Select date"}
                                            </span>
                                            <CalendarIcon size={18} className="text-yellow-500" />
                                        </button>
                                        {showStartCalendar && (
                                            <div className="absolute top-16 left-0 z-20 w-full">
                                                {renderCalendar()}
                                            </div>
                                        )}
                                    </div>

                                    <div>
                                        <label className="block text-sm text-gray-400 mb-1">Return Date</label>
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setShowEndCalendar(!showEndCalendar);
                                                setShowStartCalendar(false);
                                                setSelectedCalendar('end');
                                            }}
                                            className="w-full bg-black border border-zinc-700 rounded-lg py-3 px-4 text-left flex justify-between items-center hover:border-yellow-600 transition-colors"
                                        >
                                            <span className={endDate ? "text-white" : "text-gray-500"}>
                                                {endDate ? formatDisplayDate(endDate) : "Select date"}
                                            </span>
                                            <CalendarIcon size={18} className="text-yellow-500" />
                                        </button>
                                        {showEndCalendar && (
                                            <div className="absolute top-36 left-0 z-20 w-full">
                                                {renderCalendar()}
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Price Display */}
                                {startDate && endDate && (
                                    <div className="bg-black/50 rounded-lg p-4 mb-6 border border-zinc-800">
                                        <div className="flex justify-between items-center mb-2">
                                            <span className="text-gray-400">Duration</span>
                                            <span className="text-white font-medium">{calculateDays()} days</span>
                                        </div>
                                        <div className="flex justify-between items-center pt-2 border-t border-zinc-800">
                                            <span className="text-gray-300">Total Price</span>
                                            <span className="text-xl font-bold text-yellow-500">{calculatePrice()}</span>
                                        </div>
                                    </div>
                                )}

                                {/* Book Button */}
                                <button
                                    onClick={handleBookNow}
                                    className="w-full bg-gradient-to-r from-yellow-500 to-yellow-700 hover:from-yellow-400 hover:to-yellow-600 text-black font-bold py-4 rounded-xl transition-all duration-300 shadow-lg shadow-yellow-900/20 flex items-center justify-center gap-2 mb-4"
                                >
                                    <Check className="w-5 h-5" />
                                    BOOK NOW
                                </button>

                                {/* Contact Options */}
                                <div className="grid grid-cols-2 gap-3">
                                    <a
                                        href={`https://wa.me/971501234567?text=I'm interested in renting the ${car?.brand} ${car?.model}`}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#128C7E] text-white py-3 rounded-lg font-medium transition-colors"
                                    >
                                        <MessageSquare size={18} />
                                        WhatsApp
                                    </a>
                                    <a
                                        href="tel:+971501234567"
                                        className="flex items-center justify-center gap-2 bg-zinc-800 hover:bg-zinc-700 text-white py-3 rounded-lg font-medium transition-colors"
                                    >
                                        <PhoneCall size={18} />
                                        Call
                                    </a>
                                </div>
                            </div>

                            <div className="bg-zinc-900/50 p-4 rounded-xl border border-zinc-800 text-sm text-gray-400">
                                <p className="mb-2 flex items-start gap-2">
                                    <Check size={16} className="text-green-500 mt-0.5 shrink-0" />
                                    <span>Free cancellation up to 24 hours before pick-up</span>
                                </p>
                                <p className="mb-2 flex items-start gap-2">
                                    <Check size={16} className="text-green-500 mt-0.5 shrink-0" />
                                    <span>Best price guarantee</span>
                                </p>
                                <p className="flex items-start gap-2">
                                    <Check size={16} className="text-green-500 mt-0.5 shrink-0" />
                                    <span>No hidden fees or charges</span>
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            <FooterSection />

            {/* Booking Modal */}
            {showBookingModal && (
                <BookingModal
                    showBookingModal={showBookingModal}
                    setShowBookingModal={setShowBookingModal}
                    submitSuccess={submitSuccess}
                    handleSubmitBooking={handleSubmitBooking}
                    car={car}
                    startDate={startDate}
                    endDate={endDate}
                    calculateDays={calculateDays}
                    rentalOption={rentalOption}
                    calculatePrice={calculatePrice}
                    formatDisplayDate={formatDisplayDate}
                    customerName={customerName}
                    setCustomerName={setCustomerName}
                    customerPhone={customerPhone}
                    setCustomerPhone={setCustomerPhone}
                    customerMessage={customerMessage}
                    setCustomerMessage={setCustomerMessage}
                    isSubmitting={isSubmitting}
                />
            )}
        </div>
    );
}
