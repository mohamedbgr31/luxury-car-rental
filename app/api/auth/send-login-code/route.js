import { NextResponse } from 'next/server';
import axios from 'axios';
import { connectDB } from '../../../../lib/mongodb';
import ResetCode from '../../../../models/ResetCode';
import User from '../../../../models/User';

// WhatsApp API credentials (set these in your environment variables)
const whatsappAccessToken = process.env.WHATSAPP_ACCESS_TOKEN;
const whatsappPhoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID;

async function sendWhatsAppOTP(phone, code) {
  const url = `https://graph.facebook.com/v19.0/${whatsappPhoneNumberId}/messages`;
  const data = {
    messaging_product: 'whatsapp',
    to: phone,
    type: 'template',
    template: {
      name: 'wamotp',
      language: { code: 'en_US' },
      components: [
        {
          type: 'body',
          parameters: [
            { type: 'text', text: code } // This fills {{1}} in the body
          ]
        },
        {
          type: 'button',
          sub_type: 'url',
          index: 0,
          parameters: [
            { type: 'text', text: code } // This fills {{1}} in the button URL
          ]
        }
      ]
    }
  };
  await axios.post(url, data, {
    headers: {
      'Authorization': `Bearer ${whatsappAccessToken}`,
      'Content-Type': 'application/json',
    },
  });
}

export async function POST(req) {
  await connectDB();
  const { phone, mode } = await req.json();

  if (!whatsappAccessToken || !whatsappPhoneNumberId) {
    console.error('Missing WhatsApp environment variables.');
    return NextResponse.json(
      { error: 'Server is missing WhatsApp credentials. Set WHATSAPP_ACCESS_TOKEN and WHATSAPP_PHONE_NUMBER_ID.' },
      { status: 500 }
    );
  }

  if (!phone || !phone.startsWith('+')) {
    return NextResponse.json(
      { error: 'Phone must be in E.164 format starting with +' },
      { status: 400 }
    );
  }

  if (mode !== 'login' && mode !== 'signup') {
    return NextResponse.json({ error: 'Invalid mode' }, { status: 400 });
  }

  const existingUser = await User.findOne({ phone });
  if (mode === 'login' && !existingUser) {
    return NextResponse.json(
      { error: 'No account found for this phone. Please sign up.' },
      { status: 404 }
    );
  }
  if (mode === 'signup' && existingUser) {
    return NextResponse.json(
      { error: 'User already exists. Try logging in instead.' },
      { status: 409 }
    );
  }

  const code = Math.floor(1000 + Math.random() * 9000).toString();

  try {
    await ResetCode.findOneAndUpdate(
      { phone },
      { code, createdAt: new Date() },
      { upsert: true }
    );
  } catch (err) {
    return NextResponse.json({ error: 'Failed to persist code.' }, { status: 500 });
  }

  try {
    await sendWhatsAppOTP(phone, code);
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('WhatsApp API error (send-login-code):', err?.response?.data || err);
    const message = err?.response?.data?.error?.message || 'Failed to send WhatsApp message.';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}


