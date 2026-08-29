import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useLocation } from '../context/LocationContext';
import { useAuth } from '../context/AuthContext';
import { Shield, Sparkles, AlertTriangle, MapPin, Activity, History, Layers, Menu, X, LogIn, LogOut, User as UserIcon } from 'lucide-react';

export const Navbar = ({ activeTab, setActiveTab, onOpenDemo }) => {
  const { t, language, setLanguage, languages } = useLanguage();
  const { location } = useLocation();
  const { user, isAuthenticated, logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navItems = [
    { id: 'dashboard', label: t('nav.dashboard'), icon: Activity },
    { id: 'analyze', label: t('nav.analyze'), icon: Sparkles, highlight: true },
    { id: 'early-warning', label: t('nav.earlyWarning'), icon: AlertTriangle },
    { id: 'monitoring', label: t('nav.monitoring'), icon: Layers },
    { id: 'history', label: t('nav.history'), icon: History },
    { id: 'admin', label: t('nav.admin'), icon: Shield },
    { id: isAuthenticated ? 'profile' : 'login', label: isAuthenticated ? (t('profile.title') || 'Profile') : t('auth.signIn'), icon: isAuthenticated ? UserIcon : LogIn }
  ];

  return (
    <header style={{
      position: 'sticky',
      top: 0,
      zIndex: 100,
      background: '#FFFFFF',
      borderBottom: '1px solid #E5EAE6',
      boxShadow: '0 1px 3px rgba(0,0,0,0.03)',
      height: '60px',
      display: 'flex',
      alignItems: 'center',
      width: '100%',
      boxSizing: 'border-box'
    }}>
      <div style={{
        width: '100%',
        margin: '0 auto',
        padding: '0 16px',
        boxSizing: 'border-box',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 10
      }}>
        {/* Brand Logo */}
        <div 
          onClick={() => setActiveTab('dashboard')}
          style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', flexShrink: 0 }}
        >
          <img 
            src="/logo.png" 
            alt="AgriShield AI Logo" 
            style={{ 
              width: 32, 
              height: 32, 
              objectFit: 'contain',
              flexShrink: 0 
            }} 
          />
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, lineHeight: 1 }}>
            <span style={{ fontSize: '1.08rem', fontWeight: 800, color: '#17211B', letterSpacing: '-0.02em', whiteSpace: 'nowrap' }}>
              {t('appName')}
            </span>
          </div>
        </div>

        {/* Desktop Navigation Links - Single Crisp Row */}
        <nav className="desktop-nav" style={{
          display: 'flex',
          alignItems: 'center',
          gap: 2,
          flexWrap: 'nowrap',
          whiteSpace: 'nowrap',
          justifyContent: 'center',
          flexShrink: 1,
          minWidth: 0
        }}>
          {navItems.map(item => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 4,
                  padding: '5px 7px',
                  borderRadius: 7,
                  fontSize: '0.76rem',
                  fontWeight: isActive ? 700 : 500,
                  lineHeight: 1.2,
                  whiteSpace: 'nowrap',
                  color: isActive ? '#15803D' : '#647067',
                  background: isActive ? '#DCFCE7' : 'transparent',
                  border: isActive ? '1px solid #BBF7D0' : '1px solid transparent',
                  transition: 'all 0.2s ease',
                  cursor: 'pointer',
                  flexShrink: 0
                }}
              >
                <Icon size={13} color={isActive ? '#15803D' : '#647067'} aria-hidden="true" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Right Controls: Location Badge, SIH Demo Button, Auth, Language Selector */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexShrink: 0 }} className="desktop-controls">
          {/* Quick Location Badge */}
          <div 
            onClick={() => setActiveTab('dashboard')}
            title={t('location.title')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 4,
              padding: '4px 7px',
              borderRadius: 6,
              background: '#F1F5F2',
              border: '1px solid #E5EAE6',
              fontSize: '0.72rem',
              color: '#17211B',
              cursor: 'pointer',
              whiteSpace: 'nowrap'
            }}
          >
            <MapPin size={12} color="#16A34A" aria-hidden="true" />
            <span style={{ maxWidth: 90, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {location?.district || location?.state || t('location.title')}
            </span>
          </div>

          {/* SIH Demo Mode Button */}
          <button
            onClick={onOpenDemo}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 4,
              padding: '4px 8px',
              borderRadius: 6,
              background: '#FEF3C7',
              border: '1px solid #FDE68A',
              color: '#B45309',
              fontSize: '0.72rem',
              fontWeight: 700,
              cursor: 'pointer',
              whiteSpace: 'nowrap'
            }}
          >
            <Sparkles size={12} color="#D97706" aria-hidden="true" />
            <span>{t('nav.demo')}</span>
          </button>

          {/* Auth Button (Sign In or Logout) */}
          {isAuthenticated ? (
            <button
              onClick={() => logout()}
              title={`Logged in as ${user?.name || 'Farmer'}. Click to log out.`}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 4,
                padding: '4px 8px',
                borderRadius: 6,
                background: '#FEE2F2',
                border: '1px solid #FCA5A5',
                color: '#991B1B',
                fontSize: '0.72rem',
                fontWeight: 700,
                cursor: 'pointer',
                whiteSpace: 'nowrap'
              }}
            >
              <LogOut size={12} color="#991B1B" aria-hidden="true" />
              <span>{t('profile.logout')}</span>
            </button>
          ) : (
            <button
              onClick={() => setActiveTab('login')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 4,
                padding: '4px 8px',
                borderRadius: 6,
                background: '#16A34A',
                border: '1px solid #15803D',
                color: '#FFFFFF',
                fontSize: '0.72rem',
                fontWeight: 700,
                cursor: 'pointer',
                whiteSpace: 'nowrap'
              }}
            >
              <LogIn size={12} color="#FFFFFF" aria-hidden="true" />
              <span>{t('auth.signIn')}</span>
            </button>
          )}

          {/* Language Selector Dropdown */}
          <div style={{ position: 'relative' }}>
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              aria-label="Select Language"
              style={{
                padding: '4px 6px',
                borderRadius: 6,
                background: '#FFFFFF',
                border: '1px solid #E5EAE6',
                color: '#17211B',
                fontSize: '0.72rem',
                fontWeight: 600,
                outline: 'none',
                cursor: 'pointer',
                maxWidth: 105
              }}
            >
              {languages.map(lang => (
                <option key={lang.code} value={lang.code} style={{ background: '#FFFFFF', color: '#17211B' }}>
                  🌐 {lang.nativeName}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Mobile / Compact Quick Controls & Menu Toggle */}
        <div style={{ display: 'none', alignItems: 'center', gap: 6 }} className="mobile-controls">
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            aria-label="Select Language"
            style={{
              padding: '5px 6px',
              borderRadius: 6,
              background: '#FFFFFF',
              border: '1px solid #E5EAE6',
              color: '#17211B',
              fontSize: '0.75rem',
              fontWeight: 600,
              outline: 'none',
              cursor: 'pointer',
              maxWidth: 105
            }}
          >
            {languages.map(lang => (
              <option key={lang.code} value={lang.code}>
                🌐 {lang.nativeName}
              </option>
            ))}
          </select>

          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="mobile-menu-btn"
            aria-label="Toggle Menu"
            style={{
              padding: '6px 9px',
              borderRadius: 8,
              background: '#F1F5F2',
              border: '1px solid #E5EAE6',
              color: '#17211B',
              cursor: 'pointer'
            }}
          >
            {isMenuOpen ? <X size={18} aria-hidden="true" /> : <Menu size={18} aria-hidden="true" />}
          </button>
        </div>
      </div>

      {/* Mobile / Tablet Dropdown Drawer */}
      {isMenuOpen && (
        <div style={{
          position: 'fixed',
          top: '60px',
          left: 0,
          right: 0,
          bottom: 0,
          background: '#FFFFFF',
          zIndex: 999,
          padding: '16px 20px 32px 20px',
          overflowY: 'auto',
          overflowX: 'hidden',
          maxWidth: '100vw',
          boxSizing: 'border-box',
          display: 'flex',
          flexDirection: 'column',
          gap: 10,
          boxShadow: '0 10px 25px rgba(0,0,0,0.1)'
        }}>
          <div style={{ fontWeight: 700, fontSize: '0.82rem', color: '#647067', textTransform: 'uppercase', marginBottom: 2 }}>
            {t('appName')}
          </div>
          {navItems.map(item => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  setIsMenuOpen(false);
                }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 12,
                  padding: '11px 15px',
                  borderRadius: 10,
                  fontSize: '0.95rem',
                  fontWeight: isActive ? 700 : 500,
                  color: isActive ? '#15803D' : '#17211B',
                  background: isActive ? '#DCFCE7' : '#F7F9F7',
                  border: isActive ? '1px solid #BBF7D0' : '1px solid #E5EAE6',
                  textAlign: 'left',
                  minHeight: 44,
                  cursor: 'pointer',
                  wordBreak: 'break-word'
                }}
              >
                <Icon size={18} color={isActive ? '#15803D' : '#647067'} aria-hidden="true" />
                <span>{item.label}</span>
              </button>
            );
          })}

          <hr style={{ border: 'none', borderTop: '1px solid #E5EAE6', margin: '6px 0' }} />

          <button
            onClick={() => { onOpenDemo(); setIsMenuOpen(false); }}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              padding: '11px 15px',
              borderRadius: 10,
              background: '#FEF3C7',
              border: '1px solid #FDE68A',
              color: '#B45309',
              fontWeight: 700,
              fontSize: '0.92rem'
            }}
          >
            <Sparkles size={18} color="#D97706" aria-hidden="true" />
            <span>{t('nav.demo')}</span>
          </button>

          <div style={{ display: 'flex', gap: 10, marginTop: 4 }}>
            <div style={{ flex: 1, padding: '9px 12px', background: '#F1F5F2', borderRadius: 8, border: '1px solid #E5EAE6', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: 6 }}>
              <MapPin size={15} color="#16A34A" aria-hidden="true" />
              <span>{location?.formatted || (location?.district ? `${location.district}, ${location.state || ''}` : t('location.title'))}</span>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @media (max-width: 1140px) {
          .desktop-nav { display: none !important; }
          .desktop-controls { display: none !important; }
          .mobile-controls { display: flex !important; }
        }
        @media (min-width: 1141px) {
          .desktop-nav { display: flex !important; }
          .desktop-controls { display: flex !important; }
          .mobile-controls { display: none !important; }
        }
      `}</style>
    </header>
  );
};

export default Navbar;
