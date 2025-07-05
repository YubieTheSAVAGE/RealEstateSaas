#!/bin/bash

# Script to replace schema references with inline schemas to fix Fastify validation
echo "🔧 Fixing Swagger schema references..."

# Replace Error schema references with inline error schemas
find src/routes/ -name "*.js" -type f -exec sed -i.bak 's/\$ref: '\''#\/components\/schemas\/Error'\''/type: '\''object'\'', properties: { error: { type: '\''string'\'' } }/g' {} \;

# Replace User schema references with inline user schemas (simplified)
find src/routes/ -name "*.js" -type f -exec sed -i.bak 's/\$ref: '\''#\/components\/schemas\/User'\''/type: '\''object'\'', properties: { id: { type: '\''integer'\'' }, name: { type: '\''string'\'' }, email: { type: '\''string'\'' }, role: { type: '\''string'\'' } }/g' {} \;

# Replace Client schema references with inline client schemas (simplified)
find src/routes/ -name "*.js" -type f -exec sed -i.bak 's/\$ref: '\''#\/components\/schemas\/Client'\''/type: '\''object'\'', properties: { id: { type: '\''integer'\'' }, name: { type: '\''string'\'' }, email: { type: '\''string'\'' }, status: { type: '\''string'\'' } }/g' {} \;

# Replace Project schema references with inline project schemas (simplified)
find src/routes/ -name "*.js" -type f -exec sed -i.bak 's/\$ref: '\''#\/components\/schemas\/Project'\''/type: '\''object'\'', properties: { id: { type: '\''integer'\'' }, name: { type: '\''string'\'' }, address: { type: '\''string'\'' } }/g' {} \;

# Replace Property schema references with inline property schemas (simplified)
find src/routes/ -name "*.js" -type f -exec sed -i.bak 's/\$ref: '\''#\/components\/schemas\/Property'\''/type: '\''object'\'', properties: { id: { type: '\''integer'\'' }, number: { type: '\''string'\'' }, type: { type: '\''string'\'' }, status: { type: '\''string'\'' } }/g' {} \;

# Remove backup files
find src/routes/ -name "*.bak" -type f -delete

echo "✅ Fixed Swagger schema references"
echo "🚀 Server should now start without schema reference errors"
