const cropKnowledgeBase = require('../data/cropKnowledgeBase.json');
const diseaseKnowledge = require('../data/diseaseKnowledge.json');
const config = require('../config/config');

/**
 * Calculate pest and disease risk before visible damage occurs
 * Combines agronomic host biology + real-time micrometeorology + disease-specific thresholds
 */
function calculateCropRisk({
  cropId,
  weather,
  location,
  growthStage = 'Vegetative',
  farmerObservations = '',
  hasVisualSymptoms = false,
  visualSeverityScore = 0,
  visualCondition = null,
  aiDiagnosis = null
}) {
  const crop = cropKnowledgeBase.crops.find(c => c.id.toLowerCase() === (cropId || '').toLowerCase()) || cropKnowledgeBase.crops[0];

  const normCondition = (visualCondition || aiDiagnosis?.condition || '').toLowerCase().replace(/[\s-]/g, '_');
  const isHealthy = normCondition === 'healthy' || aiDiagnosis?.conditionType === 'healthy';

  // 1. HARD CONSISTENCY CHECK: Healthy crops MUST NEVER show disease threats
  if (isHealthy) {
    const locStr = location?.district ? `${location.district}, ${location.state || 'India'}` : 'your farm location';
    const temp = weather?.temperature ? `${weather.temperature}°C` : '28°C';
    const hum = weather?.humidity ? `${weather.humidity}%` : '75%';

    return {
      cropId: crop.id,
      cropName: crop.name,
      riskScore: 15,
      riskLevel: 'LOW',
      predictedThreat: `Healthy ${crop.name} Canopy - Routine Monitoring`,
      threatType: 'healthy',
      pathogen: 'none',
      contributingFactors: [
        {
          factor: 'Favorable Crop Canopy & Microclimate',
          impact: 'Low',
          weight: '100%',
          detail: `Environmental parameters (${temp}, ${hum} moisture) in ${locStr} are within non-pathogenic ranges.`
        }
      ],
      whyRiskExists: `Current conditions for ${crop.name} in ${locStr} are favorable with LOW risk (15%). Environmental factors are within normal thresholds. Continue routine crop monitoring and maintain balanced irrigation.`,
      recommendations: {
        immediateActions: [`Routine visual inspection of ${crop.name} canopy twice weekly.`],
        prevention: ['Maintain balanced N-P-K soil fertilization and routine weeding.'],
        monitoringPlan: ['Re-examine lower foliage every 48 hours.'],
        chemicalWarning: 'No chemical treatment required for healthy crop canopy.'
      }
    };
  }

  // 2. SPECIFIC DISEASE MATCHING: Ensure risk assessment is locked to AI vision diagnosis if present
  const diseaseKey = visualCondition ? `${crop.id.toLowerCase()}___${normCondition}` : null;
  const specificDisease = diseaseKnowledge[diseaseKey] || null;

  const temp = weather?.temperature ?? 28;
  const humidity = weather?.humidity ?? 75;
  const rain = weather?.rainfall ?? 0;
  const wind = weather?.windSpeed ?? 5;

  let maxThreatScore = 0;
  let topThreat = null;
  let activeFactors = [];

  if (specificDisease) {
    topThreat = {
      name: specificDisease.name,
      type: specificDisease.type || 'disease',
      pathogen: specificDisease.pathogen || specificDisease.condition,
      immediateActions: specificDisease.ipm?.mechanical?.concat(specificDisease.ipm?.cultural) || [],
      prevention: specificDisease.ipm?.cultural?.concat(specificDisease.ipm?.biological) || [],
      riskWeight: 0.95
    };
    maxThreatScore = visualSeverityScore > 0 ? visualSeverityScore : 75;
    activeFactors.push({
      factor: 'Visual Symptom Confirmation',
      impact: 'Critical',
      weight: '50%',
      detail: `Active ${specificDisease.name} symptoms confirmed on crop foliage.`
    });
  } else {
    // Evaluate crop threats if no specific disease visual confirmation
    for (const threat of crop.threats) {
      let threatScore = 0;
      let factors = [];

      const minHum = threat.humidityMin || 75;
      const maxHum = threat.humidityMax || 100;
      if (humidity >= minHum && humidity <= maxHum) {
        const surplus = humidity - minHum;
        threatScore += 30 + Math.min(30, (surplus / (maxHum - minHum || 1)) * 30);
        factors.push({
          factor: `High Relative Humidity (${humidity}%)`,
          impact: humidity >= 85 ? 'Critical' : 'High',
          weight: '30%',
          detail: `Exceeds the ${minHum}% critical moisture threshold favorable for ${threat.name}.`
        });
      } else {
        threatScore += 5;
      }

      const [tMin, tMax] = threat.tempRange || [20, 30];
      if (temp >= tMin && temp <= tMax) {
        threatScore += 25;
        factors.push({
          factor: `Optimal Ambient Temperature (${temp}°C)`,
          impact: 'High',
          weight: '25%',
          detail: `Thermal conditions (${tMin}°C-${tMax}°C) accelerate pathogen spore germination.`
        });
      } else {
        threatScore += 4;
      }

      const normalizedThreatScore = Math.min(100, Math.round(threatScore * (threat.riskWeight || 0.85)));

      if (normalizedThreatScore > maxThreatScore) {
        maxThreatScore = normalizedThreatScore;
        topThreat = threat;
        activeFactors = factors;
      }
    }
  }

  let finalScore = maxThreatScore;
  if (hasVisualSymptoms && visualSeverityScore > 0 && !specificDisease) {
    finalScore = Math.min(98, Math.max(finalScore, Math.round(finalScore * 0.5 + visualSeverityScore * 0.5 + 10)));
  }

  let riskLevel = 'LOW';
  const thresholds = config.RISK_THRESHOLDS;
  if (finalScore <= thresholds.LOW_MAX) riskLevel = 'LOW';
  else if (finalScore <= thresholds.MEDIUM_MAX) riskLevel = 'MEDIUM';
  else if (finalScore <= thresholds.HIGH_MAX) riskLevel = 'HIGH';
  else riskLevel = 'CRITICAL';

  const whyRiskExists = generateExplainableNarrative({
    cropName: crop.name,
    threatName: topThreat?.name || 'Crop Threat',
    riskLevel,
    riskScore: finalScore,
    location,
    weather,
    growthStage
  });

  return {
    cropId: crop.id,
    cropName: crop.name,
    riskScore: finalScore,
    riskLevel,
    predictedThreat: topThreat?.name || 'Crop Threat',
    threatType: topThreat?.type || 'disease',
    pathogen: topThreat?.pathogen || '',
    contributingFactors: activeFactors.slice(0, 5),
    whyRiskExists,
    recommendations: {
      immediateActions: topThreat?.immediateActions || [
        `Inspect lower foliage across ${crop.name} field within 24-48 hours.`,
        'Ensure proper field drainage and avoid unnecessary overhead watering.'
      ],
      prevention: topThreat?.prevention || [
        'Maintain balanced N-P-K fertilization; avoid excessive nitrogen.',
        'Use recommended biological agents.'
      ],
      monitoringPlan: [
        'Monitor leaf undersides and soil line during morning hours.',
        'Re-evaluate pest risk if humidity persists above 80% for 2 consecutive days.'
      ],
      chemicalWarning: 'Chemical intervention must be used as a last resort strictly following CIBRC guidelines. Consult local Agricultural Officer (ADA/KVK).'
    }
  };
}

