const axios = require('axios');
const path = require('path');
const fs = require('fs');

const BASE_URL = process.env.API_BASE_URL || 'http://localhost:5000';

async function runApiTests() {
  console.log('==================================================');
  console.log('   AGRISHIELD AI — END-TO-END API TEST SUITE');
  console.log(`   Target Server: ${BASE_URL}`);
  console.log('==================================================\n');

  // Test 1: GET /api/ai/health
  console.log('1. Testing GET /api/ai/health...');
  try {
    const res = await axios.get(`${BASE_URL}/api/ai/health`, { timeout: 4000 });
    console.log('✓ Health Endpoint Status: 200 OK');
    console.log('  Response:', JSON.stringify(res.data, null, 2));
  } catch (err) {
    console.warn(`⚠️ /api/ai/health error (is backend running on ${BASE_URL}?):`, err.message);
  }

  // Test 2: POST /api/ai/ask
  console.log('\n2. Testing POST /api/ai/ask (Farmer Voice/Text Query)...');
  try {
    const res = await axios.post(`${BASE_URL}/api/ai/ask`, {
      question: 'What preventive measures should I take for Septoria Leaf Spot in Tomato?',
      cropName: 'Tomato',
      language: 'en',
      location: { district: 'Chengalpattu', state: 'Tamil Nadu' },
      weather: { temperature: 31, humidity: 79 }
    }, { timeout: 35000 });

    console.log('✓ Ask AI Status: 200 OK');
    console.log('  Answer Snippet:', (res.data.answer || '').slice(0, 180) + '...');
  } catch (err) {
    console.warn('⚠️ /api/ai/ask error:', err.message);
  }

  console.log('\n==================================================');
  console.log('   API TEST SUITE FINISHED');
  console.log('==================================================\n');
}

runApiTests().catch(e => console.error(e));
