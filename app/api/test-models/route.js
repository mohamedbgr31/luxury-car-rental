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
    console.log('Testing all models...');
    await connectDB();
    
    // Test each model
    const results = {};
    
    try {
      const brands = await Brand.find({}).limit(1);
      results.brands = `✅ Found ${brands.length} brands`;
    } catch (error) {
      results.brands = `❌ Error: ${error.message}`;
    }
    
    try {
      const cars = await Car.find({}).limit(1);
      results.cars = `✅ Found ${cars.length} cars`;
    } catch (error) {
      results.cars = `❌ Error: ${error.message}`;
    }
    
    try {
      const heros = await Hero.find({}).limit(1);
      results.heros = `✅ Found ${heros.length} heros`;
    } catch (error) {
      results.heros = `❌ Error: ${error.message}`;
    }
    
    try {
      const logos = await Logo.find({}).limit(1);
      results.logos = `✅ Found ${logos.length} logos`;
    } catch (error) {
      results.logos = `❌ Error: ${error.message}`;
    }
    
    try {
      const galleries = await Gallery.find({}).limit(1);
      results.galleries = `✅ Found ${galleries.length} galleries`;
    } catch (error) {
      results.galleries = `❌ Error: ${error.message}`;
    }
    
    try {
      const faqs = await Faq.find({}).limit(1);
      results.faqs = `✅ Found ${faqs.length} faqs`;
    } catch (error) {
      results.faqs = `❌ Error: ${error.message}`;
    }
    
    return NextResponse.json({
      success: true,
      message: 'All models tested',
      results,
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('Model test failed:', error);
    return NextResponse.json({ 
      success: false, 
      error: error.message,
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}
