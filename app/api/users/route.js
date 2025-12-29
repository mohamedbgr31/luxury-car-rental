import { NextResponse } from 'next/server';
import { connectDB } from '../../../lib/mongodb';
import User from '../../../models/User';
import bcrypt from 'bcryptjs';

export async function GET() {
  await connectDB();
  const users = await User.find({}, 'name phone role');
  return NextResponse.json(users);
}

export async function POST(req) {
  await connectDB();
  const { name, phone, password, role } = await req.json();

  const allowedRoles = ['client', 'admin', 'manager', 'agent'];
  if (!role || !allowedRoles.includes(role)) {
    return NextResponse.json({ error: 'Invalid or missing role.' }, { status: 400 });
  }
  if (!name || !phone || !password) {
    return NextResponse.json({ error: 'Name, phone, and password are required.' }, { status: 400 });
  }

  // Check if user already exists
  const existingUser = await User.findOne({ phone });
  if (existingUser) {
    return NextResponse.json({ error: 'User with this phone already exists.' }, { status: 400 });
  }

  // Hash password
  const hashedPassword = await bcrypt.hash(password, 10);

  // Create user
  const user = await User.create({ name, phone, password: hashedPassword, role });
  // Exclude password from response
  const { password: _, ...userData } = user.toObject();
  return NextResponse.json({ message: 'User created successfully.', user: userData });
} 