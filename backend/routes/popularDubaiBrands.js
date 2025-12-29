const express = require('express');
const router = express.Router();
const PopularDubaiBrand = require('../models/PopularDubaiBrand');
const Brand = require('../models/Brand');

// Get all popular Dubai brands
router.get('/', async (req, res) => {
  try {
    const brands = await PopularDubaiBrand.find();
    res.json(brands);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Add a new popular Dubai brand (and also add to brands if not exists)
router.post('/', async (req, res) => {
  try {
    const { name, logo } = req.body;
    // Add to popularDubaiBrands
    const newPopularBrand = new PopularDubaiBrand({ name, logo });
    await newPopularBrand.save();
    // Add to brands if not exists
    const existingBrand = await Brand.findOne({ name });
    if (!existingBrand) {
      const newBrand = new Brand({ name, logo, description: '', isActive: true });
      await newBrand.save();
    }
    res.status(201).json(newPopularBrand);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete a popular Dubai brand by id
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await PopularDubaiBrand.findByIdAndDelete(id);
    if (!deleted) {
      return res.status(404).json({ message: 'Popular Dubai brand not found' });
    }
    res.json({ message: 'Deleted successfully' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router; 