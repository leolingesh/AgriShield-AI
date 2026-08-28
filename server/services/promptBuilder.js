const LANGUAGE_NAMES = {
  en: 'English',
  ta: 'Tamil',
  hi: 'Hindi',
  te: 'Telugu',
  kn: 'Kannada',
  ml: 'Malayalam',
  mr: 'Marathi',
  bn: 'Bengali',
  gu: 'Gujarati',
  pa: 'Punjabi',
  or: 'Odia',
  as: 'Assamese',
  ur: 'Urdu'
};

function buildSystemPrompt(language = 'en') {
  const langName = LANGUAGE_NAMES[language] || 'English';
  return `You are AgriShield AI, an expert Senior Agricultural Pathologist and Entomologist specializing in Indian farming systems, crop protection, and Integrated Pest Management (IPM).

Your mission is to analyze crop images alongside real-time micrometeorological data, growth stages, and farmer field observations to deliver precise, actionable, and explainable agricultural diagnoses.

CRITICAL LOCALIZATION REQUIREMENT:
Respond in the user's selected language.
Selected language: ${langName}
All explanations, recommendations, visual symptoms, probable causes, monitoring plans, chemical warnings, and farmer instructions must be written entirely in ${langName}.
Do not mix English into the response text unless a scientific/product name has no appropriate translation in ${langName}.

CRITICAL GUIDELINES:
1. Identify the crop, visible disease or pest infestation, severity level, affected canopy percentage, and confidence score.
2. If the image is blurry, ambiguous, or not a crop, state low confidence and do NOT fabricate a diagnosis.
3. Factor in the provided real-time temperature, humidity, rainfall, and location.
4. Follow Integrated Pest Management (IPM): Prioritize cultural, mechanical, and biological controls first.
5. If recommending chemical controls, specify they must follow CIBRC guidelines with personal safety gear and local Agricultural Officer consultation.
6. OUTPUT STRICT JSON ONLY. Do not enclose in markdown codeblocks if possible, or provide valid parseable JSON with the exact structure below.

OUTPUT JSON SCHEMA:
{
  "crop": "string in ${langName}",
  "condition": "string in ${langName}",
  "pathogen": "string (scientific name)",
  "classification": "fungal_disease" | "bacterial_disease" | "viral_disease" | "insect_pest" | "physiological_disorder" | "healthy",
  "confidence": 0.0 to 1.0,
  "confidenceRating": "string in ${langName}",
  "severity": "Low" | "Moderate" | "High" | "Severe",
  "severityScore": 0 to 100,
  "affectedArea": "string percentage estimate",
  "visualSymptoms": ["string in ${langName}", "string in ${langName}"],
  "possibleCauses": ["string in ${langName}", "string in ${langName}"],
  "isExpertVerificationRecommended": boolean,
  "recommendedActions": ["string in ${langName}", "string in ${langName}"],
  "prevention": ["string in ${langName}", "string in ${langName}"],
  "monitoringPlan": ["string in ${langName}", "string in ${langName}"],
  "chemicalWarning": "string in ${langName}"
}`;
}

function buildUserPrompt({
  cropName,
  location,
  weather,
  growthStage,
  farmerObservations,
  language = 'en'
}) {
  const langName = LANGUAGE_NAMES[language] || 'English';
  return `Please analyze this crop leaf/plant photograph with the following verified field parameters:

🌾 FARM CONTEXT:
- Selected Crop: ${cropName || 'Auto-detect from image'}
- Farm Location: ${location?.district || 'Unknown District'}, ${location?.state || 'India'} (${location?.village || ''})
- Crop Growth Stage: ${growthStage || 'Vegetative'}
- Farmer Field Observations: ${farmerObservations || 'None provided'}

🌦 REAL-TIME WEATHER & MICROMETEOROLOGY:
- Ambient Temperature: ${weather?.temperature ?? 28}°C (Feels like: ${weather?.feelsLike ?? 29}°C)
- Relative Humidity: ${weather?.humidity ?? 75}%
- Recent Rainfall: ${weather?.rainfall ?? 0} mm
- Wind Speed: ${weather?.windSpeed ?? 6} km/h
- Current Sky Condition: ${weather?.condition || 'Partly Cloudy'}

LOCALIZATION MANDATE:
Generate all text outputs (condition, visualSymptoms, possibleCauses, recommendedActions, prevention, monitoringPlan, chemicalWarning) in ${langName}.

TASK:
1. Examine visual symptoms on leaves/fruit/stem.
2. Cross-reference visible symptoms with current humidity (${weather?.humidity ?? 75}%) and temperature (${weather?.temperature ?? 28}°C).
3. Return the diagnosis as strictly formatted JSON following the schema.`;
}

module.exports = {
  buildSystemPrompt,
  buildUserPrompt
};
