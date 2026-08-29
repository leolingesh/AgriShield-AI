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
  if (c.includes('tomato') || c.includes('தக்காளி') || c.includes('टमाटर') || c.includes('టమోటా') || c.includes('ಟೊಮ್ಯಾಟೊ') || c.includes('തക്കാളി')) return 'tomato';
  if (c.includes('rice') || c.includes('paddy') || c.includes('நெல்') || c.includes('ধান') || c.includes('వరి') || c.includes('ಭತ್ತ') || c.includes('നെല്ല്')) return 'rice';
  if (c.includes('cotton') || c.includes('பருத்தி') || c.includes('कपास') || c.includes('పత్తి') || c.includes('ಹತ್ತಿ') || c.includes('পৰুత్తి')) return 'cotton';
  if (c.includes('wheat') || c.includes('கோதுமை') || c.includes('गेहूं') || c.includes('గోధుమ') || c.includes('ಗೋಧಿ') || c.includes('গম')) return 'wheat';
  if (c.includes('potato') || c.includes('உருளை') || c.includes('आलू') || c.includes('బంగాళా') || c.includes('ಆಲೂ') || c.includes('আলু')) return 'potato';
  if (c.includes('chilli') || c.includes('chili') || c.includes('pepper') || c.includes('மிளகாய்') || c.includes('मिर्च') || c.includes('మిరప') || c.includes('ಮೆಣಸಿನ')) return 'chilli';
  if (c.includes('maize') || c.includes('corn') || c.includes('மக்கா') || c.includes('मक्का') || c.includes('మొక్కజొన్న') || c.includes('ಮೆಕ್ಕೆಜೋಳ')) return 'maize';
  if (c.includes('sugarcane') || c.includes('கரும்பு') || c.includes('गन्ना') || c.includes('చెరకు') || c.includes('ಕಬ್ಬು')) return 'sugarcane';
  if (c.includes('onion') || c.includes('வெங்காயம்') || c.includes('प्याज़') || c.includes('উల్లి') || c.includes('ಈರುಳ್ಳಿ') || c.includes('পেঁয়াজ')) return 'onion';
  if (c.includes('groundnut') || c.includes('peanut') || c.includes('நிலக்கடலை') || c.includes('मूंगफली') || c.includes('వేరుశనగ') || c.includes('ಕಡಲೆಕಾಯಿ')) return 'groundnut';
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
  return ALL_LOCALES.en.crops[normKey] || cropOrId || 'Crop';
}

/**
 * Normalizes disease / condition string to canonical key
 */
export function normalizeDiseaseKey(rawCondition) {
  if (!rawCondition) return 'healthy';
  const cond = String(rawCondition).toLowerCase().trim().replace(/[\s-]/g, '_');
  if (cond.includes('septoria')) return 'septoria_leaf_spot';
  if (cond.includes('blossom') || cond.includes('end_rot')) return 'blossom_end_rot';
  if (cond.includes('blast')) return 'leaf_blast';
  if (cond.includes('yellow_rust') || (cond.includes('rust') && cond.includes('wheat'))) return 'yellow_rust';
  if (cond.includes('bollworm')) return 'pink_bollworm';
  if (cond.includes('early_blight')) return 'early_blight';
  if (cond.includes('late_blight')) return 'late_blight';
  if (cond.includes('leaf_curl')) return 'leaf_curl';
  if (cond.includes('whitefly')) return 'whitefly_infestation';
  if (cond.includes('calcium')) return 'calcium_deficiency';
  if (cond.includes('bacterial')) return 'bacterial_blight';
  if (cond.includes('powdery')) return 'powdery_mildew';
  if (cond.includes('downy')) return 'downy_mildew';
  if (cond.includes('anthracnose')) return 'anthracnose';
  if (cond.includes('root_rot')) return 'root_rot';
  if (cond.includes('stem_borer') || cond.includes('borer')) return 'stem_borer';
  if (cond.includes('aphid')) return 'aphid_infestation';
  if (cond.includes('rust')) return 'rust_disease';
  if (cond.includes('spot')) return 'leaf_spot';
  if (cond.includes('blight')) return 'foliar_blight';
  if (cond.includes('discoloration') || cond.includes('yellowing')) return 'leaf_discoloration';
  if (cond.includes('healthy') || cond.includes('normal')) return 'healthy';
  if (cond.includes('routine')) return 'routine_monitoring';
  return cond;
}

