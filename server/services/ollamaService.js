const axios = require('axios');
const fs = require('fs');
const path = require('path');

const OLLAMA_HOST = process.env.OLLAMA_HOST || 'http://127.0.0.1:11434';
const OLLAMA_MODEL = process.env.OLLAMA_MODEL || 'qwen3-vl:8b';

// Language code to human language name map
const LANGUAGE_NAMES = {
  en: 'English',
  ta: 'Tamil (தமிழ்)',
  hi: 'Hindi (हिन्दी)',
  te: 'Telugu (తెలుగు)',
  kn: 'Kannada (ಕನ್ನಡ)',
  ml: 'Malayalam (മലയാളം)',
  mr: 'Marathi (मराठी)',
  bn: 'Bengali (বাংলা)',
  gu: 'Gujarati (ગુજરાતી)',
  pa: 'Punjabi (ਪੰਜਾਬੀ)',
  or: 'Odia (ଓଡ଼ିଆ)',
  as: 'Assamese (অসমীয়া)',
  ur: 'Urdu (اردو)'
};

// Localized non-plant error messages across 13 Indian languages
const NON_PLANT_MESSAGES = {
  en: "This image does not appear to contain a recognizable crop or plant. Please upload a clear photo of a crop leaf, stem, fruit, or plant.",
  ta: "இந்த புகைப்படத்தில் பயிர் அல்லது தாவரம் தெளிவாக இல்லை. தயவுசெய்து பயிரின் இலை, தண்டு அல்லது காய் தெரியும் தெளிவான புகைப்படத்தை பதிவேற்றவும்.",
  hi: "यह चित्र किसी फसल या पौधे का प्रतीत नहीं होता है। कृपया फसल की पत्ती, तना या फल की स्पष्ट तस्वीर अपलोड करें।",
  te: "ఈ చిత్రంలో పంట లేదా మొక్క గుర్తించబడలేదు. దయచేసి పంట ఆకు, కాండం లేదా పండు యొక్క స్పష్టమైన ఫోటోను అప్‌లోడ్ చేయండి.",
  kn: "ಈ ಚಿತ್ರದಲ್ಲಿ ಯಾವುದೇ ಬೆಳೆ ಅಥವಾ ಸಸ್ಯ ಗುರುತಿಸಲಾಗಿಲ್ಲ. ದಯವಿಟ್ಟು ಬೆಳೆಯ ಎಲೆ, ಕಾಂಡ ಅಥವಾ ಹಣ್ಣಿನ ಸ್ಪಷ್ಟ ಫೋಟೋವನ್ನು ಅಪ್‌ಲೋಡ್ ಮಾಡಿ.",
  ml: "ഈ ചിത്രത്തിൽ വിളയോ സസ്യമോ തിരിച്ചറിയാൻ കഴിഞ്ഞില്ല. ദയവായി വിളയുടെ ഇല, തണ്ട് അല്ലെങ്കിൽ പഴം വ്യക്തമായി കാണുന്ന ഫോട്ടോ അപ്‌ലോഡ് ചെയ്യുക.",
  mr: "या छायाचित्रात कोणतेही पीक किंवा वनस्पती दिसत नाही. कृपया पिकाचे पान, खोड किंवा फळाचा स्पष्ट फोटो अपलोड करा.",
  bn: "এই ছবিতে কোনো চেনা ফসল বা উদ্ভিদ দেখা যাচ্ছে না। অনুগ্রহ করে ফসলের পাতা, কাণ্ড বা ফলের একটি পরিষ্কার ছবি আপলোড করুন।",
  gu: "આ ચિત્રમાં કોઈ ઓળખી શકાય તેવો પાક કે છોડ દેખાતો નથી. કૃપા કરીને પાકના પાન, થડ કે ફળનો સ્પષ્ટ ફોટો અપલોડ કરો.",
  pa: "ਇਸ ਤਸਵੀਰ ਵਿੱਚ ਕੋਈ ਪਛਾਣਨਯੋਗ ਫ਼ਸਲ ਜਾਂ ਪੌਦਾ ਨਜ਼ਰ ਨਹੀਂ ਆ ਰਿਹਾ। ਕਿਰਪਾ ਕਰਕੇ ਪੱਤੇ ਜਾਂ ਫ਼ਸਲ ਦੀ ਸਪਸ਼ਟ ਫੋਟੋ ਅੱਪਲੋਡ ਕਰੋ।",
  or: "ଏହି ଛବିରେ କୌଣସି ଚିହ୍ନିତ ଫସଲ କିମ୍ବା ଉଦ୍ଭିଦ ଦେଖାଯାଉ ନାହିଁ। ଦୟାକରି ଫସଲର ପତ୍ର କିମ୍ବା ଫଳର ଏକ ସ୍ପଷ୍ଟ ଫଟୋ ଅପଲୋଡ୍ କରନ୍ତୁ।",
  as: "এই ছবিত কোনো চিনাক্তযোগ্য শস্য বা উদ্ভিদ দেখা যোৱা নাই। অনুগ্ৰহ কৰি শস্যৰ পাত বা ফলৰ এখন স্পষ্ট ফটো আপলোড কৰক।",
  ur: "اس تصویر میں کوئی قابل شناخت فصل یا پودا نظر نہیں آرہا ہے۔ براہ کرم فصل کے پتے، تنے یا پھل کی واضح تصویر اپ لوڈ کریں۔"
};

