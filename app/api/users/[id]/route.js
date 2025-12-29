import { NextResponse } from 'next/server';
import { connectDB } from '../../../../lib/mongodb';
import User from '../../../../models/User';

export async function PATCH(req, context) {
  await connectDB();
  const { id } = (await context.params);
  const { role } = await req.json();

  const allowedRoles = ['client', 'admin', 'manager', 'agent'];
  if (!role || !allowedRoles.includes(role)) {
    return NextResponse.json({ error: 'Invalid or missing role.' }, { status: 400 });
  }

  const user = await User.findByIdAndUpdate(id, { role }, { new: true });
  if (!user) {
    return NextResponse.json({ error: 'User not found.' }, { status: 404 });
  }

  return NextResponse.json({ message: 'Role updated successfully.', user });
} 