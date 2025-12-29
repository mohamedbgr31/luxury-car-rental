"use client";
// contactdata.js - Contact Data Management System
// This system provides persistent storage for contact information
// Compatible with AdminContactsPage component

import { getApiUrl } from '@/lib/api-config';
import React from 'react';
import {
  FaWhatsapp,
  FaInstagram,
  FaTelegramPlane,
  FaFacebookF,
  FaMapMarkerAlt,
  FaTwitter,
  FaLinkedinIn,
  FaYoutube,
  FaTiktok,
  FaSnapchatGhost,
  FaLink
} from "react-icons/fa";

// Available social media platforms and their icons
export const AVAILABLE_PLATFORMS = {
  WhatsApp: FaWhatsapp,
  Instagram: FaInstagram,
  Telegram: FaTelegramPlane,
  Facebook: FaFacebookF,
  Twitter: FaTwitter,
  LinkedIn: FaLinkedinIn,
  YouTube: FaYoutube,
  TikTok: FaTiktok,
  Snapchat: FaSnapchatGhost,
  Location: FaMapMarkerAlt,
  Website: FaLink
};

// Contact Data Manager Class
class ContactDataManager {
  constructor() {
    this.contactInfo = null;
    this.socialMedia = [];
    this.lastUpdated = null;
  }

  // Initialize data from API
  async initializeData() {
    try {
      // Avoid running during SSR/build where relative fetch URLs are invalid
      if (typeof window === 'undefined') {
        return;
      }
      const response = await fetch(getApiUrl('/api/contact'));
      const data = await response.json();

      if (data) {
        this.contactInfo = data.contactInfo || {};
        this.socialMedia = (data.socialMedia || []).map(item => ({
          ...item,
          id: item._id || item.id,
          icon: AVAILABLE_PLATFORMS[item.platform] || FaLink
        }));
        this.lastUpdated = data.lastUpdated;
      }
    } catch (error) {
      console.error('Error loading data from API:', error);
      // Initialize with default data if API fails
      this.contactInfo = {
        phone: { value: "+971 50 123 4567", lastUpdated: new Date() },
        email: { value: "info@luxurycarrental.com", lastUpdated: new Date() },
        hours: { value: "Mon-Sun: 9:00 AM - 10:00 PM", lastUpdated: new Date() },
        address: { value: "Sheikh Zayed Road, Dubai, UAE", lastUpdated: new Date() }
      };
      this.socialMedia = [];
      this.lastUpdated = new Date();
    }
  }

  // Get all contact information
  getContactInfo() {
    return { ...this.contactInfo };
  }

  // Update contact information
  async updateContactInfo(field, value) {
    try {
      const response = await fetch(getApiUrl('/api/contact/info'), {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ field, value }),
      });

      if (!response.ok) {
        throw new Error('Failed to update contact info');
      }

