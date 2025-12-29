import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import Request from '@/models/Request';
import Car from '@/models/Car';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'changeme';

export async function GET(request) {
  try {
    await connectDB();
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Missing or invalid authorization header' }, { status: 401 });
    }
    const token = authHeader.replace('Bearer ', '');
    let user;
    try {
      user = jwt.verify(token, JWT_SECRET);
    } catch (err) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }
    const normalizePhone = (p) => (p || '').toString().replace(/\s+/g, '').trim();
    const userId = user.id;
    const userPhone = normalizePhone(user.phone);
    if (!userId && !userPhone) {
      return NextResponse.json({ error: 'User info not found in token' }, { status: 400 });
    }
    // Always show only this user's requests in the garage
    const phoneOrNull = userPhone || null;
    const query = userId
      ? { $or: [ { userId }, { userPhone: phoneOrNull }, { contact: phoneOrNull } ] }
      : { $or: [ { userPhone: phoneOrNull }, { contact: phoneOrNull } ] };
    const myRequests = await Request.find(query).sort({ timestamp: -1 }).populate('carId');
    return NextResponse.json(myRequests);
  } catch (error) {
    console.error('Error in GET /api/requests/my:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
} 