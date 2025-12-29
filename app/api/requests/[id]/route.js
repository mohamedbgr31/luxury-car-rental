import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import Request from '@/models/Request';
import Car from '@/models/Car';

export async function PATCH(req, { params }) {
  try {
    await connectDB();
    const { id } = params;
    const { status } = await req.json();
    if (!['accepted', 'rejected'].includes(status)) {
      return NextResponse.json({ error: 'Invalid status' }, { status: 400 });
    }
    // Update the request status
    const request = await Request.findByIdAndUpdate(id, { status }, { new: true });
    if (!request) {
      return NextResponse.json({ error: 'Request not found' }, { status: 404 });
    }
    // If accepted, update the car's unavailableDates
    if (status === 'accepted') {
      if (request.carId && request.dateFrom && request.dateTo) {
        const car = await Car.findById(request.carId);
        if (car) {
          // Add the new unavailable range as YYYY-MM-DD strings
          car.unavailableDates = car.unavailableDates || [];
          const formatDate = (d) => {
            if (!d) return '';
            const date = new Date(d);
            return date.toISOString().slice(0, 10);
          };
          car.unavailableDates.push({ from: formatDate(request.dateFrom), to: formatDate(request.dateTo) });
          await car.save();
        }
      }
    }
    return NextResponse.json({ success: true, request });
  } catch (error) {
    console.error('Error in PATCH /api/requests/[id]:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
} 