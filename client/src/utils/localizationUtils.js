/**
 * AgriShield AI Multilingual Localization Engine
 * Single Source of Truth for Dynamic Content Localization across 13 Indian languages:
 * en, ta, hi, te, kn, ml, mr, bn, gu, pa, or, as, ur
 */

import en from '../locales/en.json';
import ta from '../locales/ta.json';
import hi from '../locales/hi.json';
import te from '../locales/te.json';
import kn from '../locales/kn.json';
import ml from '../locales/ml.json';
import mr from '../locales/mr.json';
import bn from '../locales/bn.json';
import gu from '../locales/gu.json';
import pa from '../locales/pa.json';
import or from '../locales/or.json';
import as from '../locales/as.json';
import ur from '../locales/ur.json';

export const ALL_LOCALES = {
  en, ta, hi, te, kn, ml, mr, bn, gu, pa, or, as, ur
};

/**
 * Normalizes any crop name or ID to canonical key
 */
export function normalizeCropKey(rawCrop) {
  if (!rawCrop) return 'tomato';
  const c = String(rawCrop).toLowerCase().trim();
  if (c.includes('tomato') || c.includes('தக்காளி') || c.includes('टमाटर') || c.includes('టమోటా') || c.includes('ಟೊಮ್ಯಾಟೊ') || c.includes('തക്കാളി') || c.includes('টমেটো') || c.includes('টমেট') || c.includes('ٹماٹر')) return 'tomato';
  if (c.includes('rice') || c.includes('paddy') || c.includes('நெல்') || c.includes('धान') || c.includes('వరి') || c.includes('ಭತ್ತ') || c.includes('നെല്ല്') || c.includes('ধান') || c.includes('चावल') || c.includes('چاول')) return 'rice';
  if (c.includes('cotton') || c.includes('பருத்தி') || c.includes('कपास') || c.includes('పత్తి') || c.includes('ಹತ್ತಿ') || c.includes('পৰুత్తి') || c.includes('তুলা') || c.includes('કપાસ') || c.includes('ਕਪਾਹ') || c.includes('କପା') || c.includes('কপাহ') || c.includes('کپاس')) return 'cotton';
  if (c.includes('wheat') || c.includes('கோதுமை') || c.includes('गेहूं') || c.includes('గోధుమ') || c.includes('ಗೋಧಿ') || c.includes('গম') || c.includes('ઘઉં') || c.includes('ਕਣਕ') || c.includes('ଗହମ') || c.includes('گندم')) return 'wheat';
  if (c.includes('potato') || c.includes('உருளை') || c.includes('आलू') || c.includes('బంగాళా') || c.includes('ಆಲೂ') || c.includes('আলু') || c.includes('બટાટા') || c.includes('ਆਲੂ') || c.includes('ଆଳୁ') || c.includes('আলু') || c.includes('آلو')) return 'potato';
  if (c.includes('chilli') || c.includes('chili') || c.includes('pepper') || c.includes('மிளகாய்') || c.includes('मिर्च') || c.includes('మిరప') || c.includes('ಮೆಣಸಿನ') || c.includes('লঙ্কা') || c.includes('મરચાં') || c.includes('ਮਿਰਚ') || c.includes('ଲଙ୍କା') || c.includes('জলকীয়া') || c.includes('مرچ')) return 'chilli';
  if (c.includes('maize') || c.includes('corn') || c.includes('மக்கா') || c.includes('मक्का') || c.includes('మొక్కజొన్న') || c.includes('ಮೆಕ್ಕೆಜೋಳ') || c.includes('ভুট্টা') || c.includes('મકાઈ') || c.includes('ਮੱਕੀ') || c.includes('ମକା') || c.includes('মাকৈ') || c.includes('مکئی')) return 'maize';
  if (c.includes('sugarcane') || c.includes('கரும்பு') || c.includes('गन्ना') || c.includes('చెరకు') || c.includes('ಕಬ್ಬು') || c.includes('আখ') || c.includes('શેરડી') || c.includes('ਗੰਨਾ') || c.includes('ଆଖୁ') || c.includes('কুঁহিয়াৰ') || c.includes('گنا')) return 'sugarcane';
  if (c.includes('onion') || c.includes('வெங்காயம்') || c.includes('प्याज़') || c.includes('ఉల్లి') || c.includes('ಈರುಳ್ಳಿ') || c.includes('পেঁয়াজ') || c.includes('ડુંગળી') || c.includes('ਪਿਆਜ਼') || c.includes('ପିଆଜ') || c.includes('পিয়াঁজ') || c.includes('پیاز')) return 'onion';
  if (c.includes('groundnut') || c.includes('peanut') || c.includes('நிலக்கடலை') || c.includes('मूंगफली') || c.includes('வேరుశనగ') || c.includes('ವೇರುಶನಗ') || c.includes('ಕಡಲೆಕಾಯಿ') || c.includes('বাদাম') || c.includes('મગફળી') || c.includes('ਮੂੰਗਫਲੀ') || c.includes('ଚିନାବାଦାମ') || c.includes('বাদাম') || c.includes('مونگ پھلی')) return 'groundnut';
  return c.replace(/[\s-]/g, '_');
}

/**
 * Returns localized crop display name
 */
export function getLocalizedCropName(cropOrId, lang = 'en') {
  const normKey = normalizeCropKey(cropOrId);
  const locale = ALL_LOCALES[lang] || ALL_LOCALES.en;
  if (locale.crops && locale.crops[normKey]) {
    return locale.crops[normKey];
  }
  return (ALL_LOCALES.en.crops && ALL_LOCALES.en.crops[normKey]) || cropOrId || 'Crop';
}

/**
 * Normalizes disease / condition string to canonical key
 */
