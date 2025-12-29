import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import Car from '@/models/Car';

// DELETE /api/cars/:id
export async function DELETE(request, context) {
  try {
    await connectDB();
    const { id } = await context.params;
    const deleted = await Car.findByIdAndDelete(id);
    if (!deleted) {
      return NextResponse.json({ error: 'Car not found' }, { status: 404 });
    }
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// PUT /api/cars/:id
export async function PUT(request, context) {
  try {
    await connectDB();
    const { id } = await context.params;
    const data = await request.json();
    const updated = await Car.findByIdAndUpdate(id, data, { new: true });
    if (!updated) {
      return NextResponse.json({ error: 'Car not found' }, { status: 404 });
    }
    return NextResponse.json(updated);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// GET /api/cars/:id
export async function GET(request, context) {
  try {
    await connectDB();
    const { id } = await context.params;
    const car = await Car.findById(id);
    if (!car) {
      return NextResponse.json({ error: 'Car not found' }, { status: 404 });
    }
    return NextResponse.json(car);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
} 