/**
 * Returns localized disease display name
 */
export function getLocalizedDiseaseName(diseaseOrCondition, lang = 'en') {
  const normKey = normalizeDiseaseKey(diseaseOrCondition);
  const locale = ALL_LOCALES[lang] || ALL_LOCALES.en;
  if (locale.diseases && locale.diseases[normKey]) {
    return locale.diseases[normKey];
  }
  return ALL_LOCALES.en.diseases[normKey] || diseaseOrCondition || 'Disease';
}

/**
 * Normalizes growth stage
 */
export function normalizeGrowthStageKey(rawStage) {
  if (!rawStage) return 'vegetative';
  const s = String(rawStage).toLowerCase().trim();
  if (s.includes('seedling') || s.includes('నాற்று') || s.includes('अंकुर')) return 'seedling';
  if (s.includes('vegetative') || s.includes('வளர்ச்சி') || s.includes('वानस्पतिक')) return 'vegetative';
  if (s.includes('tillering') || s.includes('தூர்') || s.includes('कल्ले')) return 'tillering';
  if (s.includes('flowering') || s.includes('பூக்கும்') || s.includes('फूल')) return 'flowering';
  if (s.includes('fruiting') || s.includes('காய்') || s.includes('फल')) return 'fruiting';
  if (s.includes('ripening') || s.includes('பழுக்கும்') || s.includes('पकने')) return 'ripening';
  if (s.includes('nursery')) return 'nursery';
  if (s.includes('panicle')) return 'panicle_initiation';
  if (s.includes('maturity')) return 'maturity';
  if (s.includes('harvest')) return 'harvest';
  return s.replace(/[\s-]/g, '_');
}

/**
 * Returns localized growth stage
 */
export function getLocalizedGrowthStage(stage, lang = 'en') {
  const normKey = normalizeGrowthStageKey(stage);
  const locale = ALL_LOCALES[lang] || ALL_LOCALES.en;
  if (locale.stages && locale.stages[normKey]) {
    return locale.stages[normKey];
  }
  return ALL_LOCALES.en.stages[normKey] || stage || 'Vegetative';
}

/**
 * Returns localized risk level name
 */
export function getLocalizedRiskLevel(level, lang = 'en') {
  const l = String(level || 'LOW').toUpperCase();
  const locale = ALL_LOCALES[lang] || ALL_LOCALES.en;
  if (l.includes('CRITICAL') || l.includes('VERY HIGH')) return locale.risk.critical;
  if (l.includes('HIGH')) return locale.risk.high;
  if (l.includes('MEDIUM') || l.includes('MODERATE')) return locale.risk.medium;
  return locale.risk.low;
}

/**
 * Returns localized severity name
 */
export function getLocalizedSeverity(severity, lang = 'en') {
  const s = String(severity || 'Moderate').toLowerCase();
  const locale = ALL_LOCALES[lang] || ALL_LOCALES.en;
  if (s.includes('healthy')) return locale.severity.healthy;
  if (s.includes('critical') || s.includes('severe')) return locale.severity.critical;
  if (s.includes('high')) return locale.severity.high;
  if (s.includes('moderate') || s.includes('medium')) return locale.severity.moderate;
  return locale.severity.low;
}

/**
 * Returns localized weather condition term
 */