export function normalizeDiseaseKey(rawCondition) {
  if (!rawCondition) return 'healthy';
  const d = String(rawCondition).toLowerCase().trim();

  if (d.includes('healthy') || d.includes('ஆரோக்கியமான') || d.includes('स्वस्थ') || d.includes('صحت مند')) return 'healthy';
  if (d.includes('septoria') || d.includes('செப்டோரியா') || d.includes('सेप्टोरिया') || d.includes('సెప్టోరియా') || d.includes('ಸೆಪ್ಟೋರಿಯಾ') || d.includes('സെപ്റ്റോറിയ') || d.includes('সেপ্টোরিয়া') || d.includes('સેપ્ટોરિયા') || d.includes('ਸੈਪਟੋਰੀਆ') || d.includes('ସେପ୍ଟୋରିଆ') || d.includes('চেপ্ট’ৰিয়া') || d.includes('سیپٹوریا')) return 'septoria_leaf_spot';
  if (d.includes('early blight') || d.includes('முன் கருகல்') || d.includes('अगेती झुलसा') || d.includes('ముందస్తు తెగులు') || d.includes('ಅಗೆತಿ ರೋಗ') || d.includes('മുൻകാല കരിച്ചിൽ') || d.includes('আগাম ধসা') || d.includes('અગાઉનો સુકારો') || d.includes('ਅਗੇਤੀ ਝੁਲਸਾ') || d.includes('ପୂର୍ବ ଝାଉଁଳା') || d.includes('আগতীয়া ধ্বসা') || d.includes('قبل از وقت جھلس')) return 'early_blight';
  if (d.includes('late blight') || d.includes('பின் கருகல்') || d.includes('पछेती झुलसा') || d.includes('తరువాతి తెగులు') || d.includes('ಹಿಂಗಾರು ರೋಗ') || d.includes('പിൻകാല കരിച്ചിൽ') || d.includes('নাবী ধসা') || d.includes('પાછળનો સુકારો') || d.includes('ਪਛੇਤੀ ਝੁਲਸਾ') || d.includes('ପରବର୍ତ୍ତୀ ଝାଉଁଳା') || d.includes('পচতীয়া ধ্বসা') || d.includes('دیر سے جھلس')) return 'late_blight';
  if (d.includes('blossom') || d.includes('அழுகல்') || d.includes('कैल्शियम की कमी') || d.includes('తుది కుళ్లు') || d.includes('ಹೂವಿನ ಕೊಳೆತ') || d.includes('പൂവ് അഴുകൽ') || d.includes('ফল পচা') || d.includes('ફળનો સડો') || d.includes('ਫੁੱਲ ਗਲਣਾ') || d.includes('ଫୁଲ ପଚା') || d.includes('ফুল পচা') || d.includes('پھول گلنا') || d.includes('end_rot') || d.includes('rot')) return 'blossom_end_rot';
  if (d.includes('blast') || d.includes('குலை நோய்') || d.includes('झोंका रोग') || d.includes('అగ్గి తెగులు') || d.includes('ಬೆಂಕಿ ರೋಗ') || d.includes('കുല രോഗം') || d.includes('ব্লাস্ট রোগ') || d.includes('ગેરુઓ') || d.includes('ਬਲਾਸਟ ਰੋਗ') || d.includes('ବ୍ଲାଷ୍ଟ ରୋଗ') || d.includes('ব্লাষ্ট ৰোগ') || d.includes('جھونکا')) return 'leaf_blast';
  if (d.includes('rust') || d.includes('துரு நோய்') || d.includes('गेरुआ रोग') || d.includes('తుప్పు తెగులు') || d.includes('ತುಕ್ಕು ರೋಗ') || d.includes('തുരുമ്പ് രോഗം') || d.includes('মরিচা রোগ') || d.includes('ગેરુ') || d.includes('ਕੁੰਗੀ ਰੋਗ') || d.includes('କଳଙ୍କି ରୋଗ') || d.includes('মৰিচা ৰোগ') || d.includes('رتوا')) return 'yellow_rust';
  if (d.includes('bollworm') || d.includes('காய்ப்புழு') || d.includes('गुलाबी सुंडी') || d.includes('గులాబీ రంగు పురుగు') || d.includes('ಗುಲಾಬಿ ಕಾಯಿಕೊರಕ') || d.includes('കായ്തുരപ്പൻ') || d.includes('গোলাপী শুঁয়োপোকা') || d.includes('ગુલાબી ઈયળ') || d.includes('ਗੁਲਾਬੀ ਸੁੰਡੀ') || d.includes('ଗୋଲାପୀ ପୋକ') || d.includes('গোলাপী পলু') || d.includes('گلابی سنڈی')) return 'pink_bollworm';
  if (d.includes('leaf curl') || d.includes('இலை சுருட்டை') || d.includes('पत्ती मरोड़') || d.includes('ఆకు ముడుత') || d.includes('ಎಲೆ ಸುರುಟು') || d.includes('ഇല ചുരുളൽ') || d.includes('পাতা কোঁকড়ানো') || d.includes('પાનનું કોકડાવું') || d.includes('ਪੱਤਾ ਮਰੋੜ') || d.includes('ପତ୍ର କୁଞ୍ଚନ') || d.includes('পাত কোঁচ খোৱা') || d.includes('پتا مروڑ')) return 'leaf_curl';
  if (d.includes('whitefly') || d.includes('வெள்ளை ஈ') || d.includes('सफ़ेद मक्खी') || d.includes('తెల్ల దోమ') || d.includes('ಬಿಳಿ ನೊಣ') || d.includes('വെള്ളീച്ച') || d.includes('সাদা মাছি') || d.includes('સફેદ માખી') || d.includes('ਚਿੱਟੀ ਮੱਖੀ') || d.includes('ଧଳା ମାଛି') || d.includes('বগা মাখি') || d.includes('سفید مکھی')) return 'whitefly_infestation';
  if (d.includes('bacterial blight') || d.includes('பாக்டீரியா கருகல்') || d.includes('जीवाणु झुलसा') || d.includes('బాక్టీరియల్ బ్లైట్') || d.includes('ಬ್ಯಾಕ್ಟೀರಿಯಾ ರೋಗ') || d.includes('ബാക്ടീരിയൽ കരിച്ചിൽ') || d.includes('ব্যাকটেরিয়াল ব্লাইট') || d.includes('જીવાણુ સુકારો') || d.includes('ਬੈਕਟੀਰੀਆ ਝੁਲਸਾ') || d.includes('ଜୀବାଣୁ ଝାଉଁଳା') || d.includes('বেক্টেৰিয়েল ধ্বসা') || d.includes('بیکٹیریل جھلس')) return 'bacterial_blight';
  if (d.includes('powdery') || d.includes('சாம்பல் நோய்') || d.includes('चूर्णिल आसिता') || d.includes('బూడిద తెగులు') || d.includes('ಬೂದಿ ರೋಗ') || d.includes('ചാര രോഗം') || d.includes('পাউডারি মিলডিউ') || d.includes('ભૂકી છારો') || d.includes('ਚੂਰਨਿਲ ਆਸਿਤਾ') || d.includes('ପାଉଡରୀ ମିଲଡିଉ') || d.includes('পাউদাৰী মিলডিউ') || d.includes('سفوفی پھپھوندی')) return 'powdery_mildew';
  if (d.includes('stem borer') || d.includes('தண்டு துளைப்பான்') || d.includes('तना छेदक') || d.includes('కాండం తొలుచు పురుగు') || d.includes('ಕಾಂಡ ಕೊರಕ') || d.includes('തണ്ടുതുരപ്പൻ') || d.includes('মাজরা পোকা') || d.includes('ગાભમારાની ઈયળ') || d.includes('ਤਣਾ ਛੇਦਕ') || d.includes('କାଣ୍ଡ ବିନ୍ଧା ପୋକ') || d.includes('কাণ্ড বিন্ধা পোক') || d.includes('تنا چھیدک')) return 'stem_borer';
  if (d.includes('aphid') || d.includes('அசுவினி') || d.includes('माहू') || d.includes('పేనుబంక') || d.includes('ಸೀಡೆ') || d.includes('അഫിഡ്') || d.includes('জাব পোকা') || d.includes('મોલો મશી') || d.includes('ਤੇਲਾ') || d.includes('ଜଉ ପୋକ') || d.includes('মোৱা পোক') || d.includes('ماہو')) return 'aphid_infestation';

  return d.replace(/[\s-]/g, '_');
}

/**
 * Returns localized disease / pest display name
 */
export function getLocalizedDiseaseName(diseaseOrId, lang = 'en') {
  const normKey = normalizeDiseaseKey(diseaseOrId);
  const locale = ALL_LOCALES[lang] || ALL_LOCALES.en;
  if (locale.diseases && locale.diseases[normKey]) {
    return locale.diseases[normKey];
  }
  return (ALL_LOCALES.en.diseases && ALL_LOCALES.en.diseases[normKey]) || diseaseOrId || 'Condition';
}

/**
 * Returns localized threat (alias for getLocalizedDiseaseName)
 */
export function getLocalizedThreat(threatOrId, lang = 'en') {
  return getLocalizedDiseaseName(threatOrId, lang);
}

/**
 * Returns localized growth stage
 */
export function getLocalizedGrowthStage(stage, lang = 'en') {
  if (!stage) return '';
  const s = String(stage).toLowerCase();
  const locale = ALL_LOCALES[lang] || ALL_LOCALES.en;

  if (s.includes('seedling') || s.includes('முளைப்பு') || s.includes('अंकुरण')) return locale.stages?.seedling || stage;
  if (s.includes('vegetative') || s.includes('தாவர வளர்ச்சி') || s.includes('वानस्पतिक')) return locale.stages?.vegetative || stage;
  if (s.includes('tillering') || s.includes('கிளைக்கும்') || s.includes('कल्ले फूटने')) return locale.stages?.tillering || stage;
  if (s.includes('flowering') || s.includes('பூக்கும்') || s.includes('फूल आने')) return locale.stages?.flowering || stage;
  if (s.includes('fruiting') || s.includes('காய் பிடிக்கும்') || s.includes('फल लगने')) return locale.stages?.fruiting || stage;
  if (s.includes('ripening') || s.includes('பழுக்கும்') || s.includes('पकने')) return locale.stages?.ripening || stage;
  if (s.includes('maturity') || s.includes('harvest') || s.includes('முதிர்வு') || s.includes('कटाई')) return locale.stages?.maturity || stage;

  return stage;
}

/**
 * Returns localized risk level string
 */
export function getLocalizedRiskLevel(level, lang = 'en') {
  if (!level) return '';
  const l = String(level).toUpperCase();
  const locale = ALL_LOCALES[lang] || ALL_LOCALES.en;

  if (l === 'CRITICAL' || l.includes('CRITICAL') || l.includes('மிக தீவிர') || l.includes('गंभीर')) return locale.risk?.critical || 'CRITICAL RISK';
  if (l === 'HIGH' || l.includes('HIGH') || l.includes('அதிக') || l.includes('उच्च')) return locale.risk?.high || 'HIGH RISK';
  if (l === 'MEDIUM' || l.includes('MEDIUM') || l.includes('MODERATE') || l.includes('நடுத்தர') || l.includes('मध्यम')) return locale.risk?.medium || 'MEDIUM RISK';
  return locale.risk?.low || 'LOW RISK';
}

/**
 * Returns localized severity string
 */
export function getLocalizedSeverity(severity, lang = 'en') {
  if (!severity) return '';
  const s = String(severity).toLowerCase();
  const locale = ALL_LOCALES[lang] || ALL_LOCALES.en;

  if (s.includes('healthy') || s.includes('ஆரோக்கியமான') || s.includes('स्वस्थ')) return locale.severity?.healthy || 'Healthy';
  if (s.includes('critical') || s.includes('severe') || s.includes('தீவிர')) return locale.severity?.critical || 'Critical / Severe';
  if (s.includes('high') || s.includes('அதிக')) return locale.severity?.high || 'High Severity';
  if (s.includes('moderate') || s.includes('medium') || s.includes('நடுத்தர')) return locale.severity?.moderate || 'Moderate Severity';
  return locale.severity?.low || 'Low Severity';
}

/**
 * Returns localized weather condition term
 */
