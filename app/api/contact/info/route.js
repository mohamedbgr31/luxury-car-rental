import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import Contact from '@/models/Contact';

// PATCH /api/contact/info - Update a specific contact field
export async function PATCH(request) {
  try {
    await connectDB();
    const { field, value } = await request.json();
    
    // Find the contact document (assuming there's only one)
    let contact = await Contact.findOne({});
    
    if (!contact) {
      // Create a default contact if none exists
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

    // Validate the field
    if (!contact.contactInfo[field]) {
      return NextResponse.json({ error: 'Invalid field' }, { status: 400 });
    }

    // Update the specific field with new value and timestamp
    contact.contactInfo[field].value = value;
    contact.contactInfo[field].lastUpdated = new Date();
    contact.contactInfo[field].isValid = true;
    contact.contactInfo[field].errorMessage = "";
    contact.lastUpdated = new Date();

    // Save the updated contact
    await contact.save();

    return NextResponse.json(contact.contactInfo[field]);
  } catch (error) {
    console.error('API /api/contact/info PATCH error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
