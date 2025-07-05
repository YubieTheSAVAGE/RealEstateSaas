/**
 * Swagger Error Handler Utility
 * Provides detailed error analysis for Swagger/OpenAPI issues
 */

class SwaggerErrorHandler {
  static analyzeError(error, context = '') {
    console.error(`\n🚨 [Swagger Error] ${context}`);
    console.error('=' .repeat(60));
    
    // Basic error info
    console.error('Error Type:', error.constructor.name);
    console.error('Error Code:', error.code || 'N/A');
    console.error('Error Message:', error.message);
    
    // Specific error analysis
    this.analyzeSpecificError(error);
    
    // Stack trace (truncated)
    if (error.stack) {
      const stackLines = error.stack.split('\n').slice(0, 5);
      console.error('\nStack Trace (first 5 lines):');
      stackLines.forEach(line => console.error('  ', line));
    }
    
    // Suggestions
    this.provideSuggestions(error);
    
    console.error('=' .repeat(60));
  }
  
  static analyzeSpecificError(error) {
    const message = error.message.toLowerCase();
    
    if (message.includes('unknown keyword')) {
      this.handleUnknownKeywordError(error);
    } else if (message.includes('cannot find reference')) {
      this.handleReferenceError(error);
    } else if (message.includes('failed building the validation schema')) {
      this.handleValidationSchemaError(error);
    } else if (message.includes('failed building the serialization schema')) {
      this.handleSerializationSchemaError(error);
    } else if (message.includes('strict mode')) {
      this.handleStrictModeError(error);
    } else {
      this.handleGenericError(error);
    }
  }
  
  static handleUnknownKeywordError(error) {
    console.error('\n🔍 Analysis: Unknown Keyword Error');
    
    const keywordMatch = error.message.match(/unknown keyword: "([^"]+)"/);
    const keyword = keywordMatch ? keywordMatch[1] : 'unknown';
    
    console.error(`   Problematic keyword: "${keyword}"`);
    
    const endpointMatch = error.message.match(/for (\w+): ([^,]+)/);
    if (endpointMatch) {
      console.error(`   Endpoint: ${endpointMatch[1]} ${endpointMatch[2]}`);
    }
    
    console.error('\n💡 Common causes:');
    console.error('   - "example" keyword is not supported in Fastify strict mode');
    console.error('   - Custom keywords not recognized by JSON Schema validator');
    console.error('   - OpenAPI 3.0 keywords used in JSON Schema context');
  }
  
  static handleReferenceError(error) {
    console.error('\n🔍 Analysis: Schema Reference Error');
    
    const refMatch = error.message.match(/Cannot find reference "([^"]+)"/);
    const reference = refMatch ? refMatch[1] : 'unknown';
    
    console.error(`   Missing reference: "${reference}"`);
    
    console.error('\n💡 Common causes:');
    console.error('   - Referenced schema not defined in components.schemas');
    console.error('   - Incorrect $ref path');
    console.error('   - Schema defined after it\'s referenced');
    console.error('   - Circular references');
  }
  
  static handleValidationSchemaError(error) {
    console.error('\n🔍 Analysis: Validation Schema Error');
    
    const endpointMatch = error.message.match(/for (\w+): ([^,]+)/);
    if (endpointMatch) {
      console.error(`   Endpoint: ${endpointMatch[1]} ${endpointMatch[2]}`);
    }
    
    console.error('\n💡 Common causes:');
    console.error('   - Invalid JSON Schema syntax');
    console.error('   - Unsupported schema properties');
    console.error('   - Type mismatches');
    console.error('   - Missing required properties');
  }
  
  static handleSerializationSchemaError(error) {
    console.error('\n🔍 Analysis: Serialization Schema Error');
    
    console.error('\n💡 Common causes:');
    console.error('   - Invalid response schema structure');
    console.error('   - Unresolvable $ref in response schemas');
    console.error('   - Complex schema compositions that can\'t be serialized');
  }
  
  static handleStrictModeError(error) {
    console.error('\n🔍 Analysis: Strict Mode Error');
    
    console.error('\n💡 Common causes:');
    console.error('   - Additional properties not allowed');
    console.error('   - Unknown keywords in schema');
    console.error('   - Schema doesn\'t match strict JSON Schema specification');
  }
  
  static handleGenericError(error) {
    console.error('\n🔍 Analysis: Generic Swagger Error');
    console.error('   This error doesn\'t match common patterns');
    console.error('   Check the full error message and stack trace for clues');
  }
  
  static provideSuggestions(error) {
    console.error('\n🔧 Suggested Solutions:');
    
    const message = error.message.toLowerCase();
    
    if (message.includes('unknown keyword')) {
      console.error('   1. Remove "example" properties from all schemas');
      console.error('   2. Run: npm run fix-swagger-examples');
      console.error('   3. Use only standard JSON Schema keywords');
    }
    
    if (message.includes('cannot find reference')) {
      console.error('   1. Replace $ref with inline schemas');
      console.error('   2. Define missing schemas in components.schemas');
      console.error('   3. Run: npm run fix-swagger-refs');
    }
    
    if (message.includes('validation schema') || message.includes('serialization schema')) {
      console.error('   1. Simplify complex schemas');
      console.error('   2. Use basic types (string, number, boolean, object, array)');
      console.error('   3. Avoid deep nesting and complex compositions');
    }
    
    console.error('   4. Test individual route files with validate-swagger.js');
    console.error('   5. Check debug-schemas.js output for specific issues');
    console.error('   6. Consider disabling Swagger temporarily to test API functionality');
  }
  
  static createMinimalSchema() {
    return {
      openapi: {
        info: {
          title: 'Real Estate SaaS API',
          version: '1.0.0'
        },
        tags: [
          { name: 'Authentication', description: 'Auth endpoints' },
          { name: 'Clients', description: 'Client endpoints' }
        ]
      }
    };
  }
  
  static logSuccessfulRegistration(routeName, endpointCount = 0) {
    console.log(`✅ [Swagger] ${routeName} routes registered successfully`);
    if (endpointCount > 0) {
      console.log(`   📊 Endpoints registered: ${endpointCount}`);
    }
  }
}

module.exports = SwaggerErrorHandler;