export function getLocalizedWeatherTerm(condition, lang = 'en') {
  if (!condition) return '';
  const cond = String(condition).toLowerCase();
  const locale = ALL_LOCALES[lang] || ALL_LOCALES.en;

  if (cond.includes('humidity')) return locale.weather?.humidity || 'Humidity';
  if (cond.includes('temperature') || cond.includes('temp')) return locale.weather?.temp || 'Temperature';
  if (cond.includes('rainfall') || cond.includes('rain')) return locale.weather?.rainfall || 'Rainfall';
  if (cond.includes('wind')) return locale.weather?.wind || 'Wind Speed';
  if (cond.includes('pressure')) return locale.weather?.pressure || 'Pressure';

  const skyMap = {
    en: { 'partly cloudy': 'Partly Cloudy', 'mainly clear': 'Mainly Clear', 'cloudy': 'Cloudy', 'sunny': 'Sunny', 'clear': 'Clear Sky', 'rain': 'Rain Showers', 'showers': 'Showers', 'heavy rain': 'Heavy Rain', 'thunderstorm': 'Thunderstorm', 'overcast': 'Overcast', 'drizzle': 'Light Drizzle', 'mist': 'Fog / Mist' },
    ta: { 'partly cloudy': 'பகுதி மேகமூட்டம்', 'mainly clear': 'தெளிவான வானம்', 'cloudy': 'மேகமூட்டம்', 'sunny': 'வெயில்', 'clear': 'தெளிவான வானம்', 'rain': 'மழைப்பொழிவு', 'showers': 'மழைப்பொழிவு', 'heavy rain': 'கனமழை', 'thunderstorm': 'இடியுடன் கூடிய மழை', 'overcast': 'முழு மேகமூட்டம்', 'drizzle': 'தூறல்', 'mist': 'பனிமூட்டம்' },
    hi: { 'partly cloudy': 'आंशिक रूप से बादल', 'mainly clear': 'मुख्यतः साफ आसमान', 'cloudy': 'बादल छाए रहेंगे', 'sunny': 'धूप', 'clear': 'साफ आसमान', 'rain': 'बारिश', 'showers': 'बौछारें', 'heavy rain': 'भारी बारिश', 'thunderstorm': 'तूफान', 'overcast': 'घने बादल', 'drizzle': 'बूंदाबांदी', 'mist': 'धुंध' },
    te: { 'partly cloudy': 'పాక్షికంగా మేఘావృతం', 'mainly clear': 'నిర్మలమైన ఆకాశం', 'cloudy': 'మేఘావృతం', 'sunny': 'ఎండ', 'clear': 'నిర్మలమైన ఆకాశం', 'rain': 'వర్షం', 'showers': 'జల్లులు', 'heavy rain': 'భారీ వర్షం', 'thunderstorm': 'ఉరుములతో కూడిన వర్షం', 'overcast': 'పూర్తి మేఘావృతం', 'drizzle': 'చిరుజల్లులు', 'mist': 'మంచు' },
    kn: { 'partly cloudy': 'ಭಾಗಶಃ ಮೋಡ', 'mainly clear': 'ಸ್ವಚ್ಛ ಆಕಾಶ', 'cloudy': 'ಮೋಡ ಕವಿದ', 'sunny': 'ಬಿಸಿಲು', 'clear': 'ಸ್ವಚ್ಛ ಆಕಾಶ', 'rain': 'ಮಳೆ', 'showers': 'ಮಳೆ ಸುರಿತ', 'heavy rain': 'ಭಾರಿ ಮಳೆ', 'thunderstorm': 'ಗುಡುಗು ಸಹಿತ ಮಳೆ', 'overcast': 'ದಟ್ಟ ಮೋಡ', 'drizzle': 'ತುಂತುರು ಮಳೆ', 'mist': 'ಮಂಜು' },
    ml: { 'partly cloudy': 'ഭാഗികമായി മേഘാവൃതം', 'mainly clear': 'തെളിഞ്ഞ ആകാശം', 'cloudy': 'മേഘാവൃതം', 'sunny': 'വെയിൽ', 'clear': 'തെളിഞ്ഞ ആകാശം', 'rain': 'മഴ', 'showers': 'മഴത്തുള്ളികൾ', 'heavy rain': 'ശക്തമായ മഴ', 'thunderstorm': 'ഇടിമിന്നലോട് കൂടിയ മഴ', 'overcast': 'മൂടിക്കെട്ടിയ ആകാശം', 'drizzle': 'ചാറ്റൽമഴ', 'mist': 'മഞ്ഞ്' },
    mr: { 'partly cloudy': 'अंशतः ढगाळ', 'mainly clear': 'निरभ्र आकाश', 'cloudy': 'ढगाळ', 'sunny': 'ऊन', 'clear': 'निरभ्र आकाश', 'rain': 'पाऊस', 'showers': 'हलक्या सरी', 'heavy rain': 'मुसळधार पाऊस', 'thunderstorm': 'वादळी पाऊस', 'overcast': 'दाट ढगाळ', 'drizzle': 'रिमझिम पाऊस', 'mist': 'धुके' },
    bn: { 'partly cloudy': 'আংশিক মেঘলা', 'mainly clear': 'পরিষ্কার আকাশ', 'cloudy': 'মেঘলা', 'sunny': 'রৌদ্রোজ্জ্বল', 'clear': 'পরিষ্কার আকাশ', 'rain': 'বৃষ্টি', 'showers': 'বৃষ্টির ধারা', 'heavy rain': 'ভারী বৃষ্টি', 'thunderstorm': 'বজ্রবিদ্যুৎসহ ঝড়', 'overcast': 'ঘন মেঘলা', 'drizzle': 'গুঁড়ি গুঁড়ি বৃষ্টি', 'mist': 'কুয়াশা' },
    gu: { 'partly cloudy': 'આંશિક વાદળછાયું', 'mainly clear': 'ચોખ્ખું આકાશ', 'cloudy': 'વાદળછાયું', 'sunny': 'તડકો', 'clear': 'ચોખ્ખું આકાશ', 'rain': 'વરસાદ', 'showers': 'ઝાપટાં', 'heavy rain': 'ભારે વરસાદ', 'thunderstorm': 'ગાજવીજ સાથે વરસાદ', 'overcast': 'ઘેરાયેલું વાદળછાયું', 'drizzle': 'ઝરમર વરસાદ', 'mist': 'ઝાકળ' },
    pa: { 'partly cloudy': 'ਅੰਸ਼ਕ ਤੌਰ ਤੇ ਬੱਦਲਵਾਈ', 'mainly clear': 'ਸਾਫ਼ ਅਸਮਾਨ', 'cloudy': 'ਬੱਦਲਵਾਈ', 'sunny': 'ਧੁੱਪ', 'clear': 'ਸਾਫ਼ ਅਸਮਾਨ', 'rain': 'ਮੀਂਹ', 'showers': 'ਫੁਹਾਰਾਂ', 'heavy rain': 'ਭਾਰੀ ਮੀਂਹ', 'thunderstorm': 'ਗਰਜ ਨਾਲ ਮੀਂਹ', 'overcast': 'ਘਣੇ ਬੱਦਲ', 'drizzle': 'ਫੁਹਾਰ', 'mist': 'ਧੁੰਦ' },
    or: { 'partly cloudy': 'ଆଂଶିକ ମେଘୁଆ', 'mainly clear': 'ନିର୍ମଳ ଆକାଶ', 'cloudy': 'ମେଘୁଆ', 'sunny': 'ଖରା', 'clear': 'ନିର୍ମଳ ଆକାଶ', 'rain': 'ବର୍ଷା', 'showers': 'ବର୍ଷା ଝଲକ', 'heavy rain': 'ଭାରୀ ବର୍ଷା', 'thunderstorm': 'ଘଡ଼ଘଡ଼ି ସହ ବର୍ଷା', 'overcast': 'ଘନ ମେଘୁଆ', 'drizzle': 'ଝିପିଝିପି ବର୍ଷା', 'mist': 'କୁହୁଡ଼ି' },
    as: { 'partly cloudy': 'আংশিক ডাৱৰীয়া', 'mainly clear': 'পৰিষ্কাৰ আকাশ', 'cloudy': 'ডাৱৰীয়া', 'sunny': "ৰ'দালি", 'clear': 'পৰিষ্কাৰ আকাশ', 'rain': 'বৰষুণ', 'showers': 'বৰষুণৰ জাক', 'heavy rain': 'প্ৰবল বৰষুণ', 'thunderstorm': 'ধুমুহা-বৰষুণ', 'overcast': 'ঘন ডাৱৰীয়া', 'drizzle': 'টোপাল-টোপাল বৰষুণ', 'mist': 'কুঁৱলী' },
    ur: { 'partly cloudy': 'جزوی طور پر ابر آلود', 'mainly clear': 'صاف آسمان', 'cloudy': 'ابر آلود', 'sunny': 'دھوپ', 'clear': 'صاف آسمان', 'rain': 'بارش', 'showers': 'پھوار', 'heavy rain': 'شدید بارش', 'thunderstorm': 'گرج چمک کے ساتھ بارش', 'overcast': 'گھنے بادل', 'drizzle': 'بوندا باندی', 'mist': 'دھند' }
  };

  const currentSky = skyMap[lang] || skyMap.en;
  if (currentSky) {
    if (cond.includes('thunder')) return currentSky['thunderstorm'];
    if (cond.includes('heavy rain')) return currentSky['heavy rain'];
    if (cond.includes('drizzle')) return currentSky['drizzle'];
    if (cond.includes('shower')) return currentSky['showers'];
    if (cond.includes('rain')) return currentSky['rain'];
    if (cond.includes('overcast')) return currentSky['overcast'];
    if (cond.includes('partly cloudy') || cond.includes('partly')) return currentSky['partly cloudy'];
    if (cond.includes('mainly clear')) return currentSky['mainly clear'];
    if (cond.includes('cloud')) return currentSky['cloudy'];
    if (cond.includes('sunny')) return currentSky['sunny'];
    if (cond.includes('clear')) return currentSky['clear'];
    if (cond.includes('mist') || cond.includes('fog')) return currentSky['mist'];
  }

  return condition;
}

