import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import Brand from '@/models/Brand';
import Car from '@/models/Car';
import Hero from '@/models/Hero';
import Logo from '@/models/Logo';
import Gallery from '@/models/Gallery';
import Faq from '@/models/Faq';
import Contact from '@/models/Contact';
import Request from '@/models/Request';
import User from '@/models/User';

export async function GET() {
  try {
    console.log('🧪 Testing ALL models and collections...');
    await connectDB();
    
    const results = {};
    const errors = [];
    
    // Test each model with proper error handling
    const models = [
      { name: 'Brand', model: Brand, collection: 'brands' },
      { name: 'Car', model: Car, collection: 'cars' },
      { name: 'Hero', model: Hero, collection: 'heros' },
      { name: 'Logo', model: Logo, collection: 'logos' },
      { name: 'Gallery', model: Gallery, collection: 'galleries' },
      { name: 'Faq', model: Faq, collection: 'faqs' },
      { name: 'Contact', model: Contact, collection: 'contacts' },
      { name: 'Request', model: Request, collection: 'requests' },
      { name: 'User', model: User, collection: 'users' }
    ];
    
    for (const { name, model, collection } of models) {
      try {
        console.log(`Testing ${name} model (collection: ${collection})...`);
        const docs = await model.find({}).limit(1);
        results[name] = {
          status: '✅ SUCCESS',
          collection: collection,
          count: docs.length,
          message: `Found ${docs.length} documents in ${collection}`
        };
        console.log(`✅ ${name}: Found ${docs.length} documents`);
      } catch (error) {
        const errorMsg = error.message;
        results[name] = {
          status: '❌ ERROR',
          collection: collection,
          error: errorMsg,
          message: `Failed to query ${collection}: ${errorMsg}`
        };
        errors.push(`${name}: ${errorMsg}`);
        console.error(`❌ ${name}: ${errorMsg}`);
      }
    }
    
    const successCount = Object.values(results).filter(r => r.status === '✅ SUCCESS').length;
    const totalCount = models.length;
    
    return NextResponse.json({
      success: successCount === totalCount,
      summary: {
        total: totalCount,
        successful: successCount,
        failed: totalCount - successCount,
        successRate: `${Math.round((successCount / totalCount) * 100)}%`
      },
      results,
      errors: errors.length > 0 ? errors : null,
      timestamp: new Date().toISOString(),
      message: successCount === totalCount 
        ? '🎉 ALL MODELS WORKING PERFECTLY!' 
        : `⚠️ ${totalCount - successCount} models still have issues`
    });
    
  } catch (error) {
    console.error('💥 Critical test failure:', error);
    return NextResponse.json({ 
      success: false, 
      error: error.message,
      timestamp: new Date().toISOString(),
      message: '💥 CRITICAL ERROR - Database connection failed'
    }, { status: 500 });
  }
}
