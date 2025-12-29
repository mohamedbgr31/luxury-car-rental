const mongoose = require('mongoose');

const DashboardSchema = new mongoose.Schema({
    overview: {
        bookingsToday: Number,
        bookingGrowth: Number,
        activeRentals: Number,
        availableCars: Number,
        totalRevenue: Number,
        revenueGrowth: Number
    },
    salesChart: [{
        name: String,
        revenue: Number,
        bookings: Number
    }],
    topCars: [{
        _id: String,
        name: String,
        count: Number
    }],
    fleetStatus: [{
        _id: String,
        title: String,
        image: String,
        category: String,
        price: Number,
        state: String
    }],
    pendingBookings: [{
        // Store minimal info or full object? Storing minimal for snapshot.
        _id: String,
        name: String,
        car: String,
        status: String,
        totalPrice: String,
        dateFrom: Date,
        dateTo: Date
    }],
    period: {
        type: String,
        enum: ['today', 'week', 'month', 'year', 'all'],
        required: true
    },
    lastUpdated: {
        type: Date,
        default: Date.now
    }
});

// Compound index to ensure one document per period type
DashboardSchema.index({ period: 1 }, { unique: true });

module.exports = mongoose.model('Dashboard', DashboardSchema);
