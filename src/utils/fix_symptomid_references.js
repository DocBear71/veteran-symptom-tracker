#!/usr/bin/env node

/**
 * Script to fix all symptomId references in ratingCriteria.js
 * to use the getLogSymptomId() helper function for backward compatibility
 */

import fs from 'fs';
import path from 'fs';

const filePath = process.argv[2] || 'ratingCriteria.js';

console.log(`Reading file: ${filePath}`);
let content = fs.readFileSync(filePath, 'utf8');

// Count of replacements made
let replacements = 0;

// Pattern 1: symptomIds.includes(log.symptomId)
const pattern1Count = (content.match(/symptomIds\.includes\(log\.symptomId\)/g) || []).length;
content = content.replace(/symptomIds\.includes\(log\.symptomId\)/g, 'symptomIds.includes(getLogSymptomId(log))');
replacements += pattern1Count;
console.log(`Pattern 1: symptomIds.includes(log.symptomId) - ${pattern1Count} replacements`);

// Pattern 2: CONDITIONS.XXX.symptomIds.includes(log.symptomId)
const pattern2Count = (content.match(/CONDITIONS\.[A-Z_]+\.symptomIds\.includes\(log\.symptomId\)/g) || []).length;
content = content.replace(/CONDITIONS\.([A-Z_]+)\.symptomIds\.includes\(log\.symptomId\)/g,
    'CONDITIONS.$1.symptomIds.includes(getLogSymptomId(log))');
replacements += pattern2Count;
console.log(`Pattern 2: CONDITIONS.XXX.symptomIds.includes(log.symptomId) - ${pattern2Count} replacements`);

// Pattern 3: log.symptomId === 'string' (but NOT in definitions/constants)
// Only replace if it's in a function context (after parentheses or operators)
const pattern3Count = (content.match(/([=\(,\s])log\.symptomId === '/g) || []).length;
content = content.replace(/([=\(,\s])log\.symptomId === '/g, '$1getLogSymptomId(log) === \'');
replacements += pattern3Count;
console.log(`Pattern 3: log.symptomId === 'string' - ${pattern3Count} replacements`);

// Pattern 4: log.symptomId || log.symptomId (OR conditions)
const pattern4Count = (content.match(/log\.symptomId === '[^']+' \|\| log\.symptomId ===/g) || []).length;
content = content.replace(/log\.symptomId === '([^']+)' \|\| log\.symptomId === '([^']+)'/g,
    "getLogSymptomId(log) === '$1' || getLogSymptomId(log) === '$2'");
replacements += pattern4Count;
console.log(`Pattern 4: log.symptomId || log.symptomId - ${pattern4Count} replacements`);

// Pattern 5: s.symptomId === (in filter functions with variable 's')
const pattern5Count = (content.match(/s\.symptomId === '/g) || []).length;
content = content.replace(/s\.symptomId === '/g, 'getLogSymptomId(s) === \'');
replacements += pattern5Count;
console.log(`Pattern 5: s.symptomId === 'string' - ${pattern5Count} replacements`);

// Pattern 6: l.symptomId === (in filter functions with variable 'l')
const pattern6Count = (content.match(/([^g])l\.symptomId ===/g) || []).length; // Negative lookbehind for 'gl' to avoid 'getLogSymptomId'
content = content.replace(/([^g])l\.symptomId ===/g, '$1getLogSymptomId(l) ===');
replacements += pattern6Count;
console.log(`Pattern 6: l.symptomId === - ${pattern6Count} replacements`);

// Pattern 7: .map(log => log.symptomId)
const pattern7Count = (content.match(/\.map\(log => log\.symptomId\)/g) || []).length;
content = content.replace(/\.map\(log => log\.symptomId\)/g, '.map(log => getLogSymptomId(log))');
replacements += pattern7Count;
console.log(`Pattern 7: .map(log => log.symptomId) - ${pattern7Count} replacements`);

// Pattern 8: l.symptomId in filter expressions (different context)
const pattern8Count = (content.match(/filter\(l => l\.symptomId\)/g) || []).length;
content = content.replace(/filter\(l => l\.symptomId\)/g, 'filter(l => getLogSymptomId(l))');
replacements += pattern8Count;
console.log(`Pattern 8: filter(l => l.symptomId) - ${pattern8Count} replacements`);

// Write the file back
const backupPath = filePath + '.backup';
fs.writeFileSync(backupPath, fs.readFileSync(filePath, 'utf8'));
console.log(`\n✅ Backup created: ${backupPath}`);

fs.writeFileSync(filePath, content);
console.log(`✅ File updated: ${filePath}`);
console.log(`\n📊 Total replacements made: ${replacements}`);

console.log('\n⚠️  IMPORTANT: Please review the changes and test thoroughly!');
console.log('If anything breaks, restore from backup: ' + backupPath);