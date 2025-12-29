import { NextResponse } from 'next/server';
import bcrypt from 'bcrypt';
import { connectDB } from '../../../../lib/mongodb';
import User from '../../../../models/User';

export async function POST(req) {
  await connectDB();
  const { name, phone, password } = await req.json();

  if (!name || !phone || !password) {
    return NextResponse.json({ error: 'All fields are required.' }, { status: 400 });
  }

  const existingUser = await User.findOne({ phone });
  if (existingUser) {
    return NextResponse.json({ error: 'User already exists.' }, { status: 409 });
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const user = new User({ name, phone, password: hashedPassword, role: 'client' });
  await user.save();

  return NextResponse.json({ message: 'User created successfully.' }, { status: 201 });
} 