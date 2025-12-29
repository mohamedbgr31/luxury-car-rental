"use client";
import React, { useState, useEffect, useRef } from "react";
import { X, ChevronRight, Car, Activity, Clock, Calendar, Users, Disc, Fuel, Zap, Check, Plus, Search, Trash, Edit } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Upload, Image as ImageIcon, Trash2 } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import Sidebar from "@/components/ui/sidebar";

// CategoryButton component
const CategoryButton = ({ label, icon, isSelected, onClick }) => (
  <button
    className={`p-3 rounded flex items-center space-x-2 ${isSelected ? "bg-yellow-500 text-black" : "bg-gray-800 text-white"
      }`}
    onClick={onClick}
  >
    <span>{icon}</span>
    <span>{label}</span>
  </button>
);
// ImagePreview component for showing uploaded images
const ImagePreview = ({ src, onRemove, isMain }) => (
  <div className="relative group">
    <div className={`h-24 w-full rounded overflow-hidden ${isMain ? "border-2 border-yellow-500" : ""}`}>
      <img src={src} className="w-full h-full object-cover" alt="Car" />
    </div>
    <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
      <button
        onClick={onRemove}
        className="p-1 bg-red-500 rounded-full text-white hover:bg-red-600 transition-colors"
      >
        <Trash2 size={16} />
      </button>
    </div>
    {isMain && (
      <div className="absolute top-0 left-0 bg-yellow-500 text-black text-xs px-1 py-0.5">
        Main
      </div>
    )}
  </div>
);

