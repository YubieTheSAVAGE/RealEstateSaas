const bcrypt = require('./back-end/node_modules/bcryptjs');

async function generateHash() {
    const password = 'test123';
    const saltRounds = 10;
    
    try {
        const hash = await bcrypt.hash(password, saltRounds);
        console.log('Password:', password);
        console.log('Hash:', hash);
        console.log('');
        console.log('SQL INSERT statement:');
        console.log(`INSERT INTO "User" (`);
        console.log(`    name,`);
        console.log(`    email,`);
        console.log(`    "phoneNumber",`);
        console.log(`    status,`);
        console.log(`    role,`);
        console.log(`    "passwordHash",`);
        console.log(`    "createdAt",`);
        console.log(`    "updatedAt"`);
        console.log(`) VALUES (`);
        console.log(`    'Admin User',`);
        console.log(`    'test@immo360.com',`);
        console.log(`    '1234567890',`);
        console.log(`    'ACTIVE',`);
        console.log(`    'ADMIN',`);
        console.log(`    '${hash}',`);
        console.log(`    NOW(),`);
        console.log(`    NOW()`);
        console.log(`) ON CONFLICT (email) DO NOTHING;`);
    } catch (error) {
        console.error('Error generating hash:', error);
    }
}

generateHash();
