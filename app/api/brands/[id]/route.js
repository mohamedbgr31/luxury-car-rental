import { NextResponse } from 'next/server';
import Brand from '@/models/Brand';
import { connectDB } from '@/lib/mongodb';

// PATCH /api/brands/[id]
export async function PATCH(request, { params }) {
  await connectDB();
  const data = await request.json();
  const { id } = params;
  const updated = await Brand.findByIdAndUpdate(id, data, { new: true });
  return NextResponse.json(updated);
} 