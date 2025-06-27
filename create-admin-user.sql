-- Create admin user with email test@immo360.com and password test123
-- The password hash is generated using bcryptjs with salt rounds 10

-- First, check if user already exists
SELECT id, name, email, role FROM "User" WHERE email = 'test@immo360.com';

-- If user doesn't exist, insert the new admin user
-- Password hash for 'test123' with bcryptjs salt rounds 10: $2a$10$NV7LB8LQgLZfMf2rPbOWj.BJ8mJM1Ru2Yo0tHnkyZ6dgAtVKIDzGy
INSERT INTO "User" (
    name,
    email,
    "phoneNumber",
    status,
    role,
    "passwordHash",
    "createdAt",
    "updatedAt"
) VALUES (
    'Admin User',
    'test@immo360.com',
    '1234567890',
    'ACTIVE',
    'ADMIN',
    '$2a$10$NV7LB8LQgLZfMf2rPbOWj.BJ8mJM1Ru2Yo0tHnkyZ6dgAtVKIDzGy',
    NOW(),
    NOW()
) ON CONFLICT (email) DO NOTHING;

-- Verify the user was created
SELECT id, name, email, role, status, "createdAt" FROM "User" WHERE email = 'test@immo360.com';

-- Display login credentials
SELECT
    'Login Credentials:' as info,
    'test@immo360.com' as email,
    'test123' as password;