/**
 * Returns localized weather condition (alias for getLocalizedWeatherTerm)
 */
export function getLocalizedWeatherCondition(conditionId, lang = 'en') {
  return getLocalizedWeatherTerm(conditionId, lang);
}

/**
 * Returns localized day name for forecast
 */
export function getLocalizedDayName(dayStr, lang = 'en') {
  if (!dayStr) return '';
  const d = String(dayStr).toLowerCase().trim();
  const locale = ALL_LOCALES[lang] || ALL_LOCALES.en;
  if (!locale.days) return dayStr;

  if (d.includes('today') || d.includes('இன்று') || d.includes('आज') || d.includes('நேடு') || d.includes('ಇಂದು') || d.includes('ഇന്ന്') || d.includes('આજે') || d.includes('ਅੱਜ') || d.includes('ଆଜି') || d.includes('আজি') || d.includes('آج')) return locale.days.today || dayStr;
  if (d.includes('tomorrow') || d.includes('நாளை') || d.includes('कल') || d.includes('రేపు') || d.includes('ನಾಳೆ') || d.includes('നാളെ') || d.includes('આવતીકાલે') || d.includes('ਕੱਲ੍ਹ') || d.includes('ଆସନ୍ତାକାଲି') || d.includes('কাইলৈ') || d.includes('کل')) return locale.days.tomorrow || dayStr;
  if (d.includes('mon') || d.includes('सोम') || d.includes('திங்கள்') || d.includes('సోమ') || d.includes('ಸೋಮ') || d.includes('തിങ്കൾ') || d.includes('پیر')) return locale.days.mon || dayStr;
  if (d.includes('tue') || d.includes('मंगल') || d.includes('செவ்வாய்') || d.includes('మంగళ') || d.includes('ಮಂಗಳ') || d.includes('ചൊവ്വ') || d.includes('منگل')) return locale.days.tue || dayStr;
  if (d.includes('wed') || d.includes('बुध') || d.includes('புதன்') || d.includes('బుధ') || d.includes('ಬುಧ') || d.includes('ബുധൻ') || d.includes('بدھ')) return locale.days.wed || dayStr;
  if (d.includes('thu') || d.includes('गुरु') || d.includes('வியாழன்') || d.includes('గురు') || d.includes('ಗುರು') || d.includes('വ്യാഴം') || d.includes('جمعرات')) return locale.days.thu || dayStr;
  if (d.includes('fri') || d.includes('शुक्र') || d.includes('வெள்ளி') || d.includes('శుక్ర') || d.includes('ಶುಕ್ರ') || d.includes('വെള്ളി') || d.includes('جمعہ')) return locale.days.fri || dayStr;
  if (d.includes('sat') || d.includes('शनि') || d.includes('சனி') || d.includes('శని') || d.includes('ಶನಿ') || d.includes('ശനി') || d.includes('ہفتہ')) return locale.days.sat || dayStr;
  if (d.includes('sun') || d.includes('रवि') || d.includes('ஞாயிறு') || d.includes('ఆది') || d.includes('ಭಾನು') || d.includes('ഞായർ') || d.includes('اتوار')) return locale.days.sun || dayStr;
  
  return dayStr;
}

/**
 * Generates fully localized alert title
 */
export function getLocalizedAlertTitle(alert, lang = 'en') {
  if (!alert) return '';
  const cropName = getLocalizedCropName(alert.cropId || alert.cropName || alert.crop, lang);
  const diseaseName = getLocalizedDiseaseName(alert.threatName || alert.disease || alert.condition || alert.threat, lang);
  const locale = ALL_LOCALES[lang] || ALL_LOCALES.en;

  const isCritical = String(alert.severity || alert.riskLevel || '').toUpperCase() === 'CRITICAL';
  const template = isCritical ? locale.alerts?.criticalAlertTitle : locale.alerts?.highestRiskTitle;

  if (!template) {
    return `⚠️ ${isCritical ? 'CRITICAL' : 'HIGH'} ${cropName} (${diseaseName})`;
  }

  return template
    .replace('{crop}', cropName)
    .replace('{disease}', diseaseName);
}

/**
 * Generates fully localized alert environmental description
 */
export function getLocalizedAlertDescription(alert, lang = 'en') {
  if (!alert) return '';
  const locale = ALL_LOCALES[lang] || ALL_LOCALES.en;

  const cropName = getLocalizedCropName(alert.cropId || alert.cropName || alert.crop, lang);
  const diseaseName = getLocalizedDiseaseName(alert.threatName || alert.disease || alert.condition || alert.threat, lang);
  const growthStage = getLocalizedGrowthStage(alert.growthStage || 'Vegetative', lang);
  const risk = getLocalizedRiskLevel(alert.severity || alert.riskLevel || 'HIGH', lang);
  const location = alert.location?.formatted || alert.location?.district || alert.district || (locale.location ? locale.location.detected : 'Live Area');
  const temp = alert.temperature ? `${alert.temperature}°C` : '32°C';
  const humidity = alert.humidity ? `${alert.humidity}%` : '80%';
  const riskScore = alert.riskScore || alert.riskPercentage || '78';

  const template = locale.alerts?.environmentalRiskDescription;
  if (!template) {
    return `${location} (${temp}, ${humidity}): ${cropName} - ${growthStage} (${risk} - ${riskScore}%) ${diseaseName}`;
  }

  return template
    .replace('{location}', location)
    .replace('{temperature}', temp)
    .replace('{humidity}', humidity)
    .replace('{crop}', cropName)
    .replace('{growthStage}', growthStage)
    .replace('{risk}', risk)
    .replace('{riskPercentage}', String(riskScore))
    .replace('{disease}', diseaseName);
}

/**
 * Generates environmental why explanation
 */
export function getLocalizedEnvironmentalWhy(whyText, params = {}, lang = 'en') {
  return getLocalizedAlertDescription(params, lang);
}

/**
 * Localizes an IPM Action or Recommendation
 */
export function getLocalizedAction(actionStr, lang = 'en') {
  if (!actionStr) return '';
  const a = String(actionStr).toLowerCase();
  const locale = ALL_LOCALES[lang] || ALL_LOCALES.en;

  if (a.includes('prune') || a.includes('infected leaves') || a.includes('கத்தரி') || a.includes('काटकर')) {
    return locale.ipmActions?.prune_infected_leaves || actionStr;
  }
  if (a.includes('copper') || a.includes('fungicide') || a.includes('பூஞ்சைக் கொல்லி') || a.includes('फफूंदनाशक') || a.includes('bio-fungicide')) {
    return locale.ipmActions?.apply_copper_oxychloride || actionStr;
  }
  if (a.includes('drip') || a.includes('overhead') || a.includes('சொட்டு நீர்') || a.includes('ड्रिप')) {
    return locale.ipmActions?.switch_drip_irrigation || actionStr;
  }
  if (a.includes('nitrogen') || a.includes('urea') || a.includes('தழைச்சத்து') || a.includes('यूरिया')) {
    return locale.ipmActions?.withhold_excess_nitrogen || actionStr;
  }
  if (a.includes('water depth') || a.includes('thin water') || a.includes('பாசனம்') || a.includes('पानी')) {
    return locale.ipmActions?.thin_water_layer || actionStr;
  }
  if (a.includes('trap') || a.includes('pheromone') || a.includes('பொறி') || a.includes('प्रपंच')) {
    return locale.ipmActions?.install_pheromone_traps || actionStr;
  }
  if (a.includes('calcium') || a.includes('foliar') || a.includes('கால்சியம்') || a.includes('कैल्शियम')) {
    return locale.ipmActions?.calcium_nitrate_spray || actionStr;
  }
  if (a.includes('handpick') || a.includes('கையால்') || a.includes('हाथ से')) {
    return locale.ipmActions?.handpick_infested || actionStr;
  }
  if (a.includes('inspect') || a.includes('scout') || a.includes('கண்காணிப்பு') || a.includes('निरीक्षण')) {
    return locale.ipmActions?.inspect_lower_leaves || actionStr;
  }
  if (a.includes('re-inspect') || a.includes('48h') || a.includes('48 மணி')) {
    return locale.ipmActions?.reinspect_48h || actionStr;
  }

  // Multilingual dynamic dictionary for biological bio-insecticides
  const bioMap = {
    en: 'Spray Beauveria bassiana or Verticillium lecanii bio-insecticide (5g/L) during evening hours.',
    ta: 'மாலை வேளையில் பியூவேரியா பாசியானா அல்லது வெர்டிசிலியம் லெக்கானி உயிரியல் பூச்சிக்கொல்லியை (5 கிராம்/லிட்டர்) தெளிக்கவும்.',
    hi: 'शाम के समय ब्यूवेरिया बासियाना या वर्टिसिलियम लेकानी जैव कीटनाशक (5 ग्राम/लीटर) का छिड़काव करें।',
    te: 'సాయంత్రం వేళల్లో బ్యూవేరియా బాసియానా లేదా వెర్టిసిలియం లెకానీ బయో-పురుగుమందు (5 గ్రా/లీ) పిచికారీ చేయండి.',
    kn: 'ಸಂಜೆ ವೇಳೆ ಬ್ಯೂವೇರಿಯಾ ಬಸ್ಸಿಯಾನಾ ಅಥವಾ ವರ್ಟಿಸಿಲಿಯಂ ಲೆಕಾನಿ ಜೈವಿಕ ಕೀಟನಾಶಕವನ್ನು (5 ಗ್ರಾಂ/ಲೀ) ಸಿಂಪಡಿಸಿ.',
    ml: 'വൈകുന്നേരങ്ങളിൽ ബ്യൂവേറിയ ബാസിയാന അല്ലെങ്കിൽ വെർട്ടിസിലിയം ലെക്കാനി ജൈവ കീടനാശിനി (5 ഗ്രാം/ലിറ്റർ) തളിക്കുക.',
    mr: 'संध्याकाळच्या वेळी ब्युव्हेरिया बॅसियाना किंवा व्हर्टिसिलियम लेकानी जैविक कीटकनाशक (5 ग्रॅम/ली) फवारा.',
    bn: 'সন্ধ্যার সময় বিউভেরিয়া ব্যাসিয়ানা বা ভার্টিসিলিয়াম লেকানি জৈব কীটনাশক (৫ গ্রাম/লিটার) স্প্রে করুন।',
    gu: 'સાંજના સમયે બ્યુવેરિયા બાસિયાના અથવા વર્ટીસિલિયમ લેકાની જૈવિક કીટનાશક (5 ગ્રામ/લીટર) છંટકાવ કરો.',
    pa: 'ਸ਼ਾਮ ਦੇ ਸਮੇਂ ਬਿਊਵੇਰੀਆ ਬੈਸੀਆਨਾ ਜਾਂ ਵਰਟੀਸਿਲੀਅਮ ਲੈਕਾਨੀ ਜੈਵਿਕ ਕੀਟਨਾਸ਼ਕ (5 ਗ੍ਰਾਮ/ਲਿਟਰ) ਦਾ ਛਿੜਕਾਅ ਕਰੋ।',
    or: 'ସନ୍ଧ୍ୟା ସମୟରେ ବ୍ୟୁଭେରିଆ ବାସିଆନା କିମ୍ବା ଭର୍ଟିସିଲିୟମ ଲେକାନି ଜୈବ କୀଟନାଶକ (5 ଗ୍ରାମ/ଲିଟର) ସ୍ପ୍ରେ କରନ୍ତୁ।',
    as: 'গধূলিৰ সময়ত বিউভেৰিয়া বাচিয়ানা বা ভাৰ্টিচিলিয়াম লেকানি জৈৱ কীটনাশক (৫ গ্ৰাম/লিটাৰ) ছটিয়াব।',
    ur: 'شام کے وقت بیوویریا باسیانا یا ورٹیسیلیم لیکانی نامیاتی کیڑے مار دوا (5 گرام/لیٹر) کا چھڑکاؤ کریں۔'
  };

  if (a.includes('beauveria') || a.includes('verticillium') || a.includes('bio-insecticide')) {
    return bioMap[lang] || bioMap.en;
  }

  return actionStr;
}