// Localized crop mismatch messages
const CROP_MISMATCH_MESSAGES = {
  en: "Selected crop is {expectedCrop}, but AI identified {detectedCrop}. The diagnosis has been adjusted for the detected crop.",
  ta: "நீங்கள் தேர்ந்தெடுத்த பயிர் {expectedCrop}, ஆனால் AI {detectedCrop} என கண்டறிந்துள்ளது.",
  hi: "चुनी गई फसल {expectedCrop} है, लेकिन AI ने {detectedCrop} की पहचान की है।",
  te: "ఎంచుకున్న పంట {expectedCrop}, కానీ AI {detectedCrop} ని గుర్తించింది.",
  kn: "ಆಯ್ಕೆಮಾಡಿದ ಬೆಳೆ {expectedCrop}, ಆದರೆ AI {detectedCrop} ಎಂದು ಗುರುತಿಸಿದೆ.",
  ml: "തിരഞ്ഞെടുത്ത വിള {expectedCrop} ആണ്, എന്നാൽ AI {detectedCrop} തിരിച്ചറിഞ്ഞു.",
  mr: "निवडलेले पीक {expectedCrop} आहे, परंतु AI ने {detectedCrop} ओळखले आहे.",
  bn: "নির্বাচিত ফসল {expectedCrop}, কিন্তু AI {detectedCrop} শনাক্ত করেছে।",
  gu: "પસંદ કરેલ પાક {expectedCrop} છે, પરંતુ AI એ {detectedCrop} ઓળખ્યો છે.",
  pa: "ਚੁਣੀ ਗਈ ਫ਼ਸਲ {expectedCrop} ਹੈ, ਪਰ AI ਨੇ {detectedCrop} ਦੀ ਪਛਾਣ ਕੀਤੀ ਹੈ।",
  or: "ମନୋନୀତ ଫସଲ {expectedCrop}, କିନ୍ତୁ AI {detectedCrop} ଚିହ୍ନଟ କରିଛି।",
  as: "নিৰ্বাচিত শস্য {expectedCrop}, কিন্তু AI এ {detectedCrop} চিনাক্ত কৰিছে।",
  ur: "منتخب کردہ فصل {expectedCrop} ہے، لیکن AI نے {detectedCrop} کی شناخت کی ہے۔"
};

/**
 * Check if local Ollama server is reachable
 */
