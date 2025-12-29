import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import Car from '@/models/Car';

// GET /api/cars
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
  const run = async () => {
    await connectDB();
    // Only return active cars; avoid heavy projections here
    return await Car.find({ isActive: true }).lean();
  };

  try {
    const cars = await run();
    return NextResponse.json(cars);
  } catch (error) {
    // Retry once on transient TLS/socket errors sometimes seen on Windows/OpenSSL
    const isTransient = /SSL|ECONNRESET|socket|handshake|bad record mac/i.test(error?.message || '');
    if (isTransient) {
      try {
        const cars = await run();
        return NextResponse.json(cars);
      } catch (err2) {
        console.error('API /api/cars GET retry failed:', err2);
        return NextResponse.json({ error: err2.message }, { status: 500 });
      }
    }
    console.error('API /api/cars GET error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// POST /api/cars
export async function POST(request) {
  try {
    await connectDB();
    const data = await request.json();
    const car = await Car.create(data);
    return NextResponse.json(car);
  } catch (error) {
    console.error('API /api/cars POST error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
} 