/**
 * Returns localized alert action (alias for getLocalizedAction)
 */
export function getLocalizedAlertAction(alertOrAction, lang = 'en') {
  if (!alertOrAction) return '';
  if (typeof alertOrAction === 'string') return getLocalizedAction(alertOrAction, lang);
  const action = alertOrAction.recommendedAction || alertOrAction.action || alertOrAction.recommendedActions?.[0];
  return getLocalizedAction(action, lang);
}

/**
 * Localizes a Prevention Checklist item
 */
export function getLocalizedPrevention(itemStr, lang = 'en', index = 0) {
  if (!itemStr) return '';
  const p = String(itemStr).toLowerCase();
  const locale = ALL_LOCALES[lang] || ALL_LOCALES.en;

  if (p.includes('regularly') || p.includes('undersides') || p.includes('கீழ் இலைகள்') || p.includes('नियमित')) {
    return locale.prevention?.item1 || itemStr;
  }
  if (p.includes('safely away') || p.includes('severely') || p.includes('அகற்றி') || p.includes('नष्ट')) {
    return locale.prevention?.item2 || itemStr;
  }
  if (p.includes('spacing') || p.includes('airflow') || p.includes('இடைவெளி') || p.includes('दूरी')) {
    return locale.prevention?.item3 || itemStr;
  }
  if (p.includes('wetting') || p.includes('drip') || p.includes('சொட்டு நீர்') || p.includes('सिंचाई')) {
    return locale.prevention?.item4 || itemStr;
  }
  if (p.includes('rain') || p.includes('dew') || p.includes('ஈரப்பதம்') || p.includes('ओस')) {
    return locale.prevention?.item5 || itemStr;
  }
  if (p.includes('mulch') || p.includes('splashback') || p.includes('மூடாக்கு') || p.includes('मल्चिंग')) {
    return locale.prevention?.item6 || itemStr;
  }
  if (p.includes('rotate') || p.includes('rotation') || p.includes('பயிர் சுழற்சி') || p.includes('फसल चक्र')) {
    return locale.prevention?.item7 || itemStr;
  }

  // Fallback by index if available
  const itemKey = `item${(index % 7) + 1}`;
  if (locale.prevention && locale.prevention[itemKey]) {
    return locale.prevention[itemKey];
  }

  return itemStr;
}

/**
 * Localizes Symptom Arrays
 */
export function localizeSymptoms(symptoms, lang = 'en') {
  if (!Array.isArray(symptoms)) return [];
  const sMap = {
    en: { spot: 'Circular brown/grey concentric lesions on lower leaves', chlorosis: 'Yellow halo margin and progressive leaf chlorosis', defoliation: 'Premature defoliation starting from lower canopy' },
    ta: { spot: 'கீழ் இலைகளில் வட்ட வடிவ பழுப்பு/சாம்பல் நிற புள்ளிகள்', chlorosis: 'மஞ்சள் நிற வளையங்கள் மற்றும் இலை வெளிர்தல்', defoliation: 'கீழ் இலைகளிலிருந்து முன்கூட்டியே இலை உதிர்தல்' },
    hi: { spot: 'निचली पत्तियों पर गोल भूरे/धूसर संकेंद్రీય धब्बे', chlorosis: 'पत्तियों के किनारों पर पीला घेरा और क्लोरोसिस', defoliation: 'निचले भाग से पत्तियों का समय पूर्व झड़ना' },
    te: { spot: 'దిగువ ఆకులపై వృత్తాకార గోధుమ రంగు మచ్చలు', chlorosis: 'పసుపు రంగు వలయాలు మరియు ఆకులు పసుపు రంగులోకి మారడం', defoliation: 'దిగువ ఆకులు ముందుగానే రాలిపోవడం' },
    kn: { spot: 'ಕೆಳಗಿನ ಎಲೆಗಳ ಮೇಲೆ ದುಂಡಗಿನ ಕಂದು/ಬೂದು ಕಲೆಗಳು', chlorosis: 'ಹಳದಿ ಅಂಚುಗಳು ಮತ್ತು ಎಲೆ ಹಳದಿಯಾಗುವಿಕೆ', defoliation: 'ಕೆಳಗಿನ ಎಲೆಗಳು ಅಕಾಲಿಕವಾಗಿ ಉದುರುವುದು' },
    ml: { spot: 'താഴത്തെ ഇലകളിൽ വൃത്താകൃതിയിലുള്ള തവിട്ട് പാടുകൾ', chlorosis: 'മഞ്ഞ വളയങ്ങളും ഇലകൾ മഞ്ഞനിറമാകുന്നതും', defoliation: 'താഴത്തെ ഇലകൾ നേരത്തെ കൊഴിയുന്നത്' },
    mr: { spot: 'खालच्या पानांवर गोलाकार तपकिरी/राखाडी डाग', chlorosis: 'पिवळी कडा आणि पानांचा पिवळेपणा', defoliation: 'खालून पाने अकाली गळणे' },
    bn: { spot: 'নীচের পাতায় বৃত্তাকার বাদামী/ধূসর দাগ', chlorosis: 'হলুদ রঙের বলয় এবং পাতা হলুদ হয়ে যাওয়া', defoliation: 'নীচের দিক থেকে পাতার অকাল ঝরে পড়া' },
    gu: { spot: 'નીચલા પાંદડા પર ગોળાકાર કથ્થઈ/રાખોડી ડાઘ', chlorosis: 'પીળી કિનારી અને પાન પીળા પડવા', defoliation: 'નીચેથી પાંદડા વહેલા ખરી પડવા' },
    pa: { spot: 'ਹੇਠਲੇ ਪੱਤਿਆਂ ਤੇ ਗੋਲ ਭੂਰੇ/ਸਲੇਟੀ ਧੱਬੇ', chlorosis: 'ਪੀਲਾ ਘੇਰਾ ਅਤੇ ਪੱਤੇ ਪੀਲੇ ਪੈਣਾ', defoliation: 'ਹੇਠਲੇ ਪੱਤਿਆਂ ਦਾ ਸਮੇਂ ਤੋਂ ਪਹਿਲਾਂ ਝੜਨਾ' },
    or: { spot: 'ତଳ ପତ୍ରରେ ଗୋଲାକାର ବାଦାମୀ/ଧୂସର ଦାଗ', chlorosis: 'ହଳଦିଆ ଘେରା ଏବଂ ପତ୍ର ହଳଦିଆ ପଡ଼ିବା', defoliation: 'ତଳୁ ପତ୍ର ସମୟ ପୂର୍ବରୁ ଝଡ଼ିବା' },
    as: { spot: 'তলৰ পাতত বৃত্তাকাৰ বাদামী/ধূসৰ দাগ', chlorosis: 'হালধীয়া আঙঠি আৰু পাত হালধীয়া পৰা', defoliation: 'তলৰ ফালৰ পৰা পাত সৰি পৰা' },
    ur: { spot: 'نچلے پتوں پر گول بھورے/سرمئی دھبے', chlorosis: 'پتوں کے گرد پیلا ہالہ اور زردی مائل ہونا', defoliation: 'نچلے پتوں کا قبل از وقت جھڑنا' }
  };

  const cur = sMap[lang] || sMap.en;
  return symptoms.map(s => {
    const str = String(s).toLowerCase();
    if (str.includes('spot') || str.includes('lesion') || str.includes('grey') || str.includes('brown')) return cur.spot;
    if (str.includes('yellow') || str.includes('halo') || str.includes('chlorosis')) return cur.chlorosis;
    if (str.includes('defoliation') || str.includes('lower leaves') || str.includes('drop')) return cur.defoliation;
    return s;
  });
}

