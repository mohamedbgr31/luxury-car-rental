const express = require('express');
const router = express.Router();
const Hero = require('../models/Hero');

// Get hero section data
router.get('/', async (req, res) => {
  try {
    const heroData = await Hero.findOne();
    res.json(heroData || {});
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update hero section data
router.put('/', async (req, res) => {
  try {
    const heroData = await Hero.findOne();
    if (heroData) {
      // Update existing
      const updatedHero = await Hero.findByIdAndUpdate(
        heroData._id,
        req.body,
        { new: true }
      );
      res.json(updatedHero);
    } else {
      // Create new if doesn't exist
      const newHero = new Hero(req.body);
      const savedHero = await newHero.save();
      res.status(201).json(savedHero);
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router; 