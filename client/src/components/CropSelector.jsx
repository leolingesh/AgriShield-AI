import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { Search, Sprout, Check, Sparkles } from 'lucide-react';
import VoiceInputButton from './VoiceInputButton';
import { getLocalizedCropName, getLocalizedGrowthStage } from '../utils/localizationUtils';

export const CROPS_DATA = [
  { id: 'tomato', name: 'Tomato', icon: '🍅', category: 'vegetable', visionSupported: true, scientific: 'Solanum lycopersicum', stages: ['Seedling', 'Vegetative', 'Flowering', 'Fruiting', 'Ripening'] },
  { id: 'rice', name: 'Rice (Paddy)', icon: '🌾', category: 'cereal', visionSupported: true, scientific: 'Oryza sativa', stages: ['Nursery', 'Tillering', 'Panicle Initiation', 'Flowering', 'Maturity'] },
  { id: 'wheat', name: 'Wheat', icon: '🌾', category: 'cereal', visionSupported: true, scientific: 'Triticum aestivum', stages: ['Crown Root', 'Tillering', 'Jointing', 'Booting / Heading', 'Maturity'] },
  { id: 'cotton', name: 'Cotton', icon: '🌱', category: 'commercial', visionSupported: true, scientific: 'Gossypium hirsutum', stages: ['Germination', 'Squaring', 'Flowering', 'Boll Development', 'Boll Bursting'] },
  { id: 'potato', name: 'Potato', icon: '🥔', category: 'tuber', visionSupported: true, scientific: 'Solanum tuberosum', stages: ['Sprouting', 'Vegetative', 'Tuber Initiation', 'Tuber Bulking', 'Maturity'] },
  { id: 'chilli', name: 'Chilli (Pepper)', icon: '🌶️', category: 'spice', visionSupported: true, scientific: 'Capsicum annuum', stages: ['Seedling', 'Vegetative', 'Flowering', 'Fruiting', 'Harvest'] },
  { id: 'maize', name: 'Maize (Corn)', icon: '🌽', category: 'cereal', visionSupported: true, scientific: 'Zea mays', stages: ['Knee-high', 'Tasseling', 'Silking', 'Milking', 'Maturity'] },
  { id: 'sugarcane', name: 'Sugarcane', icon: '🎋', category: 'commercial', visionSupported: true, scientific: 'Saccharum officinarum', stages: ['Germination', 'Tillering', 'Grand Growth', 'Ripening'] },
  { id: 'onion', name: 'Onion', icon: '🧅', category: 'vegetable', visionSupported: true, scientific: 'Allium cepa', stages: ['Nursery', 'Bulb Initiation', 'Bulb Development', 'Maturity'] },
  { id: 'groundnut', name: 'Groundnut (Peanut)', icon: '🥜', category: 'oilseed', visionSupported: true, scientific: 'Arachis hypogaea', stages: ['Vegetative', 'Flowering / Pegging', 'Pod Formation', 'Maturity'] }
];