/**
 * Localizes Cause Arrays
 */
export function localizeCauses(causes, lang = 'en') {
  if (!Array.isArray(causes)) return [];
  const cMap = {
    en: { wetness: 'Persistent leaf wetness and high relative humidity (>80%)', temp: 'Moderate thermal conditions (20-28°C) accelerating fungal spore growth', splash: 'Rain droplet splashback dispersing overwintering soil inoculums' },
    ta: { wetness: 'தொடர்ச்சியான இலை ஈரப்பதம் மற்றும் அதிக ஈரப்பதம் (>80%)', temp: 'பூஞ்சை வித்து வளர்ச்சியை துரிதப்படுத்தும் வெப்பநிலை (20-28°C)', splash: 'மழை நீர் தெறிப்பு மூலம் மண்ணிலிருந்து பரவும் பூஞ்சை வித்துக்கள்' },
    hi: { wetness: 'पत्तियों पर लगातार नमी और उच्च सापेक्ष आर्द्रता (>80%)', temp: 'फफूंद बीजाणु वृद्धि को तेज करने वाला मध्यम तापमान (20-28°C)', splash: 'बारिश के पानी के छींटों से मिट्टी के बीजाणुओं का फैलाव' },
    te: { wetness: 'ఆకులపై నిరంతర తేమ మరియు అధిక సాపేక్ష ఆర్ద్రత (>80%)', temp: 'శిలీంధ్ర బీజాంశ పెరుగుదలను వేగవంతం చేసే ఉష్ణోగ్రత (20-28°C)', splash: 'వర్షపు నీటి చినుకుల ద్వారా నేల నుండి వ్యాపించే శిలీంధ్రాలు' },
    kn: { wetness: 'ಎಲೆಗಳ ಮೇಲೆ ನಿರಂತರ ತೇವಾಂಶ ಮತ್ತು ಹೆಚ್ಚಿನ ಆರ್ದ್ರತೆ (>80%)', temp: 'ಶಿಲೀಂಧ್ರ ಬೀಜಕಗಳ ಬೆಳವಣಿಗೆಯನ್ನು ವೇಗಗೊಳಿಸುವ ತಾಪಮಾನ (20-28°C)', splash: 'ಮಳೆಯ ನೀರಿನ ಸಿಂಪರಣೆಯಿಂದ ಮಣ್ಣಿನಿಂದ ಹರಡುವ ರೋಗಾಣುಗಳು' },
    ml: { wetness: 'ഇലകളിൽ തുടർച്ചയായ ഈർപ്പവും ഉയർന്ന ആർദ്രതയും (>80%)', temp: 'ഫംഗസ് ബീജങ്ങളുടെ വളർച്ച വേഗത്തിലാക്കുന്ന താപനില (20-28°C)', splash: 'മഴവെള്ളം തെറിക്കുന്നതിലൂടെ മണ്ണിൽ നിന്ന് പടരുന്ന രോഗാണുക്കൾ' },
    mr: { wetness: 'पानांवर सतत ओलावा आणि उच्च हवेतील आर्द्रता (>80%)', temp: 'बुरशीजन्य बीजाणूंची वाढ वेगाने करणारे तापमान (20-28°C)', splash: 'पावसाच्या पाण्याचे थेंब उडाल्यामुळे मातीतील बुरशीचा प्रसार' },
    bn: { wetness: 'পাতায় অবিরাম আর্দ্রতা এবং উচ্চ আপেক্ষিক আর্দ্রতা (>৮০%)', temp: 'ছত্রাকের স্পোর বৃদ্ধি ত্বরান্বিত করার মতো তাপমাত্রা (২০-২৮°সে)', splash: 'বৃষ্টির জলের ছিটে পড়ে মাটি থেকে ছত্রাকের বিস্তার' },
    gu: { wetness: 'પાંદડા પર સતત ભેજ અને ઊંચી સાપેક્ષ ભેજનું પ્રમાણ (>80%)', temp: 'ફૂગના બીજક વૃદ્ધિને ઝડપી બનાવતું તાપમાન (20-28°C)', splash: 'વરસાદના પાણીના છાંટાથી જમીનમાંથી ફૂગનો ફેલાવો' },
    pa: { wetness: 'ਪੱਤਿਆਂ ਤੇ ਲਗਾਤਾਰ ਸਿੱਲ੍ਹ ਅਤੇ ਉੱਚ ਨਮੀ (>80%)', temp: 'ਉੱਲੀ ਦੇ ਬੀਜਾਣੂਆਂ ਦੇ ਵਾਧੇ ਨੂੰ ਤੇਜ਼ ਕਰਨ ਵਾਲਾ ਤਾਪਮਾਨ (20-28°C)', splash: 'ਮੀਂਹ ਦੇ ਪਾਣੀ ਦੇ ਛਿੱਟਿਆਂ ਨਾਲ ਮਿੱਟੀ ਵਿੱਚੋਂ ਉੱਲੀ ਦਾ ਫੈਲਾਅ' },
    or: { wetness: 'ପତ୍ରରେ ଲଗାତାର ଆର୍ଦ୍ରତା ଏବଂ ଉଚ୍ଚ ଆପେକ୍ଷିକ ଆର୍ଦ୍ରତା (>80%)', temp: 'କବକ ବିଜାଣୁ ବୃଦ୍ଧିକୁ ତ୍ୱରାନ୍ୱିତ କରୁଥିବା ତାପମାତ୍ରା (20-28°C)', splash: 'ବର୍ଷା ପାଣି ଛିଟିକି ମାଟିରୁ କବକ ବିସ୍ତାର ହେବା' },
    as: { wetness: 'পাতত অহৰহ সেমেকা ভাব আৰু উচ্চ আপেক্ষিক আৰ্দ্ৰতা (>৮০%)', temp: 'ভেঁকুৰৰ বীজাণু বৃদ্ধি ত্বৰান্বিত কৰা মধ্যমীয়া উষ্ণতা (২০-২৮°চে)', splash: 'বৰষুণৰ পানী ছিটিকাৰ দ্বাৰা মাটিৰ পৰা ভেঁকুৰৰ সংক্ৰমণ' },
    ur: { wetness: 'پتوں پر مسلسل نمی اور زیادہ ہوا میں نمی (>80%)', temp: 'پھپھوندی کے بیضوں کی نشوونما کو تیز کرنے والا درجہ حرارت (20-28°C)', splash: 'بارش کے چھینٹوں سے مٹی سے پھیلنے والے پھپھوندی کے جراثیم' }
  };

  const cur = cMap[lang] || cMap.en;
  return causes.map(c => {
    const str = String(c).toLowerCase();
    if (str.includes('humidity') || str.includes('wetness') || str.includes('moisture')) return cur.wetness;
    if (str.includes('temp') || str.includes('thermal') || str.includes('20') || str.includes('28')) return cur.temp;
    if (str.includes('splash') || str.includes('rain') || str.includes('soil')) return cur.splash;
    return c;
  });
}

/**
 * Localizes Explainable AI Factor Names & details
 */
