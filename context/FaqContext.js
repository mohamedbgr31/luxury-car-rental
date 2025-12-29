"use client"
"use client";

import { createContext, useContext, useState, useEffect } from 'react';

const FaqContext = createContext();
const API_URL = '/api'; // Use Next.js API route

export const useFaqs = () => {
  const context = useContext(FaqContext);
  if (!context) {
    throw new Error('useFaqs must be used within a FaqProvider');
  }
  return context;
};

export const FaqProvider = ({ children }) => {
  const [faqs, setFaqs] = useState([]);
  const [loading, setLoading] = useState(true);

  // Load FAQs from backend
  useEffect(() => {
    loadFaqs();
  }, []);

  const loadFaqs = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/faqs`);
      if (response.ok) {
        const data = await response.json();
        setFaqs(data);
      } else {
        throw new Error('Failed to load FAQs');
      }
    } catch (error) {
      console.error('Error loading FAQs:', error);
    } finally {
      setLoading(false);
    }
  };

  const addFaq = async (newFaq) => {
    try {
      const response = await fetch(`${API_URL}/faqs`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newFaq)
      });
      
      if (!response.ok) {
        throw new Error('Failed to add FAQ');
      }

      const addedFaq = await response.json();
      setFaqs(prevFaqs => [...prevFaqs, addedFaq]);
      return addedFaq;
    } catch (error) {
      console.error('Error adding FAQ:', error);
      throw error;
    }
  };

  const updateFaq = async (id, updates) => {
    try {
      const response = await fetch(`${API_URL}/faqs/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates)
      });

      if (!response.ok) {
        throw new Error('Failed to update FAQ');
      }

      const updatedFaq = await response.json();
      setFaqs(prevFaqs => 
        prevFaqs.map(faq => faq._id === id ? updatedFaq : faq)
      );
    } catch (error) {
      console.error('Error updating FAQ:', error);
      throw error;
    }
  };

  const deleteFaq = async (id) => {
    try {
      const response = await fetch(`${API_URL}/faqs/${id}`, {
        method: 'DELETE'
      });

      if (!response.ok) {
        throw new Error('Failed to delete FAQ');
      }

      setFaqs(prevFaqs => prevFaqs.filter(faq => faq._id !== id));
    } catch (error) {
      console.error('Error deleting FAQ:', error);
      throw error;
    }
  };

  const toggleVisibility = async (id) => {
    try {
      const faq = faqs.find(f => f._id === id);
      if (!faq) return;

      const response = await fetch(`${API_URL}/faqs/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isVisible: !faq.isVisible })
      });

      if (!response.ok) {
        throw new Error('Failed to toggle FAQ visibility');
      }

      const updatedFaq = await response.json();
      setFaqs(prevFaqs => 
        prevFaqs.map(f => f._id === id ? updatedFaq : f)
      );
    } catch (error) {
      console.error('Error toggling FAQ visibility:', error);
      throw error;
    }
  };

  const getVisibleFaqs = () => faqs.filter(faq => faq.isVisible);

  const value = {
    faqs,
    loading,
    addFaq,
    updateFaq,
    deleteFaq,
    toggleVisibility,
    getVisibleFaqs,
    refreshFaqs: loadFaqs
  };

  return (
    <FaqContext.Provider value={value}>
      {children}
    </FaqContext.Provider>
  );
};