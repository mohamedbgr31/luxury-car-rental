import { NextResponse } from 'next/server';
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const revalidate = 0;
import Brand from '@/models/Brand';
import { connectDB } from '@/lib/mongodb';

// GET /api/brands
export async function GET() {
  const run = async () => {
    await connectDB();
    return await Brand.find({}).lean();
  };

  try {
    const brands = await run();
    return NextResponse.json(brands);
  } catch (error) {
    // Retry once on transient TLS/socket errors sometimes seen on Windows/OpenSSL
    const isTransient = /SSL|ECONNRESET|socket|handshake|bad record mac/i.test(error?.message || '');
    if (isTransient) {
      try {
        console.log('Retrying brands API call after SSL error');
        const brands = await run();
        return NextResponse.json(brands);
      } catch (err2) {
        console.error('API /api/brands GET retry failed:', err2);
        return NextResponse.json({ error: err2.message }, { status: 500 });
      }
    }
    console.error('API /api/brands GET error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// POST /api/brands
export async function POST(request) {
  try {
    await connectDB();
    const data = await request.json();
    const brand = await Brand.create(data);
    return NextResponse.json(brand);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// PUT /api/brands
export async function PUT(request) {
  try {
    await connectDB();
    const data = await request.json();
    const { _id, ...updateData } = data;
    const brand = await Brand.findByIdAndUpdate(_id, updateData, { new: true });
    return NextResponse.json(brand);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// DELETE /api/brands
export async function DELETE(request) {
  try {
    await connectDB();
    const data = await request.json();
    await Brand.findByIdAndDelete(data._id);
    return NextResponse.json({ message: 'Brand deleted successfully' });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}