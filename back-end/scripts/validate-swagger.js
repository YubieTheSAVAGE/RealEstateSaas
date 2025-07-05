#!/usr/bin/env node

/**
 * Swagger Schema Validation Script
 * Tests OpenAPI configuration independently to isolate issues
 */

const fastify = require('fastify');
const fs = require('fs');
const path = require('path');

console.log('🔍 Starting Swagger Schema Validation...\n');

// Test configuration object
const testSwaggerConfig = {
  openapi: {
    info: {
      title: 'Real Estate SaaS API',
      description: 'API documentation for Real Estate SaaS platform',
      version: '1.0.0'
    },
    servers: [
      {
        url: 'http://localhost:3001',
        description: 'Development server'
      }
    ],
    tags: [
      { name: 'Authentication', description: 'Authentication endpoints' },
      { name: 'Clients', description: 'Client management endpoints' },
      { name: 'Projects', description: 'Project management endpoints' }
    ]
  }
};

async function validateSwaggerConfig() {
  console.log('📋 Testing basic Swagger configuration...');
  
  const app = fastify({ logger: false });
  
  try {
    // Test basic Swagger registration
    await app.register(require('@fastify/swagger'), testSwaggerConfig);
    console.log('✅ Basic Swagger configuration is valid');
    
    // Test Swagger UI registration
    await app.register(require('@fastify/swagger-ui'), {
      routePrefix: '/docs',
      uiConfig: {
        docExpansion: 'list',
        deepLinking: false
      }
    });
    console.log('✅ Swagger UI configuration is valid');
    
    await app.close();
    return true;
  } catch (error) {
    console.error('❌ Basic Swagger configuration failed:');
    console.error('   Error:', error.message);
    console.error('   Stack:', error.stack);
    await app.close();
    return false;
  }
}

async function validateRouteSchemas() {
  console.log('\n📋 Testing route schemas...');
  
  const routesDir = path.join(__dirname, '../src/routes');
  const routeFiles = fs.readdirSync(routesDir).filter(file => file.endsWith('.js'));
  
  for (const file of routeFiles) {
    console.log(`\n🔍 Testing ${file}...`);
    
    const app = fastify({ logger: false });
    
    try {
      // Register basic Swagger first
      await app.register(require('@fastify/swagger'), testSwaggerConfig);
      
      // Add mock authentication middleware
      app.decorate('authenticate', async (request, reply) => {});
      app.decorate('isAdmin', async (request, reply) => {});
      app.decorate('isAgentOrAdmin', async (request, reply) => {});
      
      // Try to register the route
      const routePath = path.join(routesDir, file);
      await app.register(require(routePath), { prefix: '/api' });
      
      console.log(`   ✅ ${file} schemas are valid`);
      
      await app.close();
    } catch (error) {
      console.error(`   ❌ ${file} failed:`);
      console.error(`      Error: ${error.message}`);
      
      // Check for specific error types
      if (error.message.includes('unknown keyword')) {
        console.error('      🔍 Issue: Unknown keyword in schema (likely "example")');
      }
      if (error.message.includes('Cannot find reference')) {
        console.error('      🔍 Issue: Invalid schema reference ($ref)');
      }
      if (error.message.includes('strict mode')) {
        console.error('      🔍 Issue: Strict mode validation failure');
      }
      
      await app.close();
    }
  }
}

async function testSchemaComponents() {
  console.log('\n📋 Testing schema components...');
  
  const componentsConfig = {
    openapi: {
      ...testSwaggerConfig.openapi,
      components: {
        securitySchemes: {
          bearerAuth: {
            type: 'http',
            scheme: 'bearer',
            bearerFormat: 'JWT'
          }
        },
        schemas: {
          Error: {
            type: 'object',
            properties: {
              error: { type: 'string' }
            }
          },
          User: {
            type: 'object',
            properties: {
              id: { type: 'integer' },
              name: { type: 'string' },
              email: { type: 'string' },
              role: { type: 'string' }
            }
          }
        }
      }
    }
  };
  
  const app = fastify({ logger: false });
  
  try {
    await app.register(require('@fastify/swagger'), componentsConfig);
    console.log('✅ Schema components are valid');
    await app.close();
  } catch (error) {
    console.error('❌ Schema components failed:');
    console.error('   Error:', error.message);
    await app.close();
  }
}

async function testRouteWithSchema() {
  console.log('\n📋 Testing route with inline schema...');
  
  const app = fastify({ logger: false });
  
  try {
    await app.register(require('@fastify/swagger'), testSwaggerConfig);
    
    // Test a simple route with schema
    app.post('/test', {
      schema: {
        tags: ['Test'],
        summary: 'Test endpoint',
        body: {
          type: 'object',
          properties: {
            name: { type: 'string' }
          }
        },
        response: {
          200: {
            type: 'object',
            properties: {
              message: { type: 'string' }
            }
          }
        }
      }
    }, async (request, reply) => {
      return { message: 'test' };
    });
    
    console.log('✅ Route with inline schema is valid');
    await app.close();
  } catch (error) {
    console.error('❌ Route with schema failed:');
    console.error('   Error:', error.message);
    await app.close();
  }
}

async function main() {
  console.log('🚀 Real Estate SaaS - Swagger Validation Tool');
  console.log('=' .repeat(50));
  
  const results = [];
  
  // Run all validation tests
  results.push(await validateSwaggerConfig());
  results.push(await testSchemaComponents());
  results.push(await testRouteWithSchema());
  await validateRouteSchemas();
  
  console.log('\n' + '='.repeat(50));
  console.log('📊 Validation Summary:');
  
  const passed = results.filter(Boolean).length;
  const total = results.length;
  
  if (passed === total) {
    console.log('✅ All basic validations passed!');
    console.log('💡 If server still fails, check for:');
    console.log('   - Environment variables');
    console.log('   - Database connection');
    console.log('   - Missing dependencies');
  } else {
    console.log(`❌ ${total - passed}/${total} validations failed`);
    console.log('🔧 Fix the issues above before starting the server');
  }
  
  console.log('\n🔍 For detailed server logs, run with DEBUG=* node src/server.js');
}

// Run the validation
main().catch(console.error);
