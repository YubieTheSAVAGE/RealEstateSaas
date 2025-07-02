/**
 * Test script for enhanced project creation
 * This script tests the new project fields and CRUD operations
 */

require('dotenv').config();
const axios = require('axios');

const API_BASE = process.env.BASE_URL || 'http://localhost:3001';

async function testEnhancedProject() {
  console.log('🧪 Testing Enhanced Project CRUD Operations...\n');

  try {
    // Test 1: Create a project with all enhanced fields
    console.log('1️⃣ Creating project with enhanced fields...');
    
    const projectData = {
      name: 'Test Enhanced Project',
      address: '123 Test Street, Casablanca',
      numberOfApartments: 50,
      totalSurface: 5000,
      notes: 'Test project with all enhanced fields',
      
      // Enhanced fields
      latitude: 33.5731,
      longitude: -7.5898,
      folderFees: 15000.00,
      commissionPerM2: 500.00,
      totalSales: 25000000.00,
      status: 'PLANIFICATION',
      progress: 25,
      constructionPhotos: [
        'https://example.com/photo1.jpg',
        'https://example.com/photo2.jpg'
      ]
    };

    const createResponse = await axios.post(`${API_BASE}/api/projects`, projectData, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    console.log('✅ Project created successfully!');
    console.log(`   ID: ${createResponse.data.id}`);
    console.log(`   Name: ${createResponse.data.name}`);
    console.log(`   Location: ${createResponse.data.latitude}, ${createResponse.data.longitude}`);
    console.log(`   Status: ${createResponse.data.status}`);
    console.log(`   Progress: ${createResponse.data.progress}%`);
    console.log(`   Folder Fees: ${createResponse.data.folderFees} MAD`);
    console.log(`   Commission/m²: ${createResponse.data.commissionPerM2} MAD`);
    console.log(`   Total Sales: ${createResponse.data.totalSales} MAD`);
    console.log(`   Construction Photos: ${createResponse.data.constructionPhotos?.length || 0} photos\n`);

    const projectId = createResponse.data.id;

    // Test 2: Get the created project
    console.log('2️⃣ Retrieving created project...');
    const getResponse = await axios.get(`${API_BASE}/api/projects/${projectId}`);
    console.log('✅ Project retrieved successfully!');
    console.log(`   Retrieved project: ${getResponse.data.name}\n`);

    // Test 3: Update project status and progress
    console.log('3️⃣ Updating project status and progress...');
    const updateData = {
      status: 'CONSTRUCTION',
      progress: 60,
      constructionPhotos: [
        ...projectData.constructionPhotos,
        'https://example.com/photo3.jpg'
      ]
    };

    const updateResponse = await axios.put(`${API_BASE}/api/projects/${projectId}`, updateData, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    console.log('✅ Project updated successfully!');
    console.log(`   New Status: ${updateResponse.data.status}`);
    console.log(`   New Progress: ${updateResponse.data.progress}%`);
    console.log(`   Photos Count: ${updateResponse.data.constructionPhotos?.length || 0}\n`);

    // Test 4: Get all projects
    console.log('4️⃣ Getting all projects...');
    const allProjectsResponse = await axios.get(`${API_BASE}/api/projects`);
    console.log(`✅ Retrieved ${allProjectsResponse.data.length} projects\n`);

    // Test 5: Create a property in the project
    console.log('5️⃣ Creating a property in the project...');
    const propertyData = {
      number: 'A-101',
      type: 'APARTMENT',
      floor: 1,
      area: 85,
      price: 850000,
      pricePerM2: 10000,
      zone: 'A',
      status: 'AVAILABLE',
      notes: 'Beautiful apartment with sea view'
    };

    const propertyResponse = await axios.post(`${API_BASE}/api/projects/${projectId}/apartments`, propertyData, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    console.log('✅ Property created successfully!');
    console.log(`   Property ID: ${propertyResponse.data.id}`);
    console.log(`   Property Number: ${propertyResponse.data.number}`);
    console.log(`   Property Type: ${propertyResponse.data.type}`);
    console.log(`   Price: ${propertyResponse.data.price} MAD\n`);

    // Test 6: Clean up (optional - comment out to keep test data)
    console.log('6️⃣ Cleaning up test data...');
    await axios.delete(`${API_BASE}/api/projects/${projectId}`);
    console.log('✅ Test data cleaned up\n');

    console.log('🎉 All tests passed! Enhanced project and property CRUD is working correctly.');

  } catch (error) {
    console.error('❌ Test failed:', error.response?.data || error.message);
    if (error.response?.status === 401) {
      console.log('\n💡 Note: You may need to authenticate first or disable authentication for testing.');
    }
  }
}

// Helper function to test without authentication
async function testHealthCheck() {
  try {
    const response = await axios.get(`${API_BASE}/health`);
    console.log('✅ Server is running:', response.data);
    return true;
  } catch (error) {
    console.error('❌ Server is not running:', error.message);
    return false;
  }
}

// Run the tests
async function runTests() {
  console.log('🔍 Checking server status...');
  const serverRunning = await testHealthCheck();
  
  if (serverRunning) {
    console.log('\n🚀 Starting enhanced project tests...\n');
    await testEnhancedProject();
  } else {
    console.log('\n❌ Please start the server first: npm run dev');
  }
}

if (require.main === module) {
  runTests();
}

module.exports = { testEnhancedProject, testHealthCheck };
