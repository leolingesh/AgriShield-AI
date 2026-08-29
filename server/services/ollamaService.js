const axios = require('axios');
const fs = require('fs');
const path = require('path');

const OLLAMA_HOST = process.env.OLLAMA_HOST || 'http://127.0.0.1:11434';
const OLLAMA_MODEL = process.env.OLLAMA_MODEL || 'qwen3-vl:8b';

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
async function analyzeWithOllama({ imagePath, cropName = 'Tomato', language = 'en', observations = '' }) {
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

    const systemPrompt = `You are AgriShield AI, an expert agricultural pathologist and pest management specialist.
Analyze this crop leaf photo for ${cropName}.
Respond ONLY in valid raw JSON with this exact schema:
{
  "crop": "${cropName}",
  "condition": "Specific Disease Name (e.g. Septoria Leaf Spot, Early Blight, Blossom End Rot, Leaf Blast, Pink Bollworm, Healthy)",
  "diseaseCode": "canonical_disease_code",
  "pathogen": "Scientific pathogen name",
  "confidence": 0.92,
  "severity": "Moderate",
  "severityScore": 65,
  "affectedArea": "15-20%",
  "visualSymptoms": ["Symptom 1", "Symptom 2"],
  "possibleCauses": ["High humidity", "Warm temperature"],
  "recommendedActions": ["Immediate IPM action 1", "Action 2"],
  "prevention": ["Prevention tip 1", "Prevention tip 2"],
  "chemicalWarning": "Use chemical sprays strictly under agricultural officer supervision."
}`;

    const userPrompt = `Crop: ${cropName}. Field observations: ${observations || 'None'}. Language: ${language}. Analyze the visual symptoms in this leaf image.`;

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
          temperature: 0.2
        }
      },
      { timeout: 45000 }
    );

    if (response.data && response.data.message && response.data.message.content) {
      const parsed = JSON.parse(response.data.message.content);
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

    const systemPrompt = `You are AgriShield AI, a helpful agronomist assistant for Indian farmers. Answer clearly and concisely in ${language} language. Give actionable biological and cultural remedies for ${cropContext} showing ${conditionContext}.`;

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
          temperature: 0.4
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
  askOllama
};