export function getLocalizedWeatherTerm(condition, lang = 'en') {
  if (!condition) return '';
  const cond = String(condition).toLowerCase();
  const locale = ALL_LOCALES[lang] || ALL_LOCALES.en;

  if (cond.includes('humidity')) return locale.weather.humidity;
  if (cond.includes('temperature') || cond.includes('temp')) return locale.weather.temp;
  if (cond.includes('rainfall') || cond.includes('rain')) return locale.weather.rainfall;
  if (cond.includes('wind')) return locale.weather.wind;
  if (cond.includes('pressure')) return locale.weather.pressure;

  // Sky conditions
  const skyMap = {
    ta: { 'partly cloudy': 'பகுதி மேகமூட்டம்', 'cloudy': 'மேகமூட்டம்', 'sunny': 'வெயில்', 'clear': 'தெളിவான வானம்', 'rain': 'மழை', 'heavy rain': 'கனமழை', 'thunderstorm': 'இடியுடன் கூடிய மழை', 'overcast': 'முழு மேகமூட்டம்', 'drizzle': 'தூறல்', 'mist': 'பனிமூட்டம்' },
    hi: { 'partly cloudy': 'आंशिक रूप से बादल', 'cloudy': 'बादल छाए रहेंगे', 'sunny': 'धूप', 'clear': 'साफ आसमान', 'rain': 'बारिश', 'heavy rain': 'भारी बारिश', 'thunderstorm': 'तूफान', 'overcast': 'घने बादल', 'drizzle': 'बूंदाबांदी', 'mist': 'धुंध' },
    te: { 'partly cloudy': 'పాక్షికంగా మేఘావృతం', 'cloudy': 'మేఘావృతం', 'sunny': 'ఎండ', 'clear': 'నిర్మలమైన ఆకాశం', 'rain': 'వర్షం', 'heavy rain': 'భారీ వర్షం', 'thunderstorm': 'ఉరుములతో కూడిన వర్షం', 'overcast': 'పూర్తి మేఘావృతం', 'drizzle': 'చిరుజల్లులు', 'mist': 'మంచు' },
    kn: { 'partly cloudy': 'ಭಾಗಶಃ ಮೋಡ', 'cloudy': 'ಮೋಡ ಕವಿದ', 'sunny': 'ಬಿಸಿಲು', 'clear': 'ಸ್ವಚ್ಛ ಆಕಾಶ', 'rain': 'ಮಳೆ', 'heavy rain': 'ಭಾರಿ ಮಳೆ', 'thunderstorm': 'ಗುಡುಗು ಸಹಿತ ಮಳೆ', 'overcast': 'ದಟ್ಟ ಮೋಡ', 'drizzle': 'ತುಂತುರು ಮಳೆ', 'mist': 'ಮಂಜು' },
    ml: { 'partly cloudy': 'ഭാഗികമായി മേഘാവൃതം', 'cloudy': 'മേഘാവൃതം', 'sunny': 'വെയിൽ', 'clear': 'തെളിഞ്ഞ ആകാശം', 'rain': 'മഴ', 'heavy rain': 'ശക്തമായ മഴ', 'thunderstorm': 'ഇടിമിന്നലോട് കൂടിയ മഴ', 'overcast': 'മൂടിക്കെട്ടിയ ആകാശം', 'drizzle': 'ചാറ്റൽമഴ', 'mist': 'മഞ്ഞ്' },
    mr: { 'partly cloudy': 'अंशतः ढगाळ', 'cloudy': 'ढगाळ', 'sunny': 'ऊन', 'clear': 'निरभ्र आकाश', 'rain': 'पाऊस', 'heavy rain': 'मुसळधार पाऊस', 'thunderstorm': 'वादळी पाऊस', 'overcast': 'दाट ढगाळ', 'drizzle': 'रिमझिम पाऊस', 'mist': 'धुके' },
    bn: { 'partly cloudy': 'আংশিক মেঘলা', 'cloudy': 'মেঘলা', 'sunny': 'রৌদ্রোজ্জ্বল', 'clear': 'পরিষ্কার আকাশ', 'rain': 'বৃষ্টি', 'heavy rain': 'ভারী বৃষ্টি', 'thunderstorm': 'বজ্রবিদ্যুৎসহ ঝড়', 'overcast': 'ঘন মেঘলা', 'drizzle': 'গুঁড়ি গুঁড়ি বৃষ্টি', 'mist': 'কুয়াশা' },
    gu: { 'partly cloudy': 'આંશિક વાદળછાયું', 'cloudy': 'વાદળછાયું', 'sunny': 'તડકો', 'clear': 'ચોખ્ખું આકાશ', 'rain': 'વરસાદ', 'heavy rain': 'ભારે વરસાદ', 'thunderstorm': 'ગાજવીજ સાથે વરસાદ', 'overcast': 'ઘેરાયેલું વાદળછાયું', 'drizzle': 'ઝરમર વરસાદ', 'mist': 'ઝાકળ' },
    pa: { 'partly cloudy': 'ਅੰਸ਼ਕ ਤੌਰ ਤੇ ਬੱਦਲਵਾਈ', 'cloudy': 'ਬੱਦਲਵਾਈ', 'sunny': 'ਧੁੱਪ', 'clear': 'ਸਾਫ਼ ਅਸਮਾਨ', 'rain': 'ਮੀਂਹ', 'heavy rain': 'ਭਾਰੀ ਮੀਂਹ', 'thunderstorm': 'ਗਰਜ ਨਾਲ ਮੀਂਹ', 'overcast': 'ਘਣੇ ਬੱਦਲ', 'drizzle': 'ਫੁਹਾਰ', 'mist': 'ਧੁੰਦ' },
    or: { 'partly cloudy': 'ଆଂଶିକ ମେଘୁଆ', 'cloudy': 'ମେଘୁଆ', 'sunny': 'ଖରା', 'clear': 'ନିର୍ମଳ ଆକାଶ', 'rain': 'ବର୍ଷା', 'heavy rain': 'ଭାରୀ ବର୍ଷା', 'thunderstorm': 'ଘଡ଼ଘଡ଼ି ସହ ବର୍ଷା', 'overcast': 'ଘନ ମେଘୁଆ', 'drizzle': 'ଝିପିଝିପି ବର୍ଷା', 'mist': 'କୁହୁଡ଼ି' },
    as: { 'partly cloudy': 'আংশিক ডাৱৰীয়া', 'cloudy': 'ডাৱৰীয়া', 'sunny': "ৰ'দালি", 'clear': 'পৰিষ্কাৰ আকাশ', 'rain': 'বৰষুণ', 'heavy rain': 'প্ৰবল বৰষুণ', 'thunderstorm': 'ধুমুহা-বৰষুণ', 'overcast': 'ঘন ডাৱৰীয়া', 'drizzle': 'টোপাল-টোপাল বৰষুণ', 'mist': 'কুঁৱলী' },
    ur: { 'partly cloudy': 'جزوی طور پر ابر آلود', 'cloudy': 'ابر آلود', 'sunny': 'دھوپ', 'clear': 'صاف آسمان', 'rain': 'بارش', 'heavy rain': 'شدید بارش', 'thunderstorm': 'گرج چمک کے ساتھ بارش', 'overcast': 'گھنے بادل', 'drizzle': 'بوندا باندی', 'mist': 'دھند' }
  };

  if (skyMap[lang] && skyMap[lang][cond]) {
    return skyMap[lang][cond];
  }
  return condition;
}

