"use client"

import React, { useState, useEffect } from "react";
import PriceSlider from "../comp-265";
import CarFiltering from "./f";

export default function FilterSide({ cars, onFilterChange }) {
  const [searchValue, setSearchValue] = useState('');
  const [selectedBrand, setSelectedBrand] = useState(null);
  const [showActiveFilters, setShowActiveFilters] = useState(false);
  
  // Available brands from your car data
  const brands = ["Rolls Royce", "Ferrari", "Lamborghini", "Bentley", "Bugatti", "Porsche", "Mercedes", "BMW"];
  
  // Get all filter methods and states from CarFiltering
  const {
    filters,
    activeFilters,
    handlePriceChange,
    handleSearchChange,
    resetFilters,
    FilterButton,
    activeClass,
    inactiveClass
  } = CarFiltering({ cars, onFilterChange });

  // Update search value in both local state and filters
  const updateSearch = (value) => {
    setSearchValue(value);
    handleSearchChange({ target: { value } });
  };

  // Update brand in both local state and filters
  const updateBrand = (brand) => {
    setSelectedBrand(selectedBrand === brand ? null : brand);
  };

  // Categories with their icons
  const categories = [
    { value: "Supercar", icon: "/img/supercar-gold.png", label: "Supercar" },
    { value: "Luxury Car", icon: "/img/luxury-car-gold.png", label: "Luxury Car" },
    { value: "SUV Car", icon: "/img/suvcar-gold.png", label: "SUV Car" },
    { value: "Convertible", icon: "/img/roadster-car-gold.png", label: "Convertible" },
  ];

  // Fuel types with their icons
  const fuelTypes = [
    { value: "Petrol", icon: "/img/fuel-station-gold.png", label: "Petrol" },
    { value: "Diesel", icon: "/img/diesel-gold.png", label: "Diesel" },
    { value: "Hybrid", icon: "/img/fuel-gold.png", label: "Hybrid" },
    { value: "Electric", icon: "/img/flash-gold.png", label: "Electric" },
  ];

  // Transmission types with their icons
  const transmissions = [
    { value: "Manual", icon: "/img/transmission-gold.png", label: "Manual" },
    { value: "Automatic", icon: "/img/gear-gold.png", label: "Automatic" },
  ];

  return (
    <aside className="text-white px-1 py-3 space-y-10 font-playfair">
      {/* Active Filters Summary */}
      {activeFilters > 0 && (
        <div className="bg-[#171616] rounded-xl p-4 shadow-lg border border-gray-800">
          <div className="flex justify-between items-center mb-2">
            <h3 className="font-bruno text-lg text-yellow-400">Active Filters ({activeFilters})</h3>
            <div 
              className="text-yellow-400 underline cursor-pointer text-sm"
              onClick={() => setShowActiveFilters(!showActiveFilters)}
            >
              {showActiveFilters ? "Hide details" : "Show details"}
            </div>
          </div>
          
          {showActiveFilters && (
            <div className="space-y-2 text-sm">
              {filters.search && (
                <div className="flex justify-between">
                  <span>Search:</span>
                  <span className="text-yellow-400">{filters.search}</span>
                </div>
              )}
              {(filters.priceRange[0] > Math.min(...cars.map(car => Number(car.price))) || 
                filters.priceRange[1] < Math.max(...cars.map(car => Number(car.price)))) && (
                <div className="flex justify-between">
                  <span>Price:</span>
                  <span className="text-yellow-400">${filters.priceRange[0]} - ${filters.priceRange[1]}</span>
                </div>
              )}
              {filters.category && (
                <div className="flex justify-between">
                  <span>Category:</span>
                  <span className="text-yellow-400">{filters.category}</span>
                </div>
              )}
              {filters.brand && (
                <div className="flex justify-between">
                  <span>Brand:</span>
                  <span className="text-yellow-400">{filters.brand}</span>
                </div>
              )}
              {filters.fuelType && (
                <div className="flex justify-between">
                  <span>Fuel Type:</span>
                  <span className="text-yellow-400">{filters.fuelType}</span>
                </div>
              )}
              {filters.transmission && (
                <div className="flex justify-between">
                  <span>Transmission:</span>
                  <span className="text-yellow-400">{filters.transmission}</span>
                </div>
              )}
            </div>
          )}
          
          <button 
            onClick={resetFilters}
            className="w-full mt-3 bg-[#1a1a1a] hover:bg-[#222] border border-yellow-600 text-yellow-400 py-1 rounded-md text-sm font-bruno transition-all duration-200"
          >
            Clear All Filters
          </button>
        </div>
      )}

      {/* Search Bar */}
      <div className="flex w-[90%] items-center font-bruno text-2xl bg-gradient-to-r from-[#FFBB00] to-[#FF9D00] hover:opacity-90 transition duration-300 rounded-full px-5 py-1 shadow-md h-12">
        <div className="relative w-full">
          <input
            type="text"
            value={searchValue}
            onChange={(e) => updateSearch(e.target.value)}
            className="bg-transparent outline-none text-black w-full pl-4 pr-10 placeholder-transparent"
            placeholder="Search"
          />
          
          {/* Custom placeholder */}
          {!searchValue && (
            <span className="absolute left-1/4 top-1/2 transform -translate-y-1/2 text-black pointer-events-none">
              Search
            </span>
          )}

          <img
            src="/icons/search.svg"
            alt="Search Icon"
            className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5"
          />
        </div>
      </div>

      {/* Price Range */}
      <div className="custom-price-slider">
        <PriceSlider 
          minValue={Math.min(...cars.map(car => Number(car.price)))} 
          maxValue={Math.max(...cars.map(car => Number(car.price)))}
          onValueChange={handlePriceChange}
        />
      </div>

      {/* Category */}
      <div>
        <h3 className="font-bruno text-xl uppercase text-gray-100 mb-5">Category</h3>
        <div className="grid grid-cols-2 gap-4 text-center">
          {categories.map((category, index) => (
            <FilterButton 
              key={index}
              type="category"
              value={category.value}
              icon={category.icon}
              label={category.label}
            />
          ))}
        </div>
      </div>

      {/* Select Brand */}
      <div className="text-center space-y-2">
        <h3 className="font-bruno text-xl uppercase text-gray-100 mb-5">Select Brand</h3>
        <div className="grid grid-cols-2 gap-2">
          {brands.map((brand, index) => (
            <button 
              key={index}
              className={`font-bruno text-sm py-2 rounded-full shadow-md transition-all duration-300 ${selectedBrand === brand ? activeClass : inactiveClass}`}
              onClick={() => updateBrand(brand)}
            >
              {brand.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      {/* Fuel Type */}
      <div>
        <h3 className="font-bruno text-xl uppercase text-gray-100 mb-5">Fuel Type</h3>
        <div className="grid grid-cols-2 gap-4 text-center">
          {fuelTypes.map((fuelType, index) => (
            <FilterButton 
              key={index}
              type="fuelType"
              value={fuelType.value}
              icon={fuelType.icon}
              label={fuelType.label}
            />
          ))}
        </div>
      </div>

      {/* Transmission */}
      <div>
        <h3 className="font-bruno text-xl uppercase text-gray-100 mb-5">Transmission</h3>
        <div className="grid grid-cols-2 gap-4 text-center">
          {transmissions.map((transmission, index) => (
            <FilterButton 
              key={index}
              type="transmission"
              value={transmission.value}
              icon={transmission.icon}
              label={transmission.label}
            />
          ))}
        </div>
      </div>
    </aside>
  );
}