const express = require('express');
const router = express.Router();
const path = require('path');
const { upload } = require('../services/storageService');
const { analyzeCropImage } = require('../services/aiService');
const { calculateCropRisk } = require('../services/riskEngine');
const { getWeatherData } = require('../services/weatherService');
const { generateEarlyWarningAlert } = require('../services/notificationService');
const Analysis = require('../models/Analysis');
const { isMongoConnected, fallbackStore, persistFallback } = require('../config/db');

// POST /api/analyze - Full Dual-Engine Analysis (Vision AI + Agronomic Risk Scoring)
router.post('/', upload.single('image'), async (req, res) => {
  try {
    const {
      cropName = 'Tomato',
      cropId = 'tomato',
      growthStage = 'Vegetative',
      farmerObservations = '',
      isDemoMode = 'false',
      demoCaseId = '',
      sampleImageUrl = '',
      language = 'en'
    } = req.body;

    let location = {};
    try {
      location = req.body.location ? JSON.parse(req.body.location) : { state: 'Tamil Nadu', district: 'Salem' };
    } catch (e) {
      location = { state: 'Tamil Nadu', district: 'Salem' };
    }

    let weather = null;
    try {
      weather = req.body.weather ? JSON.parse(req.body.weather) : null;
    } catch (e) {
      weather = null;
    }

    // Fetch real weather if not provided
    if (!weather && location.lat && location.lng) {
      weather = await getWeatherData(location.lat, location.lng);
    } else if (!weather) {
      weather = await getWeatherData(11.6643, 78.1460); // Default Salem, TN
    }

    // Determine image path & relative URL
    let imagePath = '';
    let imageUrl = '';

    if (req.file) {
      imagePath = req.file.path;
      imageUrl = `/uploads/${req.file.filename}`;
    } else if (sampleImageUrl) {
      imageUrl = sampleImageUrl;
      imagePath = path.join(__dirname, '..', '..', 'client', 'public', sampleImageUrl.replace(/^\//, ''));
    } else {
      imageUrl = '/sample_crops/septoria_tomato.jpg';
      imagePath = path.join(__dirname, '..', '..', 'client', 'public', 'sample_crops', 'septoria_tomato.jpg');
    }

    const isDemo = (isDemoMode === 'true' || isDemoMode === true) && !req.file;

    // 1. Dual-Engine Part A: Multimodal Vision AI Analysis
    const aiResult = await analyzeCropImage({
      imagePath,
      imageName: req.file ? req.file.originalname : path.basename(imageUrl),
      cropName,
      cropId,
      location,
      weather,
      growthStage,
      farmerObservations,
      language,
      forceDemoMode: isDemo
    });

    const detectedCropId = (aiResult.crop || cropId || 'tomato').toLowerCase();

    // 2. Dual-Engine Part B: Synchronized Agronomic Risk Engine Scoring
    const riskResult = calculateCropRisk({
      cropId: detectedCropId,
      weather,
      location,
      growthStage,
      farmerObservations,
      hasVisualSymptoms: true,
      visualSeverityScore: aiResult.severityScore || 50,
      visualCondition: aiResult.condition,
      aiDiagnosis: aiResult,
      language: language || 'en'
    });

    // 3. Single Source of Truth for Recommendations
    const combinedRecommendations = {
      immediateActions: Array.from(new Set([
        ...(aiResult.recommendedActions || []),
        ...(riskResult.recommendations?.immediateActions || [])
      ])).slice(0, 5),
      prevention: Array.from(new Set([
        ...(aiResult.prevention || []),
        ...(riskResult.recommendations?.prevention || [])
      ])).slice(0, 5),
      monitoringPlan: Array.from(new Set([
        ...(aiResult.monitoringPlan || []),
        ...(riskResult.recommendations?.monitoringPlan || [])
      ])).slice(0, 4),
      chemicalWarning: aiResult.chemicalWarning || riskResult.recommendations?.chemicalWarning || 'Consult local Krishi Vigyan Kendra (KVK) agricultural officers.'
    };

    // Requirement 15 structured API response logging
    console.log('==================================================');
    console.log('/api/analyze LOG STRUCTURED DIAGNOSIS');
    console.log(JSON.stringify({
      expectedCrop: cropId,
      detectedCrop: detectedCropId,
      cropMismatch: Boolean(cropId && cropId.toLowerCase() !== detectedCropId),
      predictedClass: aiResult.rawClassKey || `${detectedCropId}___${aiResult.condition}`,
      normalizedDisease: aiResult.condition,
      confidence: aiResult.confidence,
      knowledgeKey: `${detectedCropId}___${aiResult.condition}`,
      knowledgeFound: Boolean(aiResult.supported)
    }, null, 2));
    console.log('==================================================');

    // 4. Build complete document
    const analysisRecord = {
      userId: req.body.userId || 'guest-farmer',
      cropId: detectedCropId,
      cropName: aiResult.crop || cropName,
      imageUrl,
      growthStage,
      farmerObservations,
      location: {
        state: location.state || 'Tamil Nadu',
        district: location.district || 'Salem',
        village: location.village || '',
        latitude: location.lat || location.latitude,
        longitude: location.lng || location.longitude
      },
      weatherSnapshot: {
        temperature: weather?.temperature || 28,
        humidity: weather?.humidity || 78,
        rainfall: weather?.rainfall || 0,
        windSpeed: weather?.windSpeed || 6,
        condition: weather?.condition || 'Partly Cloudy',
        timestamp: new Date()
      },
      aiAnalysis: aiResult,
      riskAssessment: {
        riskScore: riskResult.riskScore,
        riskLevel: riskResult.riskLevel,
        predictedThreat: riskResult.predictedThreat || aiResult.condition,
        contributingFactors: riskResult.contributingFactors,
        whyRiskExists: riskResult.whyRiskExists
      },
      recommendations: combinedRecommendations,
      isDemoMode: isDemo,
      createdAt: new Date()
    };

    // 5. Persist to MongoDB or local fallback
    let savedDoc = null;
    try {
      if (isMongoConnected()) {
        const mongoAnalysis = new Analysis(analysisRecord);
        savedDoc = await mongoAnalysis.save();
      }
    } catch (err) {
      console.warn('MongoDB save failed, using local store:', err.message);
    }

    if (!savedDoc) {
      const id = 'ana-' + Date.now();
      savedDoc = { _id: id, id, ...analysisRecord };
      fallbackStore.analyses.unshift(savedDoc);
      if (fallbackStore.analyses.length > 100) fallbackStore.analyses.pop();
      persistFallback();
    }

    // 6. Trigger early warning alert if High / Critical
    if (riskResult.riskLevel === 'HIGH' || riskResult.riskLevel === 'CRITICAL') {
      await generateEarlyWarningAlert({
        cropName: analysisRecord.cropName,
        cropId: analysisRecord.cropId,
        threatName: aiResult.condition || riskResult.predictedThreat,
        riskScore: riskResult.riskScore,
        riskLevel: riskResult.riskLevel,
        location,
        whyRiskExists: riskResult.whyRiskExists,
        recommendedAction: combinedRecommendations.immediateActions[0]
      });
    }

    res.json({
      success: true,
      analysis: savedDoc
    });

  } catch (err) {
    console.error('Analysis error:', err);
    res.status(500).json({
      success: false,
      message: 'AI Crop Analysis failed. Please try again with a clear leaf/plant photo.',
      error: err.message
    });
  }
});

// POST /api/ai/ask - Interactive Farmer Question & Voice Query Endpoint
router.post('/ask', async (req, res) => {
  try {
    const {
      question = '',
      currentAnalysis = null,
      cropName = '',
      language = 'en',
      location = null,
      weather = null
    } = req.body;

    if (!question || !question.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Question text is required.'
      });
    }

    const qLower = question.toLowerCase();

    // 1. Dynamic Crop Keyword Extraction (Multilingual)
    let matchedCropId = null;

    if (qLower.includes('rice') || qLower.includes('paddy') || qLower.includes('அரிசி') || qLower.includes('நெல்') || qLower.includes('चावल') || qLower.includes('धान') || qLower.includes('వరి')) {
      matchedCropId = 'rice';
    } else if (qLower.includes('wheat') || qLower.includes('கோதுமை') || qLower.includes('गेहूं')) {
      matchedCropId = 'wheat';
    } else if (qLower.includes('cotton') || qLower.includes('பருத்தி') || qLower.includes('कपास')) {
      matchedCropId = 'cotton';
    } else if (qLower.includes('potato') || qLower.includes('உருளை') || qLower.includes('ஆலூ') || qLower.includes('आलू')) {
      matchedCropId = 'potato';
    } else if (qLower.includes('chilli') || qLower.includes('chili') || qLower.includes('pepper') || qLower.includes('மிளகாய்') || qLower.includes('मिर्च')) {
      matchedCropId = 'chilli';
    } else if (qLower.includes('maize') || qLower.includes('corn') || qLower.includes('சோளம்') || qLower.includes('மக்காச்சோளம்') || qLower.includes('मक्का')) {
      matchedCropId = 'maize';
    } else if (qLower.includes('sugarcane') || qLower.includes('கரும்பு') || qLower.includes('गन्ना')) {
      matchedCropId = 'sugarcane';
    } else if (qLower.includes('onion') || qLower.includes('வெங்காயம்') || qLower.includes('प्याज़')) {
      matchedCropId = 'onion';
    } else if (qLower.includes('groundnut') || qLower.includes('peanut') || qLower.includes('நிலக்கடலை') || qLower.includes('मूंगफली')) {
      matchedCropId = 'groundnut';
    } else if (qLower.includes('tomato') || qLower.includes('தக்காளி') || qLower.includes('टमाटर')) {
      matchedCropId = 'tomato';
    }

    // Determine final active crop
    const targetCropId = matchedCropId || (currentAnalysis?.cropId || currentAnalysis?.aiAnalysis?.crop || cropName || 'tomato').toLowerCase();
    
    // Find crop knowledge from cropKnowledgeBase.json
    const cropData = cropKnowledgeBase.crops.find(c => c.id === targetCropId) || cropKnowledgeBase.crops[0];
    const activeCropName = cropData ? cropData.name : (currentAnalysis?.cropName || cropName || 'Tomato');

    const activeCondition = currentAnalysis?.aiAnalysis?.condition || 'Crop Condition';
    const activeSeverity = currentAnalysis?.aiAnalysis?.severity || 'Moderate';
    const preventionMeasures = currentAnalysis?.recommendations?.prevention || currentAnalysis?.aiAnalysis?.prevention || [];
    const immediateActions = currentAnalysis?.recommendations?.immediateActions || currentAnalysis?.aiAnalysis?.recommendedActions || [];

    let answer = '';

    // If context of current analysis is available AND user refers to "this" condition
    if (currentAnalysis && !matchedCropId && (
      qLower.includes('this') || qLower.includes('do') || qLower.includes('treat') || 
      qLower.includes('cure') || qLower.includes('prevent') || qLower.includes('என்ன') ||
      qLower.includes('செய்ய') || qLower.includes('क्या') || qLower.includes('उपाय') ||
      qLower.includes('మందు') || qLower.includes('ಔಷಧ')
    )) {
      let recsText = '';
      if (immediateActions.length > 0) {
        recsText += `Immediate action: ${immediateActions.join('. ')}. `;
      }
      if (preventionMeasures.length > 0) {
        recsText += `Prevention: ${preventionMeasures.join('. ')}.`;
      }

      answer = `For your ${activeCropName} showing ${activeCondition} (${activeSeverity} severity): ${recsText || 'Maintain proper soil drainage, remove infected foliage, and apply bio-fungicidal neem oil spray.'}`;
    } else if (cropData && cropData.threats && cropData.threats.length > 0) {
      // Query specific threats from knowledge base for the matched crop
      const topThreat = cropData.threats[0];
      const threatPrev = topThreat.prevention ? topThreat.prevention.slice(0, 2).join('. ') : '';
      const threatActions = topThreat.immediateActions ? topThreat.immediateActions.slice(0, 2).join('. ') : '';

      answer = `Based on AgriShield AI agronomic knowledge for ${activeCropName} (${cropData.category}): Key prevention: ${threatPrev}. Recommended action: ${threatActions}. Consult your local Krishi Vigyan Kendra (KVK) for field inspection.`;
    } else if (qLower.includes('yellow') || qLower.includes('மஞ்சள்') || qLower.includes('पीली')) {
      answer = `Yellow leaves on ${activeCropName} often indicate nitrogen deficiency, over-watering, or early fungal infection. Ensure balanced NPK fertilizer application, check root drainage, and avoid overhead watering.`;
    } else if (qLower.includes('spot') || qLower.includes('black') || qLower.includes('கருப்பு') || qLower.includes('दब्बे') || qLower.includes('दाग')) {
      answer = `Black or brown spots on ${activeCropName} leaves typically signal fungal leaf spot or bacterial lesion. Prune affected leaves, avoid wet foliage overnight, and apply copper bio-fungicide.`;
    } else {
      answer = `Based on AgriShield AI agronomic knowledge for ${activeCropName}: Monitor leaves daily for lesions or discoloration. Maintain proper plant spacing for ventilation, ensure balanced organic mulch, and consult your nearest Krishi Vigyan Kendra (KVK) if symptoms worsen.`;
    }

    res.json({
      success: true,
      question,
      answer,
      cropContext: activeCropName,
      conditionContext: activeCondition
    });
  } catch (err) {
    console.error('Ask AI error:', err);
    res.status(500).json({
      success: false,
      message: 'Unable to process question. Please try again.',
      error: err.message
    });
  }
});

module.exports = router;