export function localizeFactor(factorInput, lang = 'en') {
  if (!factorInput) return { factor: '', detail: '', impact: 'LOW', weight: '' };

  const fObj = typeof factorInput === 'object' ? factorInput : { factor: String(factorInput), detail: '', impact: 'HIGH', weight: '30%' };
  const str = (fObj.factor + ' ' + (fObj.detail || '')).toLowerCase();

  const factorMap = {
    en: {
      humidity: { name: 'High Relative Humidity', detail: 'Foliar moisture duration exceeds fungal spore germination threshold.' },
      temp: { name: 'Optimal Microclimate Temperature', detail: 'Thermal conditions remain optimal for pathogen incubation.' },
      rain: { name: 'Rainfall Splash & Soil Inoculum', detail: 'Recent precipitation accelerates rain-splash spore dispersal from soil.' },
      stage: { name: 'Phenology Growth Stage Vulnerability', detail: 'Crop canopy foliage is highly susceptible during active vegetative/flowering phase.' }
    },
    ta: {
      humidity: { name: 'அதிக ஈரப்பதம்', detail: 'இலை ஈரப்பதம் பூஞ்சை வித்துக்கள் முளைப்பதற்கான வரம்பை விட அதிகமாக உள்ளது.' },
      temp: { name: 'சாதகமான மைக்ரோக்ளைமேட் வெப்பநிலை', detail: 'வெப்பநிலை நோய் கிருமி பரவுவதற்கு உகந்ததாக உள்ளது.' },
      rain: { name: 'மழை நீர் தெறிப்பு மற்றும் மண் வித்துக்கள்', detail: 'மழைப்பொழிவு மண்ணிலிருந்து பூஞ்சை வித்துக்களை எளிதாக பரப்புகிறது.' },
      stage: { name: 'பயிர் வளர்ச்சி நிலை உணர்திறன்', detail: 'பூக்கும்/தாவர வளர்ச்சி நிலையில் பயிர்கள் நோய் தாக்குதலுக்கு அதிகம் உள்ளாகின்றன.' }
    },
    hi: {
      humidity: { name: 'उच्च सापेक्ष आर्द्रता', detail: 'पत्तियों पर नमी कवक बीजाणु अंकुरण की सीमा से अधिक है।' },
      temp: { name: 'अनुकूल सूक्ष्म जलवायु तापमान', detail: 'तापमान रोगज़नक़ों के पनपने के लिए पूरी तरह अनुकूल है।' },
      rain: { name: 'वर्षा जल छींटे और मिट्टी के बीजाणु', detail: 'हाल की बारिश मिट्टी से बीजाणुओं के प्रसार को तेज करती है।' },
      stage: { name: 'फसल वृद्धि चरण संवेदनशीलता', detail: 'फूल आने/वानस्पतिक अवस्था में फसल बीमारी के प्रति अधिक संवेदनशील होती है।' }
    },
    te: {
      humidity: { name: 'అధిక సాపేక్ష ఆర్ద్రత', detail: 'ఆకులపై తేమ శిలీంధ్ర బీజాంశ అంకురోత్పత్తికి అనుకూలంగా ఉంది.' },
      temp: { name: 'అనుకూల ఉష్ణోగ్రత', detail: 'ఉష్ణోగ్రత వ్యాధికారక క్రిముల పెరుగుదలకు అనుకూలంగా ఉంది.' },
      rain: { name: 'వర్షపు చినుకులు & నేల బీజాంశాలు', detail: 'వర్షం నేల నుండి శిలీంధ్రాల వ్యాప్తిని వేగవంతం చేస్తుంది.' },
      stage: { name: 'పంట పెరుగుదల దశ సున్నితత్వం', detail: 'పూత/శాకీయ దశలో పంట తెగుళ్లకు ఎక్కువగా గురవుతుంది.' }
    },
    kn: {
      humidity: { name: 'ಹೆಚ್ಚಿನ ಸಾಪೇಕ್ಷ ಆರ್ದ್ರತೆ', detail: 'ಎಲೆಗಳ ತೇವಾಂಶವು ಶಿಲೀಂಧ್ರ ಬೀಜಕ ಮೊಳಕೆಯೊಡೆಯುವಿಕೆಗೆ ಅನುಕೂಲಕರವಾಗಿದೆ.' },
      temp: { name: 'ಅನುಕೂಲಕರ ತಾಪಮಾನ', detail: 'ತಾಪಮಾನವು ರೋಗಕಾರಕಗಳ ಬೆಳವಣಿಗೆಗೆ ಸೂಕ್ತವಾಗಿದೆ.' },
      rain: { name: 'ಮಳೆ ನೀರು ಸಿಂಪರಣೆ & ಮಣ್ಣಿನ ಬೀಜಕಗಳು', detail: 'ಮಳೆಯು ಮಣ್ಣಿನಿಂದ ಶಿಲೀಂಧ್ರ ಬೀಜಕಗಳ ಹರಡುವಿಕೆಯನ್ನು ವೇಗಗೊಳಿಸುತ್ತದೆ.' },
      stage: { name: 'ಬೆಳೆ ಬೆಳವಣಿಗೆ ಹಂತದ ಸೂಕ್ಷ್ಮತೆ', detail: 'ಹೂಬಿಡುವ/ಬೆಳವಣಿಗೆ ಹಂತದಲ್ಲಿ ಬೆಳೆಯು ರೋಗಕ್ಕೆ ಹೆಚ್ಚು ತುತ್ತಾಗುತ್ತದೆ.' }
    },
    ml: {
      humidity: { name: 'ഉയർന്ന ആർദ്രത', detail: 'ഇലകളിലെ ഈർപ്പം ഫംഗസ് ബീജങ്ങൾ മുളയ്ക്കാൻ അനുകൂലമാണ്.' },
      temp: { name: 'അനുകൂല താപനില', detail: 'താപനില രോഗാണുക്കളുടെ വളർച്ചയ്ക്ക് അനുയോജ്യമാണ്.' },
      rain: { name: 'മഴവെള്ള തുള്ളികളും മണ്ണിലെ ബീജങ്ങളും', detail: 'മഴ മണ്ണിൽ നിന്നുള്ള ഫംഗസ് വ്യാപനം വേഗത്തിലാക്കുന്നു.' },
      stage: { name: 'വിള വളർച്ചാ ഘട്ടത്തിലെ സാധ്യത', detail: 'പൂവിടൽ/വളർച്ചാ ഘട്ടത്തിൽ വിളകൾ രോഗബാധയ്ക്ക് കൂടുതൽ ഇരയാകുന്നു.' }
    },
    mr: {
      humidity: { name: 'उच्च सापेक्ष आर्द्रता', detail: 'पानांवरील ओलावा बुरशीजन्य बीजाणू अंकुरणासाठी अनुकूल आहे.' },
      temp: { name: 'अनुकूल तापमान', detail: 'तापमान रोगजंतूंच्या वाढीसाठी पूर्णपणे अनुकूल आहे.' },
      rain: { name: 'पावसाचे थेंब आणि मातीतील बीजाणू', detail: 'पावसामुळे मातीतून बुरशीचा प्रसार वेगाने होतो.' },
      stage: { name: 'पीक वाढीच्या टप्प्यातील संवेदनशीलता', detail: 'फुलोरा/वाढीच्या अवस्थेत पीक रोगास अधिक बळी पडते.' }
    },
    bn: {
      humidity: { name: 'উচ্চ আপেক্ষিক আর্দ্রতা', detail: 'পাতার আর্দ্রতা ছত্রাকের স্পোর অঙ্কুরোদগমের জন্য অনুকূল।' },
      temp: { name: 'অনুকূল তাপমাত্রা', detail: 'তাপমাত্রা রোগজীবাণুর বৃদ্ধির জন্য অত্যন্ত উপযুক্ত।' },
      rain: { name: 'বৃষ্টির জলের ছিটে এবং মাটির স্পোর', detail: 'বৃষ্টিপাত মাটি থেকে ছত্রাকের বিস্তারকে দ্রুততর করে।' },
      stage: { name: 'ফসলের বৃদ্ধি পর্যায়ের সংবেদনশীলতা', detail: 'ফুল আসা/বৃদ্ধির পর্যায়ে ফসল রোগের প্রতি বেশি সংবেদনশীল।' }
    },
    gu: {
      humidity: { name: 'ઊંચી સાપેક્ષ ભેજ', detail: 'પાંદડા પરનો ભેજ ફૂગના બીજાણુ અંકુરણ માટે અનુકૂળ છે.' },
      temp: { name: 'અનુકૂળ તાપમાન', detail: 'તાપમાન રોગકારકોના વિકાસ માટે યોગ્ય છે.' },
      rain: { name: 'વરસાદી છાંટા અને જમીનના બીજાણુઓ', detail: 'વરસાદ જમીનમાંથી ફૂગના ફેલાવાને ઝડપી બનાવે છે.' },
      stage: { name: 'પાક વૃદ્ધિ તબક્કાની સંવેદનશીલતા', detail: 'ફૂલ આવવાના/વિકાસના તબક્કામાં પાક રોગ માટે વધુ સંવેદનશીલ હોય છે.' }
    },
    pa: {
      humidity: { name: 'ਉੱਚ ਸਾਪੇਖਿਕ ਨਮੀ', detail: 'ਪੱਤਿਆਂ ਤੇ ਸਿੱਲ੍ਹ ਉੱਲੀ ਦੇ ਬੀਜਾਣੂ ਉੱਗਣ ਲਈ ਅਨੁਕੂਲ ਹੈ।' },
      temp: { name: 'ਅਨੁਕੂਲ ਤਾਪਮਾਨ', detail: 'ਤਾਪਮਾਨ ਰੋਗਾਣੂਆਂ ਦੇ ਵਾਧੇ ਲਈ ਢੁਕਵਾਂ ਹੈ।' },
      rain: { name: 'ਮੀਂਹ ਦੇ ਛਿੱਟੇ ਅਤੇ ਮਿੱਟੀ ਦੇ ਬੀਜਾਣੂ', detail: 'ਮੀਂਹ ਮਿੱਟੀ ਵਿੱਚੋਂ ਉੱਲੀ ਦੇ ਫੈਲਾਅ ਨੂੰ ਤੇਜ਼ ਕਰਦਾ ਹੈ।' },
      stage: { name: 'ਫ਼ਸਲ ਦੇ ਵਾਧੇ ਦੇ ਪੜਾਅ ਦੀ ਸੰਵੇਦਨਸ਼ੀਲਤਾ', detail: 'ਫੁੱਲ ਆਉਣ/ਵਾਧੇ ਦੇ ਪੜਾਅ ਦੌਰਾਨ ਫ਼ਸਲ ਬਿਮਾਰੀ ਪ੍ਰਤੀ ਵਧੇਰੇ ਸੰਵੇਦਨਸ਼ੀਲ ਹੁੰਦੀ ਹੈ।' }
    },
    or: {
      humidity: { name: 'ଉଚ୍ଚ ଆପେକ୍ଷିକ ଆର୍ଦ୍ରତା', detail: 'ପତ୍ରର ଆର୍ଦ୍ରତା କବକ ବିଜାଣୁ ବୃଦ୍ଧି ପାଇଁ ଅନୁକୂଳ ଅଟେ।' },
      temp: { name: 'ଅନୁକୂଳ ତାପମାତ୍ରା', detail: 'ତାପମାତ୍ରା ରୋଗଜୀବାଣୁ ବୃଦ୍ଧି ପାଇଁ ଉପଯୁକ୍ତ ଅଟେ।' },
      rain: { name: 'ବର୍ଷା ପାଣି ଛିଟା ଏବଂ ମାଟି ବିଜାଣୁ', detail: 'ବର୍ଷା ମାଟିରୁ କବକ ବିସ୍ତାରକୁ ତ୍ୱରାନ୍ୱିତ କରେ।' },
      stage: { name: 'ଫସଲ ବୃଦ୍ଧି ପର୍ଯ୍ୟାୟର ସମ୍ବେଦନଶୀଳତା', detail: 'ଫୁଲ ଆସିବା/ବୃଦ୍ଧି ଅବସ୍ଥାରେ ଫସଲ ରୋଗ ପ୍ରତି ଅଧିକ ସମ୍ବେଦନଶୀଳ ହୁଏ।' }
    },
    as: {
      humidity: { name: 'উচ্চ আপেক্ষিক আৰ্দ্ৰতা', detail: 'পাতৰ সেমেকা ভাব ভেঁকুৰৰ বীজাণু বৃদ্ধিৰ বাবে অনুকূল।' },
      temp: { name: 'অনুকূল উষ্ণতা', detail: 'উষ্ণতা ৰোগ সৃষ্টিকাৰী জীৱাণুৰ বৃদ্ধিৰ বাবে উপযোগী।' },
      rain: { name: 'বৰষুণৰ পানীৰ ছিটিকনি আৰু মাটিৰ বীজাণু', detail: 'বৰষুণে মাটিৰ পৰা ভেঁকুৰৰ সংক্ৰমণ ক্ষিপ্ৰ কৰে।' },
      stage: { name: 'শস্য বৃদ্ধিৰ স্তৰৰ সংবেদনশীলতা', detail: 'ফুল ধৰা/বৃদ্ধিৰ সময়ত শস্য ৰোগৰ প্ৰতি অধিক সংবেদনশীল হয়।' }
    },
    ur: {
      humidity: { name: 'زیادہ ہوا میں نمی', detail: 'پتوں پر نمی پھپھوندی کے بیضوں کے اگنے کے لیے موزوں ہے۔' },
      temp: { name: 'سازگار درجہ حرارت', detail: 'درجہ حرارت جراثیم کی افزائش کے لیے موزوں ہے۔' },
      rain: { name: 'بارش کی بوندیں اور مٹی کے جراثیم', detail: 'بارش مٹی سے پھپھوندی کے پھیلاؤ کو تیز کرتی ہے۔' },
      stage: { name: 'فصل کے مرحلہ وار بڑھوتری کی حساسیت', detail: 'پھول آنے/بڑھوتری کے مرحلے میں فصل بیماری کے لیے زیادہ حساس ہوتی ہے۔' }
    }
  };

  const cur = factorMap[lang] || factorMap.en;
  let resolved = cur.humidity;

  if (str.includes('temp') || str.includes('thermal') || str.includes('degree') || str.includes('°c')) resolved = cur.temp;
  else if (str.includes('rain') || str.includes('splash') || str.includes('precip')) resolved = cur.rain;
  else if (str.includes('stage') || str.includes('host') || str.includes('canopy') || str.includes('vulnerab')) resolved = cur.stage;

  return {
    factor: resolved.name,
    detail: resolved.detail,
    impact: fObj.impact || 'HIGH',
    weight: fObj.weight || '30%'
  };
}