function CarManagementPanel({ existingCar = null, onClose, onSave }) {
  // Default values for a new car or use existing car values for modification
  const [car, setCar] = useState(
    existingCar || {
      id: existingCar?.id || "",
      brand: "",
      model: "",
      mainImage: "/img/default-car.jpg", // Default main image
      galleryImages: [], // Array to store gallery images
      galleryVideos: [], // Array to store gallery videos
      logo: "/img/default-logo.png", // Default logo
      categories: {
        supercar: false,
        luxury: false,
        sports: false,
        convertible: false
      },
      specs: [
        { icon: "/img/car-engine.png", label: "V10" },
        { icon: "/img/big-black-horse-walking-side-silhouette-avec-queue-et-un-pied-vers-le-haut.png", label: "640" },
        { icon: "/img/fuel-station.png", label: "5.2L" },
      ],
      transmission: existingCar?.transmission || "",
      topSpeed: existingCar?.topSpeed || "",
      seats: existingCar?.seats || "",
      drive: existingCar?.drive || "",
      pricing: {
        daily: "2500",
        weekly: "15000",
        monthly: "70000"
      },
      description: existingCar?.description || "",
      features: [
        "Free Delivery",
        "250 KM/DAY EXTRA CHARGE FOR EXCESS KM",
        "FREE CANCELLATION WITHIN 24 HOURS",
        "VIP AIRPORT PICKUP, SPECIAL SERVICE, SPECIAL REQUESTS"
      ],
      rentalRequirements: existingCar?.rentalRequirements || [
        "Minimum 21 years old",
        "Valid UAE Driving License or International Driving Permit",
        "Passport or Emirates ID",
        "Security Deposit (10,000 AED via credit card)",
        "Clean driving record"
      ],
      faqs: existingCar?.faqs || [
        { question: "What documents do I need to rent this car?", answer: "You'll need a valid UAE driving license or International Driving Permit, passport or Emirates ID, and a credit card for the security deposit." },
        { question: "Is there a mileage limit?", answer: "Yes, the standard rental includes 300km per day. Additional kilometers are charged at 5 AED per km." },
        { question: "Can I extend my rental period?", answer: "Yes, extensions are possible subject to availability. Please contact us at least 24 hours before your scheduled return." },
        { question: "What is the security deposit amount?", answer: "The security deposit for the Lamborghini Huracan is 10,000 AED, which is fully refundable upon return of the vehicle in its original condition." }
      ],
      mileage: {
        limit: "300",
        additionalCharge: "10"
      },
      state: "Available",
      fuelType: "Petrol",
      year: new Date().getFullYear().toString()
    }
  );

  const [brands, setBrands] = useState([]);
  const [showBrandSelection, setShowBrandSelection] = useState(false);

  // Refs for file inputs
  const mainImageInputRef = useRef(null);
  const logoInputRef = useRef(null);
  const galleryImageInputRef = useRef(null);
  const galleryVideoInputRef = useRef(null);

  useEffect(() => {
    const fetchBrands = async () => {
      try {
        const response = await fetch('/api/brands');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setBrands(data);
      } catch (error) {
        console.error("Error fetching brands:", error);
      }
    };
    fetchBrands();
  }, []);

  // Function to update car state
  const handleChange = (field, value) => {
    setCar({ ...car, [field]: value });
  };

  // Function to handle gallery video upload
  const handleGalleryVideoUpload = (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    files.forEach(file => {
      const reader = new FileReader();
      reader.onload = (e) => {
        setCar(prevCar => ({
          ...prevCar,
          galleryVideos: [...prevCar.galleryVideos, e.target.result]
        }));
      };
      reader.readAsDataURL(file);
    });
  };

  // Function to remove a gallery video
  const handleRemoveGalleryVideo = (index) => {
    const newGalleryVideos = [...car.galleryVideos];
    newGalleryVideos.splice(index, 1);
    setCar({
      ...car,
      galleryVideos: newGalleryVideos
    });
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
  const handleSpecChange = (index, field, value) => {
    const newSpecs = [...car.specs];
    newSpecs[index] = { ...newSpecs[index], [field]: value };
    setCar({ ...car, specs: newSpecs });
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

  // Function to add a new feature
  const handleAddFeature = () => {
    setCar({
      ...car,
      features: [...car.features, "New Feature"]
    });
  };

  // Function to remove a feature
  const handleRemoveFeature = (index) => {
    const newFeatures = [...car.features];
    newFeatures.splice(index, 1);
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


  const compressImage = (file, maxWidth = 800, maxHeight = 600, quality = 0.7) => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        const img = new Image();
        img.onload = () => {
          // Calculate new dimensions maintaining aspect ratio
          let width = img.width;
          let height = img.height;

          if (width > height) {
            if (width > maxWidth) {
              height = Math.round((height * maxWidth) / width);
              width = maxWidth;
            }
          } else {
            if (height > maxHeight) {
              width = Math.round((width * maxHeight) / height);
              height = maxHeight;
            }
          }

          // Create canvas and resize image
          const canvas = document.createElement('canvas');
          canvas.width = width;
          canvas.height = height;

          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0, width, height);

          // Get resized image as data URL
          const dataUrl = canvas.toDataURL('image/jpeg', quality);
          resolve(dataUrl);
        };
        img.src = event.target.result;
      };
      reader.readAsDataURL(file);
    });
  };


  // Function to handle main image upload
  const handleMainImageUpload = async (event) => {
    const file = event.target.files[0];
    if (file) {
      try {
        // Compress the image
        const compressedImage = await compressImage(file);
        setCar({
          ...car,
          mainImage: compressedImage
        });
      } catch (error) {
        console.error("Error compressing image:", error);
        alert("Failed to process image. Please try a smaller image.");
      }
    }
  };


  // Function to handle gallery image upload
  const handleGalleryImageUpload = async (event) => {
    const files = Array.from(event.target.files);
    if (files.length) {
      try {
        // Process each file with compression
        const compressedImages = await Promise.all(
          files.map(file => compressImage(file))
        );

        setCar({
          ...car,
          galleryImages: [...car.galleryImages, ...compressedImages]
        });
      } catch (error) {
        console.error("Error compressing images:", error);
        alert("Failed to process some images. Please try smaller images.");
      }
    }
  };

  // Function to remove a gallery image
  const handleRemoveGalleryImage = (index) => {
    const newGalleryImages = [...car.galleryImages];
    newGalleryImages.splice(index, 1);
    setCar({
      ...car,
      galleryImages: newGalleryImages
    });
  };

  // Function to set a gallery image as main image
  const setAsMainImage = (imageUrl) => {
    // Add current main image to gallery if it's not the default
    let newGallery = [...car.galleryImages];
    if (car.mainImage !== "/img/default-car.jpg") {
      newGallery.push(car.mainImage);
    }

    // Remove the selected image from gallery
    newGallery = newGallery.filter(img => img !== imageUrl);

    // Set the selected image as main
    setCar({
      ...car,
      mainImage: imageUrl,
      galleryImages: newGallery
    });
  };

  // Function to remove main image
  const handleRemoveMainImage = () => {
    setCar({
      ...car,
      mainImage: "/img/default-car.jpg"
    });
  };

  // Function to save car
  const handleSave = () => {
    if (onSave) {
      // Validate required fields
      if (!car.brand || !car.model) {
        alert("Brand and Model are required!");
        return;
      }

      onSave(car);
    }
  };

  return (
    <div className="bg-[#1a1a1a] font-bruno text-white p-6 rounded-lg shadow-xl border border-gray-800 max-h-screen overflow-y-auto car-management-panel">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-yellow-500">
          {existingCar ? "MODIFY CAR" : "CREATE NEW CAR"}
        </h1>
        <button
          onClick={onClose}
          className="text-yellow-500 hover:text-yellow-400 p-2 rounded-full hover:bg-gray-800 transition-colors"
        >
          <X size={24} />
        </button>
      </div>

      {/* Brand and Model Section */}
      <div className="mb-6 space-y-4">
        <div className="flex flex-col">
          <label className="text-gray-400 mb-2">BRAND :</label>
          <Dialog open={showBrandSelection} onOpenChange={setShowBrandSelection}>
            <DialogTrigger asChild>
              <Button className="w-full bg-gradient-to-r from-[#FFBB00] to-[#FF9D00] text-black font-medium p-2 rounded-2xl flex justify-between items-center">
                <span>{car.brand || "Select a Brand"}</span>
                <ChevronRight size={20} />
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-[#1a1a1a] text-white p-6 rounded-lg shadow-xl border border-gray-800 max-w-md">
              <DialogHeader>
                <DialogTitle className="text-xl font-bold text-yellow-500">Select Brand</DialogTitle>
              </DialogHeader>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mt-4 max-h-[60vh] overflow-y-auto custom-scrollbar">
                {brands.map((brandItem) => (
                  <button
                    key={brandItem._id}
                    className={`flex flex-col items-center p-3 rounded-lg border ${car.brand === brandItem.name ? "border-yellow-500 bg-gray-700" : "border-gray-800 bg-gray-800"} hover:bg-gray-700 transition-colors`}
                    onClick={() => {
                      handleChange("brand", brandItem.name);
                      // Assuming brandItem has a 'logo' field
                      setCar(prevCar => ({ ...prevCar, logo: brandItem.logo || "/img/default-logo.png" }));
                      setShowBrandSelection(false);
                    }}
                  >
                    {brandItem.logo && (
                      <img src={brandItem.logo} alt={brandItem.name} className="w-16 h-16 object-contain mb-2" />
                    )}
                    <span className="text-sm text-center">{brandItem.name}</span>
                  </button>
                ))}
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <div className="flex flex-col">
          <label className="text-gray-400 mb-2">MODEL :</label>
          <input
            type="text"
            value={car.model}
            onChange={e => handleChange("model", e.target.value)}
            className="bg-gray-800 text-white p-2 rounded-lg border border-gray-700 focus:border-yellow-500 outline-none"
            placeholder="Enter model"
          />
        </div>
        {/* Car Card Name (Title) Input */}
        <div className="flex flex-col">
          <label className="text-gray-400 mb-2">CAR CARD NAME :</label>
          <input
            type="text"
            value={car.title || ''}
            onChange={e => handleChange("title", e.target.value)}
            className="bg-gray-800 text-white p-2 rounded-lg border border-gray-700 focus:border-yellow-500 outline-none"
            placeholder="Enter car card name (title)"
          />
        </div>

        <div className="flex flex-col">
          <label className="text-gray-400 mb-2">YEAR :</label>
          <input
            type="text"
            value={car.year}
            onChange={(e) => handleChange("year", e.target.value)}
            className="bg-gradient-to-r from-[#FFBB00] to-[#FF9D00] text-black font-medium p-2 rounded-2xl"
            placeholder="2023"
          />
        </div>
      </div>

      {/* Main Image Upload */}
      <div className="mb-8">
        <h2 className="text-xl font-medium mb-4">MAIN CAR IMAGE</h2>
        <div className="flex items-center space-x-4">
          <div
            className="relative md:w-[35%] w-full overflow-hidden rounded-lg group transition-all duration-500"
          >
            <img
              src={car.mainImage || '/img/default-car.jpg'}
              alt={car.title}
              className="w-full h-full object-cover transform transition-transform duration-500 group-hover:scale-105"
            />
            {/* Inner shadow overlay for better visual quality */}
            <div
              className="absolute inset-0 z-10 pointer-events-none"
              style={{
                boxShadow: 'inset 0 0 60px 20px #141215, inset 0 -40px 80px 0px #000',
                borderRadius: 'inherit',
              }}
            />
          </div>
          <div className="flex flex-col space-y-2">
            <button
              onClick={() => mainImageInputRef.current.click()}
              className="bg-gradient-to-r from-[#FFBB00] to-[#FF9D00] text-black py-2 px-4 rounded flex items-center justify-center space-x-2 hover:bg-yellow-600 transition-colors"
            >
              <Upload size={16} />
              <span>Upload Main Image</span>
            </button>
            {car.mainImage !== "/img/default-car.jpg" && (
              <button
                onClick={handleRemoveMainImage}
                className="bg-gray-700 text-white py-2 px-4 rounded flex items-center justify-center space-x-2 hover:bg-gray-600 transition-colors"
              >
                <Trash2 size={16} />
                <span>Remove</span>
              </button>
            )}
          </div>
          <input
            ref={mainImageInputRef}
            type="file"
            accept="image/*"
            onChange={handleMainImageUpload}
            className="hidden"
          />
        </div>
      </div>

      {/* Gallery Images Upload */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-medium">CAR GALLERY</h2>
          <div className="flex space-x-2">
            <button
              onClick={() => galleryImageInputRef.current.click()}
              className="bg-gradient-to-r from-[#FFBB00] to-[#FF9D00] text-black p-2 rounded flex items-center space-x-2 hover:bg-yellow-600 transition-colors"
            >
              <ImageIcon size={16} />
              <span>Add Images</span>
            </button>
            <button
              onClick={() => galleryVideoInputRef.current.click()}
              className="bg-gradient-to-r from-[#FFBB00] to-[#FF9D00] text-black p-2 rounded flex items-center space-x-2 hover:bg-yellow-600 transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="23 7 16 12 23 17 23 7" />
                <rect x="1" y="5" width="15" height="14" rx="2" ry="2" />
              </svg>
              <span>Add Videos</span>
            </button>
          </div>
          <input
            ref={galleryImageInputRef}
            type="file"
            accept="image/*"
            multiple
            onChange={handleGalleryImageUpload}
            className="hidden"
          />
          <input
            ref={galleryVideoInputRef}
            type="file"
            accept="video/*"
            multiple
            onChange={handleGalleryVideoUpload}
            className="hidden"
          />
        </div>

        {car.galleryImages.length > 0 ? (
          <div className="grid grid-cols-4 gap-4">
            {car.galleryImages.map((image, index) => (
              <div key={index} className="relative group">
                <ImagePreview
                  src={image}
                  onRemove={() => handleRemoveGalleryImage(index)}
                  isMain={false}
                />
                <button
                  onClick={() => setAsMainImage(image)}
                  className="absolute top-0 right-0 mt-1 mr-1 bg-yellow-500 text-black p-1 rounded text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  Set as Main
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-gray-800 p-6 rounded border border-dashed border-gray-600 text-center">
            <p className="text-gray-400 mb-2">No gallery images yet</p>
            <p className="text-xs text-gray-500">Upload images to display in car gallery</p>
          </div>
        )}

        {/* Gallery Videos Display */}
        {car.galleryVideos.length > 0 && (
          <div className="mt-4">
            <h3 className="text-lg font-medium mb-2">Gallery Videos</h3>
            <div className="grid grid-cols-4 gap-4">
              {car.galleryVideos.map((video, index) => (
                <div key={`video-${index}`} className="relative group">
                  <div className="h-24 w-full rounded overflow-hidden bg-gray-800 flex items-center justify-center">
                    <video className="h-full w-full object-cover">
                      <source src={video} type="video/mp4" />
                      Your browser does not support the video tag.
                    </video>
                    <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <button
                        onClick={() => handleRemoveGalleryVideo(index)}
                        className="p-1 bg-red-500 rounded-full text-white hover:bg-red-600 transition-colors"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
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
            label="SPORTS CAR"
            icon={<Car size={20} />}
            isSelected={car.categories.sports}
            onClick={() => handleCategoryToggle("sports")}
          />
          <CategoryButton
            label="CONVERTIBLE"
            icon={<Car size={20} />}
            isSelected={car.categories.convertible}
            onClick={() => handleCategoryToggle("convertible")}
          />
        </div>
      </div>

      {/* Specs (Editable List) */}
      <div className="mb-6">
        <h4 className="text-xl font-bold text-white mb-4">Main Specifications</h4>
        <div className="space-y-3">
          {car.specs.map((spec, index) => (
            <div key={index} className="flex items-center space-x-2">
              <input
                type="text"
                value={spec.icon}
                onChange={e => handleSpecChange(index, 'icon', e.target.value)}
                className="flex-grow bg-zinc-700 border border-zinc-600 rounded-lg p-3 text-white focus:outline-none focus:border-yellow-500"
                placeholder="Icon path (e.g. /img/car-engine.png)"
              />
              <input
                type="text"
                value={spec.label}
                onChange={e => handleSpecChange(index, 'label', e.target.value)}
                className="flex-grow bg-zinc-700 border border-zinc-600 rounded-lg p-3 text-white focus:outline-none focus:border-yellow-500"
                placeholder="Label (e.g. V10)"
              />
              <button
                onClick={() => {
                  const newSpecs = [...car.specs];
                  newSpecs.splice(index, 1);
                  setCar({ ...car, specs: newSpecs });
                }}
                className="p-2 bg-red-500 rounded-full text-white hover:bg-red-600 transition-colors"
              >
                <X size={20} />
              </button>
            </div>
          ))}
          <button
            onClick={() => setCar({ ...car, specs: [...car.specs, { icon: '', label: '' }] })}
            className="w-full flex items-center justify-center space-x-2 p-3 bg-yellow-500 text-black font-semibold rounded-lg hover:bg-yellow-600 transition-colors"
          >
            <Plus size={20} />
            <span>Add Spec</span>
          </button>
        </div>
      </div>

      {/* New Specs: Transmission, Top Speed, Seats, Drive */}
      <div className="mb-6">
        <h4 className="text-xl font-bold text-white mb-4">Additional Specifications</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Transmission */}
          <div className="flex flex-col gap-2">
            <label className="block text-gray-400 text-sm mb-1">Transmission (e.g., Auto, Manual)</label>
            <input
              type="text"
              value={car.transmission}
              onChange={(e) => handleChange("transmission", e.target.value)}
              className="w-full bg-zinc-700 border border-zinc-600 rounded-lg p-3 text-white focus:outline-none focus:border-yellow-500"
              placeholder="Auto"
            />
          </div>
          {/* Top Speed */}
          <div className="flex flex-col gap-2">
            <label className="block text-gray-400 text-sm mb-1">Top Speed (e.g., 325 KM/H)</label>
            <input
              type="text"
              value={car.topSpeed}
              onChange={(e) => handleChange("topSpeed", e.target.value)}
              className="w-full bg-zinc-700 border border-zinc-600 rounded-lg p-3 text-white focus:outline-none focus:border-yellow-500"
              placeholder="325 KM/H"
            />
          </div>
          {/* Seats */}
          <div className="flex flex-col gap-2">
            <label className="block text-gray-400 text-sm mb-1">Number of Seats (e.g., 2 SEAT)</label>
            <input
              type="text"
              value={car.seats}
              onChange={(e) => handleChange("seats", e.target.value)}
              className="w-full bg-zinc-700 border border-zinc-600 rounded-lg p-3 text-white focus:outline-none focus:border-yellow-500"
              placeholder="2 SEAT"
            />
          </div>
          {/* Drive Type */}
          <div className="flex flex-col gap-2">
            <label className="block text-gray-400 text-sm mb-1">Drive Type (e.g., AWD, RWD, FWD)</label>
            <input
              type="text"
              value={car.drive}
              onChange={(e) => handleChange("drive", e.target.value)}
              className="w-full bg-zinc-700 border border-zinc-600 rounded-lg p-3 text-white focus:outline-none focus:border-yellow-500"
              placeholder="AWD"
            />
          </div>
        </div>
      </div>

      {/* About This Car Description */}
      <div className="mb-6">
        <h4 className="text-xl font-bold text-white mb-4">About This Car (Description)</h4>
        <textarea
          value={car.description}
          onChange={(e) => handleChange("description", e.target.value)}
          rows="5"
          className="w-full bg-zinc-700 border border-zinc-600 rounded-lg p-3 text-white placeholder-gray-400 focus:outline-none focus:border-yellow-500 resize-y"
          placeholder="Enter a detailed description about the car..."
        ></textarea>
      </div>

      {/* Pricing */}
      <div className="mb-8">
        <h2 className="text-xl font-medium mb-4">PRICING</h2>
        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="text-gray-400 block mb-2">DAILY :</label>
            <div className="bg-gradient-to-r from-[#FFBB00] to-[#FF9D00] rounded-xl text-black flex">
              <input
                type="text"
                value={car.pricing.daily}
                onChange={(e) => handlePricingChange("daily", e.target.value)}
                className="bg-transparent p-2 flex-grow outline-none "
              />
              <span className="p-2 font-medium">$</span>
            </div>
          </div>
          <div>
            <label className="text-gray-400 block mb-2">WEEKLY :</label>
            <div className="bg-gradient-to-r from-[#FFBB00] to-[#FF9D00] rounded-xl text-black flex">
              <input
                type="text"
                value={car.pricing.weekly}
                onChange={(e) => handlePricingChange("weekly", e.target.value)}
                className="bg-transparent p-2 flex-grow outline-none "
              />
              <span className="p-2 font-medium">$</span>
            </div>
          </div>
          <div>
            <label className="text-gray-400 block mb-2">MONTHLY :</label>
            <div className="bg-gradient-to-r from-[#FFBB00] to-[#FF9D00] rounded-xl text-black flex">
              <input
                type="text"
                value={car.pricing.monthly}
                onChange={(e) => handlePricingChange("monthly", e.target.value)}
                className="bg-transparent p-2 flex-grow outline-none "
              />
              <span className="p-2 font-medium">$</span>
            </div>
          </div>
        </div>
      </div>

      {/* Features */}
      <div className="mb-8">
        <h2 className="text-xl font-medium text-white mb-4">FEATURES</h2>
        <div className="space-y-3">
          {car.features.map((feature, index) => (
            <div key={index} className="flex items-center space-x-2">
              <input
                type="text"
                value={feature}
                onChange={(e) => handleFeatureChange(index, e.target.value)}
                className="flex-grow bg-zinc-700 border border-zinc-600 rounded-lg p-3 text-white focus:outline-none focus:border-yellow-500"
                placeholder="Enter feature description"
              />
              <button
                onClick={() => handleRemoveFeature(index)}
                className="p-2 bg-red-500 rounded-full text-white hover:bg-red-600 transition-colors"
              >
                <X size={20} />
              </button>
            </div>
          ))}
          <button
            onClick={handleAddFeature}
            className="w-full flex items-center justify-center space-x-2 p-3 bg-yellow-500 text-black font-semibold rounded-lg hover:bg-yellow-600 transition-colors"
          >
            <Plus size={20} />
            <span>Add Feature</span>
          </button>
        </div>
      </div>

      {/* Rental Requirements Section */}
      <div className="mb-6">
        <h4 className="text-xl font-bold text-white mb-4">Rental Requirements</h4>
        <div className="space-y-3">
          {car.rentalRequirements.map((req, index) => (
            <div key={index} className="flex items-center space-x-2">
              <input
                type="text"
                value={req}
                onChange={(e) => {
                  const newReqs = [...car.rentalRequirements];
                  newReqs[index] = e.target.value;
                  setCar({ ...car, rentalRequirements: newReqs });
                }}
                className="flex-grow bg-zinc-700 border border-zinc-600 rounded-lg p-3 text-white focus:outline-none focus:border-yellow-500"
                placeholder="Enter rental requirement"
              />
              <button
                onClick={() => {
                  const newReqs = [...car.rentalRequirements];
                  newReqs.splice(index, 1);
                  setCar({ ...car, rentalRequirements: newReqs });
                }}
                className="p-2 bg-red-500 rounded-full text-white hover:bg-red-600 transition-colors"
              >
                <X size={20} />
              </button>
            </div>
          ))}
          <button
            onClick={() => setCar({ ...car, rentalRequirements: [...car.rentalRequirements, "New Requirement"] })}
            className="w-full flex items-center justify-center space-x-2 p-3 bg-yellow-500 text-black font-semibold rounded-lg hover:bg-yellow-600 transition-colors"
          >
            <Plus size={20} />
            <span>Add Requirement</span>
          </button>
        </div>
      </div>

      {/* Frequently Asked Questions Section */}
      <div className="mb-6">
        <h4 className="text-xl font-bold text-white mb-4 rounded-[10px]">Frequently Asked Questions</h4>
        <div className="space-y-3">
          {car.faqs.map((faq, index) => (
            <div key={index} className="bg-zinc-800 rounded-lg p-4 rounded-[10px]">
              <div className="flex flex-col gap-2 mb-2 rounded-[10px]">
                <label className="text-gray-400 text-sm">Question</label>
                <input
                  type="text"
                  value={faq.question}
                  onChange={(e) => {
                    const newFaqs = [...car.faqs];
                    newFaqs[index].question = e.target.value;
                    setCar({ ...car, faqs: newFaqs });
                  }}
                  className="w-full bg-zinc-700 border border-zinc-600 rounded-lg p-3 text-white focus:outline-none focus:border-yellow-500 rounded-[10px]"
                  placeholder="Enter FAQ question"
                />
              </div>
              <div className="flex flex-col gap-2 rounded-[10px]">
                <label className="text-gray-400 text-sm">Answer</label>
                <textarea
                  value={faq.answer}
                  onChange={(e) => {
                    const newFaqs = [...car.faqs];
                    newFaqs[index].answer = e.target.value;
                    setCar({ ...car, faqs: newFaqs });
                  }}
                  rows="3"
                  className="w-full bg-zinc-700 border border-zinc-600 rounded-[10px] p-3 text-white placeholder-gray-400 focus:outline-none focus:border-yellow-500 resize-y"
                  placeholder="Enter FAQ answer"
                ></textarea>
              </div>
              <button
                onClick={() => {
                  const newFaqs = [...car.faqs];
                  newFaqs.splice(index, 1);
                  setCar({ ...car, faqs: newFaqs });
                }}
                className="mt-3 p-2 bg-red-500 rounded-full text-white hover:bg-red-600 transition-colors self-end"
              >
                <X size={20} />
              </button>
            </div>
          ))}
          <button
            onClick={() => setCar({ ...car, faqs: [...car.faqs, { question: "New Question", answer: "New Answer" }] })}
            className="w-full flex items-center justify-center space-x-2 p-3 bg-yellow-500 text-black font-semibold rounded-lg hover:bg-yellow-600 transition-colors"
          >
            <Plus size={20} />
            <span>Add FAQ</span>
          </button>
        </div>
      </div>

      {/* Mileage */}
      <div className="mb-8">
        <h2 className="text-xl font-medium mb-4">MILEAGE</h2>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-gray-400 block mb-2">MILEAGE LIMIT</label>
            <div className="bg-gradient-to-r from-[#FFBB00] to-[#FF9D00] rounded text-black flex">
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
            <div className="bg-gradient-to-r from-[#FFBB00] to-[#FF9D00] rounded text-black flex">
              <input
                type="text"
                value={car.mileage.additionalCharge}
                onChange={(e) => handleMileageChange("additionalCharge", e.target.value)}
                className="bg-transparent p-2 flex-grow outline-none"
              />
              <span className="p-2 font-medium">$ / KM</span>
            </div>
          </div>
        </div>
      </div>

      {/* State */}
      <div className="mb-8">
        <h2 className="text-xl font-medium mb-4">STATE</h2>
        <div className="grid grid-cols-2 gap-4">
          <button
            className={`p-3 rounded ${car.state === "Available" ? "bg-gradient-to-r from-[#FFBB00] to-[#FF9D00] text-black" : "bg-gray-800 text-white"}`}
            onClick={() => handleStateChange("Available")}
          >
            <div className="flex items-center space-x-2">
              <Check size={20} />
              <span>Available</span>
            </div>
          </button>
          <button
            className={`p-3 rounded ${car.state === "Not-Available" ? "bg-gradient-to-r from-[#FFBB00] to-[#FF9D00] text-black" : "bg-gray-800 text-white"}`}
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
          className="bg-gradient-to-r from-[#FFBB00] to-[#FF9D00] hover:bg-yellow-600 text-black font-bold py-3 px-8 rounded-3xl transition-all duration-300 transform hover:scale-105"
        >
          {existingCar ? "UPDATE" : "CREATE"} CAR
        </button>
      </div>

      {/* Global rounded style for inputs in this panel */}
      <style jsx global>{`
        .car-management-panel input[type='text'],
        .car-management-panel input[type='number'],
        .car-management-panel textarea {
          border-radius: 9999px;
        }
        .car-management-panel textarea {
          border-radius: 16px;
        }
      `}</style>
    </div>
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
// Main Cars Management Page Component - Complete implementation with fixed search, delete and modify

export default function CarsManagementPage() {
  const [showCreatePanel, setShowCreatePanel] = useState(false);
  const [editingCar, setEditingCar] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [cars, setCars] = useState([]);

  // Fetch cars from API on mount
  useEffect(() => {
    const fetchCars = async () => {
      try {
        const response = await fetch("/api/cars");
        if (!response.ok) throw new Error("Failed to fetch cars");
        const data = await response.json();
        setCars(data);
      } catch (error) {
        console.error("Error fetching cars:", error);
      }
    };
    fetchCars();
  }, []);

  // Add car via API
  const handleAddCar = async (carData) => {
    try {
      const response = await fetch("/api/cars", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(carData),
      });
      if (!response.ok) throw new Error("Failed to add car");
      const newCar = await response.json();
      setCars((prev) => [...prev, newCar]);
      setShowCreatePanel(false);
    } catch (error) {
      console.error("Error adding car:", error);
    }
  };

  // Update car via API
  const handleUpdateCar = async (carData) => {
    try {
      const response = await fetch(`/api/cars/${carData._id || carData.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(carData),
      });
      if (!response.ok) throw new Error("Failed to update car");
      const updatedCar = await response.json();
      setCars((prev) => prev.map((car) => (car._id === updatedCar._id ? updatedCar : car)));
      setEditingCar(null);
    } catch (error) {
      console.error("Error updating car:", error);
    }
  };

  // Delete car via API
  const handleDeleteCar = async (id) => {
    if (!window.confirm("Are you sure you want to delete this car?")) return;
    try {
      const response = await fetch(`/api/cars/${id}`, { method: "DELETE" });
      if (!response.ok) throw new Error("Failed to delete car");
      setCars((prev) => prev.filter((car) => car._id !== id && car.id !== id));
    } catch (error) {
      console.error("Error deleting car:", error);
    }
  };

  // Function to start editing a car
  const handleEditCar = (car) => {
    setEditingCar(car);
  };

  // Function to filter cars based on search term
  const filteredCars = cars.filter(car => {
    if (!searchTerm.trim()) return true;
    const searchFields = [
      car.brand,
      car.title,
      car.model,
      car.price,
      car.fuelType,
      car.year,
      ...(car.features || [])
    ].map(field => String(field).toLowerCase());
    const searchTermLower = searchTerm.toLowerCase().trim();
    return searchFields.some(field => field.includes(searchTermLower));
  });

  return (
    <div className="flex bg-black min-h-screen">
      {/* Sidebar - Hidden on mobile */}
      <div className="hidden lg:block">
        <Sidebar />
      </div>

      <div className="bg-black w-full lg:ml-72 xl:ml-80">
        <div className="bg-black min-h-screen text-white">
          {/* Admin Header - Responsive */}
          <div className="flex flex-col justify-between items-center p-4 sm:p-6 bg-black">
            <div className="text-white font-bold text-2xl sm:text-3xl md:text-4xl lg:text-5xl mb-6 sm:mb-8 lg:mb-11 mt-2 font-bruno text-center">
              CARS MANAGEMENT
            </div>

            {/* Search and Create Button - Responsive Layout */}
            <div className="flex flex-col sm:flex-row justify-between items-center w-full max-w-6xl gap-4 sm:gap-6">
              <div className="relative w-full sm:w-auto">
                <input
                  type="text"
                  placeholder="Search cars..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="bg-yellow-800/50 text-white font-bruno px-4 sm:px-6 lg:px-8 py-2 sm:py-3 rounded-full w-full sm:w-64 md:w-72 lg:w-80 pr-10 sm:pr-12 text-sm sm:text-base"
                />
                <Search
                  size={20}
                  className="absolute right-3 sm:right-4 top-1/2 transform -translate-y-1/2 text-yellow-400"
                />
              </div>

              <button
                onClick={() => {
                  setEditingCar(null);
                  setShowCreatePanel(true);
                }}
                className="bg-yellow-500 hover:bg-yellow-600 text-black px-4 sm:px-6 lg:px-8 text-sm sm:text-lg lg:text-xl py-2 sm:py-3 lg:py-4 font-bruno rounded-full flex items-center space-x-2 transition-all duration-300 hover:scale-105 w-full sm:w-auto justify-center"
              >
                <Plus size={16} className="sm:hidden" />
                <Plus size={20} className="hidden sm:block" />
                <span className="text-xs sm:text-base lg:text-lg">CREATE NEW</span>
              </button>
            </div>
          </div>

          {/* Cars List - Responsive Grid */}
          <div className="p-3 sm:p-4 lg:p-6 space-y-4 sm:space-y-6">
            {filteredCars.length > 0 ? (
              filteredCars.map(car => (
                <CarListItem
                  key={car._id}
                  car={car}
                  onDelete={handleDeleteCar}
                  onEdit={handleEditCar}
                />
              ))
            ) : (
              <div className="text-center py-10 text-gray-400">
                <div className="text-xl sm:text-2xl font-bruno mb-2">NO CARS FOUND</div>
                <p className="text-sm sm:text-base">Try changing your search criteria or add a new car</p>
              </div>
            )}
          </div>
        </div>

        {/* Create/Edit Car Panel Modal with Animation */}
        <AnimatePresence>
          {(showCreatePanel || editingCar) && (
            <motion.div
              className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => {
                setShowCreatePanel(false);
                setEditingCar(null);
              }}
            >
              <motion.div
                className="w-full max-w-4xl max-h-[90vh] overflow-y-auto"
                initial={{ scale: 0.9, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.9, opacity: 0, y: 20 }}
                transition={{ type: "spring", bounce: 0.3, duration: 0.6 }}
                onClick={(e) => e.stopPropagation()}
              >
                <CarManagementPanel
                  existingCar={editingCar}
                  onClose={() => {
                    setShowCreatePanel(false);
                    setEditingCar(null);
                  }}
                  onSave={editingCar ? handleUpdateCar : handleAddCar}
                />
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
// Car List Item Component - Fixed Mobile Layout
function CarListItem({ car, onDelete, onEdit }) {
  return (
    <div className="w-full px-2 sm:px-4 mb-6 md:mb-10">
      <div className="flex flex-col lg:flex-row items-start lg:items-center gap-4 lg:gap-0">
        {/* Main Car Card */}
        <div
          key={car._id || car.id}
          className="bg-[#171616] rounded-xl overflow-hidden shadow-lg hover:shadow-amber-500/10 transition-shadow duration-300 w-full lg:flex-1"
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

              {/* Price, Status and Button */}
              <div className="flex justify-between items-center">
                <div>
                  <span className="text-amber-400 text-xl font-bruno">
                    {car.pricing?.daily || car.price ? `${car.pricing?.daily || car.price} $` : 'No price'}
                  </span>
                  <span className="text-xs text-gray-400 block">PER DAY</span>
                  <div className="flex items-center mt-1">
                    <span className="text-xs text-gray-400 mr-2">STATUS:</span>
                    <span className={`text-xs font-semibold ${car.state === "Available" ? "text-green-500" : "text-red-500"}`}>
                      {car.state}
                    </span>
                  </div>
                </div>
                <button className="font-bruno text-sm text-black py-3 px-6 bg-gradient-to-r from-[#FFBB00] to-[#FF9D00] hover:opacity-90 transition duration-300 rounded-full shadow-md">
                  BOOK NOW!
                </button>
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

              {/* Right Side: Price, Status and Button */}
              <div className="flex flex-col justify-center items-end text-right font-bruno min-w-[150px]">
                <div className="mb-2">
                  <span className="text-amber-400 text-xl font-bruno block">
                    {car.pricing?.daily || car.price ? `${car.pricing?.daily || car.price} $` : 'No price'}
                  </span>
                  <span className="text-xs text-gray-400">PER DAY</span>
                </div>
                <div className="flex justify-end items-center mb-4">
                  <span className="text-xs text-gray-400 mr-2">STATUS:</span>
                  <span className={`text-xs font-semibold ${car.state === "Available" ? "text-green-500" : "text-red-500"}`}>
                    {car.state}
                  </span>
                </div>
                <button className="font-bruno text-sm text-black py-3 px-6 bg-gradient-to-r from-[#FFBB00] to-[#FF9D00] hover:opacity-90 transition duration-300 rounded-full shadow-md">
                  BOOK NOW!
                </button>
              </div>
            </div>
          </div>

          {/* Desktop Layout - Horizontal like cars page */}
          <div className="hidden lg:flex h-[230px]">
            {/* Desktop Image */}
            <div className="relative w-[42%] overflow-hidden rounded-lg group transition-all duration-500">
              <img
                src={car.mainImage || car.image || '/img/default-car.jpg'}
                alt={car.title}
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
            <div className="w-[40%] pb-6 mt-4 text-white font-bruno flex flex-col justify-between">
              <div>
                <div className="flex items-center mb-4">
                  {car.logo && <img src={car.logo} alt="logo" className="h-12 w-12 mx-4 object-contain" />}
                  <h3 className="text-xl font-bold">{car.title || `${car.brand} ${car.model}`}</h3>
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

            {/* Desktop Price, Status and Button */}
            <div className="text-right font-bruno flex-col flex mt-10 mr-3 min-w-[140px]">
              <span className="text-amber-400 text-xl mr-3 font-bruno">
                {car.pricing?.daily || car.price ? `${car.pricing?.daily || car.price} $` : 'No price'}
              </span>
              <span className="text-xs text-gray-400 mr-1">PER DAY</span>

              {/* Status */}
              <div className="flex justify-end items-center mt-2 mb-4 mr-3">
                <span className="text-xs text-gray-400 mr-2">STATUS:</span>
                <span className={`text-xs font-semibold ${car.state === "Available" ? "text-green-500" : "text-red-500"}`}>
                  {car.state}
                </span>
              </div>

              <button className="font-bruno w-32 text-xs text-black py-2 bg-gradient-to-r from-[#FFBB00] to-[#FF9D00] hover:opacity-90 transition duration-300 rounded-3xl mt-16 shadow-md">
                BOOK NOW!
              </button>
            </div>
          </div>
        </div>

        {/* Action Buttons - Responsive Position */}
        <div className="flex flex-row lg:flex-col justify-center gap-3 lg:gap-6 lg:ml-6">
          <button
            onClick={() => onDelete(car._id || car.id)}
            className="h-12 w-12 lg:h-14 lg:w-14 bg-[#ffbb00] p-2 rounded-xl cursor-pointer flex items-center justify-center hover:bg-red-500 transition-colors"
          >
            <Trash size={20} className="lg:size-6 text-black" />
          </button>
          <button
            onClick={() => onEdit(car)}
            className="h-12 w-12 lg:h-14 lg:w-14 bg-[#ffbb00] p-2 rounded-xl cursor-pointer flex items-center justify-center hover:bg-yellow-600 transition-colors"
          >
            <Edit size={20} className="lg:size-6 text-black" />
          </button>
        </div>
      </div>
    </div>
  );
}