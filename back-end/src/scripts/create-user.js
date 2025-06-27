const prisma = require("../utils/prisma");
const bcrypt = require("bcryptjs");

async function createUser() {
  try {
    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: "test@immo360.com" }
    });

    if (existingUser) {
      console.log("User already exists:", existingUser.email);
      return;
    }

    const passwordHash = await bcrypt.hash("test123", 10);
    const user = await prisma.user.create({
      data: {
        name: "Admin User",
        email: "test@immo360.com",
        phoneNumber: "1234567890",
        role: "ADMIN",
        passwordHash
      }
    });

    // Remove password hash from output for security
    delete user.passwordHash;
    console.log("Admin user created successfully:", user);
  } catch (error) {
    console.error("Error creating user:", error);
  } finally {
    await prisma.$disconnect();
  }
}

createUser(); 