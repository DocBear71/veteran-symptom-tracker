
import fs from 'fs';
import path from 'fs';

// Mapping of all functions to their condition info
const CONDITION_MAPPINGS = {
  'analyzeKidneyStonesLogs': {
    condition: 'Kidney Stones (Nephrolithiasis)',
    diagnosticCode: '7508'
  },
  'analyzeChronicRenalDiseaseLogs': {
    condition: 'Chronic Kidney Disease',
    diagnosticCode: '7530'
  },
  'analyzeVoidingDysfunctionLogs': {
    condition: 'Voiding Dysfunction',
    diagnosticCode: '7542'
  },
  'analyzeSphincterImpairmentLogs': {
    condition: 'Sphincter Control Impairment',
    diagnosticCode: '7332'
  },
  'analyzeErectileDysfunctionLogs': {
    condition: 'Erectile Dysfunction',
    diagnosticCode: '7522'
  },
  'analyzeIronDeficiencyAnemiaLogs': {
    condition: 'Iron Deficiency Anemia',
    diagnosticCode: '7720'
  },
  'analyzeFolateDeficiencyAnemiaLogs': {
    condition: 'Folic Acid Deficiency Anemia',
    diagnosticCode: '7721'
  },
  'analyzePerniciousAnemiaLogs': {
    condition: 'Pernicious Anemia (B12 Deficiency)',
    diagnosticCode: '7722'
  },
  'analyzeHemolyticAnemiaLogs': {
    condition: 'Acquired Hemolytic Anemia',
    diagnosticCode: '7723'
  },
  'analyzeSickleCellAnemiaLogs': {
    condition: 'Sickle Cell Anemia',
    diagnosticCode: '7714'
  },
  'analyzeAplasticAnemiaLogs': {
    condition: 'Aplastic Anemia',
    diagnosticCode: '7716'
  },
  'analyzePolycythemiaVeraLogs': {
    condition: 'Polycythemia Vera',
    diagnosticCode: '7704'
  },
  'analyzeImmuneThrombocytopeniaLogs': {
    condition: 'Immune Thrombocytopenia (ITP)',
    diagnosticCode: '7705'
  },
  'analyzeLeukemiaLogs': {
    condition: 'Leukemia',
    diagnosticCode: '7703'
  },
  'analyzeHodgkinsLymphomaLogs': {
    condition: "Hodgkin's Lymphoma",
    diagnosticCode: '7709'
  },
  'analyzeMultipleMyelomaLogs': {
    condition: 'Multiple Myeloma',
    diagnosticCode: '7712'
  },
  'analyzeNonHodgkinsLymphomaLogs': {
    condition: "Non-Hodgkin's Lymphoma",
    diagnosticCode: '7715'
  },
  'analyzeMyeloproliferative7718Logs': {
    condition: 'Essential Thrombocythemia',
    diagnosticCode: '7718'
  },
  'analyzeChronicMyelogenousLeukemiaLogs': {
    condition: 'Chronic Myelogenous Leukemia',
    diagnosticCode: '7703'
  },
  'analyzeSolitaryPlasmacytomaLogs': {
    condition: 'Solitary Plasmacytoma',
    diagnosticCode: '7712'
  },
  'analyzeMyelodysplasticSyndromesLogs': {
    condition: 'Myelodysplastic Syndromes',
    diagnosticCode: '7703'
  },
  'analyzeEndometriosisLogs': {
    condition: 'Endometriosis',
    diagnosticCode: '7629'
  },
  'analyzeFemaleReproductiveOrgansLogs': {
    condition: 'Diseases of Female Reproductive Organs',
    diagnosticCode: '7610-7629'
  },
  'analyzePelvicProlapseLogs': {
    condition: 'Pelvic Organ Prolapse',
    diagnosticCode: '7628'
  },
  'analyzeFemaleArousalDisorderLogs': {
    condition: 'Female Sexual Arousal Disorder (FSAD)',
    diagnosticCode: '7632'
  }
};

const filePath = 'ratingCriteria.js';
const backupPath = 'ratingCriteria.js.backup';

console.log('='.repeat(80));
console.log('AUTOMATED FIX: Adding condition & diagnosticCode to Analysis Functions');
console.log('='.repeat(80));
console.log();

// Step 1: Create backup
console.log('Step 1: Creating backup...');
try {
  fs.copyFileSync(filePath, backupPath);
  console.log(`✓ Backup created: ${backupPath}`);
} catch (err) {
  console.error('✗ Failed to create backup:', err.message);
  process.exit(1);
}

// Step 2: Read the file
console.log('\nStep 2: Reading file...');
let content;
try {
  content = fs.readFileSync(filePath, 'utf8');
  console.log(`✓ File read successfully (${content.length} characters)`);
} catch (err) {
  console.error('✗ Failed to read file:', err.message);
  process.exit(1);
}

// Step 3: Process each function
console.log('\nStep 3: Processing functions...');
console.log();

let fixedCount = 0;
const changes = [];

