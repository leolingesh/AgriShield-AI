const axios = require('axios');
const fs = require('fs');
const path = require('path');

const OLLAMA_HOST = process.env.OLLAMA_HOST || 'http://127.0.0.1:11434';
const OLLAMA_MODEL = process.env.OLLAMA_MODEL || 'qwen3-vl:8b';

// Localized non-plant error messages across 13 Indian languages
const NON_PLANT_MESSAGES = {
  en: "This image does not appear to contain a recognizable crop or plant. Please upload a clear photo of a crop leaf, stem, fruit, or whole plant.",
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
  en: "Selected crop is {expectedCrop}, but the image appears to be {detectedCrop}. The diagnosis has been adjusted for the detected crop.",
  ta: "நீங்கள் தேர்ந்தெடுத்த பயிர் {expectedCrop}, ஆனால் படத்தில் இருப்பது {detectedCrop} என கண்டறியப்பட்டுள்ளது.",
  hi: "चुनी गई फसल {expectedCrop} है, लेकिन चित्र में {detectedCrop} दिखाई दे रहा है।",
  te: "ఎంచుకున్న పంట {expectedCrop}, కానీ చిత్రంలో {detectedCrop} ఉంది.",
  kn: "ಆಯ್ಕೆಮಾಡಿದ ಬೆಳೆ {expectedCrop}, ಆದರೆ ಚಿತ್ರದಲ್ಲಿ {detectedCrop} ಕಂಡುಬಂದಿದೆ.",
  ml: "തിരഞ്ഞെടുത്ത വിള {expectedCrop} ആണ്, എന്നാൽ ചിത്രത്തിൽ {detectedCrop} ആണ് കാണപ്പെടുന്നത്.",
  mr: "निवडलेले पीक {expectedCrop} आहे, परंतु फोटोमध्ये {detectedCrop} दिसत आहे.",
  bn: "নির্বাচিত ফসল {expectedCrop}, কিন্তু ছবিতে {detectedCrop} দেখা যাচ্ছে।",
  gu: "પસંદ કરેલ પાક {expectedCrop} છે, પરંતુ છબીમાં {detectedCrop} દેખાય છે.",
  pa: "ਚੁਣੀ ਗਈ ਫ਼ਸਲ {expectedCrop} ਹੈ, ਪਰ ਤਸਵੀਰ ਵਿੱਚ {detectedCrop} ਦਿਖ ਰਿਹਾ ਹੈ।",
  or: "ମନୋନୀତ ଫସଲ {expectedCrop}, କିନ୍ତୁ ଛବିରେ {detectedCrop} ଦେଖାଯାଉଛି।",
  as: "নিৰ্বাচিত শস্য {expectedCrop}, কিন্তু ছবিত {detectedCrop} দেখা গৈছে।",
  ur: "منتخب کردہ فصل {expectedCrop} ہے، لیکن تصویر میں {detectedCrop} نظر آ رہا ہے۔"
};

/**
 * Check if local Ollama server is reachable
 */
async function isOllamaAvailable() {
  try {
    const res = await axios.get(`${OLLAMA_HOST}/api/tags`, { timeout: 1500 });
    if (res.status === 200 && res.data && res.data.models) {
      const hasModel = res.data.models.some(m => m.name.includes('qwen3-vl') || m.name.includes('qwen') || m.name === OLLAMA_MODEL);
      return { available: true, model: hasModel ? OLLAMA_MODEL : res.data.models[0]?.name };
    }
    return { available: false, model: null };
  } catch (err) {
    return { available: false, model: null };
  }
}

/**
 * Analyze crop leaf image using Ollama Multimodal Vision (qwen3-vl:8b)
 */
