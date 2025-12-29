import mongoose from 'mongoose';

// Connection string - update this with your actual MongoDB URI
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://luxcarrentdxb:yFO8h7xZSSQd3VYn@cluster-dxb.yfybmgr.mongodb.net/luxurycar?retryWrites=true&w=majority';

// Connect to MongoDB
async function connectDB() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB');
  } catch (error) {
    console.error('❌ Connection failed:', error);
    process.exit(1);
  }
}

// Create missing collections
async function createMissingCollections() {
  try {
    const db = mongoose.connection.db;
    
    // List of collections that should exist
    const requiredCollections = [
      'brands',
      'cars', 
      'contacts',
      'faqs',
      'galleries',
      'heros',
      'logos',
      'populardubaibrands',
      'requests',
      'resetcodes',
      'users'
    ];
    
    // Get existing collections
    const existingCollections = await db.listCollections().toArray();
    const existingNames = existingCollections.map(col => col.name);
    
    console.log('📋 Existing collections:', existingNames);
    
    // Create missing collections
    for (const collectionName of requiredCollections) {
      if (!existingNames.includes(collectionName)) {
        console.log(`➕ Creating collection: ${collectionName}`);
        await db.createCollection(collectionName);
        console.log(`✅ Created collection: ${collectionName}`);
      } else {
        console.log(`✅ Collection already exists: ${collectionName}`);
      }
    }
    
    // Verify all collections exist
    const finalCollections = await db.listCollections().toArray();
    const finalNames = finalCollections.map(col => col.name);
    
    console.log('\n🎉 Final collections:', finalNames);
    console.log('✅ All required collections are now available!');
    
  } catch (error) {
    console.error('❌ Error creating collections:', error);
  } finally {
    await mongoose.connection.close();
    console.log('🔌 Database connection closed');
  }
}

// Run the script
async function main() {
  await connectDB();
  await createMissingCollections();
}

main().catch(console.error);