/**
 * Generates fully localized alert title
 * e.g. "⚠️ மிக அதிக பூச்சி ஆபத்து: தக்காளி (செப்டோரியா இலைப்புள்ளி நோய்)"
 */
export function getLocalizedAlertTitle(alert, lang = 'en') {
  if (!alert) return '';
  const cropName = getLocalizedCropName(alert.cropId || alert.cropName || alert.crop, lang);
  const diseaseName = getLocalizedDiseaseName(alert.threatName || alert.disease || alert.condition || alert.threat, lang);
  const locale = ALL_LOCALES[lang] || ALL_LOCALES.en;

  const isCritical = String(alert.riskLevel || '').toUpperCase() === 'CRITICAL';
  const template = isCritical ? locale.alerts.criticalAlertTitle : locale.alerts.highestRiskTitle;

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
  const risk = getLocalizedRiskLevel(alert.riskLevel || 'HIGH', lang);
  const riskPercentage = alert.riskScore || 80;

  // Extract location proper name safely
  let locStr = 'Salem, Tamil Nadu';
  if (typeof alert.location === 'string') {
    locStr = alert.location;
  } else if (alert.location?.district) {
    locStr = `${alert.location.district}, ${alert.location.state || 'Tamil Nadu'}`;
  }

  // Preserve numbers & units
  const temp = alert.weather?.temperature ? `${alert.weather.temperature}°C` : (alert.temperature ? `${alert.temperature}°C` : '32.8°C');
  const humidity = alert.weather?.humidity ? `${alert.weather.humidity}%` : (alert.humidity ? `${alert.humidity}%` : '55%');

  const template = locale.alerts.environmentalRiskDescription;
  return template
    .replace('{location}', locStr)
    .replace('{temperature}', temp)
    .replace('{humidity}', humidity)
    .replace('{crop}', cropName)
    .replace('{growthStage}', growthStage)
    .replace('{risk}', risk)
    .replace('{riskPercentage}', String(riskPercentage))
    .replace('{disease}', diseaseName);
}

