import { NextResponse } from 'next/server';
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const revalidate = 0;
import { connectDB } from '@/lib/mongodb';
import Brand from '@/models/Brand';
import Hero from '@/models/Hero';
import Logo from '@/models/Logo';
import Gallery from '@/models/Gallery';
import Car from '@/models/Car';

// Default fallback data
const fallbackHero = {
  backgroundImage: '/img/Lamborghini-Huracan-EVO.jpg',
  title: 'Luxury Car Rental',
  subtitle: 'Experience the thrill of driving premium vehicles',
  carCard: {
    title: 'Lamborghini Huracan Evo',
    logo: '/img/lambologo.png',
    image: '/img/lambopng.png',
    specs: ['V10', '300 KM', '2022']
  }
};

// Aggregate critical homepage data in one fast request
export async function GET() {
  const run = async () => {
    await connectDB();

    const safe = async (promiseFactory, fallback = null) => {
      try {
        return await promiseFactory();
      } catch (err) {
        console.error(`Error in safe execution: ${err.message}`);
        return fallback;
      }
    };

    // Query sequentially to avoid flaky TLS issues with parallel connections
    const brands = await safe(() => Brand.find({}).lean().exec(), []);
    const hero = await safe(() => Hero.findOne({}).lean().exec(), fallbackHero);
    const logo = await safe(() => Logo.findOne({ isActive: true }).lean().exec(), {});
    const gallery = await safe(() => Gallery.findOne({ isActive: true }).lean().exec(), {});
    const cars = await safe(() => Car.find({ isActive: true }).sort({ createdAt: -1 }).limit(3).lean().exec(), []);

    const payload = { 
      brands: Array.isArray(brands) ? brands : [], 
      hero: hero || fallbackHero, 
      logo: logo || {}, 
      gallery: gallery || {}, 
      cars: Array.isArray(cars) ? cars : [] 
    };

    // Lightweight diagnostic logging to help verify data availability
    try {
      console.log('HOME payload counts:', {
        brands: Array.isArray(payload.brands) ? payload.brands.length : 0,
        cars: Array.isArray(payload.cars) ? payload.cars.length : 0,
        hasHero: !!payload.hero,
        hasLogo: !!payload.logo,
        hasGallery: !!payload.gallery
      });
    } catch (_) {}

    return payload;
  };

  try {
    const payload = await run();
    return NextResponse.json(payload);
  } catch (error) {
    // Retry once on transient TLS/socket errors sometimes seen on Windows/OpenSSL
    const isTransient = /SSL|ECONNRESET|socket|handshake|bad record mac/i.test(error?.message || '');
    if (isTransient) {
      try {
        console.log('Retrying home API call after SSL error');
        const payload = await run();
        return NextResponse.json(payload);
      } catch (err2) {
        console.error('API /api/home GET retry failed:', err2);
        return NextResponse.json({ 
          brands: [], 
          hero: fallbackHero, 
          logo: {}, 
          gallery: {}, 
          cars: [],
          error: err2.message 
        });
      }
    }
    console.error('API /api/home GET error:', error);
    return NextResponse.json({ 
      brands: [], 
      hero: fallbackHero, 
      logo: {}, 
      gallery: {}, 
      cars: [],
      error: error.message 
    });
  }
}


