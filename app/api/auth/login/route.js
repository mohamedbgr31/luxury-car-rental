import { NextResponse } from 'next/server';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { connectDB } from '../../../../lib/mongodb';
import User from '../../../../models/User';

const JWT_SECRET = process.env.JWT_SECRET || 'changeme';

export async function POST(req) {
  await connectDB();
  const { phone, password } = await req.json();

  if (!phone || !password) {
    return NextResponse.json({ error: 'Phone and password are required.' }, { status: 400 });
  }

  const user = await User.findOne({ phone });
  if (!user) {
    return NextResponse.json({ error: 'Invalid credentials.' }, { status: 401 });
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return NextResponse.json({ error: 'Invalid credentials.' }, { status: 401 });
  }

  // Create JWT
  const token = jwt.sign({ id: user._id, phone: user.phone, name: user.name, role: user.role }, JWT_SECRET, { expiresIn: '7d' });

  // Set token as HttpOnly cookie and also return it in the JSON for client-side storage
  const response = NextResponse.json({
    token,
    user: { name: user.name, phone: user.phone, role: user.role }
  });
  response.cookies.set('token', token, {
    httpOnly: true,
    path: '/',
    sameSite: 'lax',
    // secure: true, // Uncomment this in production (HTTPS)
    maxAge: 60 * 60 * 24 * 7, // 7 days
  });

  return response;
} 