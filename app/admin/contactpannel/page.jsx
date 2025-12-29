"use client"
import React, { useState, useEffect } from "react";
import {
  FaPhoneAlt,
  FaEnvelope,
  FaCalendarAlt,
  FaMapMarkerAlt,
  FaWhatsapp,
  FaInstagram,
  FaTelegramPlane,
  FaFacebookF,
  FaSignOutAlt,
  FaBars,
  FaTimes,
  FaLink,
  FaCheck,
  FaPen,
  FaTrash,
  FaPlus,
  FaEye,
  FaDownload,
  FaUpload,
  FaRedo
} from "react-icons/fa";

// Import the contact data system
import { useContactData, AVAILABLE_PLATFORMS } from "@/app/components/data/contactdata";
import Sidebar from "@/components/ui/sidebar";
import { usePermissions } from "@/app/hooks/usePermissions";
// Navigation items for sidebar
const navItems = [
  { name: "DASHBOARD", path: "/admin/dashboard", icon: FaEye },
  { name: "CARS", path: "/admin/cars", icon: FaCheck },
  { name: "CONTACTS", path: "/admin/contacts", active: true, icon: FaPhoneAlt },
  { name: "F.A.Q", path: "/admin/faq", icon: FaLink }
];

export default function AdminContactsPage() {
  const [editMode, setEditMode] = useState({});
  const isEditing = Object.values(editMode).some(Boolean);
  const { canEdit, canDelete, canCreate } = usePermissions();
  const {
    contactInfo,
    socialMedia,
    updateContactInfo,
    validateContactField,
    addSocialMedia,
    updateSocialMedia,
    toggleSocialActive,
    removeSocialMedia,
    lastUpdated,
    resetToDefaults,
    exportData,
    importData
  } = useContactData(isEditing);

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [notification, setNotification] = useState({ show: false, message: "", type: "" });
  const [editingSocial, setEditingSocial] = useState(null);

  const formattedLastUpdated = lastUpdated
    ? new Date(lastUpdated).toLocaleDateString() + ' • ' + new Date(lastUpdated).toLocaleTimeString()
    : '';

  // Handle contact info edit
  const handleEdit = (field) => {
    setEditMode({ ...editMode, [field]: true });
  };

  // Save contact info after validation
  const handleSave = async (field, value) => {
    try {
      const updated = await updateContactInfo(field, value);
      if (updated.isValid) {
        setEditMode({ ...editMode, [field]: false });
        showNotification(`${field.charAt(0).toUpperCase() + field.slice(1)} updated successfully!`, "success");
      } else {
        showNotification(updated.errorMessage, "error");
      }
    } catch (error) {
      showNotification("Error updating contact information", "error");
    }
  };

  // Handle cancel edit
  const handleCancel = (field) => {
    setEditMode({ ...editMode, [field]: false });
  };

  // Edit social media entry
  const startEditSocial = (id) => {
    const social = socialMedia.find(s => s.id === id);
    setEditingSocial({ ...social });
  };

  // Save social media changes
  const saveSocialChanges = () => {
    if (editingSocial) {
      try {
        if (editingSocial.id === 0) {
          // Adding new social media
          addSocialMedia(editingSocial.platform, editingSocial.link, editingSocial.active);
          showNotification("New social media platform added!", "success");
        } else {
          // Updating existing social media
          updateSocialMedia(editingSocial.id, {
            platform: editingSocial.platform,
            link: editingSocial.link,
            active: editingSocial.active
          });
          showNotification("Social media updated successfully!", "success");
        }
        setEditingSocial(null);
      } catch (error) {
        showNotification("Error saving social media changes", "error");
      }
    }
  };

  // Toggle social media activity status
  const handleToggleSocialActive = (id) => {
    try {
      const updated = toggleSocialActive(id);
      const status = updated.active ? "activated" : "deactivated";
      showNotification(`${updated.platform} ${status}!`, "info");
    } catch (error) {
      showNotification("Error toggling social media status", "error");
    }
  };

  // Remove social media platform
  const handleRemoveSocialMedia = (id) => {
    try {
      const removed = removeSocialMedia(id);
      showNotification(`${removed.platform} removed!`, "info");
    } catch (error) {
      showNotification("Error removing social media platform", "error");
    }
  };

  // Export data
  const handleExportData = () => {
    try {
      const data = exportData();
      const dataStr = JSON.stringify(data, null, 2);
      const dataBlob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(dataBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `contact-data-backup-${new Date().toISOString().split('T')[0]}.json`;
      link.click();
      URL.revokeObjectURL(url);
      showNotification("Data exported successfully!", "success");
    } catch (error) {
      showNotification("Error exporting data", "error");
    }
  };

  // Import data
  const handleImportData = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const data = JSON.parse(e.target.result);
          const success = importData(data);
          if (success) {
            showNotification("Data imported successfully!", "success");
          } else {
            showNotification("Error importing data - invalid format", "error");
          }
        } catch (error) {
          showNotification("Error importing data - invalid JSON", "error");
        }
      };
      reader.readAsText(file);
    }
  };

  // Reset to defaults
  const handleResetToDefaults = () => {
    if (confirm("Are you sure you want to reset all contact data to defaults? This action cannot be undone.")) {
      resetToDefaults();
      showNotification("Contact data reset to defaults!", "info");
    }
  };

  // Show notification message
  const showNotification = (message, type) => {
    setNotification({ show: true, message, type });
    setTimeout(() => {
      setNotification({ show: false, message: "", type: "" });
    }, 3000);
  };

  // Contact Card Component
  const ContactCard = ({ icon: Icon, title, field }) => {
    const [tempValue, setTempValue] = useState(contactInfo[field]?.value || "");

    useEffect(() => {
      if (!editMode[field]) {
        setTempValue(contactInfo[field]?.value || "");
      }
    }, [contactInfo, field, editMode]);

    // Format individual field's last updated time
    const fieldLastUpdated = contactInfo[field]?.lastUpdated
      ? new Date(contactInfo[field].lastUpdated).toLocaleDateString() + ' • ' + new Date(contactInfo[field].lastUpdated).toLocaleTimeString()
      : formattedLastUpdated;

    return (
      <div className="mb-5 bg-[#121212] rounded-xl shadow-lg overflow-hidden transform transition-all duration-300 hover:shadow-yellow-500/20">
        <div className="relative p-6 h-64">
          <div className="absolute top-4 right-4">
            {!editMode[field] && canEdit && (
              <button
                onClick={() => handleEdit(field)}
                className="bg-yellow-500/20 text-yellow-500 p-2 rounded-full hover:bg-yellow-500/30 transition"
              >
                <FaPen />
              </button>
            )}
          </div>
          <div className="flex flex-col items-center justify-center h-full">
            <div className="bg-yellow-500/10 p-4 rounded-full mb-4">
              <Icon className="text-3xl text-yellow-500" />
            </div>
            <h4 className="font-bruno text-lg mb-4">{title}</h4>
            {editMode[field] ? (
              <div className="w-full">
                <input
                  type="text"
                  value={tempValue}
                  onChange={(e) => setTempValue(e.target.value)}
                  className={`bg-[#1a1a1a] border-2 ${contactInfo[field]?.isValid ? 'border-gray-700' : 'border-red-500'
                    } text-white rounded-xl px-3 py-2 w-full text-center focus:outline-none focus:border-yellow-500 transition-all duration-200`}
                />
                {!contactInfo[field]?.isValid && (
                  <p className="text-red-500 text-xs mt-1">{contactInfo[field]?.errorMessage}</p>
                )}
                <div className="flex justify-center gap-2 mt-3">
                  <button
                    onClick={async () => await handleSave(field, tempValue)}
                    className="bg-green-600 hover:bg-green-700 text-white font-bruno py-2 px-6 rounded-xl transition-all duration-200 hover:scale-105 shadow-md border border-green-500/30"
                  >
                    Save
                  </button>
                  <button
                    onClick={() => handleCancel(field)}
                    className="bg-red-600 hover:bg-red-700 text-white font-bruno py-2 px-6 rounded-xl transition-all duration-200 hover:scale-105 shadow-md border border-red-500/30"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <p className="text-center break-words max-w-xs">{contactInfo[field]?.value}</p>
            )}
          </div>
        </div>
        <div className="bg-gradient-to-r from-yellow-500/10 to-yellow-600/10 py-2 px-4">
          <p className="text-xs text-yellow-500/80">Last updated: {fieldLastUpdated}</p>
        </div>
      </div>
    );
  };

