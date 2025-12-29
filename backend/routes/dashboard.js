const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Request = mongoose.model('Request');
const Car = require('../models/Car');

// GET /api/dashboard/stats
router.get('/stats', async (req, res) => {
    try {
        const { period } = req.query; // 'today', 'week', 'month', 'year', 'all'

        // Date Filtering Logic
        const now = new Date();
        let startDate = new Date();
        let previousStartDate = new Date();
        let previousEndDate = new Date();

        switch (period) {
            case 'week':
                startDate.setDate(now.getDate() - 7);
                previousStartDate.setDate(now.getDate() - 14);
                previousEndDate.setDate(now.getDate() - 7);
                break;
            case 'month':
                startDate.setMonth(now.getMonth() - 1);
                previousStartDate.setMonth(now.getMonth() - 2);
                previousEndDate.setMonth(now.getMonth() - 1);
                break;
            case 'year':
                startDate.setFullYear(now.getFullYear() - 1);
                previousStartDate.setFullYear(now.getFullYear() - 2);
                previousEndDate.setFullYear(now.getFullYear() - 1);
                break;
            case 'all':
            default:
                // Default to All Time if no period specified or 'all'
                startDate = new Date(0); // Beginning of time
                previousStartDate = new Date(0);
                previousEndDate = new Date(0);
                break;
            case 'today':
                startDate.setHours(0, 0, 0, 0);
                // For 'today', comparison is usually yesterday
                previousStartDate.setDate(now.getDate() - 1);
                previousStartDate.setHours(0, 0, 0, 0);
                previousEndDate.setDate(now.getDate() - 1);
                previousEndDate.setHours(23, 59, 59, 999);
                break;
        }

        // 1. Overview Stats

        // Total Bookings (Filtered by period)
        const totalBookings = await Request.countDocuments({
            timestamp: { $gte: startDate }
        });

        const previousBookings = await Request.countDocuments({
            timestamp: { $gte: previousStartDate, $lt: previousEndDate }
        });

        const bookingGrowth = previousBookings === 0 ? 100 : Math.round(((totalBookings - previousBookings) / previousBookings) * 100);


        // Active Rentals
        // Fix: Case insensitive 'accepted' check
        const activeRentals = await Request.countDocuments({
            status: { $regex: /^accepted$/i },
            dateFrom: { $lte: now },
            dateTo: { $gte: now }
        });

        // Total Revenue (Filtered by period)
        // Fix: Case insensitive 'accepted' check
        const acceptedRequests = await Request.find({
            status: { $regex: /^accepted$/i },
            timestamp: { $gte: startDate }
        });

        let totalRevenue = 0;
        acceptedRequests.forEach(req => {
            // Robust parsing: remove non-digits/dots, handle potential empty strings
            const priceStr = req.totalPrice ? req.totalPrice.toString().replace(/[^0-9.]/g, "") : "0";
            const price = parseFloat(priceStr);
            if (!isNaN(price)) {
                totalRevenue += price;
            }
        });

        // Previous Revenue for growth calculation
        const previousRequests = await Request.find({
            status: { $regex: /^accepted$/i },
            timestamp: { $gte: previousStartDate, $lt: previousEndDate }
        });
        let previousRevenue = 0;
        previousRequests.forEach(req => {
            const priceStr = req.totalPrice ? req.totalPrice.toString().replace(/[^0-9.]/g, "") : "0";
            const price = parseFloat(priceStr);
            if (!isNaN(price)) {
                previousRevenue += price;
            }
        });
        const revenueGrowth = previousRevenue === 0 ? 100 : Math.round(((totalRevenue - previousRevenue) / previousRevenue) * 100);


        // 2. Sales Graph (Based on Period)
        let dateFormat = "%Y-%m-%d"; // Default daily
        if (period === 'today') dateFormat = "%H:00"; // Hourly
        if (period === 'year') dateFormat = "%Y-%m"; // Monthly

        // JS-based aggregation for graph (safer for string prices)
        const graphMap = new Map();
        acceptedRequests.forEach(req => {
            let key;
            const date = new Date(req.timestamp);
            if (period === 'today') key = date.getHours() + ":00";
            else if (period === 'year') key = `${date.getFullYear()}-${date.getMonth() + 1}`;
            else key = date.toISOString().split('T')[0];

            const priceStr = req.totalPrice ? req.totalPrice.toString().replace(/[^0-9.]/g, "") : "0";
            const price = parseFloat(priceStr) || 0;

            if (!graphMap.has(key)) graphMap.set(key, { name: key, revenue: 0, bookings: 0 });
            const entry = graphMap.get(key);
            entry.revenue += price;
            entry.bookings += 1;
        });
        const graphData = Array.from(graphMap.values()).sort((a, b) => a.name.localeCompare(b.name));


        // 3. Top Booked Cars (Filtered)
        const topCars = await Request.aggregate([
            {
                $match: {
                    status: { $regex: /^accepted$/i },
                    timestamp: { $gte: startDate }
                }
            },
            {
                $group: {
                    _id: "$carId",
                    name: { $first: "$car" },
                    count: { $sum: 1 }
                }
            },
            { $sort: { count: -1 } },
            { $limit: 5 }
        ]);

        // 4. Fleet Status (Full list with pricing and dynamic status)
        const allCars = await Car.find();

        // Fetch currently active bookings to determine dynamic status
        const currentActiveBookings = await Request.find({
            status: { $regex: /^accepted$/i },
            dateFrom: { $lte: now },
            dateTo: { $gte: now }
        }).lean();

        // Create a set of booked car names/IDs for O(1) lookup
        const bookedCarNames = new Set(currentActiveBookings.map(req => req.car));

        const fleetList = allCars.map(car => {
            // Determine status: 
            let dynamicState = car.state;

            // Check if car is booked (matching by title, model, or brand+model)
            const carName = car.title || `${car.brand} ${car.model}`;

            // If we have an active booking for this car
            if (bookedCarNames.has(carName) || bookedCarNames.has(car.title) || bookedCarNames.has(car.model)) {
                dynamicState = 'Booked';
            }

            return {
                _id: car._id,
                title: carName,
                image: car.mainImage || car.image || '/img/luxury-car-gold.png', // Prioritize 'mainImage' to match Cars page
                category: car.category || 'Luxury',
                price: car.pricing?.daily || 0,
                state: dynamicState
            };
        });

        // Recalculate Available Cars based on dynamic state
        const availableCars = fleetList.filter(c => c.state === 'Available').length;


        // 5. Recent Activity
        const pendingBookings = await Request.find({ status: 'pending' })
            .sort({ timestamp: -1 })
            .limit(5)
            .lean();

        const dashboardData = {
            overview: {
                bookingsToday: totalBookings,
                bookingGrowth,
                activeRentals,
                availableCars,
                totalRevenue,
                revenueGrowth
            },
            salesChart: graphData,
            topCars,
            fleetStatus: fleetList,
            pendingBookings,
            period: period || 'all',
            lastUpdated: new Date()
        };

        // Save/Update Dashboard Data (Commented out to avoid CastError)
        // const Dashboard = require('../models/Dashboard');
        // await Dashboard.findOneAndUpdate(
        //     { period: period || 'all' },
        //     dashboardData,
        //     { upsert: true, new: true }
        // );

        res.json(dashboardData);

    } catch (error) {
        console.error('Dashboard Stats Error:', error);
        res.status(500).json({ message: error.message, stack: error.stack });
    }
});

module.exports = router;
