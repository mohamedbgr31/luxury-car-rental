import { NextResponse } from 'next/server';
import axios from 'axios';
import { connectDB } from '../../../../lib/mongodb';
import ResetCode from '../../../../models/ResetCode';

// WhatsApp API credentials (set these in your environment variables)
const whatsappAccessToken = process.env.WHATSAPP_ACCESS_TOKEN; // Meta access token
const whatsappPhoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID; // Meta phone number ID
const whatsappTemplateName = 'password_recovery'; // Updated template name

/**
 * Sends a WhatsApp message with the OTP code using Meta's API.
 * @param {string} phone - E.164 format (with + and country code)
 * @param {string} code - The OTP code to send
 */
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
  const { phone } = await req.json();
  if (!phone || !phone.startsWith('+')) {
    return NextResponse.json({ error: 'Phone number must be in E.164 format (with + and country code).' }, { status: 400 });
  }
  // Generate 4-digit code
  const code = Math.floor(1000 + Math.random() * 9000).toString();
  try {
    await ResetCode.findOneAndUpdate(
      { phone },
      { code, createdAt: new Date() },
      { upsert: true }
    );
    const saved = await ResetCode.findOne({ phone });
    console.log('After save, found in DB:', saved);
    console.log('Saved reset code for', phone, code);
  } catch (err) {
    console.error('Error saving reset code:', err);
    return NextResponse.json({ error: 'Failed to save reset code.' }, { status: 500 });
  }
  try {
    await sendWhatsAppOTP(phone, code);
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('WhatsApp API error:', err?.response?.data || err);
    return NextResponse.json({ error: 'Failed to send WhatsApp message.' }, { status: 500 });
  }
}

// For demo: export codes for verification route
// NOTE: You must have a WhatsApp template named 'otp_code' with one variable for the code.
// Example template body: "Your password reset code is: {{1}}" 