async function analyzeWithOllama({ imagePath, cropName = 'Tomato', cropId = 'tomato', language = 'en', observations = '' }) {
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

    const systemPrompt = `You are AgriShield AI, an expert agricultural pathologist and computer vision specialist.
Examine this image carefully and answer in strict JSON:
1. Determine if this image is a plant/crop/leaf (image_type: "plant") or an unrelated object/person/animal/building/vehicle (image_type: "non_plant").
2. If image_type is "non_plant", return: {"image_type": "non_plant", "confidence": 0, "condition": "non_plant", "crop": null}.
3. If it is a plant, identify the visible crop/plant (crop_detected), whether it matches ${cropName} (crop_match: true/false), the specific disease/pest or "Healthy" (condition), canonical disease code (diseaseCode), scientific pathogen (pathogen), confidence (0.0 to 1.0), visual severity (Low, Moderate, High, Critical), severityScore (0-100), visual symptoms array, probable causes array, recommended immediate IPM actions array, and prevention array.

Respond ONLY with valid JSON. Schema:
{
  "image_type": "plant",
  "crop": "${cropName}",
  "crop_detected": "tomato",
  "crop_match": true,
  "condition": "Septoria Leaf Spot",
  "diseaseCode": "septoria_leaf_spot",
  "pathogen": "Septoria lycopersici",
  "confidence": 0.94,
  "severity": "High",
  "severityScore": 75,
  "affectedArea": "20-25%",
  "visualSymptoms": ["Dark brown circular spots on lower leaves", "Yellow halo surrounding necrotic spots"],
  "possibleCauses": ["High foliar moisture", "Moderate temperature"],
  "recommendedActions": ["Prune and destroy infected lower leaves", "Avoid overhead sprinkler irrigation"],
  "prevention": ["Maintain 60cm row spacing for canopy airflow", "Apply preventive copper bio-fungicide"],
  "monitoringPlan": ["Inspect lower leaves weekly"],
  "chemicalWarning": "Use chemical sprays strictly under agricultural extension officer supervision.",
  "isExpertVerificationRecommended": false
}`;

    const userPrompt = `Selected Crop: ${cropName}. Field Observations: ${observations || 'None'}. Output Language: ${language}. Analyze image:`;

    const response = await axios.post(
      `${OLLAMA_HOST}/api/chat`,
      {
        model: status.model || OLLAMA_MODEL,
        messages: [
          { role: 'system', content: systemPrompt },
          {
            role: 'user',
            content: userPrompt,
            images: [base64Image]
          }
        ],
        stream: false,
        format: 'json',
        options: {
          temperature: 0.1
        }
      },
      { timeout: 35000 }
    );

    if (response.data && response.data.message && response.data.message.content) {
      let parsed = null;
      try {
        parsed = JSON.parse(response.data.message.content);
      } catch (e) {
        console.warn('[OLLAMA] JSON parse error:', e.message);
        return null;
      }

      // Check for non-plant detection
      if (parsed.image_type === 'non_plant' || parsed.condition === 'non_plant' || parsed.crop_detected === 'none') {
        const localizedMsg = NON_PLANT_MESSAGES[language] || NON_PLANT_MESSAGES.en;
        return {
          supported: false,
          image_type: 'non_plant',
          crop: cropName,
          condition: 'Non-Plant Image',
          diseaseCode: 'non_plant',
          confidence: 0,
          confidenceRating: 'Unrecognized',
          severity: 'None',
          severityScore: 0,
          affectedArea: '0%',
          visualSymptoms: [],
          possibleCauses: [],
          recommendedActions: [],
          prevention: [],
          monitoringPlan: [],
          message: localizedMsg,
          source: `Ollama (${status.model || OLLAMA_MODEL})`
        };
      }

      parsed.source = `Ollama (${status.model || OLLAMA_MODEL})`;
      return parsed;
    }

    return null;
  } catch (err) {
    console.warn('[OLLAMA] Vision analysis fallback triggered:', err.message);
    return null;
  }
}

/**
 * Ask AI question with Ollama LLM
 */
async function askOllama({ question, cropContext = 'Tomato', conditionContext = '', language = 'en' }) {
  try {
    const status = await isOllamaAvailable();
    if (!status.available) {
      return null;
    }

    const systemPrompt = `You are AgriShield AI, a helpful agronomist and crop protection specialist for Indian farmers.
Answer clearly, concisely, and practically in the ${language} language.
Focus on biological and integrated pest management (IPM) controls for ${cropContext} showing ${conditionContext}.`;

    const response = await axios.post(
      `${OLLAMA_HOST}/api/chat`,
      {
        model: status.model || OLLAMA_MODEL,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: question }
        ],
        stream: false,
        options: {
          temperature: 0.3
        }
      },
      { timeout: 25000 }
    );

    if (response.data && response.data.message && response.data.message.content) {
      return response.data.message.content;
    }

    return null;
  } catch (err) {
    console.warn('[OLLAMA] Chat response fallback triggered:', err.message);
    return null;
  }
}

module.exports = {
  isOllamaAvailable,
  analyzeWithOllama,
  askOllama,
  NON_PLANT_MESSAGES,
  CROP_MISMATCH_MESSAGES
};
