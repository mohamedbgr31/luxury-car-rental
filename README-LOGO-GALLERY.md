# Logo and Gallery Management System

This document explains the new logo and gallery management functionality added to the Noble Car Rental admin panel.

## Overview

The system now allows administrators to:
1. **Modify the navbar logo** and company name
2. **Manage photo galleries** separately for desktop and mobile views
3. **Store all data in the database** for easy modification without breaking the page design

## New Features

### 1. Logo Management
- **Navbar Logo**: Upload or change the logo that appears in the navigation bar
- **Company Name**: Modify the company name displayed next to the logo
- **Real-time Preview**: See changes immediately in the admin panel

### 2. Gallery Management
- **Desktop Photos**: Manage up to 4 photos for desktop view (vertical and horizontal layouts)
- **Mobile Photos**: Manage up to 6 photos for mobile view (vertical swipeable gallery)
- **Device-Specific**: Users see appropriate photos based on their device type
- **Order Control**: Set the display order of photos
- **Alt Text**: Add descriptive text for accessibility

## Database Structure

### Logo Collection
```javascript
{
  navbarLogo: String,      // URL or base64 of the logo
  companyName: String,     // Company name to display
  isActive: Boolean,       // Whether the logo is active
  timestamps: Date         // Created/updated timestamps
}
```

### Gallery Collection
```javascript
{
  desktopPhotos: [{
    imageUrl: String,      // URL or base64 of the image
    alt: String,           // Alt text for accessibility
    order: Number,         // Display order
    isActive: Boolean      // Whether the photo is active
  }],
  mobilePhotos: [{
    imageUrl: String,      // URL or base64 of the image
    alt: String,           // Alt text for accessibility
    order: Number,         // Display order
    isActive: Boolean      // Whether the photo is active
  }],
  isActive: Boolean,       // Whether the gallery is active
  timestamps: Date         // Created/updated timestamps
}
```

## API Endpoints

### Logo Management
- `GET /api/logo` - Retrieve current logo data
- `PUT /api/logo` - Update logo data

### Gallery Management
- `GET /api/gallery` - Retrieve current gallery data
- `PUT /api/gallery` - Update gallery data

## Setup Instructions

### 1. Database Initialization
Run the initialization script to populate the database with default data:

```bash
node scripts/init-db.js
```

This will create:
- Default logo with current Noble Car Rental branding
- Default gallery with existing car photos
- Proper database structure

### 2. Access Admin Panel
Navigate to `/admin/hp` to access the new logo and gallery management sections.

### 3. Modify Content
- Click "MODIFY LOGO" to change the navbar logo and company name
- Click "MODIFY GALLERY" to manage desktop and mobile photos

## User Experience

### Desktop Users
- See the desktop photo layout (4 photos in specific positions)
- Photos are optimized for horizontal viewing

### Mobile Users
- See the mobile photo layout (vertical swipeable gallery)
- Photos are optimized for vertical viewing
- Can swipe between photos with touch gestures

### Responsive Design
- The system automatically detects device type
- Serves appropriate photos based on screen size
- Maintains consistent branding across all devices

## Technical Implementation

### Frontend Changes
- **Homepage** (`app/hp/page.jsx`): Updated to use dynamic logo and gallery data
- **Admin Panel** (`app/admin/hp/page.jsx`): Added logo and gallery management sections

### Backend Changes
- **New Models**: `Logo.js` and `Gallery.js` for database structure
- **New APIs**: `/api/logo` and `/api/gallery` endpoints
- **Data Fetching**: Updated to load logo and gallery data alongside existing content

### State Management
- Uses React Context for global state management
- Real-time updates when content is modified
- Fallback to default content if database data is unavailable

## Benefits

1. **Easy Content Management**: Admins can update logos and photos without touching code
2. **Device Optimization**: Users see photos optimized for their device
3. **Consistent Branding**: Logo changes apply across the entire site
4. **Performance**: Photos are served from the database with proper caching
5. **Accessibility**: Alt text support for all images
6. **Scalability**: Easy to add more photos or modify existing ones

## Future Enhancements

- **Image Optimization**: Automatic image compression and format conversion
- **CDN Integration**: Serve images from content delivery networks
- **Bulk Upload**: Upload multiple images at once
- **Image Cropping**: Built-in image editing tools
- **Analytics**: Track which photos perform best

## Troubleshooting

### Common Issues
1. **Images not loading**: Check if the image URLs are valid
2. **Logo not updating**: Ensure the logo file is accessible
3. **Gallery not showing**: Verify database connection and data

### Debug Steps
1. Check browser console for errors
2. Verify API endpoints are responding
3. Confirm database has the required collections
4. Check image file permissions and URLs

## Support

For technical support or questions about the logo and gallery management system, please refer to the development team or create an issue in the project repository.
