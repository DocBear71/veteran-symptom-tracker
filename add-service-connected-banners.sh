#!/bin/bash

GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

echo -e "${GREEN}Adding ServiceConnectedBanner to all rating cards...${NC}\n"

total=0
updated=0
skipped=0

get_condition_key() {
  local filename="$1"
  local key="${filename//RatingCard.jsx/}"
  key="$(echo ${key:0:1} | tr '[:upper:]' '[:lower:]')${key:1}"
  echo "$key"
}

for file in src/components/*RatingCard.jsx; do
  ((total++))
  filename=$(basename "$file")
  conditionKey=$(get_condition_key "$filename")

  echo -e "Processing: ${YELLOW}$filename${NC} (key: $conditionKey)"

  # Add import if missing
  if grep -q "import ServiceConnectedBanner from './ServiceConnectedBanner';" "$file"; then
    echo -e "  → Import already exists"
  else
    node -e "
const fs = require('fs');
const lines = fs.readFileSync('$file', 'utf8').split('\n');
let last = -1;
lines.forEach((l, i) => { if (l.startsWith('import ')) last = i; });
if (last >= 0) {
  lines.splice(last + 1, 0, \"import ServiceConnectedBanner from './ServiceConnectedBanner';\");
  fs.writeFileSync('$file', lines.join('\n'), 'utf8');
}
"
    echo -e "  ${GREEN}✓ Added import${NC}"
  fi

  # Skip if banner already present
  if grep -q 'conditionKey=' "$file"; then
    echo -e "  ${YELLOW}→ Banner already exists, skipping${NC}"
    ((skipped++))
    echo ""
    continue
  fi

  # Insert banner via Node
  result=$(node -e "
const fs = require('fs');
const lines = fs.readFileSync('$file', 'utf8').split('\n');
let idx = -1;
lines.forEach((l, i) => {
  if (l.includes('border-t border-gray-200 dark:border-gray-700')) idx = i;
});
if (idx === -1) { console.log('no_border'); process.exit(0); }
const banner = [
  '',
  '              {/* Service-Connected Status Banner */}',
  '              <ServiceConnectedBanner',
  '                conditionKey=\"$conditionKey\"',
  '                currentAnalysis={analysis}',
  '              />',
  ''
];
lines.splice(idx + 1, 0, ...banner);
fs.writeFileSync('$file', lines.join('\n'), 'utf8');
console.log('success');
")

  if [ "$result" = "success" ]; then
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