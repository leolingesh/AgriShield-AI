const fs = require('fs');
const path = require('path');

const LOCALES_DIR = path.join(__dirname, '..', 'client', 'src', 'locales');

const TRANSLATIONS = {
  en: {
    crop: {
      visionAiBadge: "Vision AI",
      visionAiSupportedAll: "AI Vision Supported"
    },
    result: {
      cropMismatchTitle: "Crop Mismatch Detected",
      cropMismatchDesc: "Selected crop: {selectedCrop}, but AI detected: {detectedCrop}. The diagnosis below has been adjusted for the detected crop."
    }
  },
  ta: {
    crop: {
      visionAiBadge: "விஷன் AI",
      visionAiSupportedAll: "AI பார்வை ஆதரவு"
    },
    result: {
      cropMismatchTitle: "பயிர் பொருந்தாமை கண்டறியப்பட்டது",
      cropMismatchDesc: "தேர்ந்தெடுக்கப்பட்ட பயிர்: {selectedCrop}, ஆனால் AI கண்டறிந்தது: {detectedCrop}. நோயறிதல் கண்டறியப்பட்ட பயிருக்கு ஏற்ப சரிசெய்யப்பட்டுள்ளது."
    }
  },
  hi: {
    crop: {
      visionAiBadge: "विज़न AI",
      visionAiSupportedAll: "AI विज़न समर्थित"
    },
    result: {
      cropMismatchTitle: "फसल बेमेल का पता चला",
      cropMismatchDesc: "चुनी गई फसल: {selectedCrop}, लेकिन AI ने पहचाना: {detectedCrop}। नीचे दिया गया निदान पहचानी गई फसल के अनुसार है।"
    }
  },
  te: {
    crop: {
      visionAiBadge: "విజన్ AI",
      visionAiSupportedAll: "AI విజన్ మద్దతు"
    },
    result: {
      cropMismatchTitle: "పంట అసమతుల్యత గుర్తించబడింది",
      cropMismatchDesc: "ఎంచుకున్న పంట: {selectedCrop}, కానీ AI గుర్తించింది: {detectedCrop}. దిగువ రోగ నిర్ధారణ గుర్తించిన పంటకు సర్దుబాటు చేయబడింది."
    }
  },
  kn: {
    crop: {
      visionAiBadge: "ವಿಷನ್ AI",
      visionAiSupportedAll: "AI ವಿಷನ್ ಬೆಂಬಲಿತ"
    },
    result: {
      cropMismatchTitle: "ಬೆಳೆ ಹೊಂದಾಣಿಕೆಯಾಗದಿರುವುದು ಪತ್ತೆಯಾಗಿದೆ",
      cropMismatchDesc: "ಆಯ್ಕೆಮಾಡಿದ ಬೆಳೆ: {selectedCrop}, ಆದರೆ AI ಪತ್ತೆಹಚ್ಚಿದ್ದು: {detectedCrop}. ರೋಗನಿರ್ಣಯವನ್ನು ಪತ್ತೆಯಾದ ಬೆಳೆಗೆ ಸರಿಹೊಂದಿಸಲಾಗಿದೆ."
    }
  },
  ml: {
    crop: {
      visionAiBadge: "വിഷൻ AI",
      visionAiSupportedAll: "AI വിഷൻ പിന്തുണയുള്ളത്"
    },
    result: {
      cropMismatchTitle: "വിള പൊരുത്തക്കേട് കണ്ടെത്തി",
      cropMismatchDesc: "തിരഞ്ഞെടുത്ത വിള: {selectedCrop}, എന്നാൽ AI കണ്ടെത്തിയത്: {detectedCrop}. രോഗനിർണയം കണ്ടെത്തിയ വിളയ്ക്കായി ക്രമീകരിച്ചിരിക്കുന്നു."
    }
  },
  mr: {
    crop: {
      visionAiBadge: "व्हिजन AI",
      visionAiSupportedAll: "AI व्हिजन समर्थित"
    },
    result: {
      cropMismatchTitle: "पीक जुळत नसल्याचे आढळले",
      cropMismatchDesc: "निवडलेले पीक: {selectedCrop}, परंतु AI ने ओळखले: {detectedCrop}. खालील निदान ओळखलेल्या पिकासाठी समायोजित केले आहे."
    }
  },
  bn: {
    crop: {
      visionAiBadge: "ভিশন AI",
      visionAiSupportedAll: "AI ভিশন সমর্থিত"
    },
    result: {
      cropMismatchTitle: "ফসল অমিল সনাক্ত হয়েছে",
      cropMismatchDesc: "নির্বাচিত ফসল: {selectedCrop}, কিন্তু AI শনাক্ত করেছে: {detectedCrop}। নিচের রোগ নির্ণয় সনাক্ত ফসলের সাথে সমন্বয় করা হয়েছে।"
    }
  },
  gu: {
    crop: {
      visionAiBadge: "વિઝન AI",
      visionAiSupportedAll: "AI વિઝન સમર્થિત"
    },
    result: {
      cropMismatchTitle: "પાક મેળ ખાતો નથી",
      cropMismatchDesc: "પસંદ કરેલ પાક: {selectedCrop}, પરંતુ AI એ ઓળખ્યો: {detectedCrop}. નીચેનું નિદાન ઓળખાયેલા પાક માટે ગોઠવવામાં આવ્યું છે."
    }
  },
  pa: {
    crop: {
      visionAiBadge: "ਵਿਜ਼ਨ AI",
      visionAiSupportedAll: "AI ਵਿਜ਼ਨ ਸਮਰਥਿਤ"
    },
    result: {
      cropMismatchTitle: "ਫ਼ਸਲ ਮੇਲ ਨਹੀਂ ਖਾਂਦੀ",
      cropMismatchDesc: "ਚੁਣੀ ਗਈ ਫ਼ਸਲ: {selectedCrop}, ਪਰ AI ਨੇ ਪਛਾਣ ਕੀਤੀ: {detectedCrop}। ਹੇਠਾਂ ਦਿੱਤਾ ਨਿਦਾਨ ਪਛਾਣੀ ਗਈ ਫ਼ਸਲ ਅਨੁਸਾਰ ਹੈ।"
    }
  },
  or: {
    crop: {
      visionAiBadge: "ଭିଜନ AI",
      visionAiSupportedAll: "AI ଭିଜନ ସମର୍ଥିତ"
    },
    result: {
      cropMismatchTitle: "ଫସଲ ଅସଙ୍ଗତି ଚିହ୍ନଟ ହୋଇଛି",
      cropMismatchDesc: "ମନୋନୀତ ଫସଲ: {selectedCrop}, କିନ୍ତୁ AI ଚିହ୍ନଟ କରିଛି: {detectedCrop}। ନିମ୍ନ ନିଦାନ ଚିହ୍ନଟ ଫସଲ ପାଇଁ ସଜାଡ଼ିତ ହୋଇଛି।"
    }
  },
  as: {
    crop: {
      visionAiBadge: "ভিজন AI",
      visionAiSupportedAll: "AI ভিজন সমৰ্থিত"
    },
    result: {
      cropMismatchTitle: "শস্য অমিল চিনাক্ত কৰা হৈছে",
      cropMismatchDesc: "নিৰ্বাচিত শস্য: {selectedCrop}, কিন্তু AI এ চিনাক্ত কৰিছে: {detectedCrop}। তলৰ নিদান চিনাক্ত শস্যৰ বাবে সালসলনি কৰা হৈছে।"
    }
  },
  ur: {
    crop: {
      visionAiBadge: "ویژن AI",
      visionAiSupportedAll: "AI ویژن سپورٹڈ"
    },
    result: {
      cropMismatchTitle: "فصل کی عدم مطابقت پائی گئی",
      cropMismatchDesc: "منتخب کردہ فصل: {selectedCrop}، لیکن AI نے شناخت کی: {detectedCrop}۔ نیچے دی گئی تشخیص شناخت شدہ فصل کے لیے ایڈجسٹ کی گئی ہے۔"
    }
  }
};

for (const [lang, updates] of Object.entries(TRANSLATIONS)) {
  const filePath = path.join(LOCALES_DIR, `${lang}.json`);
  if (!fs.existsSync(filePath)) continue;

  const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));

  if (!data.crop) data.crop = {};
  Object.assign(data.crop, updates.crop);

  if (!data.result) data.result = {};
  Object.assign(data.result, updates.result);

  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
  console.log(`Updated ${lang}.json successfully.`);
}
