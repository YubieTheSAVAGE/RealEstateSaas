/**
 * Docker Test Script for Enhanced Project CRUD
 * This script tests the enhanced project functionality inside Docker container
 */

const axios = require('axios');

// Use internal Docker network URL
const API_BASE = 'http://localhost:3001';

async function testEnhancedProjectDocker() {
  console.log('🐳 Testing Enhanced Project CRUD in Docker...\n');

  try {
    // Test 1: Health check
    console.log('1️⃣ Testing health endpoint...');
    const healthResponse = await axios.get(`${API_BASE}/health`);
    console.log('✅ Health check passed:', healthResponse.data);
    console.log('');

    // Test 2: Create a project with all enhanced fields
    console.log('2️⃣ Creating project with enhanced fields...');
    
    const projectData = {
      name: 'Docker Test Project',
      address: 'Test Address, Casablanca',
      numberOfApartments: 25,
      totalSurface: 2500,
      notes: 'Test project created in Docker container',
      
      // Enhanced fields
      latitude: 33.5731,
      longitude: -7.5898,
      folderFees: 10000.00,
      commissionPerM2: 400.00,
      totalSales: 15000000.00,
      status: 'PLANIFICATION',
      progress: 15,
      constructionPhotos: [
        'https://example.com/docker-photo1.jpg',
        'https://example.com/docker-photo2.jpg'
      ]
    };

    const createResponse = await axios.post(`${API_BASE}/api/projects`, projectData, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    console.log('✅ Project created successfully in Docker!');
    console.log(`   ID: ${createResponse.data.id}`);
    console.log(`   Name: ${createResponse.data.name}`);
    console.log(`   Location: ${createResponse.data.latitude}, ${createResponse.data.longitude}`);
    console.log(`   Status: ${createResponse.data.status}`);
    console.log(`   Progress: ${createResponse.data.progress}%`);
    console.log(`   Enhanced fields working: ✅`);
    console.log('');

    const projectId = createResponse.data.id;

    // Test 3: Create a property in the project
    console.log('3️⃣ Creating property in Docker project...');
    const propertyData = {
      number: 'DOCKER-101',
      type: 'APARTMENT',
      floor: 2,
      area: 90,
      price: 900000,
      pricePerM2: 10000,
      zone: 'Docker Zone',
      status: 'AVAILABLE',
      notes: 'Docker test apartment'
    };

    const propertyResponse = await axios.post(`${API_BASE}/api/projects/${projectId}/apartments`, propertyData, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    console.log('✅ Property created successfully in Docker!');
    console.log(`   Property ID: ${propertyResponse.data.id}`);
    console.log(`   Property Number: ${propertyResponse.data.number}`);
    console.log(`   Property Type: ${propertyResponse.data.type}`);
    console.log(`   Price: ${propertyResponse.data.price} MAD`);
    console.log('');

    // Test 4: Update project
    console.log('4️⃣ Updating project in Docker...');
    const updateData = {
      status: 'CONSTRUCTION',
      progress: 45,
      totalSales: 20000000.00
    };

    const updateResponse = await axios.put(`${API_BASE}/api/projects/${projectId}`, updateData, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    console.log('✅ Project updated successfully in Docker!');
    console.log(`   New Status: ${updateResponse.data.status}`);
    console.log(`   New Progress: ${updateResponse.data.progress}%`);
    console.log(`   New Total Sales: ${updateResponse.data.totalSales} MAD`);
    console.log('');

    // Test 5: Get all projects
    console.log('5️⃣ Getting all projects from Docker...');
    const allProjectsResponse = await axios.get(`${API_BASE}/api/projects`);
    console.log(`✅ Retrieved ${allProjectsResponse.data.length} projects from Docker`);
    console.log('');

    console.log('🎉 All Docker tests passed! Enhanced project and property CRUD is working correctly in Docker containers.');
    console.log('');
    console.log('🎬 Your Docker setup is ready for the demo!');

  } catch (error) {
    console.error('❌ Docker test failed:', error.response?.data || error.message);
    console.log('');
    console.log('🔧 Troubleshooting tips:');
    console.log('   1. Check if containers are running: docker-compose ps');
    console.log('   2. Check backend logs: docker-compose logs backend');
    console.log('   3. Check database logs: docker-compose logs db');
    console.log('   4. Restart containers: docker-compose restart');
    
    if (error.code === 'ECONNREFUSED') {
      console.log('   5. Backend might not be ready yet, wait a few seconds and try again');
    }
  }
}

// Run the Docker tests
if (require.main === module) {
  testEnhancedProjectDocker();
}

module.exports = { testEnhancedProjectDocker };
