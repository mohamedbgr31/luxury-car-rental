import { NextResponse } from 'next/server';
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const revalidate = 0;
import Gallery from '@/models/Gallery';
import { connectDB } from '@/lib/mongodb';

// GET /api/gallery
export async function GET() {
  try {
    await connectDB();
    const gallery = await Gallery.findOne({ isActive: true }).lean();
    return NextResponse.json(gallery || {});
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// PUT /api/gallery
export async function PUT(request) {
  try {
    await connectDB();
    const data = await request.json();

    // Update or create gallery content
    const gallery = await Gallery.findOneAndUpdate(
      { isActive: true }, // find active gallery
      data,
      { new: true, upsert: true } // create if doesn't exist
    );

    return NextResponse.json(gallery);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
