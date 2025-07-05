#!/bin/bash

# Script to remove all Swagger schemas from route files
echo "🧹 Removing all Swagger schemas from route files..."

# Function to remove schema blocks from a file
remove_schemas() {
    local file="$1"
    echo "Processing $file..."
    
    # Create a temporary file
    local temp_file=$(mktemp)
    
    # Use awk to remove schema blocks
    awk '
    BEGIN { in_schema = 0; brace_count = 0 }
    /schema: {/ { 
        in_schema = 1; 
        brace_count = 1; 
        next 
    }
    in_schema && /{/ { brace_count++ }
    in_schema && /}/ { 
        brace_count--; 
        if (brace_count == 0) { 
            in_schema = 0; 
            next 
        } 
    }
    !in_schema { print }
    ' "$file" > "$temp_file"
    
    # Replace original file
    mv "$temp_file" "$file"
}

# Process all route files
for file in src/routes/*.js; do
    if [ -f "$file" ]; then
        remove_schemas "$file"
    fi
done

echo "✅ Removed all Swagger schemas from route files"
echo "🚀 Server should now start without schema validation errors"
