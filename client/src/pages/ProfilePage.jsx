import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { useLocation } from '../context/LocationContext';
import { User, Globe, MapPin, Phone, Mail, Check, LogOut } from 'lucide-react';

export const ProfilePage = () => {
  const { t, language, setLanguage, languages } = useLanguage();
  const { user, updateProfile, logout } = useAuth();
  const { location } = useLocation();

  const [name, setName] = useState(user?.name || 'Ramesh Patel');
  const [phone, setPhone] = useState(user?.phone || '+91 98765 43210');
  const [email, setEmail] = useState(user?.email || 'ramesh.farmer@agrishield.ai');
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    await updateProfile({
      name,
      phone,
      email,
      preferredLanguage: language
    });
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="app-container" style={{ maxWidth: 780 }}>
      {/* Header */}
      <div style={{ marginBottom: 24 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#16A34A', fontSize: '0.85rem', fontWeight: 700, marginBottom: 4 }}>
          <User size={18} />
          <span>{t('profile.title')}</span>
        </div>
        <h1 style={{ fontSize: '1.9rem', color: '#17211B', letterSpacing: '-0.02em', marginBottom: 4 }}>
          {t('profile.title')}
        </h1>
        <p style={{ fontSize: '0.88rem', color: '#647067' }}>
          {t('profile.subtitle')}
        </p>
      </div>

      <div className="glass-card" style={{ padding: '28px' }}>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
          {/* Language Preference */}
          <div>
            <label className="input-label" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <Globe size={16} color="#16A34A" /> {t('profile.prefLang')}
            </label>
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="input-field"
              style={{ cursor: 'pointer' }}
            >
              {languages.map(lang => (
                <option key={lang.code} value={lang.code} style={{ background: '#FFFFFF', color: '#17211B' }}>
                  {lang.nativeName} ({lang.name})
                </option>
              ))}
            </select>
          </div>

          {/* Name */}
          <div>
            <label className="input-label">{t('profile.fullName')}</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="input-field"
            />
          </div>

          {/* Contact Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 14 }}>
            <div>
              <label className="input-label" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <Phone size={15} color="#16A34A" /> {t('profile.phone')}
              </label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="input-field"
              />
            </div>

            <div>
              <label className="input-label" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <Mail size={15} color="#16A34A" /> {t('profile.email')}
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input-field"
              />
            </div>
          </div>

          {/* Primary Farm Location info */}
          <div style={{
            background: '#F0FDF4',
            border: '1px solid #86EFAC',
            borderRadius: 12,
            padding: '14px 16px'
          }}>
            <div style={{ fontSize: '0.85rem', fontWeight: 600, color: '#15803D', marginBottom: 4, display: 'flex', alignItems: 'center', gap: 6 }}>
              <MapPin size={16} /> {t('location.title')}
            </div>
            <div style={{ fontSize: '0.88rem', color: '#17211B', fontWeight: 600 }}>
              {location?.formatted || t('location.detecting')}
            </div>
            {location?.lat && location?.lng && (
              <div style={{ fontSize: '0.75rem', color: '#647067', marginTop: 2 }}>
                Lat {location.lat.toFixed(4)}°, Lng {location.lng.toFixed(4)}°
              </div>
            )}
          </div>

          {/* Success toast notice */}
          {savedSuccess && (
            <div style={{
              padding: '10px 14px',
              background: '#DCFCE7',
              border: '1px solid #86EFAC',
              borderRadius: 8,
              color: '#15803D',
              fontSize: '0.85rem',
              display: 'flex',
              alignItems: 'center',
              gap: 8
            }}>
              <Check size={16} /> {t('profile.savedSuccess')}
            </div>
          )}

          <hr style={{ border: 'none', borderTop: '1px solid #E5EAE6', margin: '10px 0' }} />

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <button
              type="button"
              onClick={logout}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                padding: '10px 18px',
                borderRadius: 10,
                background: '#FEF2F2',
                border: '1px solid #FCA5A5',
                color: '#DC2626',
                fontSize: '0.88rem',
                fontWeight: 700,
                cursor: 'pointer'
              }}
            >
              <LogOut size={16} color="#DC2626" />
              <span>{t('profile.logout')}</span>
            </button>

            <button
              type="submit"
              className="btn-primary"
              style={{ padding: '12px 24px' }}
            >
              <Check size={18} /> {t('profile.saveBtn')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProfilePage;
