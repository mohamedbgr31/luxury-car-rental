"use client"

import { useState, useEffect } from "react";
import { ChevronRight, Filter } from "lucide-react";

// This component will handle all filtering logic for the car rental site
export default function CarFiltering({ cars, onFilterChange }) {
  // State for all filters
  const [filters, setFilters] = useState({
    priceRange: [80, 2500], // Default min and max from your data
    category: null, // Supercar, Luxury Car, SUV, Convertible
    brand: null, // Rolls Royce, etc.
    fuelType: null, // Petrol, Diesel, Hybrid, Electric
    transmission: null, // Manual, Automatic
    search: ""
  });

  // State to track if filters are active
  const [activeFilters, setActiveFilters] = useState(0);

  // Calculate the actual min and max price from cars data
  const minPrice = Math.min(...cars.map(car => Number(car.price)));
  const maxPrice = Math.max(...cars.map(car => Number(car.price)));

  // Initialize price range with actual data
  useEffect(() => {
    setFilters(prev => ({
      ...prev,
      priceRange: [minPrice, maxPrice]
    }));
  }, [minPrice, maxPrice]);

  // Handle price range changes
  const handlePriceChange = (values) => {
    setFilters(prev => ({
      ...prev,
      priceRange: values
    }));
  };

  // Handle category selection
  const handleCategoryChange = (category) => {
    setFilters(prev => ({
      ...prev,
      category: prev.category === category ? null : category
    }));
  };

  // Handle brand selection
  const handleBrandChange = (brand) => {
    setFilters(prev => ({
      ...prev,
      brand: prev.brand === brand ? null : brand
    }));
  };

  // Handle fuel type selection
  const handleFuelTypeChange = (fuelType) => {
    setFilters(prev => ({
      ...prev,
      fuelType: prev.fuelType === fuelType ? null : fuelType
    }));
  };

  // Handle transmission selection
  const handleTransmissionChange = (transmission) => {
    setFilters(prev => ({
      ...prev,
      transmission: prev.transmission === transmission ? null : transmission
    }));
  };

  // Handle search input
  const handleSearchChange = (e) => {
    setFilters(prev => ({
      ...prev,
      search: e.target.value
    }));
  };

  // Apply all filters to the car data
  const applyFilters = () => {
    let filteredCars = [...cars];

    // Filter by price range
    filteredCars = filteredCars.filter(car => 
      Number(car.price) >= filters.priceRange[0] && 
      Number(car.price) <= filters.priceRange[1]
    );

    // Filter by search term
    if (filters.search.trim()) {
      const searchTerm = filters.search.toLowerCase();
      filteredCars = filteredCars.filter(car => 
        car.title.toLowerCase().includes(searchTerm) ||
        (car.engine && car.engine.toLowerCase().includes(searchTerm)) ||
        (car.year && car.year.toString().includes(searchTerm))
      );
    }

    // Filter by category if selected
    if (filters.category) {
      // Map category to car property (may need to adjust based on your data structure)
      let categoryProp;
      switch (filters.category) {
        case "Supercar":
          categoryProp = "supercar";
          break;
        case "Luxury Car":
          categoryProp = "luxury";
          break;
        case "SUV Car":
          categoryProp = "suv";
          break;
        case "Convertible":
          categoryProp = "convertible";
          break;
        default:
          categoryProp = null;
      }
      
      if (categoryProp) {
        filteredCars = filteredCars.filter(car => 
          car.category === categoryProp || 
          car.title.toLowerCase().includes(categoryProp.toLowerCase())
        );
      }
    }

    // Filter by brand if selected
    if (filters.brand) {
      filteredCars = filteredCars.filter(car => 
        car.title.toLowerCase().includes(filters.brand.toLowerCase())
      );
    }

    // Filter by fuel type if selected
    if (filters.fuelType) {
      filteredCars = filteredCars.filter(car => 
        car.fuel && car.fuel.toLowerCase().includes(filters.fuelType.toLowerCase())
      );
    }

    // Filter by transmission if selected
    if (filters.transmission) {
      filteredCars = filteredCars.filter(car => 
        car.transmission && car.transmission.toLowerCase().includes(filters.transmission.toLowerCase())
      );
    }

    // Count active filters
    let count = 0;
    if (filters.priceRange[0] > minPrice || filters.priceRange[1] < maxPrice) count++;
    if (filters.category) count++;
    if (filters.brand) count++;
    if (filters.fuelType) count++;
    if (filters.transmission) count++;
    if (filters.search) count++;
    setActiveFilters(count);

    // Return filtered cars to parent component
    onFilterChange(filteredCars);
  };

  // Apply filters whenever they change
  useEffect(() => {
    applyFilters();
  }, [filters]);

  // Reset all filters
  const resetFilters = () => {
    setFilters({
      priceRange: [minPrice, maxPrice],
      category: null,
      brand: null,
      fuelType: null,
      transmission: null,
      search: ""
    });
  };

  // Check if a filter is active
  const isActive = (type, value) => {
    return filters[type] === value;
  };

  // Generate active filter class
  const activeClass = "bg-gradient-to-r from-[#FFBB00] to-[#FF9D00] text-black";
  const inactiveClass = "bg-[#1a1a1a] text-white hover:bg-[#222]";

  // Create a FilterButton component
  const FilterButton = ({ type, value, icon, label }) => {
    const active = isActive(type, value);
    return (
      <div 
        className="flex flex-col items-center cursor-pointer transition-all duration-300"
        onClick={() => {
          switch(type) {
            case "category": 
              handleCategoryChange(value); 
              break;
            case "brand": 
              handleBrandChange(value); 
              break;
            case "fuelType": 
              handleFuelTypeChange(value); 
              break;
            case "transmission": 
              handleTransmissionChange(value); 
              break;
          }
        }}
      >
        <div className={`p-3 rounded-full mb-2 transition-all duration-300 ${active ? activeClass : inactiveClass}`}>
          <img src={icon} alt={label} className="h-8 w-8" />
        </div>
        <span className={`font-bruno text-sm ${active ? "text-yellow-400" : "text-white"}`}>{label}</span>
      </div>
    );
  };

  return {
    // Export all filter methods and states for use in the FilterSide component
    filters,
    activeFilters,
    handlePriceChange,
    handleSearchChange,
    resetFilters,
    FilterButton,
    activeClass,
    inactiveClass
  };
}