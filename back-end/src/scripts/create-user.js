const prisma = require("../utils/prisma");
const bcrypt = require("bcrypt");

async function createUser() {
  try {
    const passwordHash = await bcrypt.hash("password123", 10);
    const user = await prisma.user.create({
      data: {
        name: "Test User",
        email: "test2@example.com",
        phoneNumber: "1234567890",
        role: "ADMIN",
        passwordHash
      }
    });
    console.log("User created successfully:", user);
  } catch (error) {
    console.error("Error creating user:", error);
  } finally {
    await prisma.$disconnect();
  }
}

createUser(); 