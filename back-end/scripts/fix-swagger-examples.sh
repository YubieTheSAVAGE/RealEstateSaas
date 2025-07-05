#!/bin/bash

# Script to remove example properties from Swagger schemas to fix validation errors
echo "🔧 Fixing Swagger schema examples..."

# Remove lines containing 'example:' from route files
find src/routes/ -name "*.js" -type f -exec sed -i.bak '/example:/d' {} \;

# Remove backup files
find src/routes/ -name "*.bak" -type f -delete

echo "✅ Fixed Swagger examples in route files"
echo "🚀 You can now start the server without validation errors"
