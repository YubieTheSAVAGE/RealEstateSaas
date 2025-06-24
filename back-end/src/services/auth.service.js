const prisma = require("../utils/prisma");
const bcrypt = require("bcrypt");


async function loginUser(email, password) {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    throw new Error('Invalid credentials');
  }
  const match = await bcrypt.compare(password, user.passwordHash);
  if (!match) {
    throw new Error('Invalid credentials');
  }
  delete user.passwordHash;
  return user;
} 

// async function createUser() {
//   try {
//     const passwordHash = await bcrypt.hash("password123", 10);
//     const user = await prisma.user.create({
//       data: {
//         name: "Test User",
//         email: "issam@immo360.com",
//         phoneNumber: "1234567890",
//         role: "ADMIN",
//         passwordHash
//       }
//     });
//     console.log("User created successfully:", user);
//   } catch (error) {
//     console.error("Error creating user:", error);
//   } finally {
//     await prisma.$disconnect();
//   }
// }

// createUser(); 


module.exports = {
  loginUser,
};