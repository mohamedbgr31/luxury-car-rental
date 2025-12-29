import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import Request from '@/models/Request';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'changeme';

// Use the native MongoDB driver for flexibility
const COLLECTION = 'requests';
const DB_NAME = 'luxurycar';

export async function POST(request) {
  try {
    await connectDB();
    const data = await request.json();

    // Helper to normalize phone numbers (remove spaces and trim)
    const normalizePhone = (p) => (p || '').toString().replace(/\s+/g, '').trim();

    // Extract user from Authorization header
    const authHeader = request.headers.get('authorization');
    let user = null;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.replace('Bearer ', '');
      try {
        user = jwt.verify(token, JWT_SECRET);
      } catch (err) {
        return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
      }
    }

    // Backend validation for required fields
    const requiredFields = ['name', 'contact', 'car', 'dateFrom', 'dateTo', 'totalDays', 'rentalType', 'totalPrice'];
    const missing = requiredFields.filter(f => !data[f]);
    if (missing.length > 0) {
      return NextResponse.json({ error: `Missing fields: ${missing.join(', ')}` }, { status: 400 });
    }

    // Set userId and userPhone from token if available
    if (user) {
      data.userId = user.id;
      data.userPhone = normalizePhone(user.phone);
    }

    // If no token/userPhone, fall back to using the provided contact phone
    if (!data.userPhone && data.contact) {
      data.userPhone = normalizePhone(data.contact);
    }

    // Ensure at least some contact association exists
    if (!data.userId && !data.userPhone && !data.contact) {
      return NextResponse.json({ error: 'Missing contact information for booking.' }, { status: 400 });
    }

    // Create the request
    const doc = await Request.create(data);
    return NextResponse.json(doc, { status: 201 });
  } catch (error) {
    console.error('Error in POST /api/requests:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function GET(request) {
  try {
    await connectDB();
    const all = await Request.find({}).sort({ timestamp: -1 });
    return NextResponse.json(all);
  } catch (error) {
    console.error('Error in GET /api/requests:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// GET /api/requests/my - get requests for the logged-in user
export async function GET_MY(request) {
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
    const userId = user._id || user.id;
    const userPhone = user.phone;
    if (!userId && !userPhone) {
      return NextResponse.json({ error: 'User info not found in token' }, { status: 400 });
    }
    // Find requests for this user
    const filter = userId ? { userId } : { userPhone };
    const myRequests = await Request.find(filter).sort({ timestamp: -1 });
    return NextResponse.json(myRequests);
  } catch (error) {
    console.error('Error in GET /api/requests/my:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
} 