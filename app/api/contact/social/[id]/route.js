import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import Contact from '@/models/Contact';

// PATCH /api/contact/social/[id] - Update social media platform
export async function PATCH(request, { params }) {
  try {
    await connectDB();
    const { id } = params;
    const updates = await request.json();
    
    const contact = await Contact.findOne({});
    if (!contact) {
      return NextResponse.json({ error: 'Contact not found' }, { status: 404 });
    }

    // Find and update the social media entry
    const socialIndex = contact.socialMedia.findIndex(sm => sm._id.toString() === id);
    if (socialIndex === -1) {
      return NextResponse.json({ error: 'Social media not found' }, { status: 404 });
    }

    // Update the social media entry
    Object.keys(updates).forEach(key => {
      if (updates[key] !== undefined) {
        contact.socialMedia[socialIndex][key] = updates[key];
      }
    });
    
    contact.lastUpdated = new Date();
    await contact.save();

    return NextResponse.json(contact.socialMedia[socialIndex]);
  } catch (error) {
    console.error('API /api/contact/social/[id] PATCH error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// DELETE /api/contact/social/[id] - Remove social media platform
export async function DELETE(request, { params }) {
  try {
    await connectDB();
    const { id } = params;
    
    const contact = await Contact.findOne({});
    if (!contact) {
      return NextResponse.json({ error: 'Contact not found' }, { status: 404 });
    }

    // Find and remove the social media entry
    const socialIndex = contact.socialMedia.findIndex(sm => sm._id.toString() === id);
    if (socialIndex === -1) {
      return NextResponse.json({ error: 'Social media not found' }, { status: 404 });
    }

    const removedSocial = contact.socialMedia[socialIndex];
    contact.socialMedia.splice(socialIndex, 1);
    contact.lastUpdated = new Date();
    
    await contact.save();

    return NextResponse.json(removedSocial);
  } catch (error) {
    console.error('API /api/contact/social/[id] DELETE error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