/**
 * Translates IPM Action / Recommended Action
 */
export function getLocalizedAction(rawAction, lang = 'en', context = {}) {
  if (!rawAction) return '';
  const text = String(rawAction);
  const lower = text.toLowerCase();
  const locale = ALL_LOCALES[lang] || ALL_LOCALES.en;

  if (lower.includes('prune') && (lower.includes('infected') || lower.includes('12 inch') || lower.includes('soil line'))) {
    return locale.ipmActions.prune_infected_leaves;
  }
  if (lower.includes('inspect') && (lower.includes('lower') || lower.includes('24') || lower.includes('48'))) {
    return locale.ipmActions.inspect_lower_leaves;
  }
  if (lower.includes('sprinkler') || lower.includes('drip')) {
    return locale.ipmActions.switch_drip_irrigation;
  }
  if (lower.includes('copper') || lower.includes('trichoderma') || lower.includes('mancozeb') || lower.includes('fungicide')) {
    return locale.ipmActions.apply_copper_oxychloride;
  }
  if (lower.includes('nitrogen') || lower.includes('urea')) {
    return locale.ipmActions.withhold_excess_nitrogen;
  }
  if (lower.includes('water layer') || lower.includes('standing water') || lower.includes('wetting and drying')) {
    return locale.ipmActions.thin_water_layer;
  }
  if (lower.includes('pheromone') || lower.includes('trap')) {
    return locale.ipmActions.install_pheromone_traps;
  }
  if (lower.includes('calcium nitrate')) {
    return locale.ipmActions.calcium_nitrate_spray;
  }
  if (lower.includes('handpick') || lower.includes('rosetted') || lower.includes('bolls')) {
    return locale.ipmActions.handpick_infested;
  }
  if (lower.includes('recheck') || lower.includes('re-examine') || lower.includes('re-inspect')) {
    return locale.ipmActions.reinspect_48h;
  }
  if (lower.includes('routine') || lower.includes('canopy')) {
    return locale.ipmActions.routine_canopy_inspection;
  }

  return text;
}

/**
 * Translates prevention checklist items
 */
export function getLocalizedPrevention(rawItem, lang = 'en', index = 0) {
  if (!rawItem) return '';
  const text = String(rawItem).toLowerCase();
  const locale = ALL_LOCALES[lang] || ALL_LOCALES.en;

  if (text.includes('inspect') || text.includes('scout')) return locale.prevention.item1;
  if (text.includes('remove') || text.includes('destroy') || text.includes('prune')) return locale.prevention.item2;
  if (text.includes('spacing') || text.includes('airflow') || text.includes('canopy')) return locale.prevention.item3;
  if (text.includes('wetting') || text.includes('overhead') || text.includes('drip')) return locale.prevention.item4;
  if (text.includes('weather') || text.includes('rain') || text.includes('dew')) return locale.prevention.item5;
  if (text.includes('mulch') || text.includes('splash')) return locale.prevention.item6;
  if (text.includes('rotation') || text.includes('rotate')) return locale.prevention.item7;

  // Fallback to indexed checklist item
  const key = `item${(index % 7) + 1}`;
  return locale.prevention[key] || rawItem;
}

/**
 * Localizes visual symptoms array
 */
