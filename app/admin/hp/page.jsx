"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';
import { X, Plus, Eye, EyeOff, Trash2, Upload, Camera } from 'lucide-react';
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { useAdminUser } from '../AdminUserProvider';
import Sidebar from "@/components/ui/sidebar";

// Brand Context
const BrandContext = createContext();


const popularDubaiBrands = [
  { name: "Rolls Royce" },
  { name: "Bugatti" },
  { name: "McLaren" },
  { name: "Aston Martin" },
  { name: "Porsche" },
  { name: "Maserati" },
  { name: "BMW" },
  { name: "Audi" },
  { name: "Jaguar" },
  { name: "Land Rover" }
];

// Remove defaultBrands and defaultHeroData except as fallback
const API_URL = '/api';

// Brand Provider
const BrandProvider = ({ children }) => {
  const [brands, setBrands] = useState([]);
  const [heroData, setHeroData] = useState(null);
  const [logoData, setLogoData] = useState(null);
  const [galleryData, setGalleryData] = useState(null);
  const [selectedBrand, setSelectedBrand] = useState('Lamborghini');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        const [brandsRes, heroRes, logoRes, galleryRes] = await Promise.all([
          fetch(`${API_URL}/brands`),
          fetch(`${API_URL}/hero`),
          fetch(`${API_URL}/logo`),
          fetch(`${API_URL}/gallery`)
        ]);
        if (!brandsRes.ok) throw new Error('Failed to fetch brands');
        if (!heroRes.ok) throw new Error('Failed to fetch hero data');
        if (!logoRes.ok) throw new Error('Failed to fetch logo data');
        if (!galleryRes.ok) throw new Error('Failed to fetch gallery data');
        const [brandsData, heroData, logoData, galleryData] = await Promise.all([
          brandsRes.json(),
          heroRes.json(),
          logoRes.json(),
          galleryRes.json()
        ]);
        setBrands(brandsData.length ? brandsData : defaultBrands);
        setHeroData(heroData && heroData.backgroundImage ? heroData : defaultHeroData);
        setLogoData(logoData);
        setGalleryData(galleryData);
      } catch (err) {
        setError(err.message);
        setBrands(defaultBrands);
        setHeroData(defaultHeroData);
        setLogoData(null);
        setGalleryData(null);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Add brand (POST)
  const addBrand = async (newBrand) => {
    try {
      const res = await fetch(`${API_URL}/brands`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newBrand)
      });
      if (!res.ok) throw new Error('Failed to add brand');
      const savedBrand = await res.json();
      setBrands(prev => [...prev, savedBrand]);
    } catch (err) {
      alert(err.message);
    }
  };

  // Update brand (PATCH)
  const updateBrand = async (id, updatedBrand) => {
    try {
      const res = await fetch(`${API_URL}/brands/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedBrand)
      });
      if (!res.ok) throw new Error('Failed to update brand');
      const updated = await res.json();
      setBrands(prev => prev.map(brand => brand._id === id ? updated : brand));
    } catch (err) {
      alert(err.message);
    }
  };

  // Delete brand (soft delete)
  const deleteBrand = async (id) => {
    try {
      const res = await fetch(`${API_URL}/brands/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete brand');
      setBrands(prev => prev.filter(brand => brand._id !== id));
    } catch (err) {
      alert(err.message);
    }
  };

  // Toggle brand visibility (PATCH)
  const toggleBrandVisibility = async (id) => {
    const brand = brands.find(b => b._id === id);
    if (!brand) return;
    await updateBrand(id, { isActive: !brand.isActive });
  };

  // Update hero background (PUT)
  const updateHeroBackground = async (imageUrl) => {
    try {
      const res = await fetch(`${API_URL}/hero`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...heroData, backgroundImage: imageUrl })
      });
      if (!res.ok) throw new Error('Failed to update hero background');
      const updated = await res.json();
      setHeroData(updated);
    } catch (err) {
      alert(err.message);
    }
  };

  // Update hero car card (PUT)
  const updateHeroCarCard = async (carCardData) => {
    try {
      const res = await fetch(`${API_URL}/hero`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...heroData, carCard: { ...heroData.carCard, ...carCardData } })
      });
      if (!res.ok) throw new Error('Failed to update hero car card');
      const updated = await res.json();
      setHeroData(updated);
    } catch (err) {
      alert(err.message);
    }
  };

  // Update logo (PUT)
  const updateLogo = async (logoData) => {
    try {
      const res = await fetch(`${API_URL}/logo`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(logoData)
      });
      if (!res.ok) throw new Error('Failed to update logo');
      const updated = await res.json();
      setLogoData(updated);
    } catch (err) {
      alert(err.message);
    }
  };

  // Update gallery (PUT)
  const updateGallery = async (galleryData) => {
    try {
      const res = await fetch(`${API_URL}/gallery`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(galleryData)
      });
      if (!res.ok) throw new Error('Failed to update gallery');
      const updated = await res.json();
      setGalleryData(updated);
    } catch (err) {
      alert(err.message);
    }
  };

  const getVisibleBrands = () => {
    return brands.filter(brand => brand.isActive);
  };

  const value = {
    brands,
    heroData,
    logoData,
    galleryData,
    selectedBrand,
    popularDubaiBrands,
    setSelectedBrand,
    addBrand,
    updateBrand,
    deleteBrand,
    toggleBrandVisibility,
    updateHeroBackground,
    updateHeroCarCard,
    updateLogo,
    updateGallery,
    getVisibleBrands,
    loading,
    error
  };

  return (
    <BrandContext.Provider value={value}>
      {children}
    </BrandContext.Provider>
  );
};

const useBrand = () => {
  const context = useContext(BrandContext);
  if (context === undefined) {
    throw new Error('useBrand must be used within a BrandProvider');
  }
  return context;
};