async function isOllamaAvailable() {
  try {
    const res = await axios.get(`${OLLAMA_HOST}/api/tags`, { timeout: 1500 });
    if (res.status === 200 && res.data && res.data.models) {
      const hasModel = res.data.models.some(m => m.name.includes('qwen3-vl') || m.name.includes('qwen') || m.name === OLLAMA_MODEL);
      return { available: true, model: hasModel ? OLLAMA_MODEL : res.data.models[0]?.name, host: OLLAMA_HOST };
    }
    return { available: false, model: null, host: OLLAMA_HOST };
  } catch (err) {
    return { available: false, model: null, host: OLLAMA_HOST };
  }
}

/**
 * Clean and parse JSON response from Ollama
 */
function parseOllamaJson(rawText) {
  if (!rawText || typeof rawText !== 'string') return null;
  let text = rawText.trim();

  // Strip Markdown JSON code fence
  if (text.startsWith('```json')) {
    text = text.slice(7);
  } else if (text.startsWith('```')) {
    text = text.slice(3);
  }
  if (text.endsWith('```')) {
    text = text.slice(0, -3);
  }
  text = text.trim();

  // Try parsing direct JSON
  try {
    return JSON.parse(text);
  } catch (e) {
    // If there is surrounding prose, extract the first {...} block
    const firstBrace = text.indexOf('{');
    const lastBrace = text.lastIndexOf('}');
    if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
      try {
        const extracted = text.substring(firstBrace, lastBrace + 1);
        return JSON.parse(extracted);
      } catch (err2) {
        return null;
      }
    }
    return null;
  }
}

/**
 * Primary Multimodal Vision AI Analysis for All 10 Supported Crops (Tomato, Rice, Wheat, Cotton, Potato, Chilli, Maize, Sugarcane, Onion, Groundnut)
 */
