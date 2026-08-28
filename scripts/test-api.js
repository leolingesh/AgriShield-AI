const http = require('http');
const path = require('path');
const fs = require('fs');

async function runTests() {
  console.log('====================================================');
  console.log('🧪 Starting AgriShield AI Automated End-to-End Tests');
  console.log('====================================================');

  const app = require('../server/server');

  // Find active port or start test listener
  const PORT = 5055;
  const server = app.listen(PORT);
  await new Promise(resolve => server.on('listening', resolve));

  const baseUrl = `http://127.0.0.1:${PORT}`;

  async function makeRequest(endpoint, options = {}) {
    return new Promise((resolve, reject) => {
      const url = new URL(endpoint, baseUrl);
      const req = http.request(url, {
        method: options.method || 'GET',
        headers: options.headers || {}
      }, (res) => {
        let body = '';
        res.on('data', chunk => body += chunk);
        res.on('end', () => {
          try {
            const json = JSON.parse(body);
            resolve({ status: res.statusCode, data: json });
          } catch (e) {
            resolve({ status: res.statusCode, text: body });
          }
        });
      });
      req.on('error', reject);
      if (options.body) {
        req.write(typeof options.body === 'string' ? options.body : JSON.stringify(options.body));
      }
      req.end();
    });
  }

  let passed = 0;
  let failed = 0;

  async function test(name, fn) {
    try {
      await fn();
      console.log(`  ✅ PASSED: ${name}`);
      passed++;
    } catch (err) {
      console.error(`  ❌ FAILED: ${name} ->`, err.message);
      failed++;
    }
  }

  // 1. Health check
  await test('GET /api/health', async () => {
    const res = await makeRequest('/api/health');
    if (res.status !== 200 || res.data?.status !== 'healthy') {
      throw new Error(`Expected 200 and healthy status, got ${res.status}`);
    }
  });

  // 2. States & Districts
  await test('GET /api/location/states', async () => {
    const res = await makeRequest('/api/location/states');
    if (res.status !== 200 || !res.data?.states?.length) {
      throw new Error(`Expected Indian states list, got ${res.status}`);
    }
  });

  // 3. Reverse geocode
  await test('POST /api/location/reverse-geocode', async () => {
    const res = await makeRequest('/api/location/reverse-geocode', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: { lat: 11.6643, lng: 78.1460 }
    });
    if (res.status !== 200 || !res.data?.location?.state) {
      throw new Error(`Reverse geocode failed with status ${res.status}`);
    }
  });

  // 4. Live Weather
  await test('GET /api/weather?lat=11.66&lng=78.14', async () => {
    const res = await makeRequest('/api/weather?lat=11.66&lng=78.14');
    if (res.status !== 200 || typeof res.data?.weather?.temperature !== 'number') {
      throw new Error(`Weather check failed with status ${res.status}`);
    }
  });

  // 5. Before-Damage Agronomic Risk Engine
  await test('POST /api/risk/predict', async () => {
    const res = await makeRequest('/api/risk/predict', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: {
        cropId: 'tomato',
        cropName: 'Tomato',
        location: { state: 'Tamil Nadu', district: 'Salem' },
        weather: { temperature: 27.5, humidity: 85, rainfall: 14, windSpeed: 6 },
        growthStage: 'Flowering'
      }
    });
    if (res.status !== 200 || !res.data?.riskAssessment?.riskScore) {
      throw new Error(`Risk prediction failed with status ${res.status}`);
    }
  });

  // 6. Dual-Engine Analysis
  await test('POST /api/analyze (Dual-Engine AI + Risk)', async () => {
    const res = await makeRequest('/api/analyze', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: {
        cropName: 'Tomato',
        cropId: 'tomato',
        growthStage: 'Flowering',
        farmerObservations: 'Grey leaf spots on lower leaves',
        sampleImageUrl: '/sample_crops/septoria_tomato.jpg',
        isDemoMode: 'true'
      }
    });
    if (res.status !== 200 || !res.data?.analysis?.aiAnalysis) {
      throw new Error(`Crop analysis failed with status ${res.status}`);
    }
  });

  // 7. Crops & Monitoring list
  await test('GET /api/crops & /api/crops/monitoring/list', async () => {
    const res = await makeRequest('/api/crops');
    const res2 = await makeRequest('/api/crops/monitoring/list');
    if (res.status !== 200 || res2.status !== 200) {
      throw new Error('Crop catalog fetch failed');
    }
  });

  // 8. Analysis History Archive
  await test('GET /api/analyses', async () => {
    const res = await makeRequest('/api/analyses');
    if (res.status !== 200 || !Array.isArray(res.data?.analyses)) {
      throw new Error('Analysis history fetch failed');
    }
  });

  // 9. Early Warning Alerts
  await test('GET /api/alerts', async () => {
    const res = await makeRequest('/api/alerts');
    if (res.status !== 200 || !Array.isArray(res.data?.alerts)) {
      throw new Error('Alerts fetch failed');
    }
  });

  // 10. Admin Outbreak Metrics
  await test('GET /api/admin/metrics', async () => {
    const res = await makeRequest('/api/admin/metrics');
    if (res.status !== 200 || !res.data?.metrics?.systemHealth) {
      throw new Error('Metrics fetch failed');
    }
  });

  server.close();

  console.log('====================================================');
  console.log(`🎉 Automated Tests Completed: ${passed} Passed, ${failed} Failed`);
  console.log('====================================================');

  if (failed > 0) {
    process.exit(1);
  } else {
    process.exit(0);
  }
}

runTests();
