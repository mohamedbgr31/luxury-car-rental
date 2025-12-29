import { NextResponse } from 'next/server';
import { connectDB } from '../../../../lib/mongodb';
import ResetCode from '../../../../models/ResetCode';
import User from '../../../../models/User';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'changeme';

export async function POST(req) {
  await connectDB();
  const { phone, code, mode, name } = await req.json();

  if (!phone || !code) {
    return NextResponse.json({ error: 'Phone and code are required.' }, { status: 400 });
  }

  const record = await ResetCode.findOne({ phone, code });
  if (!record) {
    return NextResponse.json({ error: 'Invalid code.' }, { status: 400 });
  }

  // One-time code: remove after use
  await ResetCode.deleteOne({ phone });

  let user = await User.findOne({ phone });
  if (mode === 'signup') {
    if (!user) {
      const randomPassword = Math.random().toString(36).slice(2) + Math.random().toString(36).slice(2);
      const hashed = await bcrypt.hash(randomPassword, 10);
      user = await User.create({ name: name || 'WhatsApp User', phone, password: hashed, role: 'client' });
    }
  }

  if (!user) {
    return NextResponse.json({ error: 'Account not found.' }, { status: 404 });
  }

  const token = jwt.sign({ id: user._id, phone: user.phone, name: user.name, role: user.role }, JWT_SECRET, { expiresIn: '7d' });

  const response = NextResponse.json({ token, user: { name: user.name, phone: user.phone, role: user.role } });
  response.cookies.set('token', token, {
    httpOnly: true,
    path: '/',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7,
  });
  return response;
}