async function analyzeWithOllama({
  imagePath,
  cropName = 'Tomato',
  cropId = 'tomato',
  language = 'en',
  observations = '',
  weather = null,
  location = null
}) {
  try {
    const status = await isOllamaAvailable();
    if (!status.available) {
      return null;
    }

    let base64Image = '';
    if (imagePath && fs.existsSync(imagePath)) {
      base64Image = fs.readFileSync(imagePath, { encoding: 'base64' });
    }

    if (!base64Image) {
      return null;
    }

    // Section 30 Required Structured Logging
    console.log('==================================================');
    console.log('[AgriShield] Image analysis started');
    console.log('[AgriShield] AI Engine: Ollama');
    console.log(`[AgriShield] Model: ${status.model || OLLAMA_MODEL}`);
    console.log(`[AgriShield] Selected Crop: ${cropName} (${cropId})`);
    console.log(`[AgriShield] Image received: Base64 payload (${Math.round(base64Image.length * 0.75 / 1024)} KB)`);
    console.log(`[AgriShield] Sending image to Ollama at ${OLLAMA_HOST}/api/chat...`);

    const systemPrompt = `You are AgriShield AI, an agricultural crop and plant disease vision assistant.

Analyze the uploaded image carefully.

First determine whether the image contains:
- a plant, crop, leaf, fruit, stem, flower, or agricultural field (image_type: "plant")
- an unrelated object, human face/selfie, vehicle, animal, building, electronic device, furniture, sky, or non-agricultural item (image_type: "non_plant")

If it is NOT a plant/crop/agricultural image, DO NOT invent a crop or disease.
Return:
{
  "image_type": "non_plant",
  "confidence": 0.98,
  "warning": "Please upload a clear photo of a crop, leaf, fruit, stem, or plant for disease analysis."
}

If it IS a plant:
1. Identify the crop visible in the image. Supported AgriShield crops are:
   Tomato, Rice / Paddy, Wheat, Cotton, Potato, Chilli / Pepper, Maize / Corn, Sugarcane, Onion, Groundnut / Peanut.
2. The image itself is authoritative for crop identification.
   - If selectedCrop (${cropName}) matches the detected crop: crop_match = true
   - If selectedCrop (${cropName}) differs from the detected crop: crop_match = false
3. Identify the specific disease, pest infestation, nutrient disorder, or "Healthy" condition.
4. Estimate severity ("Low", "Moderate", "High", "Critical") and severityScore (0-100).
5. Estimate confidence (0.0 to 1.0).
6. List visual symptoms, visual evidence from the image, probable environmental causes, recommended immediate IPM actions, long-term prevention measures, and monitoring plan.

Return STRICT JSON only matching this exact schema:
{
  "image_type": "plant",
  "detected_crop": "tomato",
  "crop_match": true,
  "confidence": 0.92,
  "image_quality": "good",
  "condition_type": "disease",
  "condition": "Septoria Leaf Spot",
  "diseaseCode": "septoria_leaf_spot",
  "pathogen": "Septoria lycopersici",
  "severity": "High",
  "severityScore": 75,
  "affected_area_percent": 25,
  "symptoms": ["Dark brown circular spots on lower leaves", "Yellow halo surrounding necrotic spots"],
  "visual_evidence": ["Distinct circular necrotic lesions with dark margins"],
  "possible_causes": ["High foliar humidity and moisture", "Foliar fungal spore germination"],
  "immediate_actions": ["Prune and destroy infected lower leaves", "Avoid overhead sprinkler irrigation"],
  "prevention": ["Maintain proper row spacing for canopy aeration", "Apply preventive copper bio-fungicide"],
  "monitoring": ["Inspect lower leaves weekly for expanding lesions"],
  "warning": "Consult local Krishi Vigyan Kendra (KVK) agricultural extension officer before applying chemical pesticides."
}`;

    const userPrompt = `Selected Crop: ${cropName}. Field Observations: ${observations || 'None'}. Output Language: ${language}. Analyze image:`;

    const makeOllamaCall = async (retryPrompt = null) => {
      const messages = [
        { role: 'system', content: retryPrompt ? `${systemPrompt}\n\nIMPORTANT: Return ONLY valid JSON. No markdown fences, no explanatory text.` : systemPrompt },
        {
          role: 'user',
          content: userPrompt,
          images: [base64Image]
        }
      ];

      return await axios.post(
        `${OLLAMA_HOST}/api/chat`,
        {
          model: status.model || OLLAMA_MODEL,
          messages,
          stream: false,
          format: 'json',
          options: {
            temperature: 0.1
          }
        },
        { timeout: Number(process.env.OLLAMA_TIMEOUT) || 90000 }
      );
    };

    let response = await makeOllamaCall();
    let parsed = null;

    if (response.data && response.data.message && response.data.message.content) {
      parsed = parseOllamaJson(response.data.message.content);
    }

    // If initial parsing failed, retry once with strict formatting instructions
    if (!parsed) {
      console.warn('[AgriShield] Retrying Ollama call with strict JSON instructions...');
      response = await makeOllamaCall(true);
      if (response.data && response.data.message && response.data.message.content) {
        parsed = parseOllamaJson(response.data.message.content);
      }
    }

    if (!parsed) {
      console.warn('[AgriShield] Failed to obtain valid JSON from Ollama Qwen3-VL');
      return null;
    }

    console.log('[AgriShield] Ollama response received');
    console.log(`[AgriShield] Image Type: ${parsed.image_type || 'plant'}`);
    console.log(`[AgriShield] Detected crop: ${parsed.detected_crop || parsed.crop || cropName}`);
    console.log(`[AgriShield] Condition: ${parsed.condition || parsed.diseaseCode || 'Healthy'}`);
    console.log(`[AgriShield] Confidence: ${parsed.confidence || 0.9}`);
    console.log('==================================================');

    // Handle non-plant image detection
    if (parsed.image_type === 'non_plant' || parsed.condition === 'non_plant' || parsed.crop_detected === 'none') {
      const localizedMsg = NON_PLANT_MESSAGES[language] || NON_PLANT_MESSAGES.en;
      return {
        supported: false,
        image_type: 'non_plant',
        crop: cropName,
        detected_crop: 'none',
        crop_match: false,
        condition: 'Non-Plant Image',
        diseaseCode: 'non_plant',
        confidence: 0,
        confidenceRating: 'Unrecognized',
        severity: 'None',
        severityScore: 0,
        affectedArea: '0%',
        visualSymptoms: [],
        visual_evidence: [],
        possibleCauses: [],
        recommendedActions: [],
        prevention: [],
        monitoringPlan: [],
        message: localizedMsg,
        warning: localizedMsg,
        source: `Ollama (${status.model || OLLAMA_MODEL})`
      };
    }

    // Handle poor image quality
    if (parsed.image_quality === 'poor' || parsed.condition_type === 'uncertain') {
      return {
        supported: false,
        image_type: 'uncertain',
        image_quality: 'poor',
        crop: cropName,
        detected_crop: parsed.detected_crop || cropName,
        crop_match: parsed.crop_match !== false,
        condition: 'Low Quality Image',
        diseaseCode: 'uncertain',
        confidence: parsed.confidence || 0.35,
        confidenceRating: 'Uncertain / Low Confidence',
        severity: 'Low',
        severityScore: 20,
        affectedArea: 'Unknown',
        visualSymptoms: ['Image too blurry or dark for diagnostic feature extraction'],
        visual_evidence: parsed.visual_evidence || [],
        possibleCauses: [],
        recommendedActions: ['Upload a clearer, well-lit photograph of the affected plant leaf'],
        prevention: [],
        monitoringPlan: [],
        message: 'Image quality is insufficient for reliable diagnosis. Please upload a clearer photo.',
        source: `Ollama (${status.model || OLLAMA_MODEL})`
      };
    }

    // Normalize output structure
    const detectedCrop = parsed.detected_crop || parsed.crop || cropName;
    const selectedCropNorm = (cropId || cropName || 'tomato').toLowerCase();
    const detectedCropNorm = detectedCrop.toLowerCase();
    const cropMatch = parsed.crop_match !== undefined ? parsed.crop_match : (detectedCropNorm.includes(selectedCropNorm) || selectedCropNorm.includes(detectedCropNorm));

    const finalResult = {
      supported: true,
      image_type: 'plant',
      crop: detectedCrop.charAt(0).toUpperCase() + detectedCrop.slice(1),
      detected_crop: detectedCrop,
      selected_crop: cropName,
      crop_match: cropMatch,
      condition: parsed.condition || 'Healthy',
      diseaseCode: parsed.diseaseCode || (parsed.condition || 'healthy').toLowerCase().replace(/[\s-]/g, '_'),
      pathogen: parsed.pathogen || '',
      confidence: parsed.confidence || 0.92,
      confidenceRating: (parsed.confidence || 0.92) >= 0.85 ? 'High Confidence' : 'Medium Confidence',
      severity: parsed.severity || 'Moderate',
      severityScore: parsed.severityScore || (parsed.severity === 'High' ? 75 : (parsed.severity === 'Critical' ? 90 : 50)),
      affectedArea: parsed.affected_area_percent ? `${parsed.affected_area_percent}%` : (parsed.affectedArea || '15-20%'),
      visualSymptoms: parsed.symptoms || parsed.visualSymptoms || ['Leaf spots observed on foliage'],
      visual_evidence: parsed.visual_evidence || [],
      possibleCauses: parsed.possible_causes || parsed.possibleCauses || ['Environmental moisture suitability'],
      recommendedActions: parsed.immediate_actions || parsed.recommendedActions || ['Inspect surrounding plants and practice IPM'],
      prevention: parsed.prevention || ['Maintain canopy ventilation and avoid excess wetting'],
      monitoringPlan: parsed.monitoring || parsed.monitoringPlan || ['Scout crop canopy weekly'],
      chemicalWarning: parsed.warning || parsed.chemicalWarning || 'Consult local Krishi Vigyan Kendra (KVK) officer before applying any chemical pesticides.',
      source: `Ollama (${status.model || OLLAMA_MODEL})`
    };

    return finalResult;
  } catch (err) {
    console.warn('[AgriShield] Ollama Vision execution error:', err.message);
    return null;
  }
}

