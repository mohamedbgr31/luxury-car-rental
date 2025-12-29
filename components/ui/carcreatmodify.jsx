import { useState, useEffect } from "react";
import { X, ChevronRight, Car, Activity, Clock, Calendar, Users, Disc, Fuel, Zap, Check } from "lucide-react";

export default function CarManagementPanel({ existingCar = null, onClose, onSave }) {
  // Default values for a new car or use existing car values for modification
  const [car, setCar] = useState({
    brand: existingCar?.brand || "",
    model: existingCar?.model || "",
    categories: existingCar?.categories || {
      supercar: false,
      luxury: false,
      convertible: false
    },
    specs: existingCar?.specs || {
      engine: "V10 ENGINE",
      horsepower: "640 HP",
      transmission: "7-SPEED",
      topSpeed: "325+ KM/H",
      acceleration: "0-100 : 3.1 SEC",
      year: new Date().getFullYear().toString(),
      seats: "2 SEAT",
      driveType: "ALL-WHEEL DRIVE",
      engineSize: "5.2 L"
    },
    pricing: existingCar?.pricing || {
      daily: "2500",
      weekly: "15000",
      monthly: "70000"
    },
    features: existingCar?.features || [
      "Free Delivery",
      "250 KM/DAY EXTRA CHARGE FOR EXCESS KM",
      "FREE CANCELLATION WITHIN 24 HOURS",
      "VIP AIRPORT PICKUP, SPECIAL SERVICE, SPECIAL REQUESTS"
    ],
    mileage: existingCar?.mileage || {
      limit: "300",
      additionalCharge: "10"
    },
    state: existingCar?.state || "Available",
    fuelType: existingCar?.fuelType || "Petrol" // Options: Petrol, Hybrid, Diesel, Electric
  });

  // Function to update car state
  const handleChange = (field, value) => {
    setCar({ ...car, [field]: value });
  };

  // Function to update categories
  const handleCategoryToggle = (category) => {
    setCar({
      ...car,
      categories: {
        ...car.categories,
        [category]: !car.categories[category]
      }
    });
  };

  // Function to update specs
  const handleSpecChange = (spec, value) => {
    setCar({
      ...car,
      specs: {
        ...car.specs,
        [spec]: value
      }
    });
  };

  // Function to update pricing
  const handlePricingChange = (period, value) => {
    setCar({
      ...car,
      pricing: {
        ...car.pricing,
        [period]: value
      }
    });
  };

  // Function to update features
  const handleFeatureChange = (index, value) => {
    const newFeatures = [...car.features];
    newFeatures[index] = value;
    setCar({
      ...car,
      features: newFeatures
    });
  };

  // Function to update mileage
  const handleMileageChange = (field, value) => {
    setCar({
      ...car,
      mileage: {
        ...car.mileage,
        [field]: value
      }
    });
  };

  // Function to update state
  const handleStateChange = (value) => {
    setCar({
      ...car,
      state: value
    });
  };

  // Function to update fuel type
  const handleFuelTypeChange = (value) => {
    setCar({
      ...car,
      fuelType: value
    });
  };

  // Function to save car
  const handleSave = () => {
    if (onSave) {
      onSave(car);
    }
  };

  return (
    <div className="bg-gray-900 text-white p-6 rounded-lg max-w-2xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-white">
          {existingCar ? "MODIFY" : "CREATE"}
        </h1>
        <button
          onClick={onClose}
          className="text-yellow-500 hover:text-yellow-400"
        >
          <X size={24} />
        </button>
      </div>

      {/* Brand and Model Section */}
      <div className="mb-6 space-y-4">
        <div className="flex flex-col">
          <label className="text-gray-400 mb-2">BRAND :</label>
          <input
            type="text"
            value={car.brand}
            onChange={(e) => handleChange("brand", e.target.value)}
            className="bg-yellow-500 text-black font-medium p-2 rounded"
            placeholder="LAMBORGHINI"
          />
        </div>

        <div className="flex flex-col">
          <label className="text-gray-400 mb-2">TITLE :</label>
          <input
            type="text"
            value={car.model}
            onChange={(e) => handleChange("model", e.target.value)}
            className="bg-yellow-500 text-black font-medium p-2 rounded"
            placeholder="LAMBORGHINI HURACAN EVO SPYDER 2020"
          />
        </div>
      </div>

      {/* Car Category */}
      <div className="mb-8">
        <h2 className="text-xl font-medium mb-4">CAR CATEGORY</h2>
        <div className="grid grid-cols-2 gap-4">
          <CategoryButton 
            label="SUPERCAR" 
            icon={<Car size={20} />} 
            isSelected={car.categories.supercar}
            onClick={() => handleCategoryToggle("supercar")}
          />
          <CategoryButton 
            label="LUXURY" 
            icon={<Car size={20} />} 
            isSelected={car.categories.luxury}
            onClick={() => handleCategoryToggle("luxury")}
          />
          <CategoryButton 
            label="SUPERCAR" 
            icon={<Car size={20} />} 
            isSelected={car.categories.supercar}
            onClick={() => handleCategoryToggle("supercar")}
          />
          <CategoryButton 
            label="CONVERTIBLE" 
            icon={<Car size={20} />} 
            isSelected={car.categories.convertible}
            onClick={() => handleCategoryToggle("convertible")}
          />
        </div>
      </div>

      {/* Car Specs */}
      <div className="mb-8">
        <h2 className="text-xl font-medium mb-4">CAR SPEC</h2>
        <div className="grid grid-cols-3 gap-4">
          <SpecInput 
            icon={<Activity size={20} />}
            value={car.specs.engine}
            onChange={(value) => handleSpecChange("engine", value)}
          />
          <SpecInput 
            icon={<ChevronRight size={20} />}
            value={car.specs.horsepower}
            onChange={(value) => handleSpecChange("horsepower", value)}
          />
          <SpecInput 
            icon={<Activity size={20} />}
            value={car.specs.transmission}
            onChange={(value) => handleSpecChange("transmission", value)}
          />
          <SpecInput 
            icon={<Activity size={20} />}
            value={car.specs.topSpeed}
            onChange={(value) => handleSpecChange("topSpeed", value)}
          />
          <SpecInput 
            icon={<Clock size={20} />}
            value={car.specs.acceleration}
            onChange={(value) => handleSpecChange("acceleration", value)}
          />
          <SpecInput 
            icon={<Calendar size={20} />}
            value={car.specs.year}
            onChange={(value) => handleSpecChange("year", value)}
          />
          <SpecInput 
            icon={<Users size={20} />}
            value={car.specs.seats}
            onChange={(value) => handleSpecChange("seats", value)}
          />
          <SpecInput 
            icon={<Disc size={20} />}
            value={car.specs.driveType}
            onChange={(value) => handleSpecChange("driveType", value)}
          />
          <SpecInput 
            icon={<Fuel size={20} />}
            value={car.specs.engineSize}
            onChange={(value) => handleSpecChange("engineSize", value)}
          />
        </div>
      </div>

      {/* Pricing */}
      <div className="mb-8">
        <h2 className="text-xl font-medium mb-4">PRICING</h2>
        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="text-gray-400 block mb-2">DAILY :</label>
            <div className="bg-yellow-500 rounded text-black flex">
              <input
                type="text"
                value={car.pricing.daily}
                onChange={(e) => handlePricingChange("daily", e.target.value)}
                className="bg-transparent p-2 flex-grow outline-none"
              />
              <span className="p-2 font-medium">AED</span>
            </div>
          </div>
          <div>
            <label className="text-gray-400 block mb-2">WEEKLY :</label>
            <div className="bg-yellow-500 rounded text-black flex">
              <input
                type="text"
                value={car.pricing.weekly}
                onChange={(e) => handlePricingChange("weekly", e.target.value)}
                className="bg-transparent p-2 flex-grow outline-none"
              />
              <span className="p-2 font-medium">AED</span>
            </div>
          </div>
          <div>
            <label className="text-gray-400 block mb-2">MONTHLY :</label>
            <div className="bg-yellow-500 rounded text-black flex">
              <input
                type="text"
                value={car.pricing.monthly}
                onChange={(e) => handlePricingChange("monthly", e.target.value)}
                className="bg-transparent p-2 flex-grow outline-none"
              />
              <span className="p-2 font-medium">AED</span>
            </div>
          </div>
        </div>
      </div>

      {/* Features */}
      <div className="mb-8">
        <h2 className="text-xl font-medium mb-4">FEATURES</h2>
        <div className="space-y-3">
          {car.features.map((feature, index) => (
            <div key={index} className="bg-yellow-500 rounded text-black p-2">
              <input
                type="text"
                value={feature}
                onChange={(e) => handleFeatureChange(index, e.target.value)}
                className="bg-transparent w-full outline-none"
              />
            </div>
          ))}
        </div>
      </div>

      {/* Mileage */}
      <div className="mb-8">
        <h2 className="text-xl font-medium mb-4">MILEAGE</h2>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-gray-400 block mb-2">MILEAGE LIMIT</label>
            <div className="bg-yellow-500 rounded text-black flex">
              <input
                type="text"
                value={car.mileage.limit}
                onChange={(e) => handleMileageChange("limit", e.target.value)}
                className="bg-transparent p-2 flex-grow outline-none"
              />
              <span className="p-2 font-medium">KM</span>
            </div>
          </div>
          <div>
            <label className="text-gray-400 block mb-2">ADDITIONAL MILEAGE CHARGE</label>
            <div className="bg-yellow-500 rounded text-black flex">
              <input
                type="text"
                value={car.mileage.additionalCharge}
                onChange={(e) => handleMileageChange("additionalCharge", e.target.value)}
                className="bg-transparent p-2 flex-grow outline-none"
              />
              <span className="p-2 font-medium">AED / KM</span>
            </div>
          </div>
        </div>
      </div>

      {/* State */}
      <div className="mb-8">
        <h2 className="text-xl font-medium mb-4">STATE</h2>
        <div className="grid grid-cols-2 gap-4">
          <button
            className={`p-3 rounded ${car.state === "Available" ? "bg-yellow-500 text-black" : "bg-gray-800 text-white"}`}
            onClick={() => handleStateChange("Available")}
          >
            <div className="flex items-center space-x-2">
              <Check size={20} />
              <span>Available</span>
            </div>
          </button>
          <button
            className={`p-3 rounded ${car.state === "Not-Available" ? "bg-yellow-500 text-black" : "bg-gray-800 text-white"}`}
            onClick={() => handleStateChange("Not-Available")}
          >
            <span>Not-Available</span>
          </button>
        </div>
      </div>

      {/* Fuel Type */}
      <div className="mb-8">
        <h2 className="text-xl font-medium mb-4">FUEL TYPE</h2>
        <div className="grid grid-cols-4 gap-4">
          <button
            className={`p-4 rounded flex flex-col items-center justify-center ${car.fuelType === "Petrol" ? "bg-gray-800 border-2 border-yellow-500" : "bg-gray-800"}`}
            onClick={() => handleFuelTypeChange("Petrol")}
          >
            <Fuel size={24} className="text-yellow-500 mb-2" />
            <span className="text-sm">PETROL</span>
          </button>
          <button
            className={`p-4 rounded flex flex-col items-center justify-center ${car.fuelType === "Hybrid" ? "bg-gray-800 border-2 border-yellow-500" : "bg-gray-800"}`}
            onClick={() => handleFuelTypeChange("Hybrid")}
          >
            <div className="text-yellow-500 mb-2">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M7 2v11m0 0a4 4 0 0 0 4 4h2a4 4 0 0 0 4-4v-4M7 13h10" />
                <path d="M15 5l2 2l2-2" />
              </svg>
            </div>
            <span className="text-sm">HYBRID</span>
          </button>
          <button
            className={`p-4 rounded flex flex-col items-center justify-center ${car.fuelType === "Diesel" ? "bg-gray-800 border-2 border-yellow-500" : "bg-gray-800"}`}
            onClick={() => handleFuelTypeChange("Diesel")}
          >
            <Fuel size={24} className="text-yellow-500 mb-2" />
            <span className="text-sm">DIESEL</span>
          </button>
          <button
            className={`p-4 rounded flex flex-col items-center justify-center ${car.fuelType === "Electric" ? "bg-gray-800 border-2 border-yellow-500" : "bg-gray-800"}`}
            onClick={() => handleFuelTypeChange("Electric")}
          >
            <Zap size={24} className="text-yellow-500 mb-2" />
            <span className="text-sm">ELECTRIC</span>
          </button>
        </div>
      </div>

      {/* Save Button */}
      <div className="flex justify-center mt-8">
        <button
          onClick={handleSave}
          className="bg-yellow-500 hover:bg-yellow-600 text-black font-bold py-3 px-8 rounded"
        >
          {existingCar ? "UPDATE" : "CREATE"} CAR
        </button>
      </div>
    </div>
  );
}

// Component for category buttons
function CategoryButton({ label, icon, isSelected, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center space-x-2 p-3 rounded 
        ${isSelected ? 'bg-gray-800 border-b-2 border-yellow-500' : 'bg-gray-800'}`}
    >
      <span className="text-yellow-500">{icon}</span>
      <span className="font-medium">{label}</span>
    </button>
  );
}

// Component for spec inputs
function SpecInput({ icon, value, onChange }) {
  return (
    <div className="bg-gray-800 p-3 rounded flex items-center space-x-3">
      <span className="text-yellow-500">{icon}</span>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="bg-transparent text-white flex-grow outline-none"
      />
    </div>
  );
}