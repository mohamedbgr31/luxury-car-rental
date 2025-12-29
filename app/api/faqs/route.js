import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import Faq from '@/models/Faq';

// GET /api/faqs
export async function GET() {
  try {
    await connectDB();
    const faqs = await Faq.find({});
    return NextResponse.json(faqs);
  } catch (error) {
    console.error('API /api/faqs GET error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// POST /api/faqs
export async function POST(request) {
  try {
    await connectDB();
    const data = await request.json();
    const faq = await Faq.create(data);
    return NextResponse.json(faq);
  } catch (error) {
    console.error('API /api/faqs POST error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
} 