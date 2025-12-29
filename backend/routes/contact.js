const express = require('express');
const router = express.Router();
const Contact = require('../models/Contact');

// Get contact information
router.get('/', async (req, res) => {
  try {
    let contact = await Contact.findOne();
    if (!contact) {
      // Create default contact if none exists
      contact = await Contact.create({
        contactInfo: {
          phone: {
            value: "+971 50 123 4567",
            isValid: true,
            errorMessage: "",
            pattern: "^\\+[0-9]{1,4}\\s[0-9\\s]{5,}$",
            validationMessage: "Please enter a valid phone number (e.g., +971 50 123 4567)"
          },
          email: {
            value: "luxrentals@gmail.com",
            isValid: true,
            errorMessage: "",
            pattern: "^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$",
            validationMessage: "Please enter a valid email address"
          },
          hours: {
            value: "Mon - Sun: 9:00 AM - 10:00 PM",
            isValid: true,
            errorMessage: "",
            pattern: ".+",
            validationMessage: "Working hours cannot be empty"
          },
          address: {
            value: "Sheikh Zayed Road, Dubai, UAE",
            isValid: true,
            errorMessage: "",
            pattern: ".+",
            validationMessage: "Address cannot be empty"
          }
        },
        socialMedia: [
          { platform: "WhatsApp", link: "https://wa.me/971501234567", active: true },
          { platform: "Instagram", link: "https://instagram.com/nobleluxrent", active: true },
          { platform: "Telegram", link: "https://t.me/nobleluxrent", active: true },
          { platform: "Facebook", link: "https://facebook.com/nobleluxrent", active: true },
          { platform: "Location", link: "https://maps.google.com", active: true }
        ]
      });
    }
    res.json(contact);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update contact information
router.patch('/info', async (req, res) => {
  try {
    const { field, value } = req.body;
    const contact = await Contact.findOne();
    
    if (!contact) {
      return res.status(404).json({ message: 'Contact information not found' });
    }

    // Validate the field
    const fieldData = contact.contactInfo[field];
    if (!fieldData) {
      return res.status(400).json({ message: 'Invalid field' });
    }

    // Update the field
    contact.contactInfo[field].value = value;
    contact.lastUpdated = new Date();
    await contact.save();

    res.json(contact.contactInfo[field]);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Add social media
router.post('/social', async (req, res) => {
  try {
    const { platform, link, active } = req.body;
    const contact = await Contact.findOne();
    
    if (!contact) {
      return res.status(404).json({ message: 'Contact information not found' });
    }

    contact.socialMedia.push({ platform, link, active });
    contact.lastUpdated = new Date();
    await contact.save();

    res.status(201).json(contact.socialMedia[contact.socialMedia.length - 1]);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Update social media
router.patch('/social/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { platform, link, active } = req.body;
    const contact = await Contact.findOne();
    
    if (!contact) {
      return res.status(404).json({ message: 'Contact information not found' });
    }

    const socialMedia = contact.socialMedia.id(id);
    if (!socialMedia) {
      return res.status(404).json({ message: 'Social media not found' });
    }

    if (platform) socialMedia.platform = platform;
    if (link) socialMedia.link = link;
    if (typeof active === 'boolean') socialMedia.active = active;

    contact.lastUpdated = new Date();
    await contact.save();

    res.json(socialMedia);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete social media
router.delete('/social/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const contact = await Contact.findOne();
    
    if (!contact) {
      return res.status(404).json({ message: 'Contact information not found' });
    }

    contact.socialMedia = contact.socialMedia.filter(sm => sm._id.toString() !== id);
    contact.lastUpdated = new Date();
    await contact.save();

    res.json({ message: 'Social media deleted successfully' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Reset to defaults
router.post('/reset', async (req, res) => {
  try {
    await Contact.deleteMany({});
    const contact = await Contact.create({
      contactInfo: {
        phone: {
          value: "+971 50 123 4567",
          isValid: true,
          errorMessage: "",
          pattern: "^\\+[0-9]{1,4}\\s[0-9\\s]{5,}$",
          validationMessage: "Please enter a valid phone number (e.g., +971 50 123 4567)"
        },
        email: {
          value: "luxrentals@gmail.com",
          isValid: true,
          errorMessage: "",
          pattern: "^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$",
          validationMessage: "Please enter a valid email address"
        },
        hours: {
          value: "Mon - Sun: 9:00 AM - 10:00 PM",
          isValid: true,
          errorMessage: "",
          pattern: ".+",
          validationMessage: "Working hours cannot be empty"
        },
        address: {
          value: "Sheikh Zayed Road, Dubai, UAE",
          isValid: true,
          errorMessage: "",
          pattern: ".+",
          validationMessage: "Address cannot be empty"
        }
      },
      socialMedia: [
        { platform: "WhatsApp", link: "https://wa.me/971501234567", active: true },
        { platform: "Instagram", link: "https://instagram.com/nobleluxrent", active: true },
        { platform: "Telegram", link: "https://t.me/nobleluxrent", active: true },
        { platform: "Facebook", link: "https://facebook.com/nobleluxrent", active: true },
        { platform: "Location", link: "https://maps.google.com", active: true }
      ]
    });

    res.json(contact);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router; 