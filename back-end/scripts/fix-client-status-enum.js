const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function fixClientStatusEnum() {
  console.log('🔍 Checking ClientStatus enum in database...');
  
  try {
    // Check current enum values
    const enumValues = await prisma.$queryRaw`
      SELECT enumlabel FROM pg_enum 
      WHERE enumtypid = (SELECT oid FROM pg_type WHERE typname = 'ClientStatus')
      ORDER BY enumsortorder;
    `;
    
    console.log('📋 Current ClientStatus enum values:', enumValues);
    
    // Check if we have the expected values
    const expectedValues = ['LEAD', 'CLIENT'];
    const currentValues = enumValues.map(row => row.enumlabel);
    
    console.log('🎯 Expected values:', expectedValues);
    console.log('💾 Current values:', currentValues);
    
    const missingValues = expectedValues.filter(val => !currentValues.includes(val));
    
    if (missingValues.length > 0) {
      console.log('⚠️ Missing enum values:', missingValues);
      
      // Try to add missing values
      for (const value of missingValues) {
        try {
          console.log(`➕ Adding enum value: ${value}`);
          await prisma.$executeRaw`ALTER TYPE "ClientStatus" ADD VALUE ${value}`;
          console.log(`✅ Successfully added: ${value}`);
        } catch (addError) {
          console.error(`❌ Failed to add ${value}:`, addError.message);
        }
      }
    } else {
      console.log('✅ All expected enum values are present');
    }
    
    // Test creating a client with LEAD status
    console.log('🧪 Testing client creation with LEAD status...');
    
    // First check if we have any users to use as createdBy
    const users = await prisma.user.findMany({
      take: 1,
      select: { id: true, email: true, role: true }
    });
    
    if (users.length === 0) {
      console.log('⚠️ No users found. Creating a test admin user...');
      const testUser = await prisma.user.create({
        data: {
          name: 'Test Admin',
          email: 'test@admin.com',
          phoneNumber: '+1234567890',
          role: 'ADMIN',
          passwordHash: '$2b$10$test.hash.for.testing.purposes.only',
          status: 'ACTIVE'
        }
      });
      console.log('✅ Test user created:', testUser.email);
    }
    
    const testUser = await prisma.user.findFirst({
      select: { id: true, email: true }
    });
    
    // Try to create a test client
    const testClientData = {
      name: 'Test Client',
      email: `test.client.${Date.now()}@example.com`,
      phoneNumber: '+1234567890',
      status: 'LEAD',
      provenance: 'Test',
      createdById: testUser.id
    };
    
    try {
      const testClient = await prisma.client.create({
        data: testClientData
      });
      console.log('✅ Test client created successfully with LEAD status:', testClient.id);
      
      // Clean up test client
      await prisma.client.delete({
        where: { id: testClient.id }
      });
      console.log('🧹 Test client cleaned up');
      
    } catch (testError) {
      console.error('❌ Test client creation failed:', testError.message);
      
      // Try with CLIENT status
      console.log('🔄 Trying with CLIENT status...');
      try {
        const testClientWithClientStatus = await prisma.client.create({
          data: { ...testClientData, status: 'CLIENT' }
        });
        console.log('✅ Test client created with CLIENT status:', testClientWithClientStatus.id);
        
        // Clean up
        await prisma.client.delete({
          where: { id: testClientWithClientStatus.id }
        });
        console.log('🧹 Test client cleaned up');
        
      } catch (clientStatusError) {
        console.error('❌ CLIENT status also failed:', clientStatusError.message);
      }
    }
    
  } catch (error) {
    console.error('💥 Error checking enum:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Run the fix
fixClientStatusEnum()
  .then(() => {
    console.log('🎉 ClientStatus enum check completed');
    process.exit(0);
  })
  .catch((error) => {
    console.error('💥 Script failed:', error);
    process.exit(1);
  });
