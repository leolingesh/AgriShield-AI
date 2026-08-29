const fs = require('fs');
const path = require('path');

const LOCALES_DIR = path.join(__dirname, '..', 'client', 'src', 'locales');
const LANGUAGES = ['en', 'ta', 'hi', 'te', 'kn', 'ml', 'mr', 'bn', 'gu', 'pa', 'or', 'as', 'ur'];

function getAllKeys(obj, prefix = '') {
  let keys = [];
  for (const [k, v] of Object.entries(obj)) {
    const fullKey = prefix ? `${prefix}.${k}` : k;
    if (v && typeof v === 'object' && !Array.isArray(v)) {
      keys = keys.concat(getAllKeys(v, fullKey));
    } else {
      keys.push(fullKey);
    }
  }
  return keys;
}

function runCheck() {
  console.log('[LOCALE CHECK] Verifying translation key parity across all 13 locales...\n');
  
  const enPath = path.join(LOCALES_DIR, 'en.json');
  if (!fs.existsSync(enPath)) {
    console.error('ERROR: en.json not found at', enPath);
    process.exit(1);
  }

  const enData = JSON.parse(fs.readFileSync(enPath, 'utf8'));
  const enKeys = new Set(getAllKeys(enData));
  console.log(`Found ${enKeys.size} total keys in reference en.json.\n`);

  let hasErrors = false;
  let totalMissing = 0;

  for (const lang of LANGUAGES) {
    const langPath = path.join(LOCALES_DIR, `${lang}.json`);
    if (!fs.existsSync(langPath)) {
      console.error(`❌ [${lang}] File does not exist: ${langPath}`);
      hasErrors = true;
      continue;
    }

    try {
      const langData = JSON.parse(fs.readFileSync(langPath, 'utf8'));
      const langKeys = new Set(getAllKeys(langData));

      const missing = [];
      for (const k of enKeys) {
        if (!langKeys.has(k)) {
          missing.push(k);
        }
      }

      if (missing.length === 0) {
        console.log(`✓ ${lang} (${langKeys.size} keys, 0 missing)`);
      } else {
        console.error(`❌ ${lang} - Missing ${missing.length} keys:`);
        missing.slice(0, 10).forEach(k => console.error(`   - ${k}`));
        if (missing.length > 10) console.error(`   ... and ${missing.length - 10} more`);
        hasErrors = true;
        totalMissing += missing.length;
      }
    } catch (err) {
      console.error(`❌ [${lang}] JSON parse error:`, err.message);
      hasErrors = true;
    }
  }

  console.log(`\n========================================`);
  if (!hasErrors) {
    console.log(`[LOCALE CHECK] SUCCESS: All 13 locales have 100% complete key coverage with 0 missing keys.`);
    console.log(`========================================\n`);
    process.exit(0);
  } else {
    console.error(`[LOCALE CHECK] FAILED: Total ${totalMissing} missing keys across locales.`);
    console.error(`========================================\n`);
    process.exit(1);
  }
}

runCheck();
