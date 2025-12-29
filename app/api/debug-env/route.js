import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // Check all possible MongoDB environment variable names
    const allEnvVars = {};
    
    // List all possible MongoDB env var names
    const possibleNames = [
      'MONGODB_URI',
      'MONGO_URI', 
      'MONGO_URL',
      'MONGODB_URI_LOCAL',
      'MONGODB_URI_REMOTE',
      'DATABASE_URL',
      'DB_URL',
      'MONGO_CONNECTION_STRING'
    ];
    
    // Check each possible name
    possibleNames.forEach(name => {
      if (process.env[name]) {
        allEnvVars[name] = 'SET';
        allEnvVars[name + '_VALUE'] = process.env[name].substring(0, 50) + '...';
      } else {
        allEnvVars[name] = 'NOT SET';
      }
    });
    
    // Add some system info
    allEnvVars.NODE_ENV = process.env.NODE_ENV;
    allEnvVars.VERCEL = process.env.VERCEL;
    
    // Show all environment variables that contain 'mongo' or 'db'
    const mongoRelatedVars = {};
    Object.keys(process.env).forEach(key => {
      if (key.toLowerCase().includes('mongo') || key.toLowerCase().includes('db')) {
        mongoRelatedVars[key] = process.env[key] ? 'SET' : 'NOT SET';
      }
    });
    allEnvVars.MONGO_RELATED_VARS = mongoRelatedVars;

    return NextResponse.json(allEnvVars);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