export const CropSelector = ({
  selectedCrop,
  onSelectCrop,
  growthStage,
  onSelectGrowthStage,
  observations,
  onChangeObservations
}) => {
  const { t, language } = useLanguage();
  const [searchTerm, setSearchTerm] = useState('');

  const filteredCrops = CROPS_DATA.filter(c => {
    const locName = getLocalizedCropName(c.id, language);
    return locName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.scientific.toLowerCase().includes(searchTerm.toLowerCase());
  });

  const activeCropObj = CROPS_DATA.find(c => c.id === selectedCrop?.id) || CROPS_DATA[0];
  const stagesList = activeCropObj ? activeCropObj.stages : ['Seedling', 'Vegetative', 'Flowering', 'Fruiting', 'Maturity'];
  const localizedActiveCropName = getLocalizedCropName(selectedCrop?.id || 'tomato', language);

  return (
    <div className="glass-card" style={{ padding: '22px' }}>
      {/* Title & Search */}
      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 12,
        marginBottom: 16
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{
            width: 36,
            height: 36,
            borderRadius: 10,
            background: '#DCFCE7',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <Sprout size={20} color="#16A34A" aria-hidden="true" />
          </div>
          <div>
            <h3 style={{ fontSize: '1.05rem', color: '#17211B', fontWeight: 700 }}>{t('crop.selectTitle')}</h3>
            <span style={{ fontSize: '0.78rem', color: '#647067' }}>
              <strong style={{ color: '#16A34A' }}>{localizedActiveCropName}</strong> — {t('crop.visionAiSupportedAll', 'AI Vision Supported')}
            </span>
          </div>
        </div>

        {/* Search input */}
        <div style={{ position: 'relative', minWidth: 200 }}>
          <Search size={15} color="#647067" style={{ position: 'absolute', left: 10, top: 12 }} aria-hidden="true" />
          <input
            type="text"
            placeholder={t('crop.searchPlaceholder')}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              width: '100%',
              padding: '8px 12px 8px 32px',
              borderRadius: 8,
              background: '#FFFFFF',
              border: '1px solid #E5EAE6',
              color: '#17211B',
              fontSize: '0.85rem',
              outline: 'none'
            }}
          />
        </div>
      </div>

      {/* Crop Cards Grid - All 10 Crops Unified with Vision AI */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))',
        gap: 10,
        marginBottom: 16,
        maxHeight: 250,
        overflowY: 'auto',
        paddingRight: 4
      }}>
        {filteredCrops.map(crop => {
          const isSelected = selectedCrop?.id === crop.id;
          const localizedName = getLocalizedCropName(crop.id, language);

          return (
            <button
              key={crop.id}
              type="button"
              onClick={() => onSelectCrop({ ...crop, displayName: localizedName })}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                padding: '12px 8px',
                borderRadius: 12,
                background: isSelected ? '#DCFCE7' : '#F7F9F7',
                border: isSelected ? '1.5px solid #16A34A' : '1px solid #E5EAE6',
                boxShadow: isSelected ? '0 2px 8px rgba(22, 163, 74, 0.15)' : 'none',
                cursor: 'pointer',
                textAlign: 'center',
                transition: 'all 0.2s ease',
                position: 'relative'
              }}
            >
              {isSelected && (
                <div style={{
                  position: 'absolute',
                  top: 6,
                  right: 6,
                  width: 16,
                  height: 16,
                  borderRadius: '50%',
                  background: '#16A34A',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <Check size={10} color="#ffffff" strokeWidth={3} aria-hidden="true" />
                </div>
              )}
              <span style={{ fontSize: '1.8rem', marginBottom: 4 }}>{crop.icon}</span>
              <span style={{ fontSize: '0.85rem', fontWeight: 700, color: isSelected ? '#15803D' : '#17211B' }}>
                {localizedName}
              </span>
              <span style={{
                fontSize: '0.62rem',
                fontWeight: 700,
                padding: '2px 6px',
                borderRadius: 4,
                marginTop: 4,
                background: '#DCFCE7',
                color: '#15803D',
                border: '1px solid #86EFAC',
                display: 'inline-flex',
                alignItems: 'center',
                gap: 3
              }}>
                <Sparkles size={9} aria-hidden="true" />
                <span>{t('crop.visionAiBadge', 'Vision AI')}</span>
              </span>
            </button>
          );
        })}
      </div>

      {/* Growth Stage and Observations */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 14 }}>
        <div>
          <label className="input-label">{t('crop.growthStage')}</label>
          <select
            value={growthStage}
            onChange={(e) => onSelectGrowthStage(e.target.value)}
            className="input-field"
            style={{ cursor: 'pointer' }}
          >
            {stagesList.map(st => (
              <option key={st} value={st} style={{ background: '#FFFFFF', color: '#17211B' }}>
                🌱 {getLocalizedGrowthStage(st, language)}
              </option>
            ))}
          </select>
        </div>

        <div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 }}>
            <label className="input-label" style={{ margin: 0 }}>{t('crop.observations')}</label>
            <VoiceInputButton
              compact={true}
              onTranscript={(spokenText) => {
                const updated = observations ? `${observations} ${spokenText}` : spokenText;
                onChangeObservations(updated);
              }}
            />
          </div>
          <input
            type="text"
            placeholder={t('crop.observationsPlaceholder')}
            value={observations}
            onChange={(e) => onChangeObservations(e.target.value)}
            className="input-field"
          />
        </div>
      </div>
    </div>
  );
};

export default CropSelector;
