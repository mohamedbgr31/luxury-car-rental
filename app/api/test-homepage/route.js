import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import Brand from '@/models/Brand';
import Car from '@/models/Car';
import Hero from '@/models/Hero';
import Logo from '@/models/Logo';
import Gallery from '@/models/Gallery';
import Faq from '@/models/Faq';

export async function GET() {
  try {
    console.log('🏠 Testing homepage data...');
    await connectDB();
    
    // Test all the data your homepage needs
    const homepageData = {};
    
    try {
      const brands = await Brand.find({ isActive: true });
      homepageData.brands = {
        status: '✅ SUCCESS',
        count: brands.length,
        data: brands.slice(0, 3) // First 3 brands
      };
    } catch (error) {
      homepageData.brands = {
        status: '❌ ERROR',
        error: error.message
      };
    }
    
    try {
      const cars = await Car.find({ isActive: true });
      homepageData.cars = {
        status: '✅ SUCCESS',
        count: cars.length,
        data: cars.slice(0, 3) // First 3 cars
      };
    } catch (error) {
      homepageData.cars = {
        status: '❌ ERROR',
        error: error.message
      };
    }
    
    try {
      const hero = await Hero.findOne({});
      homepageData.hero = {
        status: '✅ SUCCESS',
        data: hero
      };
    } catch (error) {
      homepageData.hero = {
        status: '❌ ERROR',
        error: error.message
      };
    }
    
    try {
      const logo = await Logo.findOne({ isActive: true });
      homepageData.logo = {
        status: '✅ SUCCESS',
        data: logo
      };
    } catch (error) {
      homepageData.logo = {
        status: '❌ ERROR',
        error: error.message
      };
    }
    
    try {
      const gallery = await Gallery.findOne({ isActive: true });
      homepageData.gallery = {
        status: '✅ SUCCESS',
        data: gallery
      };
    } catch (error) {
      homepageData.gallery = {
        status: '❌ ERROR',
        error: error.message
      };
    }
    
    try {
      const faqs = await Faq.find({ isVisible: true });
      homepageData.faqs = {
        status: '✅ SUCCESS',
        count: faqs.length,
        data: faqs.slice(0, 3) // First 3 FAQs
      };
    } catch (error) {
      homepageData.faqs = {
        status: '❌ ERROR',
        error: error.message
      };
    }
    
    const successCount = Object.values(homepageData).filter(d => d.status === '✅ SUCCESS').length;
    const totalCount = Object.keys(homepageData).length;
    
    return NextResponse.json({
      success: successCount === totalCount,
      summary: {
        total: totalCount,
        successful: successCount,
        failed: totalCount - successCount,
        successRate: `${Math.round((successCount / totalCount) * 100)}%`
      },
      homepageData,
      timestamp: new Date().toISOString(),
      message: successCount === totalCount 
        ? '🏠 HOMEPAGE WILL WORK PERFECTLY!' 
        : `⚠️ Homepage has ${totalCount - successCount} data issues`
    });
    
  } catch (error) {
    console.error('💥 Homepage test failed:', error);
    return NextResponse.json({ 
      success: false, 
      error: error.message,
      timestamp: new Date().toISOString(),
      message: '💥 HOMEPAGE WILL NOT WORK'
    }, { status: 500 });
  }
}
