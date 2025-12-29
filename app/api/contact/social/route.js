import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import Contact from '@/models/Contact';

// POST /api/contact/social - Add new social media platform
export async function POST(request) {
  try {
    await connectDB();
    const { platform, link, active = true } = await request.json();
    
    // Find or create contact document
    let contact = await Contact.findOne({});
    
    if (!contact) {
      contact = new Contact({
        contactInfo: {
          phone: { value: "+971 50 123 4567", lastUpdated: new Date() },
          email: { value: "info@luxurycarrental.com", lastUpdated: new Date() },
          hours: { value: "Mon-Sun: 9:00 AM - 10:00 PM", lastUpdated: new Date() },
          address: { value: "Sheikh Zayed Road, Dubai, UAE", lastUpdated: new Date() }
        },
        socialMedia: [],
        lastUpdated: new Date()
      });
    }

    // Add new social media platform
    const newSocial = {
      platform,
      link,
      active
    };
    
    contact.socialMedia.push(newSocial);
    contact.lastUpdated = new Date();
    
    await contact.save();

    // Return the newly added social media with its generated ID
    const addedSocial = contact.socialMedia[contact.socialMedia.length - 1];
    return NextResponse.json(addedSocial);
  } catch (error) {
    console.error('API /api/contact/social POST error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
