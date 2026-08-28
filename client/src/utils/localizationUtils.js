/**
 * Multilingual dynamic localization dictionary & translator for AgriShield AI Risk Factors & Narratives.
 * Supports all 13 Indian languages: en, ta, hi, te, kn, ml, mr, bn, gu, pa, or, as, ur
 */

const DICTIONARIES = {
  ta: {
    subtitle: "விளக்கமளிக்கும் AI (XAI) விவசாய காரணி பகுப்பாய்வு",
    factorsTitle: "காரணமான சுற்றுச்சூழல் காரணிகள்",
    weight: "எடை",
    critical: "மிக தீவிர அபாயம்",
    high: "அதிக அபாயம்",
    medium: "நடுத்தர அபாயம்",
    low: "குறைந்த அபாயம்",
    estimateNotice: "* வானிலை மற்றும் உயிரியல் காரணிகளை அடிப்படையாகக் கொண்ட AI-உதவி அபாயக் கணிப்பு.",
    factors: {
      "Visual Symptom Confirmation": "காட்சி அறிகுறிகள் உறுதிப்படுத்தல்",
      "High Relative Humidity": "அதிக காற்றில் ஈரப்பதம்",
      "Moderate Humidity": "மிதமான காற்றில் ஈரப்பதம்",
      "Optimal Ambient Temperature": "உகந்த சுற்றுப்புற வெப்பநிலை",
      "Moderate Temperature": "மிதமான வெப்பநிலை",
      "Heavy Recent Rainfall": "சமீபத்திய கனமழை",
      "Light Rainfall / Showers": "லேசான மழை",
      "Morning Dew & Dense Air Moisture": "காலை பனி மற்றும் காற்று ஈரப்பதம்",
      "Critical Crop Stage": "முக்கியமான பயிர் வளர்ச்சி நிலை",
      "Crop Stage": "பயிர் வளர்ச்சி நிலை",
      "Wind Speed": "காற்றின் வேகம்"
    },
    details: {
      "Active pathogen / pest damage identified on crop foliage.": "பயிர் இலைகளில் தீவிர நோய்க்கிருமி / பூச்சி சேதம் கண்டறியப்பட்டது.",
      "Exceeds the": "அதிகரித்துள்ளது",
      "critical moisture threshold favorable for": "நோய்க்கிருமி வளர்ச்சிக்கு சாதகமான முக்கியமான ஈரப்பத வரம்பை விட அதிகமானது:",
      "Approaching favorable moisture levels for": "ஈரப்பத அளவு சாதகமான நிலையை நெருங்குகிறது:",
      "Thermal conditions": "வெப்பநிலை நிலைகள் வித்திகளின் முளைப்பை விரைவுபடுத்துகின்றன:",
      "Near favorable temperature range for": "வெப்பநிலை வரம்பு சாதகமான நிலைக்கு அருகில் உள்ளது:",
      "Precipitation causes soil splash and creates continuous free-water films on foliage.": "மழைப்பொழிவு மண் தெளிப்பை ஏற்படுத்தி இலைகளில் நீர்த்துளிகளை உருவாக்குகிறது.",
      "Moisture increases leaf wetness duration.": "ஈரப்பதம் இலைகளின் ஈரமான கால அளவை அதிகரிக்கிறது.",
      "High air moisture prevents leaves from drying quickly.": "அதிக காற்று ஈரப்பதம் இலைகள் விரைவாக உலர்வதைத் தடுக்கிறது.",
      "Dense canopy during": "வளர்ச்சி நிலையின் போது அடர்த்தியான இலைகள் சூரிய ஒளியையும் காற்றோட்டத்தையும் கட்டுப்படுத்துகின்றன.",
      "Vegetative tissue monitored for early pathogen infection.": "ஆரம்பகால நோய்க்கிருமி தொற்றுக்காக பயிர் திசுக்கள் கண்காணிக்கப்படுகின்றன.",
      "Wind currents facilitate aerial dispersal of fungal spores across adjacent fields.": "காற்றோட்டம் அருகிலுள்ள வயல்களுக்கு பூஞ்சை வித்திகளை பரப்ப உதவுகிறது."
    }
  },
  hi: {
    subtitle: "व्याख्यात्मक AI (XAI) कृषि कारक विश्लेषण",
    factorsTitle: "योगदान देने वाले पर्यावरणीय कारक",
    weight: "भार",
    critical: "अत्यधिक गंभीर जोखिम",
    high: "उच्च जोखिम",
    medium: "मध्यम जोखिम",
    low: "कम जोखिम",
    estimateNotice: "* सूक्ष्म जलवायु और जैविक कारकों पर आधारित AI-सहायता प्राप्त जोखिम अनुमान।",
    factors: {
      "Visual Symptom Confirmation": "दृश्य लक्षणों की पुष्टि",
      "High Relative Humidity": "उच्च सापेक्ष आर्द्रता",
      "Moderate Humidity": "मध्यम सापेक्ष आर्द्रता",
      "Optimal Ambient Temperature": "अनुकूल परिवेश तापमान",
      "Moderate Temperature": "मध्यम तापमान",
      "Heavy Recent Rainfall": "हाल की भारी वर्षा",
      "Light Rainfall / Showers": "हल्की वर्षा / बौछारें",
      "Morning Dew & Dense Air Moisture": "सुबह की ओस और हवा की नमी",
      "Critical Crop Stage": "क्रिटिकल फसल अवस्था",
      "Crop Stage": "फसल अवस्था",
      "Wind Speed": "हवा की गति"
    },
    details: {
      "Active pathogen / pest damage identified on crop foliage.": "फसल की पत्तियों पर सक्रिय रोगाणु/कीट क्षति की पहचान की गई।",
      "Exceeds the": "अधिक है",
      "critical moisture threshold favorable for": "के लिए अनुकूल नमी सीमा से अधिक है:",
      "Approaching favorable moisture levels for": "के लिए अनुकूल नमी स्तर के करीब पहुँच रहा है:",
      "Thermal conditions": "तापीय स्थितियां बीजाणु अंकुरण को तेज करती हैं:",
      "Near favorable temperature range for": "के लिए अनुकूल तापमान सीमा के करीब है:",
      "Precipitation causes soil splash and creates continuous free-water films on foliage.": "वर्षा से मिट्टी की छीटें पड़ती हैं और पत्तियों पर पानी की परत बनती है।",
      "Moisture increases leaf wetness duration.": "नमी पत्तियों के गीले रहने की अवधि बढ़ाती है।",
      "High air moisture prevents leaves from drying quickly.": "हवा की अधिक नमी पत्तियों को जल्दी सूखने नहीं देती।",
      "Dense canopy during": "अवस्था के दौरान सघन कैनोपी धूप और हवा को रोकती है।",
      "Vegetative tissue monitored for early pathogen infection.": "प्रारंभिक रोगाणु संक्रमण के लिए वनस्पति ऊतकों की निगरानी की जाती है।",
      "Wind currents facilitate aerial dispersal of fungal spores across adjacent fields.": "हवा के प्रवाह से आस-पास के खेतों में कवक बीजाणुओं का फैलाव होता है।"
    }
  },
  te: {
    subtitle: "వివరణాత్మక AI (XAI) వ్యవసాయ కారకాల విశ్లేషణ",
    factorsTitle: "కారణమైన పర్యావరణ కారకాలు",
    weight: "బరువు",
    critical: "అత్యంత తీవ్రమైన ప్రమాదం",
    high: "అధిక ప్రమాదం",
    medium: "మధ్యస్థ ప్రమాదం",
    low: "తక్కువ ప్రమాదం",
    estimateNotice: "* సూక్ష్మ వాతావరణం మరియు జీవసంబంధిత కారకాల ఆధారంగా AI ప్రమాద అంచనా.",
    factors: {
      "Visual Symptom Confirmation": "దృశ్య లక్షణాల నిర్ధారణ",
      "High Relative Humidity": "అధిక సాపేక్ష తేమ",
      "Moderate Humidity": "మధ్యస్థ తేమ",
      "Optimal Ambient Temperature": "అనుకూల ఉష్ణోగ్రత",
      "Moderate Temperature": "మధ్యస్థ ఉష్ణోగ్రత",
      "Heavy Recent Rainfall": "ఇటీవలి భారీ వర్షపాతం",
      "Light Rainfall / Showers": "తేలికపాటి వర్షం",
      "Morning Dew & Dense Air Moisture": "ఉదయం మంచు & గాలిలో తేమ",
      "Critical Crop Stage": "కీలకమైన పంట దశ",
      "Crop Stage": "పంట దశ",
      "Wind Speed": "గాలి వేగం"
    }
  },
  kn: {
    subtitle: "ವಿವರಣಾತ್ಮಕ AI (XAI) ಕೃಷಿ ಅಂಶಗಳ ವಿಶ್ಲೇಷಣೆ",
    factorsTitle: "ಕಾರಣವಾದ ವಾತಾವರಣದ ಅಂಶಗಳು",
    weight: "ತೂಕ",
    critical: "ಅತ್ಯಂತ ತೀವ್ರ ಅಪಾಯ",
    high: "ಹೆಚ್ಚಿನ ಅಪಾಯ",
    medium: "ಮಧ್ಯಮ ಅಪಾಯ",
    low: "ಕಡಿಮೆ ಅಪಾಯ",
    estimateNotice: "* ಸೂಕ್ಷ್ಮ ಹವಾಮಾನ ಆಧಾರಿತ AI ಅಪಾಯದ ಅಂದಾಜು.",
    factors: {
      "Visual Symptom Confirmation": "ದೃಶ್ಯ ರೋಗಲಕ್ಷಣಗಳ ದೃಢೀಕರಣ",
      "High Relative Humidity": "ಹೆಚ್ಚಿನ ಆಪೇಕ್ಷಿಕ ತೇವಾಂಶ",
      "Moderate Humidity": "ಮಧ್ಯಮ ತೇವಾಂಶ",
      "Optimal Ambient Temperature": "ಅನುಕೂಲಕರ ತಾಪಮಾನ",
      "Moderate Temperature": "ಮಧ್ಯಮ ತಾಪಮಾನ",
      "Heavy Recent Rainfall": "ಇತ್ತೀಚಿನ ಭಾರಿ ಮಳೆ",
      "Light Rainfall / Showers": "ಸಣ್ಣ ಮಳೆ",
      "Morning Dew & Dense Air Moisture": "ಬೆಳಗಿನ ಇಬ್ಬನಿ ಮತ್ತು ಗಾಳಿಯ ತೇವಾಂಶ",
      "Critical Crop Stage": "ಸಂವೇದನಾಶೀಲ ಬೆಳೆಯ ಹಂತ",
      "Crop Stage": "ಬೆಳೆಯ ಹಂತ",
      "Wind Speed": "ಗಾಳಿಯ ವೇಗ"
    }
  },
  ml: {
    subtitle: "വിശദീകരണ AI (XAI) കാർഷിക ഘടക വിശകലനം",
    factorsTitle: "കാരണമായ പാരിസ്ഥിതിക ഘടകങ്ങൾ",
    weight: "ഭാരം",
    critical: "അതീവ ഗുരുതര സാധ്യത",
    high: "ഉയർന്ന സാധ്യത",
    medium: "മിതമായ സാധ്യത",
    low: "കുറഞ്ഞ സാധ്യത",
    estimateNotice: "* സൂക്ഷ്മ കാലാവസ്ഥയെ അടിസ്ഥാനമാക്കിയുള്ള AI അപകടസാധ്യത അനുമാനം.",
    factors: {
      "Visual Symptom Confirmation": "ദൃശ്യ ലക്ഷണങ്ങളുടെ സ്ഥിരീകരണം",
      "High Relative Humidity": "ഉയർന്ന ആപേക്ഷിക ഈർപ്പം",
      "Moderate Humidity": "മിതമായ ഈർപ്പം",
      "Optimal Ambient Temperature": "അനുയോജ്യമായ താപനില",
      "Moderate Temperature": "മിതമായ താപനില",
      "Heavy Recent Rainfall": "സമീപകാല ശക്തമായ മഴ",
      "Light Rainfall / Showers": "നേരിയ മഴ",
      "Morning Dew & Dense Air Moisture": "പ്രഭാത മഞ്ഞും വായുവിലെ ഈർപ്പവും",
      "Critical Crop Stage": "നിർണ്ണായക വിള ഘട്ടം",
      "Crop Stage": "വിള ഘട്ടം",
      "Wind Speed": "കാറ്റിന്റെ വേഗത"
    }
  },
  mr: {
    subtitle: "स्पष्टीकरणात्मक AI (XAI) कृषी घटक विश्लेषण",
    factorsTitle: "कारणीभूत पर्यावरणीय घटक",
    weight: "भार",
    critical: "अत्यंत गंभीर धोका",
    high: "उच्च धोका",
    medium: "मध्यम धोका",
    low: "कमी धोका",
    estimateNotice: "* सूक्ष्म हवामानावर आधारित AI धोका अंदाज.",
    factors: {
      "Visual Symptom Confirmation": "दृश्य लक्षणांची पुष्टी",
      "High Relative Humidity": "उच्च सापेक्ष आर्द्रता",
      "Moderate Humidity": "मध्यम आर्द्रता",
      "Optimal Ambient Temperature": "अनुकूल तापमान",
      "Moderate Temperature": "मध्यम तापमान",
      "Heavy Recent Rainfall": "अलीकडील मुसळधार पाऊस",
      "Light Rainfall / Showers": "हलका पाऊस",
      "Morning Dew & Dense Air Moisture": "सकाळचे दव आणि हवेतील ओलसरपणा",
      "Critical Crop Stage": "संवेदनशील पीक अवस्था",
      "Crop Stage": "पीक अवस्था",
      "Wind Speed": "वाऱ्याचा वेग"
    }
  },
  bn: {
    subtitle: "ব্যাখ্যাযোগ্য AI (XAI) কৃষি উপাদান বিশ্লেষণ",
    factorsTitle: "কারণমূলক পরিবেশগত উপাদানসমূহ",
    weight: "ওজন",
    critical: "অত্যন্ত সংকটজনক ঝুঁকি",
    high: "উচ্চ ঝুঁকি",
    medium: "মাঝারি ঝুঁকি",
    low: "কম ঝুঁকি",
    estimateNotice: "* অনুআবহাওয়ার ওপর ভিত্তি করে AI ঝুঁকি অনুমান।",
    factors: {
      "Visual Symptom Confirmation": "দৃশ্যমান লক্ষণের নিশ্চিতকরণ",
      "High Relative Humidity": "উচ্চ আপেক্ষিক আর্দ্রতা",
      "Moderate Humidity": "মাঝারি আর্দ্রতা",
      "Optimal Ambient Temperature": "অনুকূল তাপমাত্রা",
      "Moderate Temperature": "মাঝারি তাপমাত্রা",
      "Heavy Recent Rainfall": "সাম্প্রতিক ভারী বৃষ্টিপাত",
      "Light Rainfall / Showers": "হালকা বৃষ্টিপাত",
      "Morning Dew & Dense Air Moisture": "সকালের শিশির ও বাতাসের আর্দ্রতা",
      "Critical Crop Stage": "সংবেদনশীল ফসলের পর্যায়",
      "Crop Stage": "ফসলের পর্যায়",
      "Wind Speed": "বাতাসের গতি"
    }
  },
  gu: {
    subtitle: "સ્પષ્ટીકરણાત્મક AI (XAI) કૃષિ પરિબળ વિશ્લેષણ",
    factorsTitle: "કારણભૂત પર્યાવરણીય પરિબળો",
    weight: "વજન",
    critical: "અત્યંત ગંભીર જોખમ",
    high: "ઉચ્ચ જોખમ",
    medium: "મધ્યમ જોખમ",
    low: "ઓછું જોખમ",
    estimateNotice: "* હવામાન આધારિત AI જોખમ અંદાજ.",
    factors: {
      "Visual Symptom Confirmation": "દ્રશ્ય લક્ષણોની પૃષ્ટિ",
      "High Relative Humidity": "ઉચ્ચ સાપેક્ષ ભેજ",
      "Moderate Humidity": "મધ્યમ ભેજ",
      "Optimal Ambient Temperature": "અનુકૂળ તાપમાન",
      "Moderate Temperature": "મધ્યમ તાપમાન",
      "Heavy Recent Rainfall": "તાજેતરનો ભારે વરસાદ",
      "Light Rainfall / Showers": "હળવો વરસાદ",
      "Morning Dew & Dense Air Moisture": "સવારનું ઝાકળ અને હવામાં ભેજ",
      "Critical Crop Stage": "નાજુક પાક અવસ્થા",
      "Crop Stage": "પાક અવસ્થા",
      "Wind Speed": "પવની ઝડપ"
    }
  },
  pa: {
    subtitle: "ਵਿਆਖਿਆਯੋਗ AI (XAI) ਖੇਤੀਬਾੜੀ ਕਾਰਕ ਵਿਸ਼ਲੇਸ਼ਣ",
    factorsTitle: "ਯੋਗਦਾਨ ਪਾਉਣ ਵਾਲੇ ਵਾਤਾਵਰਣਕ ਕਾਰਕ",
    weight: "ਭਾਰ",
    critical: "ਅਤਿ ਗੰਭੀਰ ਖਤਰਾ",
    high: "ਉੱਚ ਖਤਰਾ",
    medium: "ਦਰਮਿਆਨਾ ਖਤਰਾ",
    low: "ਘੱਟ ਖਤਰਾ",
    estimateNotice: "* ਮੌਸਮ ਆਧਾਰਿਤ AI ਖਤਰੇ ਦਾ ਅਨੁਮਾਨ।",
    factors: {
      "Visual Symptom Confirmation": "ਦ੍ਰਿਸ਼ਮਾਨ ਲੱਛਣਾਂ ਦੀ ਪੁਸ਼ਟੀ",
      "High Relative Humidity": "ਉੱਚ ਸਾਪੇਖਿਕ ਨਮੀ",
      "Moderate Humidity": "ਦਰਮਿਆਨੀ ਨਮੀ",
      "Optimal Ambient Temperature": "ਅਨੁਕੂਲ ਤਾਪਮਾਨ",
      "Moderate Temperature": "ਦਰਮਿਆਨਾ ਤਾਪਮਾਨ",
      "Heavy Recent Rainfall": "ਹਾਲ ਹੀ ਦੀ ਭਾਰੀ ਬਾਰਿਸ਼",
      "Light Rainfall / Showers": "ਹਲਕੀ ਬਾਰਿਸ਼",
      "Morning Dew & Dense Air Moisture": "ਸਵੇਰ ਦੀ ਤ੍ਰੇਲ ਅਤੇ ਹਵਾ ਦੀ ਨਮੀ",
      "Critical Crop Stage": "ਨਾਜ਼ੁਕ ਫਸਲ ਦਾ ਪੜਾਅ",
      "Crop Stage": "ਫਸਲ ਦਾ ਪੜਾਅ",
      "Wind Speed": "ਹਵਾ ਦੀ ਗਤੀ"
    }
  },
  or: {
    subtitle: "ବ୍ୟାଖ୍ୟାଯୋଗ୍ୟ AI (XAI) କୃଷି କାରକ ବିଶ୍ଳେଷଣ",
    factorsTitle: "କାରଣମୂଳକ ପରିବେଶ କାରକ",
    weight: "ଓଜନ",
    critical: "ଅତ୍ୟନ୍ତ ଗମ୍ଭୀର ବିପଦ",
    high: "ଉଚ୍ଚ ବିପଦ",
    medium: "ମଧ୍ୟମ ବିପଦ",
    low: "କମ୍ ବିପଦ",
    estimateNotice: "* ପାଣିପାଗ ଉପରେ ଆଧାରିତ AI ବିପଦ ଅନୁମାନ।",
    factors: {
      "Visual Symptom Confirmation": "ଦୃଶ୍ୟମାନ ଲକ୍ଷଣର ନିଶ୍ଚିତକରଣ",
      "High Relative Humidity": "ଉଚ୍ଚ ଆପେକ୍ଷିକ ଆର୍ଦ୍ରତା",
      "Moderate Humidity": "ମଧ୍ୟମ ଆର୍ଦ୍ରତା",
      "Optimal Ambient Temperature": "ଅନୁକୂଳ ତାପମାତ୍ରା",
      "Moderate Temperature": "ମଧ୍ୟମ ତାପମାତ୍ରା",
      "Heavy Recent Rainfall": "ସାମ୍ପ୍ରତିକ ଭାରୀ ବର୍ଷା",
      "Light Rainfall / Showers": "ହାଲୁକା ବର୍ଷା",
      "Morning Dew & Dense Air Moisture": "ସକାଳର କାକର ଓ ବାୟୁର ଆର୍ଦ୍ରତା",
      "Critical Crop Stage": "ସମ୍ବେଦନଶୀଳ ଫସଲ ପର୍ଯ୍ୟାୟ",
      "Crop Stage": "ଫସଲ ପର୍ଯ୍ୟାୟ",
      "Wind Speed": "ପବନର ବେଗ"
    }
  },
  as: {
    subtitle: "ব্যাখ্যাযোগ্য AI (XAI) কৃষি উপাদান বিশ্লেষণ",
    factorsTitle: "কাৰণমূলক পৰিৱেশগত উপাদানসমূহ",
    weight: "ওজন",
    critical: "অত্যন্ত সংকটজনক বিপদাশংকা",
    high: "উচ্চ বিপদাশংকা",
    medium: "মাজাৰী বিপদাশংকা",
    low: "কম বিপদাশংকা",
    estimateNotice: "* বতৰৰ ওপৰত ভিত্তি কৰি AI বিপদাশংকা অনুমান।",
    factors: {
      "Visual Symptom Confirmation": "দৃশ্যমান লক্ষণৰ নিশ্চিতকৰণ",
      "High Relative Humidity": "উচ্চ আপেক্ষিক আৰ্দ্ৰতা",
      "Moderate Humidity": "মাজাৰী আৰ্দ্ৰতা",
      "Optimal Ambient Temperature": "অনুকূল তাপমাত্রা",
      "Moderate Temperature": "মাজাৰী তাপমাত্রা",
      "Heavy Recent Rainfall": "শেহতীয়া প্ৰবল বৃষ্টিপাত",
      "Light Rainfall / Showers": "পাতল বৃষ্টিপাত",
      "Morning Dew & Dense Air Moisture": "পুৱাৰ নিয়ৰ আৰু বতাহৰ আৰ্দ্ৰতা",
      "Critical Crop Stage": "সংবেদনশীল শস্যৰ পৰ্যায়",
      "Crop Stage": "শস্যৰ পৰ্যায়",
      "Wind Speed": "বতাহৰ গতি"
    }
  },
  ur: {
    subtitle: "وضاحتی AI (XAI) زرعی عوامل کا تجزیہ",
    factorsTitle: "اہم ماحولیاتی عوامل",
    weight: "وزن",
    critical: "انتہائی شدید خطرہ",
    high: "زیادہ خطرہ",
    medium: "معتدل خطرہ",
    low: "کم خطرہ",
    estimateNotice: "* مائیکرو آب و ہوا پر مبنی AI خطرے کا تخمینہ۔",
    factors: {
      "Visual Symptom Confirmation": "بصری علامات کی تصدیق",
      "High Relative Humidity": "زیادہ ہوائی نمی",
      "Moderate Humidity": "معتدل ہوائی نمی",
      "Optimal Ambient Temperature": "مناسب درجہ حرارت",
      "Moderate Temperature": "معتدل درجہ حرارت",
      "Heavy Recent Rainfall": "حالیہ شدید بارش",
      "Light Rainfall / Showers": "ہلکی بارش",
      "Morning Dew & Dense Air Moisture": "صبح کی شبنم اور ہوا کی نمی",
      "Critical Crop Stage": "حساس فصل کا مرحلہ",
      "Crop Stage": "فصل کا مرحلہ",
      "Wind Speed": "ہوا کی رفتار"
    }
  }
};

