#!/usr/bin/env node

/**
 * Schema Debugging Utility
 * Analyzes route files for common Swagger/OpenAPI issues
 */

const fs = require('fs');
const path = require('path');

console.log('🔍 Schema Debugging Utility');
console.log('=' .repeat(40));

function analyzeRouteFile(filePath) {
  console.log(`\n📁 Analyzing: ${path.basename(filePath)}`);
  
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    const issues = [];
    
    // Check for common problematic patterns
    const lines = content.split('\n');
    
    lines.forEach((line, index) => {
      const lineNum = index + 1;
      
      // Check for "example" keyword
      if (line.includes('example:')) {
        issues.push({
          type: 'EXAMPLE_KEYWORD',
          line: lineNum,
          content: line.trim(),
          severity: 'HIGH',
          description: 'Found "example" keyword which is not supported in Fastify strict mode'
        });
      }
      
      // Check for $ref references
      if (line.includes('$ref:')) {
        issues.push({
          type: 'SCHEMA_REFERENCE',
          line: lineNum,
          content: line.trim(),
          severity: 'MEDIUM',
          description: 'Found schema reference ($ref) which may cause issues if schema is not defined'
        });
      }
      
      // Check for allOf usage
      if (line.includes('allOf:')) {
        issues.push({
          type: 'ALLOF_USAGE',
          line: lineNum,
          content: line.trim(),
          severity: 'MEDIUM',
          description: 'Found allOf usage which can be complex to validate'
        });
      }
      
      // Check for nullable usage
      if (line.includes('nullable:')) {
        issues.push({
          type: 'NULLABLE_USAGE',
          line: lineNum,
          content: line.trim(),
          severity: 'LOW',
          description: 'Found nullable property which may need special handling'
        });
      }
      
      // Check for format usage
      if (line.includes('format:') && (line.includes('date-time') || line.includes('email') || line.includes('uri'))) {
        issues.push({
          type: 'FORMAT_USAGE',
          line: lineNum,
          content: line.trim(),
          severity: 'LOW',
          description: 'Found format property - ensure it\'s supported'
        });
      }
    });
    
    // Report findings
    if (issues.length === 0) {
      console.log('   ✅ No obvious issues found');
    } else {
      console.log(`   ⚠️ Found ${issues.length} potential issues:`);
      
      issues.forEach(issue => {
        const severity = issue.severity === 'HIGH' ? '🔴' : 
                        issue.severity === 'MEDIUM' ? '🟡' : '🟢';
        console.log(`   ${severity} Line ${issue.line}: ${issue.type}`);
        console.log(`      ${issue.description}`);
        console.log(`      Code: ${issue.content}`);
      });
    }
    
    return issues;
    
  } catch (error) {
    console.error(`   ❌ Error reading file: ${error.message}`);
    return [];
  }
}

function generateFixSuggestions(allIssues) {
  console.log('\n🔧 Fix Suggestions:');
  console.log('=' .repeat(40));
  
  const exampleIssues = allIssues.filter(issue => issue.type === 'EXAMPLE_KEYWORD');
  const refIssues = allIssues.filter(issue => issue.type === 'SCHEMA_REFERENCE');
  
  if (exampleIssues.length > 0) {
    console.log('\n📝 Example Keyword Issues:');
    console.log('   Problem: Fastify strict mode doesn\'t support "example" keyword');
    console.log('   Solution: Remove all "example:" properties from schemas');
    console.log('   Command: Run the fix-swagger-examples.sh script');
  }
  
  if (refIssues.length > 0) {
    console.log('\n🔗 Schema Reference Issues:');
    console.log('   Problem: $ref references may not resolve correctly');
    console.log('   Solution: Replace with inline schemas or ensure components are defined');
    console.log('   Command: Run the fix-swagger-refs.sh script');
  }
  
  console.log('\n💡 General Recommendations:');
  console.log('   1. Use inline schemas instead of $ref for simpler validation');
  console.log('   2. Avoid complex schema compositions (allOf, oneOf, anyOf)');
  console.log('   3. Keep schemas simple and explicit');
  console.log('   4. Test each route file individually');
}

function main() {
  const routesDir = path.join(__dirname, '../src/routes');
  
  if (!fs.existsSync(routesDir)) {
    console.error('❌ Routes directory not found:', routesDir);
    process.exit(1);
  }
  
  const routeFiles = fs.readdirSync(routesDir)
    .filter(file => file.endsWith('.js'))
    .map(file => path.join(routesDir, file));
  
  console.log(`📂 Found ${routeFiles.length} route files to analyze`);
  
  const allIssues = [];
  
  routeFiles.forEach(file => {
    const issues = analyzeRouteFile(file);
    allIssues.push(...issues);
  });
  
  console.log('\n📊 Summary:');
  console.log('=' .repeat(40));
  console.log(`Total files analyzed: ${routeFiles.length}`);
  console.log(`Total issues found: ${allIssues.length}`);
  
  const severityCounts = {
    HIGH: allIssues.filter(i => i.severity === 'HIGH').length,
    MEDIUM: allIssues.filter(i => i.severity === 'MEDIUM').length,
    LOW: allIssues.filter(i => i.severity === 'LOW').length
  };
  
  console.log(`High severity: ${severityCounts.HIGH}`);
  console.log(`Medium severity: ${severityCounts.MEDIUM}`);
  console.log(`Low severity: ${severityCounts.LOW}`);
  
  generateFixSuggestions(allIssues);
  
  if (severityCounts.HIGH > 0) {
    console.log('\n🚨 High severity issues found! These likely prevent server startup.');
    process.exit(1);
  } else if (severityCounts.MEDIUM > 0) {
    console.log('\n⚠️ Medium severity issues found. These may cause problems.');
    process.exit(1);
  } else {
    console.log('\n✅ No critical issues found. Schemas should work.');
    process.exit(0);
  }
}

main();
