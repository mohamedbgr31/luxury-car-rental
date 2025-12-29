import { NextResponse } from 'next/server';
import { connectDB } from '../../../../lib/mongodb';
import User from '../../../../models/User';
import bcrypt from 'bcryptjs';

export async function POST(req) {
  await connectDB();
  const { phone, newPassword } = await req.json();
  if (!phone || !newPassword || newPassword.length < 6) {
    return NextResponse.json({ error: 'Phone and new password are required, and password must be at least 6 characters.' }, { status: 400 });
  }
  const user = await User.findOne({ phone });
  if (!user) {
    return NextResponse.json({ error: 'User not found.' }, { status: 404 });
  }
  const hashed = await bcrypt.hash(newPassword, 10);
  user.password = hashed;
  await user.save();
  return NextResponse.json({ success: true });
} 