/**
 * Translates factor title, weight label, and factor details into target language code.
 */
export function localizeFactor(factorObj, langCode = 'en') {
  if (!factorObj || langCode === 'en' || !DICTIONARIES[langCode]) {
    return factorObj;
  }

  const dict = DICTIONARIES[langCode];
  let factorName = factorObj.factor || '';
  let detailText = factorObj.detail || '';

  // Match factor key
  for (const [engKey, transName] of Object.entries(dict.factors)) {
    if (factorName.toLowerCase().includes(engKey.toLowerCase())) {
      // Retain numbers inside parentheses e.g. (66%) or (27.8°C)
      const numMatch = factorName.match(/\([^)]+\)/);
      const suffix = numMatch ? ` ${numMatch[0]}` : '';
      factorName = `${transName}${suffix}`;
      break;
    }
  }

  // Match detail substrings
  if (dict.details) {
    for (const [engSub, transSub] of Object.entries(dict.details)) {
      if (detailText.includes(engSub)) {
        detailText = detailText.replace(engSub, transSub);
      }
    }
  }

  return {
    ...factorObj,
    factor: factorName,
    detail: detailText
  };
}

/**
 * Returns localized string for UI elements in ExplainableWhy & Recommendations
 */
export function getXAIString(key, langCode = 'en', fallback = '') {
  if (langCode === 'en' || !DICTIONARIES[langCode] || !DICTIONARIES[langCode][key]) {
    return fallback;
  }
  return DICTIONARIES[langCode][key];
}
