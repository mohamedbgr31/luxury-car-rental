const mongoose = require('mongoose');

// Connect to MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || process.env.MONGO_URI || process.env.MONGO_URL || 'mongodb+srv://luxcarrentdxb:yFO8h7xZSSQd3VYn@cluster-dxb.yfybmgr.mongodb.net/luxurycar');
    console.log('MongoDB connected successfully');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};

// Logo Schema
const logoSchema = new mongoose.Schema({
  navbarLogo: {
    type: String,
    required: true,
    default: '/img/noblelogo.png'
  },
  companyName: {
    type: String,
    required: true,
    default: 'Noble Car Rental'
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true,
});

// Gallery Schema
const gallerySchema = new mongoose.Schema({
  desktopPhotos: [{
    imageUrl: {
      type: String,
      required: true
    },
    alt: {
      type: String,
      default: 'Luxury Car'
    },
    order: {
      type: Number,
      default: 0
    },
    isActive: {
      type: Boolean,
      default: true
    }
  }],
  mobilePhotos: [{
    imageUrl: {
      type: String,
      required: true
    },
    alt: {
      type: String,
      default: 'Luxury Car'
    },
    order: {
      type: Number,
      default: 0
    },
    isActive: {
      type: Boolean,
      default: true
    }
  }],
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true,
});

const Logo = mongoose.model('Logo', logoSchema);
const Gallery = mongoose.model('Gallery', gallerySchema);

// Initialize default data
const initializeData = async () => {
  try {
    // Initialize Logo
    const existingLogo = await Logo.findOne({ isActive: true });
    if (!existingLogo) {
      const logo = new Logo({
        navbarLogo: '/img/noblelogo.png',
        companyName: 'Noble Car Rental',
        isActive: true
      });
      await logo.save();
      console.log('Logo initialized successfully');
    } else {
      console.log('Logo already exists');
    }

    // Initialize Gallery
    const existingGallery = await Gallery.findOne({ isActive: true });
    if (!existingGallery) {
      const gallery = new Gallery({
        desktopPhotos: [
          {
            imageUrl: '/img/lamboburjdxb.jpg',
            alt: 'Lamborghini with Burj Khalifa',
            order: 0,
            isActive: true
          },
          {
            imageUrl: '/img/LAMBOEVO.jpg',
            alt: 'Lamborghini EVO',
            order: 1,
            isActive: true
          },
          {
            imageUrl: '/img/LAMBOREAR.jpg',
            alt: 'Lamborghini Rear View',
            order: 2,
            isActive: true
          },
          {
            imageUrl: '/img/lamboinside.jpg',
            alt: 'Lamborghini Interior',
            order: 3,
            isActive: true
          }
        ],
        mobilePhotos: [
          {
            imageUrl: '/img/lamboburjdxb.jpg',
            alt: 'Lamborghini with Burj Khalifa',
            order: 0,
            isActive: true
          },
          {
            imageUrl: '/img/lamboinside.jpg',
            alt: 'Lamborghini Interior',
            order: 1,
            isActive: true
          }
        ],
        isActive: true
      });
      await gallery.save();
      console.log('Gallery initialized successfully');
    } else {
      console.log('Gallery already exists');
    }

    console.log('Database initialization completed successfully');
  } catch (error) {
    console.error('Error initializing data:', error);
  } finally {
    mongoose.connection.close();
  }
};

// Run initialization
connectDB().then(() => {
  initializeData();
});