/**
 * Ask AI question with Ollama LLM (Multilingual Agronomic Advisory)
 */
async function askOllama({
  question,
  cropContext = 'Tomato',
  conditionContext = '',
  severityContext = 'Moderate',
  language = 'en',
  location = null,
  weather = null,
  growthStage = 'Vegetative',
  observations = ''
}) {
  try {
    const status = await isOllamaAvailable();
    if (!status.available) {
      return null;
    }

    const langName = LANGUAGE_NAMES[language] || 'English';

    console.log('==================================================');
    console.log('[AgriShield] Ask Question Request Received');
    console.log(`[AgriShield] Model: ${status.model || OLLAMA_MODEL}`);
    console.log(`[AgriShield] Question: "${question}"`);
    console.log(`[AgriShield] Target Language: ${langName} (${language})`);
    console.log(`[AgriShield] Calling ${OLLAMA_HOST}/api/chat...`);

    const systemPrompt = `You are AgriShield AI, an expert agricultural pathologist and integrated pest management (IPM) advisor for Indian farmers.
Respond ENTIRELY in the ${langName} language (${language}).
Do NOT use English sentences when responding in Indian languages (Tamil, Hindi, Telugu, etc.), except for necessary scientific Latin names (e.g. Trichoderma viride), registered chemical active ingredients, or standard metric units.
Provide clear, practical, actionable, and environmentally safe advice tailored to Indian agricultural conditions and Krishi Vigyan Kendra (KVK) recommendations.
When advising on chemical control, always include safety advisories (PPE, dosage adherence, and consulting agricultural extension officers).`;

    const weatherSnippet = weather ? `Live Weather: Temp ${weather.temperature || 28}°C, Humidity ${weather.humidity || 75}%, Rainfall ${weather.rainfall || 0}mm, Wind ${weather.windSpeed || 5} km/h.` : '';
    const locationSnippet = location?.district ? `Farmer Location: ${location.village ? `${location.village}, ` : ''}${location.district}, ${location.state || ''}.` : '';

    const userPrompt = `Crop Context: ${cropContext}
${conditionContext ? `Diagnosed Condition: ${conditionContext} (${severityContext} severity)` : ''}
Growth Stage: ${growthStage}
${observations ? `Farmer Field Observations: ${observations}` : ''}
${locationSnippet}
${weatherSnippet}

Farmer's Question: "${question}"

Answer completely in ${langName}:`;

    const response = await axios.post(
      `${OLLAMA_HOST}/api/chat`,
      {
        model: status.model || OLLAMA_MODEL,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        stream: false,
        options: {
          temperature: 0.3
        }
      },
      { timeout: Number(process.env.OLLAMA_TIMEOUT) || 90000 }
    );

    if (response.data && response.data.message && response.data.message.content) {
      console.log('[AgriShield] Ollama conversational answer generated successfully');
      console.log('==================================================');
      return response.data.message.content.trim();
    }

    return null;
  } catch (err) {
    console.warn('[AgriShield] Ollama Ask AI fallback triggered:', err.message);
    return null;
  }
}

module.exports = {
  isOllamaAvailable,
  analyzeWithOllama,
  askOllama,
  NON_PLANT_MESSAGES,
  CROP_MISMATCH_MESSAGES,
  LANGUAGE_NAMES
};