Object.entries(CONDITION_MAPPINGS).forEach(([funcName, info]) => {
  // Find the function
  const funcRegex = new RegExp(`export const ${funcName} = \\([^)]*\\) => \\{`, 'g');
  const funcMatch = funcRegex.exec(content);

  if (!funcMatch) {
    console.log(`⚠ Function not found: ${funcName}`);
    return;
  }

  const funcStart = funcMatch.index;

  // Find all return statements in this function
  // We need to be careful to only modify returns within this function
  // Find the next function or end of file
  const allFunctions = content.match(/export const analyze\w+Logs = \([^)]*\) => \{/g) || [];
  const currentFuncIndex = allFunctions.findIndex(f => f.includes(funcName));

  let funcEnd = content.length;
  if (currentFuncIndex < allFunctions.length - 1) {
    // Find the next function
    const nextFuncPattern = allFunctions[currentFuncIndex + 1];
    const nextFuncIndex = content.indexOf(nextFuncPattern, funcStart + 1);
    if (nextFuncIndex !== -1) {
      funcEnd = nextFuncIndex;
    }
  }

  const functionBody = content.substring(funcStart, funcEnd);

  // Find return statements with hasData: true
  // Look for: return { ... hasData: true ... }
  const returnPattern = /return\s*\{\s*\n(\s*)hasData:\s*true,/g;
  let returnMatch;
  let modified = false;

  while ((returnMatch = returnPattern.exec(functionBody)) !== null) {
    const returnStart = funcStart + returnMatch.index;
    const indent = returnMatch[1];

    // Check if this return already has condition field
    const returnBlock = content.substring(returnStart, returnStart + 500);
    if (returnBlock.includes('condition:')) {
      continue; // Already fixed
    }

    // Find the exact position to insert (right after "return {")
    const insertPos = returnStart + returnMatch[0].indexOf('{') + 1;

    // Create the fields to insert
    const fieldsToInsert = `\n${indent}  condition: '${info.condition}',\n${indent}  diagnosticCode: '${info.diagnosticCode}',\n${indent}  `;

    // Insert the fields
    content = content.slice(0, insertPos) + fieldsToInsert + content.slice(insertPos);

    // Adjust position for next iteration
    funcEnd += fieldsToInsert.length;

    modified = true;
  }

  if (modified) {
    fixedCount++;
    changes.push({
      function: funcName,
      condition: info.condition,
      diagnosticCode: info.diagnosticCode
    });
    console.log(`✓ Fixed: ${funcName}`);
    console.log(`  → ${info.condition} (DC ${info.diagnosticCode})`);
  } else {
    console.log(`⊘ Skipped: ${funcName} (already has fields or no matching return)`);
  }
});

// Step 4: Standardize field names (rationale → ratingRationale, evidenceGaps → gaps)
console.log('\nStep 4: Standardizing field names...');

// This is more complex - we need to be careful to only change in return statements
// For now, we'll do targeted replacements in the functions we know need it

let fieldNameChanges = 0;

// Pattern: find "rationale:" or "rationale," within return statements we just modified
Object.entries(CONDITION_MAPPINGS).forEach(([funcName, info]) => {
  // Find this function's return statements
  const funcPattern = new RegExp(`export const ${funcName} = [\\s\\S]*?(?=export const |$)`, 'g');
  const funcMatch = funcPattern.exec(content);

  if (funcMatch) {
    let funcContent = funcMatch[0];
    const funcStart = funcMatch.index;

    // Replace rationale: with ratingRationale: (but only if it doesn't already say ratingRationale)
    if (funcContent.includes('rationale:') && !funcContent.includes('ratingRationale:')) {
      // Be careful to only replace in return statements
      funcContent = funcContent.replace(
          /(\breturn\s*\{[^}]*?)(\brationale)(:\s*(?:rationale|\[))/g,
          '$1ratingRationale$3'
      );
      fieldNameChanges++;
    }

    // Replace evidenceGaps: with gaps:
    if (funcContent.includes('evidenceGaps:')) {
      funcContent = funcContent.replace(/\bevidenceGaps:/g, 'gaps:');
      fieldNameChanges++;
    }

    // Update content
    content = content.slice(0, funcStart) + funcContent + content.slice(funcStart + funcMatch[0].length);
  }
});

console.log(`✓ Standardized ${fieldNameChanges} field name occurrences`);

// Step 5: Write the fixed file
console.log('\nStep 5: Writing fixed file...');
try {
  fs.writeFileSync(filePath, content, 'utf8');
  console.log(`✓ File written successfully`);
} catch (err) {
  console.error('✗ Failed to write file:', err.message);
  console.log('Restoring from backup...');
  fs.copyFileSync(backupPath, filePath);
  process.exit(1);
}

// Step 6: Generate report
console.log('\n' + '='.repeat(80));
console.log('FIX COMPLETE');
console.log('='.repeat(80));
console.log();
console.log(`Functions fixed: ${fixedCount} out of ${Object.keys(CONDITION_MAPPINGS).length}`);
console.log(`Field names standardized: ${fieldNameChanges} changes`);
console.log();
console.log('Changes made:');
console.log('-'.repeat(80));

changes.forEach(change => {
  console.log(`  ${change.function}`);
  console.log(`    → Added: condition = "${change.condition}"`);
  console.log(`    → Added: diagnosticCode = "${change.diagnosticCode}"`);
});

console.log();
console.log('Backup location:', backupPath);
console.log();
console.log('✓ All fixes applied successfully!');
console.log();
console.log('Next steps:');
console.log('  1. Test exports to verify all conditions now display correctly');
console.log('  2. If everything works, you can delete the backup file');
console.log('  3. If issues occur, restore from backup');
console.log();
console.log('='.repeat(80));