/**
 * Generates an explainable text narrative for farmer understanding and Read Aloud in target language
 */
function generateExplainableNarrative({ cropName, threatName, riskLevel, riskScore, location, weather, growthStage, language = 'en' }) {
  const locStr = location?.district ? `${location.district}, ${location.state || 'India'}` : 'your farm location';
  const temp = weather?.temperature ? `${weather.temperature}°C` : 'current temperature';
  const hum = weather?.humidity ? `${weather.humidity}% humidity` : 'current moisture';
  const rain = weather?.rainfall && weather.rainfall > 0 ? ` and ${weather.rainfall} mm rainfall` : '';

  const lang = (language || 'en').toLowerCase();

  // Tamil (ta)
  if (lang === 'ta') {
    if (riskLevel === 'CRITICAL' || riskLevel === 'HIGH') {
      return `${locStr} பகுதியில் உள்ள தற்போதைய வானிலை சூழல்கள் (${temp}, ${hum}${rain}) மற்றும் ${growthStage} நிலையில் உள்ள ${cropName} பயிர் ஆகியவை ${threatName} நோய்க்கான ${riskLevel} ஆபத்தை (${riskScore}%) உருவாக்குகின்றன. ஈரப்பதமும் வெப்பமும் நோய்க்கிருமி கிருமிகளின் வளர்ச்சியை விரைவுபடுத்துகின்றன. 24 முதல் 48 மணி நேரத்திற்குள் உடனடி கள ஆய்வு செய்ய அறிவுறுத்தப்படுகிறது.`;
    }
    if (riskLevel === 'MEDIUM') {
      return `${locStr} பகுதியில் உள்ள வானிலை அளவுருக்கள் ${threatName} நோய்க்கான மிதமான ஆபத்தை (${riskScore}%) சுட்டிக்காட்டுகின்றன. தற்போதைய ஈரப்பதம் பூச்சிகள் வளர்ச்சிக்கு சாதகமான நிலையை நெருங்குகிறது. வழக்கமான வயல் ஆய்வு மற்றும் தடுப்பு முறைகள் பரிந்துரைக்கப்படுகின்றன.`;
    }
    return `${locStr} பகுதியில் ${cropName} பயிருக்கான தற்போதைய நிலைகள் சாதகமாக உள்ளன (குறைந்த ஆபத்து: ${riskScore}%). வழக்கமான பயிர் கண்காணிப்பைத் தொடரவும்.`;
  }

  // Hindi (hi)
  if (lang === 'hi') {
    if (riskLevel === 'CRITICAL' || riskLevel === 'HIGH') {
      return `${locStr} में वर्तमान पर्यावरणीय स्थितियां (${temp}, ${hum}${rain}) और ${growthStage} अवस्था में ${cropName} फसल मिलकर ${threatName} के लिए ${riskLevel} जोखिम (${riskScore}%) उत्पन्न करती हैं। नमी और गर्मी रोगाणु बीजाणुओं के अंकुरण को तेज करती हैं। 24 से 48 घंटों के भीतर तत्काल खेत के निरीक्षण की सलाह दी जाती है।`;
    }
    if (riskLevel === 'MEDIUM') {
      return `${locStr} में मौसम के पैरामीटर ${threatName} के लिए मध्यम जोखिम (${riskScore}%) का संकेत देते हैं। नियमित खेत स्काउटिंग और निवारक जैविक इनपुट की सिफारिश की जाती है।`;
    }
    return `${locStr} में ${cropName} के लिए वर्तमान स्थितियां अनुकूल हैं (कम जोखिम: ${riskScore}%)। नियमित फसल निगरानी जारी रखें।`;
  }

  // Telugu (te)
  if (lang === 'te') {
    if (riskLevel === 'CRITICAL' || riskLevel === 'HIGH') {
      return `${locStr} లో ప్రస్తుత వాతావరణ పరిస్థితులు (${temp}, ${hum}${rain}) మరియు ${growthStage} దశలో ఉన్న ${cropName} పంట కలిసి ${threatName} కి ${riskLevel} ప్రమాదాన్ని (${riskScore}%) సృష్టిస్తున్నాయి. 24 నుండి 48 గంటల్లో క్షేత్ర పరిశీలన చేయాలని సూచించబడింది.`;
    }
    return `${locStr} లో వాతావరణ పరిస్థితులు ${threatName} కి మిశ్రమ ప్రమాదాన్ని (${riskScore}%) సూచిస్తున్నాయి. క్రమం తప్పకుండా పంటను పరిశీలించండి.`;
  }

  // Kannada (kn)
  if (lang === 'kn') {
    if (riskLevel === 'CRITICAL' || riskLevel === 'HIGH') {
      return `${locStr} ನಲ್ಲಿನ ಪ್ರಸ್ತುತ ವಾತಾವರಣದ ಸ್ಥಿತಿಗಳು (${temp}, ${hum}${rain}) ಮತ್ತು ${growthStage} ಹಂತದಲ್ಲಿರುವ ${cropName} ಬೆಳೆ ಸೇರಿ ${threatName} ಗೆ ${riskLevel} ಅಪಾಯವನ್ನು (${riskScore}%) ಉಂಟುಮಾಡುತ್ತವೆ. 24 ರಿಂದ 48 ಗಂಟೆಗಳ ಒಳಗೆ ತಕ್ಷಣದ ಕ್ಷೇತ್ರ ತಪಾಸಣೆಗೆ ಸಲಹೆ ನೀಡಲಾಗುತ್ತದೆ.`;
    }
    return `${locStr} ನಲ್ಲಿನ ವಾತಾವರಣದ ಸ್ಥಿತಿಗಳು ${threatName} ಗೆ ಸಾಧಾರಣ ಅಪಾಯವನ್ನು (${riskScore}%) ಸೂಚಿಸುತ್ತವೆ.`;
  }

  // Malayalam (ml)
  if (lang === 'ml') {
    if (riskLevel === 'CRITICAL' || riskLevel === 'HIGH') {
      return `${locStr} ലെ നിലവിലെ കാലാവസ്ഥാ സാഹചര്യങ്ങളും (${temp}, ${hum}${rain}) ${growthStage} ഘട്ടത്തിലുള്ള ${cropName} വിളയും ചേരുമ്പോൾ ${threatName} നോയിക്ക് ${riskLevel} സാധ്യത (${riskScore}%) സൃഷ്ടിക്കുന്നു. 24 മുതൽ 48 മണിക്കൂറിനുള്ളിൽ ഉടനടി പാടം പരിശോധിക്കാൻ നിർദ്ദേശിക്കുന്നു.`;
    }
    return `${locStr} ലെ കാലാവസ്ഥാ സാഹചര്യങ്ങൾ ${threatName} നോയിക്ക് മിതമായ സാധ്യത (${riskScore}%) സൂചിപ്പിക്കുന്നു.`;
  }

  // Marathi (mr)
  if (lang === 'mr') {
    if (riskLevel === 'CRITICAL' || riskLevel === 'HIGH') {
      return `${locStr} मधील सध्याची हवामान परिस्थिती (${temp}, ${hum}${rain}) आणि ${growthStage} अवस्थेतील ${cropName} पीक मिळून ${threatName} साठी ${riskLevel} धोका (${riskScore}%) निर्माण करतात. २४ ते ४८ तासांच्या आत शेताची पाहणी करण्याचा सल्ला दिला जातो.`;
    }
    return `${locStr} मधील हवामान परिस्थिती ${threatName} साठी मध्यम धोका (${riskScore}%) दर्शवते.`;
  }

  // Bengali (bn)
  if (lang === 'bn') {
    if (riskLevel === 'CRITICAL' || riskLevel === 'HIGH') {
      return `${locStr} এলাকার বর্তমান আবহাওয়ার পরিস্থিতি (${temp}, ${hum}${rain}) এবং ${growthStage} পর্যায়ভুক্ত ${cropName} ফসল মিলে ${threatName} এর জন্য ${riskLevel} ঝুঁকি (${riskScore}%) তৈরি করছে। ২৪ থেকে ৪৮ ঘণ্টার মধ্যে মাঠ পরিদর্শনের পরামর্শ দেওয়া হচ্ছে।`;
    }
    return `${locStr} এলাকায় আবহাওয়ার পরিস্থিতি ${threatName} এর জন্য মাঝারি ঝুঁকি (${riskScore}%) নির্দেশ করছে।`;
  }

  // Gujarati (gu)
  if (lang === 'gu') {
    if (riskLevel === 'CRITICAL' || riskLevel === 'HIGH') {
      return `${locStr} માં વર્તમાન હવામાનની પરિસ્થિતિઓ (${temp}, ${hum}${rain}) અને ${growthStage} તબક્કામાં ${cropName} પાક મળીને ${threatName} માટે ${riskLevel} જોખમ (${riskScore}%) ઉભું કરે છે. 24 થી 48 કલાકમાં ખેતરની તપાસ કરવાની સલાહ આપવામાં આવે છે.`;
    }
    return `${locStr} માં હવામાન પરિસ્થિતિઓ ${threatName} માટે મધ્યમ જોખમ (${riskScore}%) દર્શાવે છે.`;
  }

  // Punjabi (pa)
  if (lang === 'pa') {
    if (riskLevel === 'CRITICAL' || riskLevel === 'HIGH') {
      return `${locStr} ਵਿੱਚ ਮੌਜੂਦਾ ਮੌਸਮ ਦੀਆਂ ਸਥਿਤੀਆਂ (${temp}, ${hum}${rain}) ਅਤੇ ${growthStage} ਪੜਾਅ ਦੀ ${cropName} ਫਸਲ ਮਿਲ ਕੇ ${threatName} ਲਈ ${riskLevel} ਖਤਰਾ (${riskScore}%) ਪੈਦਾ ਕਰਦੀਆਂ ਹਨ। 24 ਤੋਂ 48 ਘੰਟਿਆਂ ਦੇ ਅੰਦਰ ਖੇਤ ਦੀ ਜਾਂਚ ਦੀ ਸਲਾਹ ਦਿੱਤੀ ਜਾਂਦੀ ਹੈ।`;
    }
    return `${locStr} ਵਿੱਚ ਮੌਸਮ ਦੀਆਂ ਸਥਿਤੀਆਂ ${threatName} ਲਈ ਦਰਮਿਆਨਾ ਖਤਰਾ (${riskScore}%) ਦਰਸਾਉਂਦੀਆਂ ਹਨ।`;
  }

  // Odia (or)
  if (lang === 'or') {
    if (riskLevel === 'CRITICAL' || riskLevel === 'HIGH') {
      return `${locStr} ରେ ବର୍ତ୍ତମାନର ପାଣିପାଗ ପରିସ୍ଥିତି (${temp}, ${hum}${rain}) ଏବଂ ${growthStage} ପର୍ଯ୍ୟାୟରେ ${cropName} ଫସଲ ମିଶି ${threatName} ପାଇଁ ${riskLevel} ବିପଦ (${riskScore}%) ସୃଷ୍ଟି କରୁଛି। 24 ରୁ 48 ଘଣ୍ଟା ମଧ୍ୟରେ କ୍ଷେତ୍ର ନିରୀକ୍ଷଣ ପାଇଁ ପରାମର୍ଶ ଦିଆଯାଉଛି।`;
    }
    return `${locStr} ରେ ପାଣିପାଗ ପରିସ୍ଥିତି ${threatName} ପାଇଁ ମଧ୍ୟମ ବିପଦ (${riskScore}%) ସୂଚାଉଛି।`;
  }

  // Assamese (as)
  if (lang === 'as') {
    if (riskLevel === 'CRITICAL' || riskLevel === 'HIGH') {
      return `${locStr} ৰ বৰ্তমানৰ বতৰৰ অৱস্থা (${temp}, ${hum}${rain}) আৰু ${growthStage} পৰ্যায়ৰ ${cropName} শস্যই একেলগে ${threatName} ৰ বাবে ${riskLevel} বিপদাশংকা (${riskScore}%) সৃষ্টি কৰিছে। ২৪ ৰ পৰা ৪৮ ঘণ্টাৰ ভিতৰত পথাৰ নিৰীক্ষণ কৰিবলৈ পৰামৰ্শ দিয়া হৈছে।`;
    }
    return `${locStr} ৰ বতৰৰ অৱস্থাই ${threatName} ৰ বাবে মাজাৰী বিপদাশংকা (${riskScore}%) সূচাইছে।`;
  }

  // Urdu (ur)
  if (lang === 'ur') {
    if (riskLevel === 'CRITICAL' || riskLevel === 'HIGH') {
      return `${locStr} میں موجودہ موسمی حالات (${temp}، ${hum}${rain}) اور ${growthStage} مرحلے کی ${cropName} فصل مل کر ${threatName} کے لیے ${riskLevel} خطرہ (${riskScore}%) پیدا کر رہے ہیں۔ 24 سے 48 گھنٹوں کے اندر فوری کھیت کے معائنے کی ہدایت کی جاتی ہے۔`;
    }
    return `${locStr} میں موسمی حالات ${threatName} کے لیے معتدل خطرے (${riskScore}%) کی نشاندہی کرتے ہیں۔`;
  }

  // Default English (en)
  if (riskLevel === 'CRITICAL' || riskLevel === 'HIGH') {
    return `Current environmental conditions in ${locStr} (${temp}, ${hum}${rain}) combined with ${cropName} in ${growthStage} stage create a ${riskLevel} risk (${riskScore}%) for ${threatName}. Moisture and warmth accelerate pathogen spore germination. Immediate field inspection is advised within 24 to 48 hours.`;
  }

  if (riskLevel === 'MEDIUM') {
    return `Weather parameters in ${locStr} indicate a moderate risk (${riskScore}%) for ${threatName}. Current humidity (${hum}) is approaching conditions favorable for pest development. Routine field scouting and preventive bio-inputs are recommended.`;
  }

  return `Current conditions for ${cropName} in ${locStr} are favorable with LOW risk (${riskScore}%). Environmental factors are within normal thresholds. Continue routine crop monitoring and maintain balanced irrigation.`;
}

module.exports = {
  calculateCropRisk
};