// Social Media Item Component
const SocialMediaItem = ({ social }) => {
  const Icon = social.icon;
  const { canEdit, canDelete } = usePermissions();

  return (
    <div className={`flex flex-col items-center p-4 rounded-xl ${social.active ? 'bg-[#121212]' : 'bg-[#121212]/50 opacity-60'
      } transition-all duration-300`}>
      <div className="relative">
        <Icon className={`text-5xl ${social.active ? 'text-yellow-500' : 'text-gray-500'} mb-2`} />
        {!social.active && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="h-0.5 w-full bg-gray-500 transform rotate-45"></div>
          </div>
        )}
      </div>

      <span className="font-bruno text-sm mt-2">{social.platform}</span>
      <a href={social.link} target="_blank" rel="noopener noreferrer" className="text-xs text-gray-400 hover:text-yellow-500 mt-1 truncate max-w-full">
        {social.link}
      </a>

      <div className="flex gap-2 mt-3">
        {canEdit && (
          <button
            onClick={() => startEditSocial(social.id)}
            className="bg-blue-600/20 text-blue-500 p-1.5 rounded hover:bg-blue-600/30 transition"
          >
            <FaPen size={12} />
          </button>
        )}
        {canEdit && (
          <button
            onClick={() => handleToggleSocialActive(social.id)}
            className={`${social.active ? 'bg-red-600/20 text-red-500' : 'bg-green-600/20 text-green-500'
              } p-1.5 rounded hover:bg-opacity-30 transition`}
          >
            {social.active ? <FaTimes size={12} /> : <FaCheck size={12} />}
          </button>
        )}
        {canDelete && (
          <button
            onClick={() => handleRemoveSocialMedia(social.id)}
            className="bg-red-600/20 text-red-500 p-1.5 rounded hover:bg-red-600/30 transition"
          >
            <FaTrash size={12} />
          </button>
        )}
      </div>
    </div>
  );
};

