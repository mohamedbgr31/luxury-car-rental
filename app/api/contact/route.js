import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import Contact from '@/models/Contact';

// GET /api/contact
export async function GET() {
  try {
    await connectDB();
    const contact = await Contact.findOne({});
    return NextResponse.json(contact);
  } catch (error) {
    console.error('API /api/contact GET error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