// Admin Brand Modal Component - Fully Responsive
const AdminBrandModal = ({ isOpen, onClose }) => {
  const { 
    brands, 
    popularDubaiBrands, 
    addBrand, 
    updateBrand, 
    deleteBrand, 
    toggleBrandVisibility 
  } = useBrand();
  const user = useAdminUser();
  const isManager = user?.role === 'manager';

  const [showAddForm, setShowAddForm] = useState(false);
  const [showPopularBrands, setShowPopularBrands] = useState(false);
  const [editingBrand, setEditingBrand] = useState(null);
  
  const [newBrand, setNewBrand] = useState({
    name: '',
    logo: '',
    description: '',
    isVisible: true
  });

  const handleAddBrand = () => {
    if (newBrand.name && newBrand.logo && newBrand.description) {
      addBrand(newBrand);
      setNewBrand({ name: '', logo: '', description: '', isVisible: true });
      setShowAddForm(false);
    }
  };

  const handleAddPopularBrand = (brand) => {
    const dbBrand = brands.find(
      (b) => b.name?.toLowerCase() === brand.name.toLowerCase()
    );

    const newBrandData = {
      name: brand.name,
      logo: dbBrand?.logo || brand.logo || "",
      description: `Premium ${brand.name} vehicles available for luxury rental in Dubai.`,
      isVisible: true
    };
    addBrand(newBrandData);
    setShowPopularBrands(false);
  };

  const handleEditBrand = (brand) => {
    setEditingBrand(brand._id);
    setNewBrand({
      name: brand.name,
      logo: brand.logo,
      description: brand.description,
      isVisible: brand.isActive
    });
    setShowAddForm(true);
  };

  const handleUpdateBrand = () => {
    if (editingBrand && newBrand.name && newBrand.logo && newBrand.description) {
      updateBrand(editingBrand, newBrand);
      setEditingBrand(null);
      setNewBrand({ name: '', logo: '', description: '', isVisible: true });
      setShowAddForm(false);
    }
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setNewBrand(prev => ({ ...prev, logo: event.target.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-2 sm:p-4">
      <div className="bg-[#1a1a1a] border border-yellow-400 rounded-xl p-3 sm:p-4 md:p-6 w-full max-w-xs sm:max-w-md md:max-w-2xl lg:max-w-4xl max-h-[95vh] sm:max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4 sm:mb-6">
          <h2 className="text-yellow-400 text-lg sm:text-xl md:text-2xl font-bruno">MANAGE BRANDS</h2>
          <button 
            onClick={onClose}
            className="text-white hover:text-yellow-400 transition p-1"
          >
            <X size={20} className="sm:w-6 sm:h-6" />
          </button>
        </div>

        {!showAddForm && !showPopularBrands && (
          <div>
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 mb-4 sm:mb-6">
              {!isManager && (
                <button
                  onClick={() => setShowAddForm(true)}
                  className="bg-yellow-400 text-black px-3 py-2 sm:px-4 sm:py-2 rounded-lg hover:bg-yellow-300 transition flex items-center justify-center gap-2 text-sm sm:text-base"
                >
                  <Plus size={14} className="sm:w-4 sm:h-4" />
                  Add Custom Brand
                </button>
              )}
              {!isManager && (
                <button
                  onClick={() => setShowPopularBrands(true)}
                  className="bg-gray-700 text-white px-3 py-2 sm:px-4 sm:py-2 rounded-lg hover:bg-gray-600 transition text-sm sm:text-base"
                >
                  Add Popular Brand
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-3 sm:gap-4">
              {brands.map((brand) => (
                <div 
                  key={brand._id} 
                  className={`border rounded-lg p-3 sm:p-4 ${brand.isActive ? 'border-yellow-400' : 'border-gray-600'}`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
                      <img src={brand.logo} alt={brand.name} className="w-6 h-6 sm:w-8 sm:h-8 object-contain flex-shrink-0" />
                      <h3 className="text-white font-semibold text-sm sm:text-base truncate">{brand.name}</h3>
                    </div>
                    {!isManager && (
                      <div className="flex gap-1 sm:gap-2 flex-shrink-0">
                        <button
                          onClick={() => toggleBrandVisibility(brand._id)}
                          className={`p-1 rounded ${brand.isActive ? 'text-yellow-400' : 'text-gray-500'}`}
                        >
                          {brand.isActive ? <Eye size={14} className="sm:w-4 sm:h-4" /> : <EyeOff size={14} className="sm:w-4 sm:h-4" />}
                        </button>
                        <button
                          onClick={() => handleEditBrand(brand)}
                          className="text-blue-400 hover:text-blue-300 transition px-1 sm:px-2 py-1 text-xs sm:text-sm"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => deleteBrand(brand._id)}
                          className="text-red-400 hover:text-red-300 transition p-1"
                        >
                          <Trash2 size={14} className="sm:w-4 sm:h-4" />
                        </button>
                      </div>
                    )}
                  </div>
                  <p className="text-gray-400 text-xs sm:text-sm line-clamp-2 sm:line-clamp-3">{brand.description}</p>
                  <div className="mt-2">
                    <span className={`text-xs px-2 py-1 rounded ${brand.isActive ? 'bg-green-600' : 'bg-gray-600'}`}>
                      {brand.isActive ? 'Visible' : 'Hidden'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {showAddForm && !isManager && (
          <div className="space-y-3 sm:space-y-4">
            <h3 className="text-white text-lg sm:text-xl font-bruno">
              {editingBrand ? 'EDIT BRAND' : 'ADD NEW BRAND'}
            </h3>
            
            <div>
              <label className="block text-white mb-2 text-sm sm:text-base">Brand Name</label>
              <input
                type="text"
                value={newBrand.name}
                onChange={(e) => setNewBrand(prev => ({ ...prev, name: e.target.value }))}
                className="w-full p-2 sm:p-3 bg-gray-800 text-white rounded-lg border border-gray-600 focus:border-yellow-400 text-sm sm:text-base"
                placeholder="Enter brand name"
              />
            </div>

            <div>
              <label className="block text-white mb-2 text-sm sm:text-base">Logo</label>
              <div className="flex flex-col sm:flex-row gap-2 sm:gap-4">
                <input
                  type="url"
                  value={newBrand.logo}
                  onChange={(e) => setNewBrand(prev => ({ ...prev, logo: e.target.value }))}
                  className="flex-1 p-2 sm:p-3 bg-gray-800 text-white rounded-lg border border-gray-600 focus:border-yellow-400 text-sm sm:text-base"
                  placeholder="Enter logo URL or upload file"
                />
                <input
                  type="file"
                  accept="image/png,image/jpg,image/jpeg"
                  onChange={handleFileUpload}
                  className="hidden"
                  id="logo-upload"
                />
                <label
                  htmlFor="logo-upload"
                  className="bg-gray-700 text-white px-3 py-2 sm:px-4 sm:py-3 rounded-lg hover:bg-gray-600 transition cursor-pointer text-center text-sm sm:text-base"
                >
                  Upload
                </label>
              </div>
              {newBrand.logo && (
                <div className="mt-2">
                  <img src={newBrand.logo} alt="Preview" className="w-12 h-12 sm:w-16 sm:h-16 object-contain border border-gray-600 rounded" />
                </div>
              )}
            </div>

            <div>
              <label className="block text-white mb-2 text-sm sm:text-base">Description</label>
              <textarea
                value={newBrand.description}
                onChange={(e) => setNewBrand(prev => ({ ...prev, description: e.target.value }))}
                className="w-full p-2 sm:p-3 bg-gray-800 text-white rounded-lg border border-gray-600 focus:border-yellow-400 h-20 sm:h-24 resize-none text-sm sm:text-base"
                placeholder="Enter brand description"
              />
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="isVisible"
                checked={newBrand.isVisible}
                onChange={(e) => setNewBrand(prev => ({ ...prev, isVisible: e.target.checked }))}
                className="w-4 h-4"
              />
              <label htmlFor="isVisible" className="text-white text-sm sm:text-base">Show in brands section</label>
            </div>

            <div className="flex flex-col sm:flex-row gap-2 sm:gap-4">
              <button
                onClick={editingBrand ? handleUpdateBrand : handleAddBrand}
                className="bg-yellow-400 text-black px-4 py-2 sm:px-6 sm:py-2 rounded-lg hover:bg-yellow-300 transition text-sm sm:text-base"
              >
                {editingBrand ? 'Update Brand' : 'Add Brand'}
              </button>
              <button
                onClick={() => {
                  setShowAddForm(false);
                  setEditingBrand(null);
                  setNewBrand({ name: '', logo: '', description: '', isVisible: true });
                }}
                className="bg-gray-700 text-white px-4 py-2 sm:px-6 sm:py-2 rounded-lg hover:bg-gray-600 transition text-sm sm:text-base"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {showPopularBrands && (
          <div>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-white text-lg sm:text-xl font-bruno">POPULAR DUBAI LUXURY BRANDS</h3>
              <button
                onClick={() => setShowPopularBrands(false)}
                className="text-gray-400 hover:text-white transition text-sm sm:text-base"
              >
                Back
              </button>
            </div>
            
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4">
              {popularDubaiBrands.map((brand, index) => (
                (() => {
                  const dbBrand = brands.find(
                    (b) => b.name?.toLowerCase() === brand.name.toLowerCase()
                  );
                  const logo = dbBrand?.logo || brand.logo || "/img/noblelogo.png";
                  return (
                <div
                  key={index}
                  onClick={() => handleAddPopularBrand(brand)}
                  className="border border-gray-600 hover:border-yellow-400 rounded-lg p-3 sm:p-4 cursor-pointer transition text-center"
                >
                  <img 
                    src={logo} 
                    alt={brand.name} 
                    className="w-12 h-12 sm:w-16 sm:h-16 object-contain mx-auto mb-2" 
                    onError={(e) => { e.target.src = '/img/default-logo.png'; }}
                  />
                  <p className="text-white font-semibold text-xs sm:text-sm">{brand.name}</p>
                </div>
                  );
                })()
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// Admin Logo Modal Component - Fully Responsive
const AdminLogoModal = ({ isOpen, onClose }) => {
  const { logoData, updateLogo } = useBrand();
  
  const [logo, setLogo] = useState({
    navbarLogo: '',
    companyName: ''
  });

  useEffect(() => {
    if (isOpen && logoData) {
      setLogo({
        navbarLogo: logoData.navbarLogo || '',
        companyName: logoData.companyName || ''
      });
    }
  }, [isOpen, logoData]);

  const handleLogoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setLogo(prev => ({ ...prev, navbarLogo: event.target.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    if (logo.navbarLogo && logo.companyName) {
      updateLogo(logo);
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-2 sm:p-4">
      <div className="bg-[#1a1a1a] border border-yellow-400 rounded-xl p-3 sm:p-4 md:p-6 w-full max-w-xs sm:max-w-md md:max-w-2xl max-h-[95vh] sm:max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4 sm:mb-6">
          <h2 className="text-yellow-400 text-lg sm:text-xl md:text-2xl font-bruno">MODIFY LOGO</h2>
          <button 
            onClick={onClose}
            className="text-white hover:text-yellow-400 transition p-1"
          >
            <X size={20} className="sm:w-6 sm:h-6" />
          </button>
        </div>

        <div className="space-y-4 sm:space-y-6">
          <div>
            <label className="block text-white mb-2 sm:mb-3 text-sm sm:text-base">Current Logo</label>
            <div className="relative">
              <img 
                src={logo.navbarLogo} 
                alt="Current Logo" 
                className="w-16 h-16 sm:w-20 sm:h-20 object-contain border border-gray-600 rounded-lg"
              />
            </div>
          </div>

          <div>
            <label className="block text-white mb-2 text-sm sm:text-base">Upload New Logo</label>
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-4">
              <input
                type="url"
                value={logo.navbarLogo}
                onChange={(e) => setLogo(prev => ({ ...prev, navbarLogo: e.target.value }))}
                className="flex-1 p-2 sm:p-3 bg-gray-800 text-white rounded-lg border border-gray-600 focus:border-yellow-400 text-sm sm:text-base"
                placeholder="Enter logo URL"
              />
              <input
                type="file"
                accept="image/*"
                onChange={handleLogoUpload}
                className="hidden"
                id="logo-upload"
              />
              <label
                htmlFor="logo-upload"
                className="bg-gray-700 text-white px-3 py-2 sm:px-4 sm:py-3 rounded-lg hover:bg-gray-600 transition cursor-pointer flex items-center justify-center gap-2 text-sm sm:text-base"
              >
                <Upload size={14} className="sm:w-4 sm:h-4" />
                Upload
              </label>
            </div>
          </div>

          <div>
            <label className="block text-white mb-2 text-sm sm:text-base">Company Name</label>
            <input
              type="text"
              value={logo.companyName}
              onChange={(e) => setLogo(prev => ({ ...prev, companyName: e.target.value }))}
              className="w-full p-2 sm:p-3 bg-gray-800 text-white rounded-lg border border-gray-600 focus:border-yellow-400 text-sm sm:text-base"
              placeholder="Enter company name"
            />
          </div>

          <div className="flex flex-col sm:flex-row gap-2 sm:gap-4">
            <button
              onClick={handleSave}
              className="bg-yellow-400 text-black px-4 py-2 sm:px-6 sm:py-2 rounded-lg hover:bg-yellow-300 transition text-sm sm:text-base"
            >
              Save Logo
            </button>
            <button
              onClick={onClose}
              className="bg-gray-700 text-white px-4 py-2 sm:px-6 sm:py-2 rounded-lg hover:bg-gray-600 transition text-sm sm:text-base"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Admin Gallery Modal Component - Fully Responsive
const AdminGalleryModal = ({ isOpen, onClose, type }) => {
  const { galleryData, updateGallery } = useBrand();
  
  const [gallery, setGallery] = useState({
    desktopPhotos: [],
    mobilePhotos: []
  });

  useEffect(() => {
    if (isOpen && galleryData) {
      setGallery({
        desktopPhotos: [...(galleryData.desktopPhotos || [])],
        mobilePhotos: [...(galleryData.mobilePhotos || [])]
      });
    }
  }, [isOpen, galleryData]);

  const handlePhotoUpload = (e, deviceType, index) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const newGallery = { ...gallery };
        if (deviceType === 'desktop') {
          newGallery.desktopPhotos[index] = {
            ...newGallery.desktopPhotos[index],
            imageUrl: event.target.result
          };
        } else {
          newGallery.mobilePhotos[index] = {
            ...newGallery.mobilePhotos[index],
            imageUrl: event.target.result
          };
        }
        setGallery(newGallery);
      };
      reader.readAsDataURL(file);
    }
  };

  const handlePhotoChange = (deviceType, index, field, value) => {
    const newGallery = { ...gallery };
    if (deviceType === 'desktop') {
      newGallery.desktopPhotos[index] = {
        ...newGallery.desktopPhotos[index],
        [field]: value
      };
    } else {
      newGallery.mobilePhotos[index] = {
        ...newGallery.mobilePhotos[index],
        [field]: value
      };
    }
    setGallery(newGallery);
  };

  const handleSave = () => {
    updateGallery(gallery);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-2 sm:p-4">
      <div className="bg-[#1a1a1a] border border-yellow-400 rounded-xl p-3 sm:p-4 md:p-6 w-full max-w-xs sm:max-w-md md:max-w-4xl lg:max-w-6xl max-h-[95vh] sm:max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4 sm:mb-6">
          <h2 className="text-yellow-400 text-lg sm:text-xl md:text-2xl font-bruno">MODIFY GALLERY</h2>
          <button 
            onClick={onClose}
            className="text-white hover:text-yellow-400 transition p-1"
          >
            <X size={20} className="sm:w-6 sm:h-6" />
          </button>
        </div>

        <div className="space-y-6">
          {/* Desktop Photos */}
          <div>
            <h3 className="text-white text-lg font-bruno mb-4">Desktop Photos</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {[0, 1, 2, 3].map((index) => (
                <div key={`desktop-${index}`} className="space-y-3">
                  <div className="relative">
                                         <img 
                       src={gallery.desktopPhotos[index]?.imageUrl || 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjMzMzIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxNCIgZmlsbD0iI2ZmZiIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkltYWdlPC90ZXh0Pjwvc3ZnPg=='} 
                       alt={`Desktop ${index + 1}`} 
                       className="w-full h-32 object-cover rounded-lg border border-gray-600"
                     />
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handlePhotoUpload(e, 'desktop', index)}
                      className="hidden"
                      id={`desktop-upload-${index}`}
                    />
                    <label
                      htmlFor={`desktop-upload-${index}`}
                      className="absolute inset-0 bg-black bg-opacity-50 rounded-lg flex items-center justify-center cursor-pointer opacity-0 hover:opacity-100 transition-opacity"
                    >
                      <Upload size={20} className="text-white" />
                    </label>
                  </div>
                  <input
                    type="text"
                    value={gallery.desktopPhotos[index]?.alt || ''}
                    onChange={(e) => handlePhotoChange('desktop', index, 'alt', e.target.value)}
                    className="w-full p-2 bg-gray-800 text-white rounded-lg border border-gray-600 focus:border-yellow-400 text-sm"
                    placeholder="Alt text"
                  />
                  <input
                    type="number"
                    value={gallery.desktopPhotos[index]?.order || index}
                    onChange={(e) => handlePhotoChange('desktop', index, 'order', parseInt(e.target.value))}
                    className="w-full p-2 bg-gray-800 text-white rounded-lg border border-gray-600 focus:border-yellow-400 text-sm"
                    placeholder="Order"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Mobile Photos */}
          <div>
            <h3 className="text-white text-lg font-bruno mb-4">Mobile Photos</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {[0, 1, 2, 3, 4, 5].map((index) => (
                <div key={`mobile-${index}`} className="space-y-3">
                  <div className="relative">
                                         <img 
                       src={gallery.mobilePhotos[index]?.imageUrl || 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjMzMzIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxNCIgZmlsbD0iI2ZmZiIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkltYWdlPC90ZXh0Pjwvc3ZnPg=='} 
                       alt={`Mobile ${index + 1}`} 
                       className="w-full h-32 object-cover rounded-lg border border-gray-600"
                     />
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handlePhotoUpload(e, 'mobile', index)}
                      className="hidden"
                      id={`mobile-upload-${index}`}
                    />
                    <label
                      htmlFor={`mobile-upload-${index}`}
                      className="absolute inset-0 bg-black bg-opacity-50 rounded-lg flex items-center justify-center cursor-pointer opacity-0 hover:opacity-100 transition-opacity"
                    >
                      <Upload size={20} className="text-white" />
                    </label>
                  </div>
                  <input
                    type="text"
                    value={gallery.mobilePhotos[index]?.alt || ''}
                    onChange={(e) => handlePhotoChange('mobile', index, 'alt', e.target.value)}
                    className="w-full p-2 bg-gray-800 text-white rounded-lg border border-gray-600 focus:border-yellow-400 text-sm"
                    placeholder="Alt text"
                  />
                  <input
                    type="number"
                    value={gallery.mobilePhotos[index]?.order || index}
                    onChange={(e) => handlePhotoChange('mobile', index, 'order', parseInt(e.target.value))}
                    className="w-full p-2 bg-gray-800 text-white rounded-lg border border-gray-600 focus:border-yellow-400 text-sm"
                    placeholder="Order"
                  />
                </div>
              ))}
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-2 sm:gap-4">
            <button
              onClick={handleSave}
              className="bg-yellow-400 text-black px-4 py-2 sm:px-6 sm:py-2 rounded-lg hover:bg-yellow-300 transition text-sm sm:text-base"
            >
              Save Gallery
            </button>
            <button
              onClick={onClose}
              className="bg-gray-700 text-white px-4 py-2 sm:px-6 sm:py-2 rounded-lg hover:bg-gray-600 transition text-sm sm:text-base"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Admin Hero Modal Component - Fully Responsive
const AdminHeroModal = ({ isOpen, onClose, type }) => {
  const { heroData, updateHeroBackground, updateHeroCarCard } = useBrand();
  
  const [backgroundImage, setBackgroundImage] = useState(heroData?.backgroundImage);
  const [carCard, setCarCard] = useState(() => {
    const base = heroData?.carCard || {};
    return {
      title: base.title || '',
      logo: base.logo || '',
      image: base.image || '',
      specs: Array.isArray(base.specs) ? [...base.specs, '', '', ''].slice(0, 3) : ['', '', ''],
    };
  });

  useEffect(() => {
    if (isOpen && heroData?.carCard) {
      const base = heroData.carCard;
      setCarCard({
        title: base.title || '',
        logo: base.logo || '',
        image: base.image || '',
        specs: Array.isArray(base.specs) ? [...base.specs, '', '', ''].slice(0, 3) : ['', '', ''],
      });
    }
  }, [isOpen, heroData]);

  const handleBackgroundImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setBackgroundImage(event.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCarImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setCarCard(prev => ({ ...prev, image: event.target.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleLogoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setCarCard(prev => ({ ...prev, logo: event.target.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveBackground = () => {
    updateHeroBackground(backgroundImage);
    onClose();
  };

  const handleSaveCarCard = () => {
    updateHeroCarCard(carCard);
    onClose();
  };

  const handleSpecChange = (index, value) => {
    const newSpecs = [...carCard.specs];
    newSpecs[index] = value;
    setCarCard(prev => ({ ...prev, specs: newSpecs }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-2 sm:p-4">
      <div className="bg-[#1a1a1a] border border-yellow-400 rounded-xl p-3 sm:p-4 md:p-6 w-full max-w-xs sm:max-w-md md:max-w-2xl max-h-[95vh] sm:max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4 sm:mb-6">
          <h2 className="text-yellow-400 text-lg sm:text-xl md:text-2xl font-bruno">
            {type === 'background' ? 'MODIFY HERO BACKGROUND' : 'MODIFY CAR CARD'}
          </h2>
          <button 
            onClick={onClose}
            className="text-white hover:text-yellow-400 transition p-1"
          >
            <X size={20} className="sm:w-6 sm:h-6" />
          </button>
        </div>

        {type === 'background' && (
          <div className="space-y-4 sm:space-y-6">
            <div>
              <label className="block text-white mb-2 sm:mb-3 text-sm sm:text-base">Current Background</label>
              <div className="relative">
                <img 
                  src={backgroundImage} 
                  alt="Hero Background" 
                  className="w-full h-32 sm:h-48 object-cover rounded-lg border border-gray-600"
                />
                <div className="absolute inset-0 bg-black bg-opacity-30 rounded-lg flex items-center justify-center">
                  <Camera size={24} className="sm:w-8 sm:h-8 text-white opacity-70" />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-white mb-2 text-sm sm:text-base">Upload New Background</label>
              <div className="flex flex-col sm:flex-row gap-2 sm:gap-4">
                <input
                  type="url"
                  value={backgroundImage}
                  onChange={(e) => setBackgroundImage(e.target.value)}
                  className="flex-1 p-2 sm:p-3 bg-gray-800 text-white rounded-lg border border-gray-600 focus:border-yellow-400 text-sm sm:text-base"
                  placeholder="Enter image URL"
                />
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleBackgroundImageUpload}
                  className="hidden"
                  id="background-upload"
                />
                <label
                  htmlFor="background-upload"
                  className="bg-gray-700 text-white px-3 py-2 sm:px-4 sm:py-3 rounded-lg hover:bg-gray-600 transition cursor-pointer flex items-center justify-center gap-2 text-sm sm:text-base"
                >
                  <Upload size={14} className="sm:w-4 sm:h-4" />
                  Upload
                </label>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-2 sm:gap-4">
              <button
                onClick={handleSaveBackground}
                className="bg-yellow-400 text-black px-4 py-2 sm:px-6 sm:py-2 rounded-lg hover:bg-yellow-300 transition text-sm sm:text-base"
              >
                Save Background
              </button>
              <button
                onClick={onClose}
                className="bg-gray-700 text-white px-4 py-2 sm:px-6 sm:py-2 rounded-lg hover:bg-gray-600 transition text-sm sm:text-base"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {type === 'carcard' && (
          <div className="space-y-4 sm:space-y-6">
            <div>
              <label className="block text-white mb-2 sm:mb-3 text-sm sm:text-base">Car Card Preview</label>
              <div className="bg-gray-800 p-3 sm:p-4 rounded-lg border border-gray-600">
                <div className="flex items-center gap-2 mb-2 sm:mb-3">
                  {carCard?.logo && <img src={carCard.logo} alt="Logo" className="w-6 h-6 sm:w-8 sm:h-8 object-contain" />}
                  <span className="text-white font-semibold text-sm sm:text-base">{carCard?.title}</span>
                </div>
                {carCard?.image && <img src={carCard.image} alt="Car" className="w-full h-24 sm:h-32 object-contain mb-2 sm:mb-3" />}
                <div className="flex justify-between text-xs sm:text-sm text-gray-400">
                  {(carCard?.specs || []).map((spec, index) => (
                    <span key={index} className="truncate">{spec}</span>
                  ))}
                </div>
              </div>
            </div>

            <div>
              <label className="block text-white mb-2 text-sm sm:text-base">Car Title</label>
              <input
                type="text"
                value={carCard?.title}
                onChange={(e) => setCarCard(prev => ({ ...prev, title: e.target.value }))}
                className="w-full p-2 sm:p-3 bg-gray-800 text-white rounded-lg border border-gray-600 focus:border-yellow-400 text-sm sm:text-base"
                placeholder="Enter car title"
              />
            </div>

            <div>
              <label className="block text-white mb-2 text-sm sm:text-base">Car Logo</label>
              <div className="flex flex-col sm:flex-row gap-2 sm:gap-4">
                <input
                  type="url"
                  value={carCard?.logo}
                  onChange={(e) => setCarCard(prev => ({ ...prev, logo: e.target.value }))}
                  className="flex-1 p-2 sm:p-3 bg-gray-800 text-white rounded-lg border border-gray-600 focus:border-yellow-400 text-sm sm:text-base"
                  placeholder="Enter logo URL"
                />
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleLogoUpload}
                  className="hidden"
                  id="logo-upload"
                />
                <label
                  htmlFor="logo-upload"
                  className="bg-gray-700 text-white px-3 py-2 sm:px-4 sm:py-3 rounded-lg hover:bg-gray-600 transition cursor-pointer flex items-center justify-center gap-2 text-sm sm:text-base"
                >
                  <Upload size={14} className="sm:w-4 sm:h-4" />
                  Upload
                </label>
              </div>
            </div>

            <div>
              <label className="block text-white mb-2 text-sm sm:text-base">Car Image</label>
              <div className="flex flex-col sm:flex-row gap-2 sm:gap-4">
                <input
                  type="url"
                  value={carCard?.image}
                  onChange={(e) => setCarCard(prev => ({ ...prev, image: e.target.value }))}
                  className="flex-1 p-2 sm:p-3 bg-gray-800 text-white rounded-lg border border-gray-600 focus:border-yellow-400 text-sm sm:text-base"
                  placeholder="Enter car image URL"
                />
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleCarImageUpload}
                  className="hidden"
                  id="car-image-upload"
                />
                <label
                  htmlFor="car-image-upload"
                  className="bg-gray-700 text-white px-3 py-2 sm:px-4 sm:py-3 rounded-lg hover:bg-gray-600 transition cursor-pointer flex items-center justify-center gap-2 text-sm sm:text-base"
                >
                  <Upload size={14} className="sm:w-4 sm:h-4" />
                  Upload
                </label>
              </div>
            </div>

            <div>
              <label className="block text-white mb-2 text-sm sm:text-base">Car Specifications</label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-3">
                {(carCard?.specs || []).map((spec, index) => (
                  <input
                    key={index}
                    type="text"
                    value={spec}
                    onChange={(e) => handleSpecChange(index, e.target.value)}
                    className="p-2 sm:p-3 bg-gray-800 text-white rounded-lg border border-gray-600 focus:border-yellow-400 text-sm sm:text-base"
                    placeholder={`Spec ${index + 1}`}
                  />
                ))}
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-2 sm:gap-4">
              <button
                onClick={handleSaveCarCard}
                className="bg-yellow-400 text-black px-4 py-2 sm:px-6 sm:py-2 rounded-lg hover:bg-yellow-300 transition text-sm sm:text-base"
              >
                Save Car Card
              </button>
              <button
                onClick={onClose}
                className="bg-gray-700 text-white px-4 py-2 sm:px-6 sm:py-2 rounded-lg hover:bg-gray-600 transition text-sm sm:text-base"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// Main Admin Component - Fully Responsive
const AdminManageHome = () => {
  const { brands, heroData, logoData, galleryData, selectedBrand, setSelectedBrand, getVisibleBrands } = useBrand();
  const user = useAdminUser();
  const isManager = user?.role === 'manager';
  const [showBrandModal, setShowBrandModal] = useState(false);
  const [showHeroModal, setShowHeroModal] = useState(false);
  const [showLogoModal, setShowLogoModal] = useState(false);
  const [showGalleryModal, setShowGalleryModal] = useState(false);
  const [heroModalType, setHeroModalType] = useState('');

  const visibleBrands = getVisibleBrands();
  const selected = visibleBrands.find((brand) => brand.name === selectedBrand) || visibleBrands[0];

  const openHeroModal = (type) => {
    setHeroModalType(type);
    setShowHeroModal(true);
  };

  return (
    <div className="bg-black min-h-screen">
      <div className="flex flex-col lg:flex-row h-full bg-black text-white font-bruno">
        {/* Sidebar - Sticky positioning */}
        <div className="lg:block lg:sticky lg:top-0 lg:h-screen sidebar-container">
          <Sidebar />
        </div>

        {/* Mobile Header */}
        <div className="lg:hidden bg-black border-b border-gray-800 p-4">
          <h1 className="text-xl sm:text-2xl text-center font-bruno text-yellow-400">MANAGE HOME PAGE</h1>
        </div>

        {/* Main Content */}
        <main className="flex-1 p-3 sm:p-6 lg:p-10 lg:ml-72 xl:ml-80 overflow-x-hidden main-content">
          {/* Desktop Header */}
          <h1 className="hidden lg:block text-2xl xl:text-4xl text-center mb-6 lg:mb-10 font-bruno">MANAGE HOME PAGE</h1>

                    {/* Car Card and Photo Section */}
          <div className="flex flex-col lg:flex-row justify-center items-center gap-4 sm:gap-6 lg:gap-10 mb-6 lg:mb-10">
            {/* Car Card */}
            <div className="flex flex-col items-center w-full lg:w-auto">
              <div className="bg-[#111] border border-white p-3 sm:p-4 rounded-xl w-full max-w-sm lg:max-w-none">
                <div className='flex items-center gap-2 sm:gap-3 mb-2 sm:mb-3'>
                  <img 
                    src={heroData?.carCard?.logo} 
                    alt="" 
                    className='h-8 sm:h-10 lg:h-12 object-contain' 
                  />
                  <h2 className="text-xs sm:text-sm lg:text-base font-bruno truncate">
                    {heroData?.carCard?.title}
                  </h2>
                </div>
                <div className="flex justify-center p-2 sm:p-4 lg:p-8">
                  <img 
                    src={heroData?.carCard?.image} 
                    alt="Car" 
                    className="rounded max-w-full h-auto max-h-32 sm:max-h-40 lg:max-h-none object-contain" 
                  />
                </div>
                <div className="flex justify-between text-xs sm:text-sm gap-1">
                  {(heroData?.carCard?.specs || []).map((spec, index) => (
                    <span key={index} className="truncate flex-1 text-center">{spec}</span>
                  ))}
                </div>
              </div>
              {!isManager && (
                <button 
                  onClick={() => openHeroModal('carcard')}
                  className="text-xs sm:text-sm px-4 sm:px-6 py-2 text-black mt-3 sm:mt-4 lg:mt-6 w-full sm:w-auto lg:w-[50%] bg-gradient-to-r from-[#FFBB00] to-[#FF9D00] hover:opacity-90 transition duration-300 rounded-3xl"
                >
                  MODIFY CARD
                </button>
              )}
            </div>
            
            {/* Photo Section */}
            <div className="flex flex-col items-center w-full lg:w-auto">
              <div className="bg-[#111] rounded-xl border border-white overflow-hidden w-full max-w-sm sm:max-w-md lg:max-w-none lg:w-[400px] xl:w-[500px]">
                <img 
                  src={heroData?.backgroundImage} 
                  alt="Hero Background" 
                  className="rounded-xl w-full h-48 sm:h-56 lg:h-64 xl:h-auto object-cover" 
                />
              </div>
              {!isManager && (
                <button 
                  onClick={() => openHeroModal('background')}
                  className="text-xs sm:text-sm px-4 sm:px-6 py-2 text-black mt-3 sm:mt-4 lg:mt-6 w-full sm:w-auto lg:w-[50%] bg-gradient-to-r from-[#FFBB00] to-[#FF9D00] hover:opacity-90 transition duration-300 rounded-3xl"
                >
                  MODIFY PHOTO
                </button>
              )}
            </div>
          </div>

          {/* Logo and Gallery Management Section */}
          <div className="flex flex-col lg:flex-row justify-center items-center gap-4 sm:gap-6 lg:gap-10 mb-6 lg:mb-10">
            {/* Logo Management */}
            <div className="flex flex-col items-center w-full lg:w-auto">
              <div className="bg-[#111] border border-white p-3 sm:p-4 rounded-xl w-full max-w-sm lg:max-w-none">
                <div className='flex items-center gap-2 sm:gap-3 mb-2 sm:mb-3'>
                  <img 
                    src={logoData?.navbarLogo || "/img/noblelogo.png"} 
                    alt="Logo" 
                    className='h-8 sm:h-10 lg:h-12 object-contain' 
                  />
                  <h2 className="text-xs sm:text-sm lg:text-base font-bruno truncate text-white">
                    {logoData?.companyName || "Noble Car Rental"}
                  </h2>
                </div>
                <div className="flex justify-center p-2 sm:p-4 lg:p-8">
                  <div className="text-center">
                    <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-2">
                      <img 
                        src={logoData?.navbarLogo || "/img/noblelogo.png"} 
                        alt="Logo Preview" 
                        className="w-full h-full object-contain" 
                      />
                    </div>
                    <p className="text-xs sm:text-sm text-gray-400">Logo Preview</p>
                  </div>
                </div>
              </div>
              {!isManager && (
                <button 
                  onClick={() => setShowLogoModal(true)}
                  className="text-xs sm:text-sm px-4 sm:px-6 py-2 text-black mt-3 sm:mt-4 lg:mt-6 w-full sm:w-auto lg:w-[50%] bg-gradient-to-r from-[#FFBB00] to-[#FF9D00] hover:opacity-90 transition duration-300 rounded-3xl"
                >
                  MODIFY LOGO
                </button>
              )}
            </div>
            
            {/* Gallery Management */}
            <div className="flex flex-col items-center w-full lg:w-auto">
              <div className="bg-[#111] border border-white p-3 sm:p-4 rounded-xl w-full max-w-sm lg:max-w-none lg:w-[400px] xl:w-[500px]">
                <div className="p-3 sm:p-4 h-full flex flex-col justify-center">
                  <h3 className="text-white text-sm sm:text-base font-bruno mb-3 text-center">Photo Gallery</h3>
                  <div className="grid grid-cols-2 gap-2 mb-4">
                    {/* Desktop Preview */}
                    <div className="text-center">
                      <div className="w-12 h-8 sm:w-16 sm:h-12 bg-gray-700 rounded mb-1 mx-auto flex items-center justify-center">
                        <span className="text-xs text-gray-400">Desktop</span>
                      </div>
                      <p className="text-xs text-gray-400">Desktop Photos</p>
                    </div>
                    {/* Mobile Preview */}
                    <div className="text-center">
                      <div className="w-8 h-12 sm:w-12 sm:h-16 bg-gray-700 rounded mb-1 mx-auto flex items-center justify-center">
                        <span className="text-xs text-gray-400">Mobile</span>
                      </div>
                      <p className="text-xs text-gray-400">Mobile Photos</p>
                    </div>
                  </div>
                  {/* Additional content to match logo section height */}
                  <div className="text-center">
                    <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-2 bg-gray-700 rounded flex items-center justify-center">
                      <span className="text-xs text-gray-400">Gallery</span>
                    </div>
                    <p className="text-xs sm:text-sm text-gray-400">Gallery Preview</p>
                  </div>
                </div>
              </div>
              {!isManager && (
                <button 
                  onClick={() => setShowGalleryModal(true)}
                  className="text-xs sm:text-sm px-4 sm:px-6 py-2 text-black mt-3 sm:mt-4 lg:mt-6 w-full sm:w-auto lg:w-[50%] bg-gradient-to-r from-[#FFBB00] to-[#FF9D00] hover:opacity-90 transition duration-300 rounded-3xl"
                >
                  MODIFY GALLERY
                </button>
              )}
            </div>
          </div>

          {/* Brands Section */}
          <div className="bg-black content-max-width-lg w-full mx-auto">
            <div className="py-6 sm:py-10 lg:py-14">
              {/* Brands Grid - Responsive */}
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2 sm:gap-4 lg:gap-7 mb-6 sm:mb-8 items-center">
                {visibleBrands.map((brand) => (
                  <motion.div
                    key={brand.name}
                    whileTap={{ scale: 0.95 }}
                    animate={{ 
                      scale: selectedBrand === brand.name ? [1, 1.05, 1.02] : 1,
                      transition: { duration: 0.3 }
                    }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                    onClick={() => setSelectedBrand(brand.name)}
                    className="w-full"
                  >
                    <div
                      className={cn(
                        "flex items-center justify-center p-2 sm:p-3 lg:p-4 rounded-xl sm:rounded-2xl cursor-pointer border transition-all duration-300 aspect-square",
                        selectedBrand === brand.name
                          ? "bg-zinc-900 border-yellow-400 shadow-lg shadow-yellow-400/20"
                          : "bg-zinc-800 border-zinc-700 hover:border-yellow-300 hover:bg-zinc-750"
                      )}
                    >
                      <img
                        src={brand.logo}
                        alt={brand.name}
                        className="h-8 sm:h-12 lg:h-16 xl:h-20 object-contain max-w-full"
                        loading="lazy"
                      />
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Selected Brand Details */}
              {selected && (
                <motion.div
                  key={selected.name}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, ease: "easeOut" }}
                  className="text-center"
                >
                  <div className="mb-4 sm:mb-6">
                    <img
                      src={selected.logo}
                      alt={selected.name}
                      className="mx-auto h-12 sm:h-16 lg:h-20 xl:h-24 object-contain"
                      loading="lazy"
                    />
                  </div>
                  
                  <div className="mb-4 sm:mb-6 px-2 sm:px-4">
                    <p className="text-gray-400 text-sm sm:text-base lg:text-lg max-w-sm sm:max-w-md lg:max-w-xl xl:max-w-2xl mx-auto leading-relaxed">
                      {selected.description}
                    </p>
                  </div>
                  
                  <button
                    onClick={() => setShowBrandModal(true)}
                    className="bg-yellow-400 text-black font-bold hover:bg-yellow-300 active:bg-yellow-500 rounded-3xl px-4 sm:px-6 lg:px-8 py-2 sm:py-3 transition-all duration-300 text-sm sm:text-base lg:text-lg transform hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl"
                  >
                    MANAGE BRANDS
                  </button>
                </motion.div>
              )}
            </div>
          </div>

          {/* Mobile Bottom Spacing */}
          <div className="h-6 lg:hidden"></div>
        </main>
      </div>

      {/* Modals */}
      <AdminBrandModal 
        isOpen={showBrandModal} 
        onClose={() => setShowBrandModal(false)} 
      />
      
      <AdminHeroModal 
        isOpen={showHeroModal} 
        onClose={() => setShowHeroModal(false)} 
        type={heroModalType}
      />

      <AdminLogoModal 
        isOpen={showLogoModal} 
        onClose={() => setShowLogoModal(false)} 
      />

      <AdminGalleryModal 
        isOpen={showGalleryModal} 
        onClose={() => setShowGalleryModal(false)} 
      />
    </div>
  );
};

// Export the complete component with BrandProvider wrapper
const AdminManageHomeWithProvider = () => {
  return (
    <>
      <style jsx global>{`
        /* Ensure sidebar stays sticky */
        .lg\\:sticky {
          position: sticky !important;
          top: 0 !important;
          height: 100vh !important;
        }
        
        /* Fix any spacing issues below sidebar */
        .sidebar-container {
          position: sticky;
          top: 0;
          height: 100vh;
          overflow-y: auto;
        }
        
        /* Ensure main content flows properly */
        .main-content {
          min-height: 100vh;
          overflow-x: hidden;
        }
      `}</style>
      <BrandProvider>
        <AdminManageHome />
      </BrandProvider>
    </>
  );
};

export default AdminManageHomeWithProvider;