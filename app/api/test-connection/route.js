import { NextResponse } from 'next/server';
import { connectDB, MONGODB_URI } from '@/lib/mongodb';

export async function GET() {
  try {
    console.log('🧪 Testing MongoDB connection...');
    console.log('📍 Using URI:', MONGODB_URI.replace(/\/\/.*@/, '//***:***@'));
    
    await connectDB();
    
    return NextResponse.json({
      success: true,
      message: '✅ MongoDB connection successful!',
      uri: MONGODB_URI.replace(/\/\/.*@/, '//***:***@'),
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('💥 Connection test failed:', error);
    return NextResponse.json({
      success: false,
      error: error.message,
      uri: MONGODB_URI.replace(/\/\/.*@/, '//***:***@'),
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}
