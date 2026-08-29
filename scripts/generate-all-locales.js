const fs = require('fs');
const path = require('path');

const LOCALES_DIR = path.join(__dirname, '..', 'client', 'src', 'locales');

// Comprehensive dictionary definitions for all 13 Indian languages
// en, ta, hi, te, kn, ml, mr, bn, gu, pa, or, as, ur
const locales = {
  en: require('./translations/en.data.js'),
  ta: require('./translations/ta.data.js'),
  hi: require('./translations/hi.data.js'),
  te: require('./translations/te.data.js'),
  kn: require('./translations/kn.data.js'),
  ml: require('./translations/ml.data.js'),
  mr: require('./translations/mr.data.js'),
  bn: require('./translations/bn.data.js'),
  gu: require('./translations/gu.data.js'),
  pa: require('./translations/pa.data.js'),
  or: require('./translations/or.data.js'),
  as: require('./translations/as.data.js'),
  ur: require('./translations/ur.data.js')
};

for (const [lang, data] of Object.entries(locales)) {
  const filePath = path.join(LOCALES_DIR, `${lang}.json`);
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
  console.log(`✓ Generated ${lang}.json`);
}

console.log('All 13 locales updated successfully.');