      const updatedField = await response.json();
      // Update the specific field with its own timestamp
      this.contactInfo[field] = updatedField;
      this.lastUpdated = new Date();
      return this.contactInfo[field];
    } catch (error) {
      console.error('Error updating contact info:', error);
      throw error;
    }
  }

  // Get social media
  getSocialMedia() {
    return [...this.socialMedia];
  }

  // Add social media
  async addSocialMedia(platform, link, active = true) {
    try {
      const response = await fetch(getApiUrl('/api/contact/social'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ platform, link, active }),
      });

      if (!response.ok) {
        throw new Error('Failed to add social media');
      }

      const newSocial = await response.json();
      this.socialMedia.push({
        ...newSocial,
        id: newSocial._id || newSocial.id,
        icon: AVAILABLE_PLATFORMS[platform] || FaLink
      });
      this.lastUpdated = new Date();
      return this.socialMedia[this.socialMedia.length - 1];
    } catch (error) {
      console.error('Error adding social media:', error);
      throw error;
    }
  }

  // Update social media
  async updateSocialMedia(id, updates) {
    try {
      const response = await fetch(getApiUrl(`/api/contact/social/${id}`), {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updates),
      });

      if (!response.ok) {
        throw new Error('Failed to update social media');
      }

      const updatedSocial = await response.json();
      const index = this.socialMedia.findIndex(sm => (sm._id || sm.id) === id);
      if (index !== -1) {
        this.socialMedia[index] = {
          ...updatedSocial,
          id: updatedSocial._id || updatedSocial.id,
          icon: AVAILABLE_PLATFORMS[updatedSocial.platform] || FaLink
        };
      }
      this.lastUpdated = new Date();
      return this.socialMedia[index];
    } catch (error) {
      console.error('Error updating social media:', error);
      throw error;
    }
  }

  // Toggle social media active status
  async toggleSocialActive(id) {
    const social = this.socialMedia.find(sm => (sm._id || sm.id) === id);
    if (social) {
      return this.updateSocialMedia(id, { active: !social.active });
    }
    throw new Error('Social media not found');
  }

  // Remove social media
  async removeSocialMedia(id) {
    try {
      const response = await fetch(getApiUrl(`/api/contact/social/${id}`), {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to remove social media');
      }

      const removed = this.socialMedia.find(sm => (sm._id || sm.id) === id);
      this.socialMedia = this.socialMedia.filter(sm => (sm._id || sm.id) !== id);
      this.lastUpdated = new Date();
      return removed;
    } catch (error) {
      console.error('Error removing social media:', error);
      throw error;
    }
  }

  // Get last updated timestamp
  getLastUpdated() {
    return this.lastUpdated;
  }

  // Reset to defaults
  async resetToDefaults() {
    try {
      // For now, just reset locally - you can implement a reset API endpoint later
      this.contactInfo = {
        phone: { value: "+971 50 123 4567", lastUpdated: new Date() },
        email: { value: "info@luxurycarrental.com", lastUpdated: new Date() },
        hours: { value: "Mon-Sun: 9:00 AM - 10:00 PM", lastUpdated: new Date() },
        address: { value: "Sheikh Zayed Road, Dubai, UAE", lastUpdated: new Date() }
      };
      this.socialMedia = [];
      this.lastUpdated = new Date();
      return true;
    } catch (error) {
      console.error('Error resetting to defaults:', error);
      throw error;
    }
  }
}

// Create a singleton instance
const contactDataManager = new ContactDataManager();

// React hook for using contact data
export const useContactData = (pausePolling = false) => {
  const [contactInfo, setContactInfo] = React.useState(contactDataManager.getContactInfo());
  const [socialMedia, setSocialMedia] = React.useState(contactDataManager.getSocialMedia());
  const [lastUpdated, setLastUpdated] = React.useState(contactDataManager.getLastUpdated());

  React.useEffect(() => {
    // Ensure data is initialized on the client
    contactDataManager.initializeData().finally(() => {
      setContactInfo(contactDataManager.getContactInfo());
      setSocialMedia(contactDataManager.getSocialMedia());
      setLastUpdated(contactDataManager.getLastUpdated());
    });

    if (pausePolling) return; // Do not poll if editing
    const updateStates = () => {
      setContactInfo(contactDataManager.getContactInfo());
      setSocialMedia(contactDataManager.getSocialMedia());
      setLastUpdated(contactDataManager.getLastUpdated());
    };
    const interval = setInterval(updateStates, 5000);
    return () => clearInterval(interval);
  }, [pausePolling]);

  return {
    contactInfo,
    socialMedia,
    lastUpdated,
    updateContactInfo: async (field, value) => {
      const updated = await contactDataManager.updateContactInfo(field, value);
      setContactInfo(contactDataManager.getContactInfo());
      return updated;
    },
    addSocialMedia: async (platform, link, active) => {
      const added = await contactDataManager.addSocialMedia(platform, link, active);
      setSocialMedia(contactDataManager.getSocialMedia());
      return added;
    },
    updateSocialMedia: async (id, updates) => {
      const updated = await contactDataManager.updateSocialMedia(id, updates);
      setSocialMedia(contactDataManager.getSocialMedia());
      return updated;
    },
    toggleSocialActive: async (id) => {
      const updated = await contactDataManager.toggleSocialActive(id);
      setSocialMedia(contactDataManager.getSocialMedia());
      return updated;
    },
    removeSocialMedia: async (id) => {
      const removed = await contactDataManager.removeSocialMedia(id);
      setSocialMedia(contactDataManager.getSocialMedia());
      return removed;
    },
    resetToDefaults: async () => {
      await contactDataManager.resetToDefaults();
      setContactInfo(contactDataManager.getContactInfo());
      setSocialMedia(contactDataManager.getSocialMedia());
      setLastUpdated(contactDataManager.getLastUpdated());
    }
  };
};