// Notification Component
const Notification = () => {
  const bgColors = {
    success: "bg-green-500",
    error: "bg-red-500",
    info: "bg-blue-500"
  };

  return notification.show ? (
    <div className={`fixed bottom-4 right-4 ${bgColors[notification.type]} text-white px-4 py-2 rounded-md shadow-lg z-50 animate-fade-in-up`}>
      {notification.message}
    </div>
  ) : null;
};

return (
  <div className="bg-black flex min-h-screen relative font-bruno text-white">
    {/* Notification */}
    <Notification />

    <Sidebar />

    {/* Main Content Wrapper with Sidebar Fix */}
    <div className="flex-1 flex flex-col min-h-screen lg:ml-72 xl:ml-80">

      {/* Mobile menu button */}
      <div className="md:hidden fixed top-4 left-4 z-50">
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="bg-yellow-500 text-black p-2 rounded-md"
        >
          {mobileMenuOpen ? <FaTimes /> : <FaBars />}
        </button>
      </div>

      {/* Page Content */}
      <div className="container mx-auto px-6 py-8">

        {/* Statistics Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-[#121212] rounded-xl p-4 border border-yellow-500/20 hover:border-yellow-500/40 transition-all duration-300">
            <div className="text-yellow-500 text-2xl font-bold">
              {Object.keys(contactInfo).length}
            </div>
            <div className="text-gray-400 text-sm">Contact Fields</div>
          </div>

          <div className="bg-[#121212] rounded-xl p-4 border border-green-500/20 hover:border-green-500/40 transition-all duration-300">
            <div className="text-green-500 text-2xl font-bold">
              {socialMedia.filter(s => s.active).length}
            </div>
            <div className="text-gray-400 text-sm">Active Socials</div>
          </div>

          <div className="bg-[#121212] rounded-xl p-4 border border-red-500/20 hover:border-red-500/40 transition-all duration-300">
            <div className="text-red-500 text-2xl font-bold">
              {socialMedia.filter(s => !s.active).length}
            </div>
            <div className="text-gray-400 text-sm">Inactive Socials</div>
          </div>

          <div className="bg-[#121212] rounded-xl p-4 border border-blue-500/20 hover:border-blue-500/40 transition-all duration-300">
            <div className="text-blue-500 text-2xl font-bold">
              {socialMedia.length}
            </div>
            <div className="text-gray-400 text-sm">Total Platforms</div>
          </div>
        </div>

        {/* Section: Contact Information */}
        <section className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bruno text-yellow-500">CONTACT INFORMATION</h2>
            <div className="h-px bg-yellow-500/20 flex-1 ml-4"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-8">
            <ContactCard
              key="phone"
              icon={FaPhoneAlt}
              title="Phone Number"
              value={contactInfo.phone}
              field="phone"
            />
            <ContactCard
              key="email"
              icon={FaEnvelope}
              title="Email Address"
              value={contactInfo.email}
              field="email"
            />
            <ContactCard
              key="whatsapp"
              icon={FaWhatsapp}
              title="WhatsApp"
              value={contactInfo.whatsapp}
              field="whatsapp"
            />
            <ContactCard
              key="address"
              icon={FaMapMarkerAlt}
              title="Office Address"
              value={contactInfo.address}
              field="address"
            />
          </div>
        </section>

        {/* Section: Social Media */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bruno text-yellow-500">SOCIAL MEDIA</h2>
            <div className="h-px bg-yellow-500/20 flex-1 ml-4 mr-4"></div>
            {canCreate && (
              <button
                onClick={() => setEditingSocial({ id: 0, platform: "", link: "", active: true })}
                className="bg-yellow-500 hover:bg-yellow-400 text-black px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 transition"
              >
                <FaPlus /> Add Platform
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {socialMedia.map(social => (
              <SocialMediaItem key={social.id} social={social} />
            ))}
          </div>
        </section>
      </div>
    </div>

    {/* Edit Modal */}
    {editingSocial && (
      <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
        <div className="bg-[#121212] border border-yellow-500/30 rounded-xl p-6 w-full max-w-md shadow-2xl">
          <h3 className="text-xl font-bruno text-white mb-6">
            {editingSocial.id === 0 ? "Add Social Platform" : "Edit Social Platform"}
          </h3>

          <div className="space-y-4">
            <div>
              <label className="block text-sm text-gray-400 mb-2">Platform</label>
              <select
                value={editingSocial.platform}
                onChange={(e) => setEditingSocial({
                  ...editingSocial,
                  platform: e.target.value,
                  icon: AVAILABLE_PLATFORMS[e.target.value] || FaLink
                })}
                className="bg-[#1a1a1a] border border-gray-700 text-white rounded px-3 py-2 w-full focus:outline-none focus:border-yellow-500"
              >
                <option value="">Select Platform</option>
                {Object.keys(AVAILABLE_PLATFORMS).map(platform => (
                  <option key={platform} value={platform}>{platform}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm text-gray-400 mb-2">Link URL</label>
              <input
                type="url"
                value={editingSocial.link}
                onChange={(e) => setEditingSocial({ ...editingSocial, link: e.target.value })}
                placeholder="https://example.com"
                className="bg-[#1a1a1a] border border-gray-700 text-white rounded px-3 py-2 w-full focus:outline-none focus:border-yellow-500"
              />
            </div>

            <div className="flex items-center justify-between">
              <label className="text-sm text-gray-400">Active Status</label>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  checked={editingSocial.active}
                  onChange={(e) => setEditingSocial({ ...editingSocial, active: e.target.checked })}
                  className="mr-2 h-4 w-4 accent-yellow-500"
                />
                <span className="text-sm">{editingSocial.active ? "Active" : "Inactive"}</span>
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-3 mt-6">
            <button
              onClick={() => setEditingSocial(null)}
              className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded transition"
            >
              Cancel
            </button>
            <button
              onClick={saveSocialChanges}
              disabled={!editingSocial.platform || !editingSocial.link}
              className="bg-gradient-to-r from-yellow-500 to-yellow-600 text-black px-4 py-2 rounded hover:opacity-90 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {editingSocial.id === 0 ? "Add Platform" : "Save Changes"}
            </button>
          </div>
        </div>
      </div>
    )}
  </div>
);
}