const express = require('express');
const router = express.Router();
const Car = require('../models/Car');

// GET all active cars
router.get('/', async (req, res) => {
  try {
    const cars = await Car.find({ isActive: true });
    res.json(cars);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET a single car by ID
router.get('/:id', async (req, res) => {
  try {
    const car = await Car.findById(req.params.id);
    if (!car) {
      return res.status(404).json({ message: 'Car not found' });
    }
    res.json(car);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// CREATE a new car
router.post('/', async (req, res) => {
  try {
    const car = new Car(req.body);
    const savedCar = await car.save();
    res.status(201).json(savedCar);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// UPDATE a car by ID
router.patch('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updatedCar = await Car.findByIdAndUpdate(
      id,
      { ...req.body, updatedAt: new Date() },
      { new: true, runValidators: true }
    );
    
    if (!updatedCar) {
      return res.status(404).json({ message: 'Car not found' });
    }
    
    res.json(updatedCar);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// DELETE a car (soft delete)
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const car = await Car.findByIdAndUpdate(
      id,
      { isActive: false, updatedAt: new Date() },
      { new: true }
    );
    
    if (!car) {
      return res.status(404).json({ message: 'Car not found' });
    }
    
    res.json(car);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router; 