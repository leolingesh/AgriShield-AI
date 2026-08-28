import React, { useState } from 'react';
import { useLocation } from '../context/LocationContext';
import { useLanguage } from '../context/LanguageContext';
import { MapPin, Navigation, Edit3, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';

export const LocationSelector = ({ compact = false }) => {
  const {
    location,
    mode,
    setMode,
    isLocating,
    locationError,
    availableStates,
    requestLiveLocation,
    setManualLocation
  } = useLocation();

  const { t } = useLanguage();

  const [selectedState, setSelectedState] = useState(location?.state || 'Tamil Nadu');
  const [selectedDistrict, setSelectedDistrict] = useState(location?.district || 'Salem');
  const [villageInput, setVillageInput] = useState(location?.village || '');

  // Get districts for currently selected state
  const currentStateObj = availableStates.find(s => s.name === selectedState) || availableStates[0];
  const districtList = currentStateObj ? currentStateObj.districts : [];

  const handleStateChange = (e) => {
    const newState = e.target.value;
    setSelectedState(newState);
    const stateObj = availableStates.find(s => s.name === newState);
    if (stateObj && stateObj.districts.length > 0) {
      const firstDist = stateObj.districts[0].name;
      setSelectedDistrict(firstDist);
      setManualLocation({
        state: newState,
        district: firstDist,
        village: villageInput
      });
    }
  };

  const handleDistrictChange = (e) => {
    const newDistrict = e.target.value;
    setSelectedDistrict(newDistrict);
    setManualLocation({
      state: selectedState,
      district: newDistrict,
      village: villageInput
    });
  };

  const handleVillageBlur = () => {
    setManualLocation({
      state: selectedState,
      district: selectedDistrict,
      village: villageInput
    });
  };

  return (
    <div className="glass-card" style={{ padding: compact ? '16px' : '20px' }}>
      {/* Header & Mode Switcher */}
      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 10,
        marginBottom: 14
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{
            width: 36,
            height: 36,
            borderRadius: 10,
            background: '#DCFCE7',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0
          }}>
            <MapPin size={18} color="#16A34A" />
          </div>
          <div>
            <h3 style={{ fontSize: '1.05rem', color: '#17211B' }}>{t('location.title')}</h3>
            <span style={{ fontSize: '0.78rem', color: '#647067' }}>
              {location?.isLiveGPS ? '📍 ' + t('location.detected') : '📍 ' + (location?.formatted || 'Salem, Tamil Nadu')}
            </span>
          </div>
        </div>

        {/* Mode Toggle Buttons */}
        <div style={{
          display: 'flex',
          background: '#F1F5F2',
          padding: 3,
          borderRadius: 8,
          border: '1px solid #E5EAE6'
        }}>
          <button
            type="button"
            onClick={() => {
              setMode('live');
              requestLiveLocation();
            }}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 5,
              padding: '5px 10px',
              borderRadius: 6,
              fontSize: '0.78rem',
              fontWeight: 600,
              background: mode === 'live' ? '#16A34A' : 'transparent',
              color: mode === 'live' ? '#FFFFFF' : '#647067',
              transition: 'all 0.2s ease',
              cursor: 'pointer'
            }}
          >
            <Navigation size={13} />
            {t('location.currentBtn')}
          </button>
          <button
            type="button"
            onClick={() => setMode('manual')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 5,
              padding: '5px 10px',
              borderRadius: 6,
              fontSize: '0.78rem',
              fontWeight: 600,
              background: mode === 'manual' ? '#16A34A' : 'transparent',
              color: mode === 'manual' ? '#FFFFFF' : '#647067',
              transition: 'all 0.2s ease',
              cursor: 'pointer'
            }}
          >
            <Edit3 size={13} />
            {t('location.manualBtn')}
          </button>
        </div>
      </div>

      {/* Live Mode Display */}
      {mode === 'live' && (
        <div>
          <div style={{
            background: '#F0FDF4',
            border: '1px solid #86EFAC',
            borderRadius: 10,
            padding: '12px 14px',
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 10
          }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#15803D', fontWeight: 600, fontSize: '0.88rem', marginBottom: 2 }}>
                <CheckCircle2 size={15} /> {location?.formatted || 'Tamil Nadu, India'}
              </div>
              <div style={{ fontSize: '0.75rem', color: '#647067' }}>
                Lat {location?.lat?.toFixed(4) || '11.5977'}°, Lng {location?.lng?.toFixed(4) || '78.5986'}°
              </div>
            </div>

            <button
              type="button"
              onClick={requestLiveLocation}
              disabled={isLocating}
              className="btn-secondary"
              style={{ padding: '7px 12px', fontSize: '0.8rem', minHeight: 36 }}
            >
              {isLocating ? (
                <>
                  <Loader2 size={13} className="spin" />
                  {t('location.detecting')}
                </>
              ) : (
                t('location.currentBtn')
              )}
            </button>
          </div>
        </div>
      )}

      {/* Manual Mode Dropdowns */}
      {mode === 'manual' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 10 }}>
          <div>
            <label className="input-label">{t('location.selectState')}</label>
            <select
              value={selectedState}
              onChange={handleStateChange}
              className="input-field"
              style={{ cursor: 'pointer' }}
            >
              {availableStates.map(st => (
                <option key={st.code} value={st.name} style={{ background: '#FFFFFF', color: '#17211B' }}>
                  {st.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="input-label">{t('location.selectDistrict')}</label>
            <select
              value={selectedDistrict}
              onChange={handleDistrictChange}
              className="input-field"
              style={{ cursor: 'pointer' }}
            >
              {districtList.map(dist => (
                <option key={dist.name} value={dist.name} style={{ background: '#FFFFFF', color: '#17211B' }}>
                  {dist.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="input-label">{t('location.village')}</label>
            <input
              type="text"
              placeholder="e.g. Attur / North Farm"
              value={villageInput}
              onChange={(e) => setVillageInput(e.target.value)}
              onBlur={handleVillageBlur}
              className="input-field"
            />
          </div>
        </div>
      )}

      {/* Error Notice */}
      {locationError && (
        <div style={{
          marginTop: 10,
          padding: '8px 12px',
          background: '#FEE2E2',
          border: '1px solid #FCA5A5',
          borderRadius: 8,
          color: '#DC2626',
          fontSize: '0.8rem',
          display: 'flex',
          alignItems: 'center',
          gap: 8
        }}>
          <AlertCircle size={15} />
          <span>{locationError}</span>
        </div>
      )}
    </div>
  );
};

export default LocationSelector;