export function localizeSymptoms(symptoms, lang = 'en') {
  if (!Array.isArray(symptoms) || symptoms.length === 0) return [];
  const locale = ALL_LOCALES[lang] || ALL_LOCALES.en;

  return symptoms.map(s => {
    const text = String(s).toLowerCase();
    if (text.includes('circular') || text.includes('dark grey') || text.includes('spots on lower leaves')) {
      return lang === 'ta' ? 'கீழ் இலைகளில் கருமையான விளிம்புகளுடன் கூடிய சிறிய வட்ட சாம்பல் நிற புள்ளிகள்' :
             lang === 'hi' ? 'निचली पत्तियों पर गहरे किनारों वाले छोटे गोलाकार गहरे भूरे धब्बे' : s;
    }
    if (text.includes('pycnidia') || text.includes('black dots')) {
      return lang === 'ta' ? 'புள்ளிகளின் மையத்தில் சிறிய கருப்பு புள்ளிகள் (பிக்னிடியா) காணப்படுகின்றன' :
             lang === 'hi' ? 'धब्बों के केंद्र में छोटे काले बिंदु दिखाई देते हैं' : s;
    }
    if (text.includes('chlorosis') || text.includes('yellowing') || text.includes('defoliation')) {
      return lang === 'ta' ? 'சுற்றியுள்ள இலை திசுக்களின் மஞ்சள் நிறமாதல் (குளோரோసిஸ்) மற்றும் இலை உதிர்தல்' :
             lang === 'hi' ? 'आसपास के पत्तों के ऊतकों का पीला पड़ना और पत्तियों का समय से पहले झड़ना' : s;
    }
    if (text.includes('water-soaked') || text.includes('sunken patch')) {
      return lang === 'ta' ? 'வளரும் காயின் அடிப்பகுதியில் நீரில் நனைந்த கருமையான தோல் போன்ற பள்ளமான பகுதி' :
             lang === 'hi' ? 'विकसित हो रहे फल के निचले हिस्से पर पानी जैसा काला धंसा हुआ धब्बा' : s;
    }
    if (text.includes('vibrant green') || text.includes('healthy')) {
      return lang === 'ta' ? 'புள்ளிகள் அல்லது கருகல் இல்லாத ஆரோக்கியமான பசுமையான இலைகள்' :
             lang === 'hi' ? 'धब्बों या झुलसा रहित चमकदार हरी पत्तियां' : s;
    }
    return s;
  });
}

/**
 * Localizes possible causes array
 */
export function localizeCauses(causes, lang = 'en') {
  if (!Array.isArray(causes) || causes.length === 0) return [];

  return causes.map(c => {
    const text = String(c);
    const lower = text.toLowerCase();
    if (lower.includes('microclimate thermal suitability') || lower.includes('thermal')) {
      const match = text.match(/\([^)]+\)/);
      const range = match ? ` ${match[0]}` : '';
      return lang === 'ta' ? `நுண்ணிய காலநிலையின் உகந்த வெப்பநிலை வரம்பு${range}` :
             lang === 'hi' ? `सूक्ष्म जलवायु की अनुकूल तापमान सीमा${range}` : c;
    }
    if (lower.includes('foliar humidity threshold') || lower.includes('humidity')) {
      const match = text.match(/\([^)]+\)/);
      const hum = match ? ` ${match[0]}` : '';
      return lang === 'ta' ? `இலைப்பரப்பு ஈரப்பத வரம்பு${hum}` :
             lang === 'hi' ? `पत्तियों की आर्द्रता सीमा${hum}` : c;
    }
    if (lower.includes('optimal temperature') || lower.includes('healthy')) {
      return lang === 'ta' ? 'உகந்த வெப்பநிலை மற்றும் சமநிலையான ஈரப்பதம்' :
             lang === 'hi' ? 'इष्टतम तापमान और संतुलित नमी की स्थिति' : c;
    }
    return c;
  });
}

/**
 * Translates XAI Contributing Factor object
 */
