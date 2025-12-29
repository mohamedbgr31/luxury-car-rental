"use client";

import { createContext, useContext, useState, useEffect } from 'react';

const API_BASE_URL = 'http://localhost:5001/api';

const HomeContext = createContext();

export const useHome = () => {
  const context = useContext(HomeContext);
  if (!context) {
    throw new Error('useHome must be used within a HomeProvider');
  }
  return context;
};

export const HomeProvider = ({ children }) => {
  const [brands, setBrands] = useState([]);
  const [heroData, setHeroData] = useState({});
  const [loading, setLoading] = useState(true);
  const [selectedBrand, setSelectedBrand] = useState("");

  // Load initial data
  useEffect(() => {
    loadBrands();
    loadHeroData();
  }, []);

  // Load brands from API
  const loadBrands = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/brands`);
      if (response.ok) {
        const data = await response.json();
        setBrands(data);
        if (data.length > 0 && !selectedBrand) {
          setSelectedBrand(data[0].name);
        }
      }
    } catch (error) {
      console.error('Error loading brands:', error);
    }
  };

  // Load hero data from API
  const loadHeroData = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/hero`);
      if (response.ok) {
        const data = await response.json();
        setHeroData(data);
      }
    } catch (error) {
      console.error('Error loading hero data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Add new brand
  const addBrand = async (newBrand) => {
    try {
      const response = await fetch(`${API_BASE_URL}/brands`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newBrand),
      });
      
      if (response.ok) {
        const data = await response.json();
        setBrands(prev => [...prev, data]);
        return data;
      }
    } catch (error) {
      console.error('Error adding brand:', error);
    }
  };

  // Update brand
  const updateBrand = async (id, updates) => {
    try {
      const response = await fetch(`${API_BASE_URL}/brands/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      });
      
      if (response.ok) {
        const updatedBrand = await response.json();
        setBrands(prev => prev.map(brand => 
          brand._id === id ? updatedBrand : brand
        ));
      }
    } catch (error) {
      console.error('Error updating brand:', error);
    }
  };

  // Delete brand
  const deleteBrand = async (id) => {
    try {
      const response = await fetch(`${API_BASE_URL}/brands/${id}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
      });
      
      if (response.ok) {
        setBrands(prev => prev.filter(brand => brand._id !== id));
      }
    } catch (error) {
      console.error('Error deleting brand:', error);
    }
  };

  // Update hero data
  const updateHeroData = async (newHeroData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/hero`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newHeroData),
      });
      
      if (response.ok) {
        const data = await response.json();
        setHeroData(data);
      }
    } catch (error) {
      console.error('Error updating hero data:', error);
    }
  };

  const value = {
    brands,
    heroData,
    loading,
    selectedBrand,
    setSelectedBrand,
    addBrand,
    updateBrand,
    deleteBrand,
    updateHeroData,
    refreshData: () => {
      loadBrands();
      loadHeroData();
    }
  };

  return (
    <HomeContext.Provider value={value}>
      {children}
    </HomeContext.Provider>
  );
}; 