import { NextResponse } from 'next/server';
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const revalidate = 0;
import Hero from '@/models/Hero';
import { connectDB } from '@/lib/mongodb';

// Default fallback data that matches the database structure
const fallbackHero = {
  backgroundImage: '/img/Lamborghini-Huracan-EVO.jpg',
  title: 'Luxury Car Rental',
  subtitle: 'Experience the thrill of driving premium vehicles',
  carCard: {
    title: 'Lamborghini Huracan EVO',
    logo: '/img/lambologo.png',
    image: '/img/lambopng.png',
    specs: ['V10', '300 KM', '2023']
  }
};

// GET /api/hero
export async function GET() {
  const run = async () => {
    await connectDB();
    try {
      const hero = await Hero.findOne({}).lean();
      return hero || fallbackHero;
    } catch (err) {
      console.error('Error fetching hero data:', err);
      return fallbackHero;
    }
  };

  try {
    const hero = await run();
    return NextResponse.json(hero);
  } catch (error) {
    // Retry once on transient TLS/socket errors sometimes seen on Windows/OpenSSL
    const isTransient = /SSL|ECONNRESET|socket|handshake|bad record mac/i.test(error?.message || '');
    if (isTransient) {
      try {
        console.log('Retrying hero API call after SSL error');
        const hero = await run();
        return NextResponse.json(hero);
      } catch (err2) {
        console.error('API /api/hero GET retry failed:', err2);
        return NextResponse.json(fallbackHero);
      }
    }
    console.error('API /api/hero GET error:', error);
    return NextResponse.json(fallbackHero);
  }
}

// POST /api/hero
export async function POST(request) {
  try {
    await connectDB();
    const data = await request.json();
    
    // Update or create hero content
    const hero = await Hero.findOneAndUpdate(
      {}, // empty filter to match any document
      data,
      { new: true, upsert: true } // create if doesn't exist
    );
    
    return NextResponse.json(hero);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// PUT /api/hero
export async function PUT(request) {
  try {
    await connectDB();
    const data = await request.json();

    // Update or create hero content
    const hero = await Hero.findOneAndUpdate(
      {}, // empty filter to match any document
      data,
      { new: true, upsert: true } // create if doesn't exist
    );

    return NextResponse.json(hero);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}