export function localizeFactor(factorObj, lang = 'en') {
  if (!factorObj || lang === 'en') return factorObj;

  const locale = ALL_LOCALES[lang] || ALL_LOCALES.en;
  let factorName = factorObj.factor || '';
  let detailText = factorObj.detail || '';

  const fLower = factorName.toLowerCase();
  const numMatch = factorName.match(/\([^)]+\)/);
  const suffix = numMatch ? ` ${numMatch[0]}` : '';

  if (fLower.includes('visual symptom')) {
    factorName = lang === 'ta' ? `காட்சி அறிகுறிகள் உறுதிப்படுத்தல்${suffix}` :
                 lang === 'hi' ? `दृश्य लक्षणों की पुष्टि${suffix}` : factorName;
    detailText = lang === 'ta' ? 'பயிர் இலைகளில் தீவிர நோய்க்கிருமி / பூச்சி சேதம் கண்டறியப்பட்டது.' :
                 lang === 'hi' ? 'फसल की पत्तियों पर सक्रिय रोगाणु/कीट क्षति की पहचान کی گئی۔' : detailText;
  } else if (fLower.includes('high relative humidity') || fLower.includes('high humidity')) {
    factorName = lang === 'ta' ? `அதிக காற்றில் ஈரப்பதம்${suffix}` :
                 lang === 'hi' ? `उच्च सापेक्ष आर्द्रता${suffix}` : factorName;
    detailText = lang === 'ta' ? 'நோய்க்கிருமி வளர்ச்சிக்கு சாதகமான முக்கியமான ஈரப்பத வரம்பை விட அதிகமானது.' :
                 lang === 'hi' ? 'रोगजनक विकास के लिए अनुकूल आर्द्रता सीमा से अधिक है।' : detailText;
  } else if (fLower.includes('optimal ambient temperature') || fLower.includes('optimal temp')) {
    factorName = lang === 'ta' ? `உகந்த சுற்றுப்புற வெப்பநிலை${suffix}` :
                 lang === 'hi' ? `अनुकूल परिवेश तापमान${suffix}` : factorName;
    detailText = lang === 'ta' ? 'வெப்பநிலை நிலைகள் வித்திகளின் முளைப்பை விரைவுபடுத்துகின்றன.' :
                 lang === 'hi' ? 'तापीय स्थितियां बीजाणु अंकुरण को तेज करती हैं।' : detailText;
  } else if (fLower.includes('heavy recent rainfall') || fLower.includes('rainfall')) {
    factorName = lang === 'ta' ? `சமீபத்திய கனமழை${suffix}` :
                 lang === 'hi' ? `हाल की भारी वर्षा${suffix}` : factorName;
    detailText = lang === 'ta' ? 'மழைப்பொழிவு மண் தெளிப்பை ஏற்படுத்தி இலைகளில் நீர்த்துளிகளை உருவாக்குகிறது.' :
                 lang === 'hi' ? 'वर्षा से मिट्टी की छीटें पड़ती हैं और पत्तियों पर पानी की परत बनती है।' : detailText;
  } else if (fLower.includes('favorable crop canopy') || fLower.includes('healthy')) {
    factorName = lang === 'ta' ? 'சாதகமான பயிர் சூழல் மற்றும் தட்பவெப்பநிலை' :
                 lang === 'hi' ? 'अनुकूल फसल कैनोपी एवं सूक्ष्म जलवायु' : factorName;
    detailText = lang === 'ta' ? 'சுற்றுச்சூழல் அளவுருக்கள் நோயற்ற வரம்பிற்குள் உள்ளன.' :
                 lang === 'hi' ? 'पर्यावरणीय पैरामीटर सामान्य सीमा के भीतर हैं।' : detailText;
  }

  return {
    ...factorObj,
    factor: factorName,
    detail: detailText
  };
}

/**
 * Translates whyRiskExists narrative into target language
 */
