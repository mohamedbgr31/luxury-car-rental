import { NextResponse } from 'next/server';
import { connectDB } from '../../../../lib/mongodb';
import ResetCode from '../../../../models/ResetCode';

function normalizePhone(phone) {
  if (!phone) return '';
  const cleaned = phone.replace(/\s+/g, '');
  return cleaned.startsWith('+') ? cleaned : `+${cleaned}`;
}

export async function POST(req) {
  console.log('--- VERIFY ENDPOINT HIT ---');
  await connectDB();
  const { phone, code } = await req.json();
  const normPhone = normalizePhone(phone);
  console.log('Verifying:', normPhone, code);
  const record = await ResetCode.findOne({ phone: normPhone, code });
  console.log('Found record:', record);
  if (!normPhone || !code) {
    return NextResponse.json({ error: 'Phone and code are required.' }, { status: 400 });
  }
  if (record) {
    await ResetCode.deleteOne({ phone: normPhone });
    return NextResponse.json({ success: true });
  } else {
    return NextResponse.json({ error: 'Invalid code.' }, { status: 400 });
  }
} 