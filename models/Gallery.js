import mongoose from 'mongoose';

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
  collection: 'galleries'
});

const Gallery = mongoose.models.Gallery || mongoose.model('Gallery', gallerySchema);

export default Gallery;
