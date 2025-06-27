const prisma = require("../src/utils/prisma");
const bcrypt = require("bcryptjs");

async function createAdminUser() {
  try {
    console.log("🔧 Creating admin user...");

    // Test database connection first
    console.log("📡 Testing database connection...");
    await prisma.$connect();
    console.log("✅ Database connected successfully");

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: "test@immo360.com" }
    });

    if (existingUser) {
      console.log("✅ Admin user already exists:");
      console.log(`   Email: ${existingUser.email}`);
      console.log(`   Name: ${existingUser.name}`);
      console.log(`   Role: ${existingUser.role}`);
      return;
    }

    // Create password hash
    const passwordHash = await bcrypt.hash("test123", 10);
    
    // Create admin user
    const user = await prisma.user.create({
      data: {
        name: "Admin User",
        email: "test@immo360.com",
        phoneNumber: "1234567890",
        role: "ADMIN",
        status: "ACTIVE",
        passwordHash
      }
    });
    
    console.log("✅ Admin user created successfully!");
    console.log(`   Email: ${user.email}`);
    console.log(`   Name: ${user.name}`);
    console.log(`   Role: ${user.role}`);
    console.log(`   Password: test123`);
    console.log("");
    console.log("🎯 You can now login with:");
    console.log("   Email: test@immo360.com");
    console.log("   Password: test123");
    
  } catch (error) {
    console.error("❌ Error creating admin user:", error.message);

    if (error.code === 'P2002') {
      console.log("💡 User with this email already exists");
    } else if (error.message.includes('denied access')) {
      console.log("💡 Database connection issue. Make sure:");
      console.log("   1. Database is running (docker compose up -d db)");
      console.log("   2. DATABASE_URL is set correctly");
      console.log("   3. Database migrations are applied (npx prisma migrate deploy)");
    } else if (error.message.includes('connect')) {
      console.log("💡 Cannot connect to database. Please check:");
      console.log("   1. Database is running on localhost:5432");
      console.log("   2. DATABASE_URL environment variable");
      console.log("   Current DATABASE_URL:", process.env.DATABASE_URL || 'Not set');
    }
  } finally {
    await prisma.$disconnect();
  }
}

// Run the function
createAdminUser();
