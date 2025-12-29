import { NextResponse } from 'next/server';
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const revalidate = 0;
import Logo from '@/models/Logo';
import { connectDB } from '@/lib/mongodb';

// GET /api/logo
export async function GET() {
  try {
    await connectDB();
    const logo = await Logo.findOne({ isActive: true }).lean();
    return NextResponse.json(logo || {});
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// PUT /api/logo
export async function PUT(request) {
  try {
    await connectDB();
    const data = await request.json();

    // Update or create logo content
    const logo = await Logo.findOneAndUpdate(
      { isActive: true }, // find active logo
      data,
      { new: true, upsert: true } // create if doesn't exist
    );

    return NextResponse.json(logo);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
