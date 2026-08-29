const path = require('path');
const fs = require('fs');
const { isOllamaAvailable, analyzeWithOllama, askOllama } = require('../server/services/ollamaService');

async function runOllamaTests() {
  console.log('==================================================');
  console.log('   AGRISHIELD AI — OLLAMA QWEN3-VL:8B TEST SUITE');
  console.log('==================================================\n');

  // TEST 1: Ollama Availability & Model Check
  console.log('TEST 1: Checking Ollama Health & Model Presence...');
  const health = await isOllamaAvailable();
  if (health.available) {
    console.log(`✓ Ollama is REACHABLE at ${health.host}`);
    console.log(`✓ Active Multimodal Model: ${health.model}\n`);
  } else {
    console.warn(`⚠️ Ollama not reachable at ${health.host}. (Make sure 'ollama serve' is running)\n`);
  }

  // TEST 2: Multilingual Agronomic Question Answering
  console.log('TEST 2: Multilingual Question Answering (Tamil)...');
  const tamilQuestion = 'என் தக்காளி பயிரில் இலைப்புள்ளி நோய் உள்ளது. இயற்கை முறையில் எவ்வாறு கட்டுப்படுத்துவது?';
  console.log(`Question: "${tamilQuestion}"`);
  const tamilAnswer = await askOllama({
    question: tamilQuestion,
    cropContext: 'Tomato',
    conditionContext: 'Septoria Leaf Spot',
    severityContext: 'High',
    language: 'ta'
  });
  if (tamilAnswer) {
    console.log(`✓ Ollama Tamil Response received:\n"${tamilAnswer.slice(0, 160)}..."\n`);
  } else {
    console.warn('⚠️ Ollama Tamil question test bypassed or offline.\n');
  }

  // TEST 3: Multilingual Agronomic Question Answering (Hindi)
  console.log('TEST 3: Multilingual Question Answering (Hindi)...');
  const hindiQuestion = 'धान की फसल में झोंका रोग (ब्लास्ट) से बचाव के लिए क्या उपाय करें?';
  console.log(`Question: "${hindiQuestion}"`);
  const hindiAnswer = await askOllama({
    question: hindiQuestion,
    cropContext: 'Rice',
    conditionContext: 'Leaf Blast',
    severityContext: 'Moderate',
    language: 'hi'
  });
  if (hindiAnswer) {
    console.log(`✓ Ollama Hindi Response received:\n"${hindiAnswer.slice(0, 160)}..."\n`);
  } else {
    console.warn('⚠️ Ollama Hindi question test bypassed or offline.\n');
  }

  // TEST 4: Multimodal Vision Analysis with Real Image
  console.log('TEST 4: Multimodal Vision Analysis (Tomato Leaf)...');
  const sampleImagePath = path.join(__dirname, '..', 'client', 'public', 'sample_crops', 'septoria_tomato.jpg');
  if (fs.existsSync(sampleImagePath)) {
    console.log(`Using sample image: ${sampleImagePath}`);
    const visionResult = await analyzeWithOllama({
      imagePath: sampleImagePath,
      cropName: 'Tomato',
      cropId: 'tomato',
      language: 'en',
      observations: 'Circular spots with yellow halos on lower leaves'
    });

    if (visionResult) {
      console.log('✓ Vision Result:');
      console.log(`  - Image Type: ${visionResult.image_type}`);
      console.log(`  - Detected Crop: ${visionResult.detected_crop || visionResult.crop}`);
      console.log(`  - Condition: ${visionResult.condition}`);
      console.log(`  - Severity: ${visionResult.severity}`);
      console.log(`  - Confidence: ${visionResult.confidence}`);
      console.log(`  - Symptoms: ${(visionResult.visualSymptoms || []).slice(0, 2).join('; ')}`);
      console.log(`  - Immediate Action: ${(visionResult.recommendedActions || []).slice(0, 1).join('; ')}\n`);
    } else {
      console.warn('⚠️ Vision analysis returned null (offline/timeout).\n');
    }
  } else {
    console.log(`Sample image not found at ${sampleImagePath}, skipping vision test.`);
  }

  console.log('==================================================');
  console.log('   OLLAMA TEST SUITE COMPLETED');
  console.log('==================================================\n');
}

runOllamaTests().catch(err => console.error('Ollama test runner error:', err));
