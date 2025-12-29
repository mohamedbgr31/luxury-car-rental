"use client";
import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import FooterSection from "../components/homepage/footer";
import Link from "next/link";
import FilterSidebar from "@/components/ui/filtersidebar";
import Pagination from "@/components/ui/pagination";
import Navbar from "../components/homepage/navbar";
import { Filter, X } from "lucide-react";

function CarsPageContent() {
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filteredCars, setFilteredCars] = useState([]);
  const [favoriteIds, setFavoriteIds] = useState(new Set());
  const searchParams = useSearchParams();
  
  // State for active filters
  const [activeFilters, setActiveFilters] = useState({
    search: "",
    priceRange: [0, 5000],
    category: null,
    brand: null,
    fuelType: null,
    transmission: null
  });
  
  // State for pagination
  const [currentPage, setCurrentPage] = useState(1);
  const carsPerPage = 6;

  // Mobile filter toggle state
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  // Fetch cars from API on component mount
  useEffect(() => {
    const fetchCars = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/cars');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setCars(data);
        setFilteredCars(data);
      } catch (error) {
        console.error("Error fetching cars:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchCars();
  }, []);

  // Handle brand parameter from URL
  useEffect(() => {
    const brandFromUrl = searchParams.get('brand');
    if (brandFromUrl) {
      setActiveFilters(prev => ({
        ...prev,
        brand: brandFromUrl
      }));
    }
  }, [searchParams]);

  // Fetch current user's favorites
  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        const res = await fetch('/api/favorites', { credentials: 'include' });
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
      const res = await fetch('/api/favorites', {
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

  // Apply filters
  useEffect(() => {
    if (
      !activeFilters.search &&
      (!activeFilters.priceRange || (activeFilters.priceRange[0] === 0 && activeFilters.priceRange[1] === 5000)) &&
      !activeFilters.category &&
      !activeFilters.brand &&
      !activeFilters.fuelType &&
      !activeFilters.transmission
    ) {
      setFilteredCars(cars);
      return;
    }

    let filtered = cars.filter(car => {
      let price = car.pricing?.price || car.price || 0;
      let inPriceRange = price >= activeFilters.priceRange[0] && price <= activeFilters.priceRange[1];
      let inCategory = !activeFilters.category || car.category === activeFilters.category;
      let inBrand = !activeFilters.brand || car.brand?.toLowerCase() === activeFilters.brand.toLowerCase();
      let inFuel = !activeFilters.fuelType || car.fuelType === activeFilters.fuelType;
      let inTrans = !activeFilters.transmission || car.transmission === activeFilters.transmission;
      let inSearch = !activeFilters.search || (car.title && car.title.toLowerCase().includes(activeFilters.search.toLowerCase()));
      return inPriceRange && inCategory && inBrand && inFuel && inTrans && inSearch;
    });
    setFilteredCars(filtered);
    // Reset to first page when filters change
    setCurrentPage(1);
  }, [activeFilters, cars]);

  // Handle filter changes
  const handleFilterChange = (filterType, value) => {
    if (typeof filterType === 'string') {
      setActiveFilters(prev => ({
        ...prev,
        [filterType]: value
      }));
    } else if (typeof filterType === 'object') {
      setActiveFilters(filterType);
    }
  };
  
  // Calculate pagination
  const indexOfLastCar = currentPage * carsPerPage;
  const indexOfFirstCar = indexOfLastCar - carsPerPage;
  const currentCars = filteredCars.slice(indexOfFirstCar, indexOfLastCar);
  const totalPages = Math.ceil(filteredCars.length / carsPerPage);

  // Handle page change
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    const carListings = document.getElementById('carListings');
    if (carListings) {
      carListings.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  if (loading) {
    return (
      <div className="bg-black text-white min-h-screen font-sans">
        <Navbar />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-500"></div>
        </div>
        <FooterSection />
      </div>
    );
  }

  return (
    <div className="bg-black text-white min-h-screen font-sans">
      <Navbar />
      
      <main className="container-responsive-xl responsive-padding">
        {/* Mobile Filter Toggle */}
        <div className="lg:hidden mb-6">
          <button
            onClick={() => setShowMobileFilters(!showMobileFilters)}
            className="w-full bg-gradient-to-r from-amber-700 via-amber-500 to-amber-700 text-black font-bruno py-4 rounded-xl flex items-center justify-center gap-2"
          >
            <Filter size={20} />
            {showMobileFilters ? 'Hide Filters' : 'Show Filters'}
          </button>
        </div>

        <div className="flex flex-col lg:flex-row spacing-responsive">
          {/* Filter Sidebar */}
          <div className={`lg:w-1/3 ${showMobileFilters ? 'block' : 'hidden lg:block'}`}>
            {/* Mobile close button */}
            {showMobileFilters && (
              <div className="lg:hidden mb-4">
                <button
                  onClick={() => setShowMobileFilters(false)}
                  className="w-full bg-gray-800 text-white py-2 rounded-lg flex items-center justify-center gap-2"
                >
                  <X size={20} />
                  Close Filters
                </button>
              </div>
            )}
            
            <FilterSidebar 
              onFilterChange={handleFilterChange}
              activeFilters={activeFilters}
              cars={cars}
            />
            
            {/* Mobile apply button */}
            {showMobileFilters && (
              <div className="lg:hidden p-4 mt-6">
                <button
                  onClick={() => setShowMobileFilters(false)}
                  className="w-full bg-gradient-to-r from-amber-700 via-amber-500 to-amber-700 text-black font-bruno py-4 rounded-xl"
                >
                  View Results ({filteredCars.length})
                </button>
              </div>
            )}
          </div>

          {/* Car Cards Container - Mobile Responsive */}
          <div id="carListings" className="w-full lg:w-2/3 spacing-responsive mt-4 lg:mt-0">
            {/* Results count */}
            <div className="text-white font-bruno mb-4 md:mb-6 text-center lg:text-left px-2">
              {/* Show brand filter message if brand is selected from URL */}
              {activeFilters.brand && (
                <div className="mb-3 p-3 bg-amber-500 bg-opacity-10 border border-amber-500 border-opacity-30 rounded-lg">
                  <p className="text-amber-400 text-sm">
                    Showing cars from <span className="font-bold">{activeFilters.brand}</span>
                    <button 
                      onClick={() => handleFilterChange('brand', null)}
                      className="ml-2 text-amber-300 hover:text-amber-100 underline"
                    >
                      (Clear filter)
                    </button>
                  </p>
                </div>
              )}
              <span className="text-amber-400">{filteredCars.length}</span> vehicles found
              {Object.values(activeFilters).some(val => 
                val !== null && 
                val !== "" && 
                (Array.isArray(val) ? 
                  (val[0] !== 0 || val[1] !== 5000) : true)
              ) && " matching your criteria"}
            </div>

            {/* No results message */}
            {filteredCars.length === 0 && (
              <div className="bg-[#171616] rounded-xl p-6 md:p-10 text-center mx-2">
                <h3 className="text-amber-400 font-bruno text-lg md:text-xl mb-3">No vehicles found</h3>
                <p className="text-gray-300 text-sm md:text-base">Try adjusting your filters to see more options</p>
              </div>
            )}

            {/* Car Cards - Enhanced Responsive Design */}
            {currentCars.map((car) => (
              <div
                key={car._id || car.id}
                className="bg-[#171616] rounded-xl overflow-hidden shadow-lg hover:shadow-amber-500/10 transition-shadow duration-300 max-w-6xl mx-auto"
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
                    <button
                      title="Toggle favorite"
                      aria-pressed={favoriteIds.has(car._id)}
                      onClick={(e) => { e.stopPropagation(); toggleFavorite(car._id); }}
                      className="absolute top-3 right-3 z-30 bg-black/60 hover:bg-black/80 p-2 rounded-full"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="h-5 w-5">
                        <path
                          d="M12 21s-6.716-4.238-9.193-6.716C.804 12.28.5 9.5 2.343 7.657a5 5 0 017.071 0L12 10.243l2.586-2.586a5 5 0 017.071 7.071C18.716 16.762 12 21 12 21z"
                          className={favoriteIds.has(car._id) ? 'fill-red-500' : 'fill-transparent'}
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
                    <button
                      title="Toggle favorite"
                      aria-pressed={favoriteIds.has(car._id)}
                      onClick={(e) => { e.stopPropagation(); toggleFavorite(car._id); }}
                      className="absolute top-3 right-3 z-30 bg-black/60 hover:bg-black/80 p-2 rounded-full"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="h-5 w-5">
                        <path
                          d="M12 21s-6.716-4.238-9.193-6.716C.804 12.28.5 9.5 2.343 7.657a5 5 0 017.071 0L12 10.243l2.586-2.586a5 5 0 017.071 7.071C18.716 16.762 12 21 12 21z"
                          className={favoriteIds.has(car._id) ? 'fill-red-500' : 'fill-transparent'}
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
                      src={car.mainImage || car.image}
                      alt={car.title}
                      className="w-full h-full object-cover transform transition-transform duration-500 group-hover:scale-105"
                    />
                    {/* Favorite Button */}
                    <button
                      title="Toggle favorite"
                      aria-pressed={favoriteIds.has(car._id)}
                      onClick={(e) => { e.stopPropagation(); toggleFavorite(car._id); }}
                      className="absolute top-3 right-3 z-30 bg-black/60 hover:bg-black/80 p-2 rounded-full"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="h-5 w-5">
                        <path
                          d="M12 21s-6.716-4.238-9.193-6.716C.804 12.28.5 9.5 2.343 7.657a5 5 0 017.071 0L12 10.243l2.586-2.586a5 5 0 017.071 7.071C18.716 16.762 12 21 12 21z"
                          className={favoriteIds.has(car._id) ? 'fill-red-500' : 'fill-transparent'}
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
            ))}

            {/* Enhanced Responsive Pagination */}
            {filteredCars.length > 0 && (
              <div className="mt-8 md:mt-12 mb-8">
                <div className="flex justify-center space-x-2 md:space-x-5 px-2">
                  {/* Previous button */}
                  {currentPage > 1 && (
                    <button 
                      onClick={() => handlePageChange(currentPage - 1)}
                      className="bg-gray-800 hover:bg-amber-600 text-white px-3 md:px-4 py-2 rounded-xl font-bruno text-xs md:text-sm transition-colors"
                    >
                      Prev
                    </button>
                  )}
                  
                  {/* Page numbers - responsive count */}
                  {Array.from({ length: Math.min(typeof window !== 'undefined' && window.innerWidth < 768 ? 3 : 5, totalPages) }, (_, i) => {
                    const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
                    const maxPages = isMobile ? 3 : 5;
                    let pageNum;
                    
                    if (totalPages <= maxPages) {
                      pageNum = i + 1;
                    } else if (currentPage <= 2) {
                      pageNum = i + 1;
                    } else if (currentPage >= totalPages - 1) {
                      pageNum = totalPages - (maxPages - 1) + i;
                    } else {
                      pageNum = currentPage - 1 + i;
                    }

                    return (
                      <button
                        key={pageNum}
                        onClick={() => handlePageChange(pageNum)}
                        className={`w-8 h-8 md:w-10 md:h-10 rounded-xl font-bruno font-bold text-sm md:text-base ${
                          currentPage === pageNum
                            ? 'bg-amber-500 text-black'
                            : 'bg-gray-800 hover:bg-amber-600 text-white'
                        } transition-colors`}
                      >
                        {pageNum}
                      </button>
                    );
                  })}
                  
                  {/* Next button */}
                  {currentPage < totalPages && (
                    <button 
                      onClick={() => handlePageChange(currentPage + 1)}
                      className="bg-gray-800 hover:bg-amber-600 text-white px-3 md:px-4 py-2 rounded-xl font-bruno text-xs md:text-sm transition-colors"
                    >
                      Next
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
      
      <FooterSection />
    </div>
  );
}

export default function CarsPage() {
  return (
    <Suspense fallback={
      <div className="bg-black text-white min-h-screen font-sans">
        <Navbar />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-500"></div>
        </div>
        <FooterSection />
      </div>
    }>
      <CarsPageContent />
    </Suspense>
  );
}