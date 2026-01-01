#!/bin/bash

# Script to add ServiceConnectedBanner to all rating card components
# This adds the import and the banner JSX to each rating card

# Color codes for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${GREEN}Adding ServiceConnectedBanner to all rating cards...${NC}\n"

# Counter for tracking
total=0
updated=0
skipped=0

# Function to convert filename to conditionKey
# Example: PTSDRatingCard.jsx -> ptsd
get_condition_key() {
  local filename="$1"
  local key="${filename//RatingCard.jsx/}"

  # Convert PascalCase to camelCase
  # First letter lowercase, rest stays the same
  key="$(echo ${key:0:1} | tr '[:upper:]' '[:lower:]')${key:1}"

  echo "$key"
}

# Find all rating card files
for file in src/components/*RatingCard.jsx; do
  ((total++))

  filename=$(basename "$file")
  conditionKey=$(get_condition_key "$filename")

  echo -e "Processing: ${YELLOW}$filename${NC} (key: $conditionKey)"

  # Check if import already exists
  if grep -q "import ServiceConnectedBanner from './ServiceConnectedBanner';" "$file"; then
    echo -e "  ${YELLOW}→ Import already exists, checking for banner...${NC}"
  else
    # Add import after other imports (after the last import statement)
    # Find the line number of the last import
    last_import_line=$(grep -n "^import" "$file" | tail -1 | cut -d: -f1)

    if [ -n "$last_import_line" ]; then
      # Add the import after the last import line
      sed -i "${last_import_line}a\\import ServiceConnectedBanner from './ServiceConnectedBanner';" "$file"
      echo -e "  ${GREEN}✓ Added import${NC}"
    else
      echo -e "  ${RED}✗ Could not find import section${NC}"
      ((skipped++))
      continue
    fi
  fi

  # Check if banner already exists
  if grep -q "ServiceConnectedBanner" "$file" | grep -q "conditionKey="; then
    echo -e "  ${YELLOW}→ Banner already exists, skipping${NC}"
    ((skipped++))
    continue
  fi

  # Find the line with the border divider in the expanded section
  # Looking for: <div className="border-t border-gray-200 dark:border-gray-700" />
  border_line=$(grep -n 'border-t border-gray-200 dark:border-gray-700' "$file" | head -1 | cut -d: -f1)

  if [ -n "$border_line" ]; then
    # Add the banner after the border line
    banner_code="\\
              {/* Service-Connected Status Banner */}\\
              <ServiceConnectedBanner \\
                conditionKey=\"$conditionKey\" \\
                currentAnalysis={analysis}\\
              />\\
"

    sed -i "${border_line}a\\${banner_code}" "$file"
    echo -e "  ${GREEN}✓ Added banner (conditionKey: $conditionKey)${NC}"
    ((updated++))
  else
    echo -e "  ${RED}✗ Could not find border divider${NC}"
    ((skipped++))
  fi

  echo ""
done

echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}Summary:${NC}"
echo -e "  Total files: $total"
echo -e "  ${GREEN}Updated: $updated${NC}"
echo -e "  ${YELLOW}Skipped: $skipped${NC}"
echo -e "${GREEN}========================================${NC}"