export function getLocalizedWhyNarrative(whyText, params = {}, lang = 'en') {
  if (lang === 'en' || !whyText) return whyText;

  const { cropName, diseaseName, riskLevel, riskScore, location, weather, growthStage } = params;
  const locCrop = getLocalizedCropName(cropName || 'Tomato', lang);
  const locDisease = getLocalizedDiseaseName(diseaseName || 'Septoria Leaf Spot', lang);
  const locStage = getLocalizedGrowthStage(growthStage || 'Vegetative', lang);
  const locRisk = getLocalizedRiskLevel(riskLevel || 'HIGH', lang);
  const score = riskScore || 80;

  const locStr = location?.district ? `${location.district}, ${location.state || 'Tamil Nadu'}` : (typeof location === 'string' ? location : 'Salem, Tamil Nadu');
  const temp = weather?.temperature ? `${weather.temperature}°C` : '32.8°C';
  const hum = weather?.humidity ? `${weather.humidity}%` : '55%';

  if (lang === 'ta') {
    if (riskLevel === 'CRITICAL' || riskLevel === 'HIGH' || score >= 60) {
      return `${locStr} பகுதியில் உள்ள தற்போதைய வானிலை சூழல்கள் (${temp}, ${hum} ஈரப்பதம்) மற்றும் ${locStage} நிலையில் உள்ள ${locCrop} பயிர் ஆகியவை ${locDisease} நோய்க்கான ${locRisk} ஆபத்தை (${score}%) உருவாக்குகின்றன. ஈரப்பதமும் வெப்பமும் நோய்க்கிருமி வித்துக்களின் வளர்ச்சியை விரைவுபடுத்துகின்றன. 24 முதல் 48 மணி நேரத்திற்குள் உடனடி கள ஆய்வு செய்ய அறிவுறுத்தப்படுகிறது.`;
    }
    if (riskLevel === 'MEDIUM' || score >= 30) {
      return `${locStr} பகுதியில் உள்ள வானிலை அளவுருக்கள் ${locDisease} நோய்க்கான மிதமான ஆபத்தை (${score}%) சுட்டிக்காட்டுகின்றன. தற்போதைய ஈரப்பதம் பூச்சிகள் வளர்ச்சிக்கு சாதகமான நிலையை நெருங்குகிறது. வழக்கமான வயல் ஆய்வு மற்றும் தடுப்பு முறைகள் பரிந்துரைக்கப்படுகின்றன.`;
    }
    return `${locStr} பகுதியில் ${locCrop} பயிருக்கான தற்போதைய நிலைகள் சாதகமாக உள்ளன (குறைந்த ஆபத்து: ${score}%). வழக்கமான பயிர் கண்காணிப்பைத் தொடரவும்.`;
  }

  if (lang === 'hi') {
    if (riskLevel === 'CRITICAL' || riskLevel === 'HIGH' || score >= 60) {
      return `${locStr} में वर्तमान पर्यावरणीय स्थितियां (${temp}, ${hum} आर्द्रता) और ${locStage} अवस्था में ${locCrop} फसल मिलकर ${locDisease} کے لیے ${locRisk} जोखिम (${score}%) उत्पन्न करती हैं। नमी और गर्मी रोगाणु बीजाणुओं के अंकुरण को तेज करती हैं। 24 से 48 घंटों के भीतर तत्काल खेत के निरीक्षण की सलाह दी जाती है।`;
    }
    if (riskLevel === 'MEDIUM' || score >= 30) {
      return `${locStr} में मौसम के पैरामीटर ${locDisease} के लिए मध्यम जोखिम (${score}%) का संकेत देते हैं। नियमित खेत स्काउटिंग और निवारक जैविक इनपुट की सिफारिश की जाती है।`;
    }
    return `${locStr} में ${locCrop} के लिए वर्तमान स्थितियां अनुकूल हैं (कम जोखिम: ${score}%)। नियमित फसल निगरानी जारी रखें।`;
  }

  return whyText;
}

/**
 * Development validator to detect mixed language when currentLanguage !== 'en'
 */
export function validateLanguageOutput(text, lang = 'en', componentName = 'Component') {
  if (process.env.NODE_ENV === 'production' || lang === 'en' || !text) {
    return text;
  }

  // Detect common English crop and disease phrases in non-English rendered output
  const suspiciousEnglish = [
    'Tomato', 'Rice', 'Cotton', 'Wheat', 'Potato', 'Septoria Leaf Spot',
    'Blossom End Rot', 'Pink Bollworm', 'Leaf Blast', 'Yellow Rust',
    'HIGH PEST RISK', 'CRITICAL ADVISORY', 'Vegetative stage'
  ];

  const found = suspiciousEnglish.find(word => String(text).includes(word));
  if (found) {
    console.warn(`[MIXED LANGUAGE DETECTED]\nlanguage: ${lang}\ncomponent: ${componentName}\nfound English token: "${found}"\ntext: "${text}"`);
  }

  return text;
}