/**
 * Localizes "Why am I receiving this warning?" narrative
 */
export function getLocalizedWhyNarrative(whyText, { cropName, diseaseName, humidity = '80%', temp = '28°C', location = '', riskLevel = 'HIGH', riskScore = 75 } = {}, lang = 'en') {
  const locale = ALL_LOCALES[lang] || ALL_LOCALES.en;
  const locCrop = getLocalizedCropName(cropName, lang);
  const locDisease = getLocalizedDiseaseName(diseaseName, lang);
  const locRisk = getLocalizedRiskLevel(riskLevel, lang);
  const locPlace = location?.formatted || location?.district || (locale.location ? locale.location.detected : 'Live Area');

  const template = locale.alerts?.environmentalRiskDescription;
  if (template) {
    return template
      .replace('{location}', locPlace)
      .replace('{temperature}', String(temp).includes('°') ? String(temp) : `${temp}°C`)
      .replace('{humidity}', String(humidity).includes('%') ? String(humidity) : `${humidity}%`)
      .replace('{crop}', locCrop)
      .replace('{growthStage}', getLocalizedGrowthStage('Vegetative', lang))
      .replace('{risk}', locRisk)
      .replace('{riskPercentage}', String(riskScore))
      .replace('{disease}', locDisease);
  }

  return `Current conditions (${temp}, ${humidity}): ${locCrop} at ${locRisk} (${riskScore}%) for ${locDisease}.`;
}

/**
 * Development-only Language Validation Helper
 */
export function validateLanguageOutput(outputString, targetLanguage, componentName = 'Component') {
  if (!outputString || typeof outputString !== 'string' || targetLanguage === 'en') {
    return outputString;
  }

  if (typeof process !== 'undefined' && process.env && process.env.NODE_ENV !== 'production') {
    const englishIndicators = [
      'High Pest Risk', 'Environmental risk', 'prune and destroy',
      'copper fungicide', 'Relative Humidity', 'Field Observations',
      'Crop Health', 'Why am I receiving this warning'
    ];

    for (const indicator of englishIndicators) {
      if (outputString.includes(indicator)) {
        console.warn(`[MIXED LANGUAGE DETECTED] in <${componentName}> for [${targetLanguage}]: "${indicator}" found in output:`, outputString);
        break;
      }
    }
  }

  return outputString;
}

/**
 * Fully transforms an AI result or analysis record into pure localized representation
 */
export function localizeAIResult(result, lang = 'en') {
  if (!result) return null;

  const rawCrop = result.crop || result.cropName || result.aiAnalysis?.crop || 'Tomato';
  const rawCondition = result.condition || result.disease || result.aiAnalysis?.condition || 'Healthy';
  const rawSeverity = result.severity || result.aiAnalysis?.severity || 'Moderate';
  const rawStage = result.growthStage || 'Vegetative';

  const localizedCrop = getLocalizedCropName(rawCrop, lang);
  const localizedCondition = getLocalizedDiseaseName(rawCondition, lang);
  const localizedSeverity = getLocalizedSeverity(rawSeverity, lang);
  const localizedStage = getLocalizedGrowthStage(rawStage, lang);

  const visualSymptoms = localizeSymptoms(result.visualSymptoms || result.aiAnalysis?.visualSymptoms || [], lang);
  const possibleCauses = localizeCauses(result.possibleCauses || result.aiAnalysis?.possibleCauses || [], lang);
  
  const rawActions = result.recommendedActions || result.immediateActions || result.recommendations?.immediateActions || [];
  const immediateActions = rawActions.map(a => getLocalizedAction(a, lang));

  const rawPrevention = result.prevention || result.recommendations?.prevention || [];
  const prevention = rawPrevention.map(p => getLocalizedPrevention(p, lang));

  const rawMonitoring = result.monitoringPlan || result.recommendations?.monitoringPlan || [];
  const monitoringPlan = rawMonitoring.map(m => getLocalizedAction(m, lang));

  const whyRiskExists = getLocalizedWhyNarrative(result.whyRiskExists || result.riskAssessment?.whyRiskExists, {
    cropName: rawCrop,
    diseaseName: rawCondition,
    humidity: result.weather?.humidity || result.weatherSnapshot?.humidity || 80,
    temp: result.weather?.temperature || result.weatherSnapshot?.temperature || 28,
    location: result.location,
    riskScore: result.riskAssessment?.riskScore || result.severityScore || 75
  }, lang);

  return {
    ...result,
    localizedCrop,
    localizedCondition,
    localizedSeverity,
    localizedStage,
    visualSymptoms,
    possibleCauses,
    immediateActions,
    prevention,
    monitoringPlan,
    whyRiskExists
  };
}

export default {
  ALL_LOCALES,
  normalizeCropKey,
  getLocalizedCropName,
  normalizeDiseaseKey,
  getLocalizedDiseaseName,
  getLocalizedThreat,
  getLocalizedGrowthStage,
  getLocalizedRiskLevel,
  getLocalizedSeverity,
  getLocalizedWeatherTerm,
  getLocalizedWeatherCondition,
  getLocalizedDayName,
  getLocalizedAlertTitle,
  getLocalizedAlertDescription,
  getLocalizedEnvironmentalWhy,
  getLocalizedAction,
  getLocalizedAlertAction,
  getLocalizedPrevention,
  localizeSymptoms,
  localizeCauses,
  localizeFactor,
  getLocalizedWhyNarrative,
  localizeAIResult,
  validateLanguageOutput
};

