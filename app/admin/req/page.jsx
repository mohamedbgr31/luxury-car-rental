"use client";

import { useState, useEffect } from "react";
import {
  Search,
  Filter,
  Calendar,
  Check,
  X,
  Eye,
  Phone,
  Mail,
  Car,
  User,
  Clock,
  DollarSign,
  Menu,
} from "lucide-react";
import {
  getAllRequests,
  acceptRequest,
  rejectRequest,
} from "@/app/components/data/requestService";
import Sidebar from "@/components/ui/sidebar";
import { usePermissions } from "@/app/hooks/usePermissions";

export default function AdminRequestsPanel() {
  const [requests, setRequests] = useState([]);
  const [openRequests, setOpenRequests] = useState({});
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [dateFilter, setDateFilter] = useState("all");
  const [showFilters, setShowFilters] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [carImages, setCarImages] = useState({});
  const { canEdit } = usePermissions();

  // Load requests function
  const loadRequests = async () => {
    try {
      setLoading(true);
      setError(null);

      const data = await getAllRequests();
      console.log("Loaded requests in admin panel:", data);
      setRequests(data);

      // Preload car images for each request so admins can see which exact car was requested
      await preloadCarImages(data);
    } catch (err) {
      console.error("Error loading requests:", err);
      setError("Failed to load requests. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Load related car images (main image) for each request using its carId
  const preloadCarImages = async (requestsData) => {
    const ids = [...new Set(requestsData.map((req) => req.carId).filter(Boolean))];
    if (!ids.length) return;

    try {
      const results = await Promise.all(
        ids.map(async (id) => {
          try {
            const res = await fetch(`/api/cars/${id}`);
            if (!res.ok) throw new Error(`Failed to fetch car ${id}`);
            const car = await res.json();
            const imageUrl =
              car.mainImage ||
              (Array.isArray(car.galleryImages) && car.galleryImages[0]) ||
              car.image ||
              null;
            return { id, imageUrl };
          } catch (err) {
            console.error("Failed to load car details for request", id, err);
            return { id, imageUrl: null };
          }
        })
      );

      setCarImages((prev) => {
        const next = { ...prev };
        results.forEach(({ id, imageUrl }) => {
          if (imageUrl) {
            next[id] = imageUrl;
          }
        });
        return next;
      });
    } catch (err) {
      console.error("Error preloading car images for requests", err);
    }
  };

  // Load requests when component mounts
  useEffect(() => {
    loadRequests();
  }, []);

  // Listen for updates from other components
  useEffect(() => {
    const handleRequestsUpdated = (event) => {
      console.log("Received requestsUpdated event:", event.detail);
      loadRequests();
    };

    window.addEventListener("requestsUpdated", handleRequestsUpdated);

    return () => {
      window.removeEventListener("requestsUpdated", handleRequestsUpdated);
    };
  }, []);

  // Close sidebar when clicking outside on mobile
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setSidebarOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const toggleRequest = (id) => {
    setOpenRequests((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleAccept = async (id) => {
    try {
      const result = await acceptRequest(id);

      if (result.success) {
        setRequests((prev) =>
          prev.map((req) =>
            req.id === id ? { ...req, status: "accepted" } : req
          )
        );
      } else {
        throw new Error(result.error || "Failed to accept request");
      }
    } catch (error) {
      console.error("Error accepting request:", error);
      alert("Failed to accept request. Please try again.");
    }
  };

  const handleReject = async (id) => {
    try {
      const result = await rejectRequest(id);

      if (result.success) {
        setRequests((prev) =>
          prev.map((req) =>
            req.id === id ? { ...req, status: "rejected" } : req
          )
        );
      } else {
        throw new Error(result.error || "Failed to reject request");
      }
    } catch (error) {
      console.error("Error rejecting request:", error);
      alert("Failed to reject request. Please try again.");
    }
  };

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString("en-AE", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const formatTimestamp = (timestamp) => {
    return new Date(timestamp).toLocaleString("en-AE", {
      day: "numeric",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "pending":
        return "text-yellow-400 bg-yellow-900/30";
      case "accepted":
        return "text-green-400 bg-green-900/30";
      case "rejected":
        return "text-red-400 bg-red-900/30";
      default:
        return "text-gray-400 bg-gray-900/30";
    }
  };

  const filteredRequests = requests.filter((req) => {
    const matchesSearch =
      req.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      req.car.toLowerCase().includes(searchTerm.toLowerCase()) ||
      req.contact.includes(searchTerm);

    const matchesStatus = statusFilter === "all" || req.status === statusFilter;

    let matchesDate = true;
    if (dateFilter === "today") {
      const today = new Date().toDateString();
      matchesDate = new Date(req.timestamp).toDateString() === today;
    } else if (dateFilter === "week") {
      const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
      matchesDate = new Date(req.timestamp) >= weekAgo;
    }

    return matchesSearch && matchesStatus && matchesDate;
  });

  const pendingCount = requests.filter((req) => req.status === "pending").length;
  const urgentCount = requests.filter(
    (req) => req.urgent && req.status === "pending"
  ).length;

  if (loading) {
    return (
      <div className="flex min-h-screen font-sans bg-black text-white items-center justify-center p-4">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-yellow-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-400">Loading requests...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen font-sans bg-black text-white items-center justify-center p-4">
        <div className="text-center">
          <p className="text-red-400 mb-4 text-sm sm:text-base">{error}</p>
          <button
            onClick={loadRequests}
            className="bg-yellow-500 hover:bg-yellow-600 text-black px-6 py-2 rounded-lg transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-black flex min-h-screen relative font-bruno text-white">
      {/* Sidebar */}
      <div className="hidden lg:block fixed h-screen z-10">
        <Sidebar />
      </div>

      {/* Main Content Wrapper */}
      <main className="flex-1 flex flex-col min-h-screen lg:ml-72 xl:ml-80">
        {/* Mobile menu button */}
        <div className="md:hidden fixed top-4 left-4 z-50">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="bg-yellow-500 text-black p-2 rounded-md"
          >
            {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        {/* Mobile Sidebar Overlay */}
        {sidebarOpen && (
          <div className="fixed inset-0 z-40 lg:hidden">
            <div
              className="absolute inset-0 bg-black/50 backdrop-blur-sm"
              onClick={() => setSidebarOpen(false)}
            />
            <div className="absolute left-0 top-0 h-full w-64 bg-black border-r border-zinc-800">
              <Sidebar />
            </div>
          </div>
        )}

        <div className="container mx-auto px-4 sm:px-6 py-8 mt-12 md:mt-0">
          {/* Header */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
            <div>
              <h1 className="text-3xl xl:text-4xl font-bold text-yellow-500 mb-2">
                Requests Management
              </h1>
              <p className="text-gray-400 text-sm">
                Manage and track customer car rental requests
              </p>
            </div>

            <div className="flex gap-3">
              <div className="bg-zinc-800 rounded-2xl p-3 text-center min-w-[80px]">
                <div className="text-yellow-400 font-bold text-lg">
                  {pendingCount}
                </div>
                <div className="text-gray-400 text-xs">Pending</div>
              </div>
              <div className="bg-zinc-800 rounded-2xl p-3 text-center min-w-[80px]">
                <div className="text-red-400 font-bold text-lg">
                  {urgentCount}
                </div>
                <div className="text-gray-400 text-xs">Urgent</div>
              </div>
              <button
                onClick={loadRequests}
                className="bg-zinc-800 hover:bg-zinc-700 text-white p-3 rounded-lg transition-colors flex items-center justify-center"
                title="Refresh Requests"
              >
                <Clock size={20} className="text-yellow-500" />
              </button>
            </div>
          </div>

          {/* Search and Filter Controls */}
          <div className="mb-6 lg:mb-8 space-y-4">
            {/* Search Bar */}
            <div className="relative w-full max-w-md mx-auto md:mx-0">
              <Search
                size={18}
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              />
              <input
                type="text"
                placeholder="Search requests..."
                className="w-full bg-zinc-800 border border-zinc-700 rounded-full py-3 pl-10 pr-4 text-white placeholder-gray-400 focus:outline-none focus:border-yellow-500 transition-colors text-sm sm:text-base"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            {/* Filter Buttons */}
            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all flex items-center gap-2 ${
                  showFilters
                    ? "bg-yellow-500 text-black"
                    : "bg-zinc-800 text-gray-300 hover:bg-zinc-700"
                }`}
              >
                <Filter size={16} />
                Filters
              </button>

              <div className="flex bg-zinc-800 rounded-full p-1">
                {["all", "pending", "accepted", "rejected"].map((status) => (
                  <button
                    key={status}
                    onClick={() => setStatusFilter(status)}
                    className={`px-4 py-1.5 rounded-full text-xs sm:text-sm capitalize transition-all ${
                      statusFilter === status
                        ? "bg-yellow-500 text-black font-bold shadow-sm"
                        : "text-gray-400 hover:text-white"
                    }`}
                  >
                    {status}
                  </button>
                ))}
              </div>
            </div>

            {/* Filter Options */}
            <div
              className={`overflow-hidden transition-all duration-300 ease-in-out ${
                showFilters ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
              }`}
            >
              <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-4 max-w-2xl">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2 text-gray-400">
                      Date Range
                    </label>
                    <select
                      value={dateFilter}
                      onChange={(e) => setDateFilter(e.target.value)}
                      className="w-full bg-zinc-800 border border-zinc-700 rounded-lg py-2 px-3 text-white focus:outline-none focus:border-yellow-500 transition-colors text-sm"
                    >
                      <option value="all">All Time</option>
                      <option value="today">Today</option>
                      <option value="week">This Week</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Request List */}
          <div className="space-y-4">
            {filteredRequests.length === 0 ? (
              <div className="text-center py-12 bg-zinc-900/50 rounded-xl border border-zinc-800 border-dashed">
                <div className="bg-zinc-800 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Search size={24} className="text-gray-500" />
                </div>
                <p className="text-gray-300 text-lg font-medium">
                  No requests found
                </p>
                <p className="text-gray-500 text-sm mt-2">
                  {requests.length === 0
                    ? "No requests have been submitted yet."
                    : "Try adjusting your search filters."}
                </p>
              </div>
            ) : (
              filteredRequests.map((req) => (
                <div
                  key={req._id}
                  className="bg-zinc-900 rounded-xl lg:rounded-2xl overflow-hidden border border-zinc-800 hover:border-yellow-500/30 transition-all duration-300"
                >
                  <div className="p-4 sm:p-6">
                    {/* Request Header */}
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-4 gap-3">
                      <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
                        <div className="flex items-center gap-3">
                          <User
                            size={18}
                            className="text-yellow-400 flex-shrink-0"
                          />
                          <span className="font-semibold text-base sm:text-lg capitalize truncate">
                            {req.name}
                          </span>
                          {req.urgent && (
                            <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full whitespace-nowrap font-bold animate-pulse">
                              URGENT
                            </span>
                          )}
                        </div>
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
                            req.status
                          )} self-start`}
                        >
                          {req.status.toUpperCase()}
                        </span>
                      </div>
                      <div className="text-left sm:text-right text-sm text-gray-400">
                        <div className="flex items-center gap-1 sm:justify-end">
                          <Clock size={14} />
                          <span className="text-xs sm:text-sm">
                            {formatTimestamp(req.timestamp)}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Request Summary */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-4 bg-black/30 p-4 rounded-2xl border border-zinc-800">
                      <div className="flex items-center gap-2 min-w-0">
                        <Phone
                          size={14}
                          className="text-gray-400 flex-shrink-0"
                        />
                        <span className="text-gray-300 text-sm truncate">
                          {req.contact}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 min-w-0">
                        <Car
                          size={14}
                          className="text-gray-400 flex-shrink-0"
                        />
                        <span className="text-white font-medium text-sm truncate">
                          {req.car}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 min-w-0 sm:col-span-2 lg:col-span-1">
                        <Calendar
                          size={14}
                          className="text-gray-400 flex-shrink-0"
                        />
                        <span className="text-gray-300 text-xs sm:text-sm">
                          {formatDate(req.dateFrom)} - {formatDate(req.dateTo)}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <DollarSign
                          size={14}
                          className="text-gray-400 flex-shrink-0"
                        />
                        <span className="text-yellow-400 font-semibold text-sm">
                          {req.totalPrice}
                        </span>
                      </div>
                    </div>

                    {/* Expandable Message */}
                    <div
                      onClick={() => toggleRequest(req._id)}
                      className="cursor-pointer mb-4 select-none group"
                    >
                      <div className="flex items-center gap-2 mb-2">
                        <Eye
                          size={14}
                          className="text-gray-400 group-hover:text-yellow-500 transition-colors"
                        />
                        <span className="text-xs sm:text-sm text-gray-400 group-hover:text-yellow-500 transition-colors">
                          {openRequests[req._id]
                            ? "Hide Details"
                            : "View Details"}
                        </span>
                      </div>

                      <div
                        className={`overflow-hidden transition-all duration-300 ease-in-out ${
                          openRequests[req._id]
                            ? "max-h-96 opacity-100"
                            : "max-h-0 opacity-0"
                        }`}
                      >
                        <div className="bg-zinc-800 rounded-2xl p-4 mt-2 border border-zinc-700">
                          {carImages[req.carId] && (
                            <div className="mb-4">
                              <img
                                src={carImages[req.carId]}
                                alt={req.car}
                                className="w-full h-40 sm:h-52 object-cover rounded-2xl border border-zinc-700"
                              />
                            </div>
                          )}
                          <p className="text-gray-300 leading-relaxed text-sm sm:text-base mb-3 italic">
                            "{req.message}"
                          </p>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm border-t border-zinc-700 pt-3 mt-3">
                            <div>
                              <span className="text-gray-400">Rental Type:</span>
                              <span className="ml-2 text-white capitalize">
                                {req.rentalType}
                              </span>
                            </div>
                            <div>
                              <span className="text-gray-400">Duration:</span>
                              <span className="ml-2 text-white">
                                {req.totalDays} days
                              </span>
                            </div>
                            {req.email && (
                              <div className="sm:col-span-2">
                                <span className="text-gray-400">Email:</span>
                                <span className="ml-2 text-white break-all">
                                  {req.email}
                                </span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    {req.status === "pending" && canEdit && (
                      <div className="flex flex-col sm:flex-row justify-end gap-3 border-t border-zinc-800 pt-4 mt-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleReject(req._id);
                          }}
                          className="flex items-center justify-center gap-2 px-5 py-2.5 bg-red-900/20 hover:bg-red-900/40 text-red-500 border border-red-900/50 rounded-full transition-all text-sm font-medium"
                        >
                          <X size={16} />
                          Reject
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleAccept(req._id);
                          }}
                          className="flex items-center justify-center gap-2 px-5 py-2.5 bg-green-900/20 hover:bg-green-900/40 text-green-500 border border-green-900/50 rounded-full transition-all text-sm font-medium"
                        >
                          <Check size={16} />
                          Accept
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </main>
    </div>
  );
}