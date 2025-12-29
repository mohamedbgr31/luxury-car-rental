import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'changeme';

export async function GET(req) {
  const token = req.cookies.get('token')?.value;
  if (!token) {
    return NextResponse.json({ user: null }, { status: 200 });
  }
  try {
    const user = jwt.verify(token, JWT_SECRET);
    return NextResponse.json({ user: { id: user.id, name: user.name, phone: user.phone, role: user.role } });
  } catch (e) {
    return NextResponse.json({ user: null }, { status: 200 });
  }
} 