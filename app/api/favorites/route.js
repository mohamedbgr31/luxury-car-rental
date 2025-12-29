import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { connectDB } from '@/lib/mongodb';
import User from '@/models/User';
import Car from '@/models/Car';

const JWT_SECRET = process.env.JWT_SECRET || 'changeme';

function getTokenFromRequest(request) {
  const cookieToken = request.cookies.get('token')?.value;
  if (cookieToken) return cookieToken;
  const authHeader = request.headers.get('authorization');
  if (authHeader && authHeader.startsWith('Bearer ')) {
    return authHeader.replace('Bearer ', '');
  }
  return null;
}

export async function GET(request) {
  try {
    await connectDB();
    const token = getTokenFromRequest(request);
    if (!token) {
      return NextResponse.json({ favorites: [] }, { status: 200 });
    }
    let userData;
    try {
      userData = jwt.verify(token, JWT_SECRET);
    } catch (e) {
      return NextResponse.json({ favorites: [] }, { status: 200 });
    }
    const user = await User.findById(userData.id).populate('favorites');
    if (!user) {
      return NextResponse.json({ favorites: [] }, { status: 200 });
    }
    return NextResponse.json({ favorites: user.favorites || [] });
  } catch (error) {
    console.error('GET /api/favorites error', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    await connectDB();
    const token = getTokenFromRequest(request);
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    let userData;
    try {
      userData = jwt.verify(token, JWT_SECRET);
    } catch (e) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const { carId } = await request.json();
    if (!carId) {
      return NextResponse.json({ error: 'carId is required' }, { status: 400 });
    }
    // Validate car exists
    const car = await Car.findById(carId).select('_id');
    if (!car) {
      return NextResponse.json({ error: 'Car not found' }, { status: 404 });
    }
    const user = await User.findById(userData.id).select('favorites');
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }
    const index = user.favorites.findIndex((id) => id.toString() === carId);
    let favorited;
    if (index >= 0) {
      // Remove
      user.favorites.splice(index, 1);
      favorited = false;
    } else {
      user.favorites.push(carId);
      favorited = true;
    }
    await user.save();
    const populated = await User.findById(userData.id).populate('favorites');
    return NextResponse.json({ favorited, favorites: populated.favorites });
  } catch (error) {
    console.error('POST /api/favorites error', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}


