import React, { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useLocation } from '../context/LocationContext';
import { useWeather } from '../context/WeatherContext';
import LocationSelector from '../components/LocationSelector';
import CropSelector, { CROPS_DATA } from '../components/CropSelector';
import ImageUploader from '../components/ImageUploader';
import CameraCapture from '../components/CameraCapture';
import AnalysisLoader from '../components/AnalysisLoader';
import AnalysisResult from '../components/AnalysisResult';
import AskAiCard from '../components/AskAiCard';
import { getLocalizedCropName } from '../utils/localizationUtils';
import { Sparkles, AlertCircle } from 'lucide-react';

export const AnalyzePage = ({ initialCropId = 'tomato', initialDemoCase = null }) => {
  const { t, language } = useLanguage();
  const { location } = useLocation();
  const { weather } = useWeather();

  const [selectedCrop, setSelectedCrop] = useState(() => {
    return CROPS_DATA.find(c => c.id === initialCropId) || CROPS_DATA[0];
  });
  const [growthStage, setGrowthStage] = useState('Vegetative');
  const [observations, setObservations] = useState('');
  const [selectedImage, setSelectedImage] = useState(null);
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);

  // Sync if initialCropId or initialDemoCase changes
  useEffect(() => {
    if (initialCropId) {
      const crop = CROPS_DATA.find(c => c.id === initialCropId);
      if (crop) setSelectedCrop(crop);
    }
  }, [initialCropId]);

  useEffect(() => {
    if (initialDemoCase) {
      const crop = CROPS_DATA.find(c => c.id === initialDemoCase.cropId);
      if (crop) setSelectedCrop(crop);
      setSelectedImage({
        previewUrl: initialDemoCase.image,
        name: initialDemoCase.title,
        sampleImageUrl: initialDemoCase.image,
        isSample: true
      });
      setObservations(initialDemoCase.farmerObservations || '');
    }
  }, [initialDemoCase]);

  // Sample quick images
  const sampleImages = [
    { label: 'Septoria Spot (Tomato)', url: '/sample_crops/septoria_tomato.jpg' },
    { label: 'Rice Blast Diamond Lesion', url: '/sample_crops/rice_blast.jpg' },
    { label: 'Pink Bollworm (Cotton)', url: '/sample_crops/cotton_bollworm.jpg' },
    { label: 'Blossom End Rot (Tomato)', url: '/sample_crops/blossom_rot_tomato.jpg' }
  ];

  const handleStartAnalysis = async () => {
    if (!selectedImage && !selectedCrop) {
      setErrorMsg(t('upload.dropzoneNotice'));
      return;
    }

    setErrorMsg(null);
    setIsAnalyzing(true);

    try {
      const formData = new FormData();
      if (selectedImage?.file) {
        formData.append('image', selectedImage.file);
      } else if (selectedImage?.sampleImageUrl) {
        formData.append('sampleImageUrl', selectedImage.sampleImageUrl);
      }

      formData.append('cropName', selectedCrop?.name || 'Tomato');
      formData.append('cropId', selectedCrop?.id || 'tomato');
      formData.append('growthStage', growthStage);
      formData.append('farmerObservations', observations);
      formData.append('location', JSON.stringify(location || null));
      formData.append('weather', JSON.stringify(weather || null));
      formData.append('isDemoMode', selectedImage?.isSample ? 'true' : 'false');
      formData.append('language', language);

      const res = await fetch('/api/analyze', {
        method: 'POST',
        body: formData
      });

      const data = await res.json();
      if (data.success && data.analysis) {
        setAnalysisResult(data.analysis);
      } else {
        throw new Error(data.message || t('audio.uncertainCrop'));
      }
    } catch (err) {
      console.error('Analysis error:', err);
      setErrorMsg(err.message || t('audio.uncertainCrop'));
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleReset = () => {
    setAnalysisResult(null);
    setSelectedImage(null);
    setObservations('');
    setErrorMsg(null);
  };

  const localizedCropName = getLocalizedCropName(selectedCrop?.id || 'tomato', language);

  return (
    <div className="app-container">
      {/* Title Header */}
      <div style={{ marginBottom: 24, textAlign: 'center' }}>
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 8,
          background: '#DCFCE7',
          color: '#15803D',
          padding: '6px 14px',
          borderRadius: 999,
          fontSize: '0.82rem',
          fontWeight: 700,
          marginBottom: 10,
          border: '1px solid #86EFAC'
        }}>
          <Sparkles size={15} /> {t('hero.title')}
        </div>
        <h1 style={{ fontSize: '2rem', color: '#17211B', letterSpacing: '-0.02em', marginBottom: 6 }}>
          {t('nav.analyze')}
        </h1>
        <p style={{ fontSize: '0.92rem', color: '#647067', maxWidth: 640, margin: '0 auto' }}>
          {t('hero.subtitle')}
        </p>
      </div>

      {/* Analysis Result Display */}
      {analysisResult ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          <AnalysisResult
            analysis={analysisResult}
            onNewScan={handleReset}
          />
          {/* Ask AgriShield AI Voice Question Card with Active Image Context */}
          <AskAiCard
            currentAnalysis={analysisResult}
            cropName={localizedCropName}
          />
        </div>
      ) : isAnalyzing ? (
        /* Stepped Progress Animation */
        <AnalysisLoader />
      ) : (
        /* Workflow Form: Location -> Crop -> Image -> Analyze Button */
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20, maxWidth: 900, margin: '0 auto' }}>
          {/* 1. Location & Weather Bar */}
          <LocationSelector compact={true} />

          {/* 2. Crop Selector & Growth Stage */}
          <CropSelector
            selectedCrop={selectedCrop}
            onSelectCrop={(c) => setSelectedCrop(c)}
            growthStage={growthStage}
            onSelectGrowthStage={(s) => setGrowthStage(s)}
            observations={observations}
            onChangeObservations={(obs) => setObservations(obs)}
          />

          {/* 3. Image Upload / Camera Dropzone */}
          <ImageUploader
            selectedImage={selectedImage}
            onImageSelected={(img) => setSelectedImage(img)}
            onClearImage={() => setSelectedImage(null)}
            onLaunchCamera={() => setIsCameraOpen(true)}
            sampleImages={sampleImages}
          />

          {/* 4. Ask AgriShield AI Voice Question Box */}
          <AskAiCard
            cropName={localizedCropName}
          />

          {/* Error notice */}
          {errorMsg && (
            <div style={{
              padding: '12px 16px',
              background: '#FEE2E2',
              border: '1px solid #FCA5A5',
              borderRadius: 10,
              color: '#DC2626',
              fontSize: '0.88rem',
              display: 'flex',
              alignItems: 'center',
              gap: 10
            }}>
              <AlertCircle size={20} color="#DC2626" style={{ flexShrink: 0 }} />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Main Action Button */}
          <div style={{ textAlign: 'center', marginTop: 10 }}>
            <button
              onClick={handleStartAnalysis}
              className="btn-primary"
              style={{
                width: '100%',
                maxWidth: 420,
                padding: '16px 32px',
                fontSize: '1.1rem',
                margin: '0 auto'
              }}
            >
              <Sparkles size={22} />
              <span>{t('hero.ctaScan')}</span>
            </button>
          </div>
        </div>
      )}

      {/* Live Camera Modal */}
      <CameraCapture
        isOpen={isCameraOpen}
        onClose={() => setIsCameraOpen(false)}
        onCapture={(img) => setSelectedImage(img)}
      />
    </div>
  );
};

export default AnalyzePage;
