/**
 * Script to update all translation datasets with complete footer keys, day names, and weather terms
 */
const fs = require('fs');
const path = require('path');

const footerAdditions = {
  en: { disclaimerTitle: "Agricultural Disclaimer", allRights: "All rights reserved." },
  ta: { disclaimerTitle: "விவசாய மறுப்பு", allRights: "அனைத்து உரிமைகளும் பாதுகாக்கப்பட்டவை." },
  hi: { disclaimerTitle: "कृषि अस्वीकरण", allRights: "सर्वाधिकार सुरक्षित।" },
  te: { disclaimerTitle: "వ్యవసాయ నిరాకరణ", allRights: "అన్ని హక్కులు ప్రత్యేకించబడ్డాయి." },
  kn: { disclaimerTitle: "ಕೃಷಿ ಹಕ್ಕುತ್ಯಾಗ", allRights: "ಎಲ್ಲಾ ಹಕ್ಕುಗಳನ್ನು ಕಾಯ್ದಿರಿಸಲಾಗಿದೆ." },
  ml: { disclaimerTitle: "കാർഷിക നിരാകരണം", allRights: "എല്ലാ അവകാശങ്ങളും നിക്ഷിപ്തം." },
  mr: { disclaimerTitle: "कृषी अस्वीकरण", allRights: "सर्व हक्क राखीव." },
  bn: { disclaimerTitle: "কৃষি দাবিত্যাগ", allRights: "সর্বস্বত্ব সংরক্ষিত।" },
  gu: { disclaimerTitle: "કૃષિ અસ્વીકરણ", allRights: "સર્વહક સ્વાધીન." },
  pa: { disclaimerTitle: "ਖੇਤੀਬਾੜੀ ਬੇਦਾਅਵਾ", allRights: "ਸਾਰੇ ਹੱਕ ਰਾਖਵੇਂ ਹਨ।" },
  or: { disclaimerTitle: "କୃଷି ଦାବିତ୍ୟାଗ", allRights: "ସମସ୍ତ ଅଧିକାର ସଂରକ୍ଷିତ।" },
  as: { disclaimerTitle: "কৃষি দাবীত্যাগ", allRights: "সকলো অধিকাৰ সংৰক্ষিত।" },
  ur: { disclaimerTitle: "زرعی دستبرداری", allRights: "جملہ حقوق محفوظ ہیں۔" }
};

const dayNames = {
  en: { today: "Today", tomorrow: "Tomorrow", mon: "Mon", tue: "Tue", wed: "Wed", thu: "Thu", fri: "Fri", sat: "Sat", sun: "Sun" },
  ta: { today: "இன்று", tomorrow: "நாளை", mon: "திங்கள்", tue: "செவ்வாய்", wed: "புதன்", thu: "வியாழன்", fri: "வெள்ளி", sat: "சனி", sun: "ஞாயிறு" },
  hi: { today: "आज", tomorrow: "कल", mon: "सोम", tue: "मंगल", wed: "बुध", thu: "गुरु", fri: "शुक्र", sat: "शनि", sun: "रवि" },
  te: { today: "నేడు", tomorrow: "రేపు", mon: "సోమ", tue: "మంగళ", wed: "బుధ", thu: "గురు", fri: "శుక్ర", sat: "శని", sun: "ఆది" },
  kn: { today: "ಇಂದು", tomorrow: "ನಾಳೆ", mon: "ಸೋಮ", tue: "ಮಂಗಳ", wed: "ಬುಧ", thu: "ಗುರು", fri: "ಶುಕ್ರ", sat: "ಶನಿ", sun: "ಭಾನು" },
  ml: { today: "ഇന്ന്", tomorrow: "നാളെ", mon: "തിങ്കൾ", tue: "ചൊവ്വ", wed: "ബുധൻ", thu: "വ്യാഴം", fri: "വെള്ളി", sat: "ശനി", sun: "ഞായർ" },
  mr: { today: "आज", tomorrow: "उद्या", mon: "सोम", tue: "मंगळ", wed: "बुध", thu: "गुरु", fri: "शुक्र", sat: "शनि", sun: "रवि" },
  bn: { today: "আজ", tomorrow: "আগামীকাল", mon: "সোম", tue: "মঙ্গল", wed: "বুধ", thu: "বৃহস্পতি", fri: "শুক্র", sat: "শনি", sun: "রবি" },
  gu: { today: "આજે", tomorrow: "આવતીકાલે", mon: "સોમ", tue: "મંગળ", wed: "બુધ", thu: "ગુરુ", fri: "શુક્ર", sat: "શનિ", sun: "રવિ" },
  pa: { today: "ਅੱਜ", tomorrow: "ਕੱਲ੍ਹ", mon: "ਸੋਮ", tue: "ਮੰਗਲ", wed: "ਬੁੱਧ", thu: "ਵੀਰ", fri: "ਸ਼ੁੱਕਰ", sat: "ਸ਼ਨਿੱਚਰ", sun: "ਐਤ" },
  or: { today: "ଆଜି", tomorrow: "ଆସନ୍ତାକାଲି", mon: "ସୋମ", tue: "ମଙ୍ଗଳ", wed: "ବୁଧ", thu: "ଗୁରୁ", fri: "ଶୁକ୍ର", sat: "ଶନି", sun: "ରବି" },
  as: { today: "আজি", tomorrow: "কাইলৈ", mon: "সোম", tue: "মঙ্গল", wed: "বুধ", thu: "বৃহস্পতি", fri: "শুক্ৰ", sat: "শনি", sun: "দেও" },
  ur: { today: "آج", tomorrow: "کل", mon: "پیر", tue: "منگل", wed: "بدھ", thu: "جمعرات", fri: "جمعہ", sat: "ہفتہ", sun: "اتوار" }
};

const LANGS = ['en', 'ta', 'hi', 'te', 'kn', 'ml', 'mr', 'bn', 'gu', 'pa', 'or', 'as', 'ur'];

for (const lang of LANGS) {
  const filePath = path.join(__dirname, `../client/src/locales/${lang}.json`);
  if (!fs.existsSync(filePath)) continue;
  
  const content = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  
  // Patch footer
  if (!content.footer) content.footer = {};
  content.footer.disclaimerTitle = footerAdditions[lang].disclaimerTitle;
  content.footer.allRights = footerAdditions[lang].allRights;
  
  // Patch days
  content.days = dayNames[lang];
  
  fs.writeFileSync(filePath, JSON.stringify(content, null, 2), 'utf8');
  console.log(`✓ Patched ${lang}.json`);
}

console.log('[SUCCESS] All locales updated with days and footer keys.');
