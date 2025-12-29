const express = require('express');
const router = express.Router();
const Brand = require('../models/Brand');

// Get all active brands
router.get('/', async (req, res) => {
  try {
    const brands = await Brand.find({ isActive: true });
    res.json(brands);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create a new brand
router.post('/', async (req, res) => {
  try {
    const brand = new Brand(req.body);
    const savedBrand = await brand.save();
    res.status(201).json(savedBrand);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Update a brand
router.patch('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updatedBrand = await Brand.findByIdAndUpdate(
      id,
      { ...req.body, updatedAt: new Date() },
      { new: true }
    );
    
    if (!updatedBrand) {
      return res.status(404).json({ message: 'Brand not found' });
    }
    
    res.json(updatedBrand);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete a brand (soft delete)
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const brand = await Brand.findByIdAndUpdate(
      id,
      { isActive: false, updatedAt: new Date() },
      { new: true }
    );
    
    if (!brand) {
      return res.status(404).json({ message: 'Brand not found' });
    }
    
    res.json(brand);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router; 