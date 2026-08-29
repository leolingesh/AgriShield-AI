import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { Mail, Lock, User, Eye, EyeOff, ArrowRight, AlertCircle, Leaf, Zap, ShieldCheck } from 'lucide-react';

export const SignupPage = ({ onNavigate }) => {
  const { t } = useLanguage();
  const { register } = useAuth();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  // Field validation error states
  const [nameError, setNameError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [confirmError, setConfirmError] = useState('');
  const [serverError, setServerError] = useState('');

  const validateNameFormat = (val) => {
    if (!val || !val.trim()) {
      return t('auth.nameRequired');
    }
    return '';
  };

  const validateEmailFormat = (val) => {
    if (!val || !val.trim()) {
      return t('auth.emailRequired');
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(val.trim())) {
      return t('auth.emailInvalid');
    }
    return '';
  };

  const validatePasswordFormat = (val) => {
    if (!val || val.length < 8) {
      return t('auth.passwordMinLength');
    }
    return '';
  };

  const validateConfirmFormat = (confirmVal, passVal) => {
    if (!confirmVal) {
      return t('auth.confirmPasswordRequired');
    }
    if (confirmVal !== passVal) {
      return t('auth.passwordsDoNotMatch');
    }
    return '';
  };

  const handleNameChange = (e) => {
    const val = e.target.value;
    setName(val);
    if (nameError) setNameError(validateNameFormat(val));
    if (serverError) setServerError('');
  };

  const handleEmailChange = (e) => {
    const val = e.target.value;
    setEmail(val);
    if (emailError) setEmailError(validateEmailFormat(val));
    if (serverError) setServerError('');
  };

  const handlePasswordChange = (e) => {
    const val = e.target.value;
    setPassword(val);
    if (passwordError) setPasswordError(validatePasswordFormat(val));
    if (confirmPassword && confirmError) setConfirmError(validateConfirmFormat(confirmPassword, val));
    if (serverError) setServerError('');
  };

  const handleConfirmChange = (e) => {
    const val = e.target.value;
    setConfirmPassword(val);
    if (confirmError) setConfirmError(validateConfirmFormat(val, password));
    if (serverError) setServerError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError('');

    const nErr = validateNameFormat(name);
    const eErr = validateEmailFormat(email);
    const pErr = validatePasswordFormat(password);
    const cErr = validateConfirmFormat(confirmPassword, password);

    setNameError(nErr);
    setEmailError(eErr);
    setPasswordError(pErr);
    setConfirmError(cErr);

    if (nErr || eErr || pErr || cErr) {
      return;
    }

    setLoading(true);
    try {
      const res = await register(name.trim(), email.trim(), password);
      if (res.success) {
        if (onNavigate) {
          onNavigate('dashboard');
        }
      } else {
        setServerError(res.message || t('auth.createAccountError'));
      }
    } catch (err) {
      setServerError(t('auth.connectionError'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      width: '100%',
      minHeight: 'calc(100vh - 120px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '24px 16px',
      boxSizing: 'border-box',
      background: '#F8FAF8'
    }}>
      <div style={{
        maxWidth: 1040,
        width: '100%',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
        borderRadius: 24,
        overflow: 'hidden',
        boxShadow: '0 12px 40px rgba(0,0,0,0.05), 0 2px 8px rgba(0,0,0,0.03)',
        border: '1px solid #E2E8E4',
        background: '#FFFFFF'
      }}>

        {/* LEFT SECTION — Brand Showcase */}
        <div style={{
          background: 'linear-gradient(145deg, #15803D 0%, #16A34A 50%, #14532D 100%)',
          padding: '48px 40px',
          color: '#FFFFFF',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          position: 'relative',
          overflow: 'hidden'
        }}>
          <div>
            {/* Logo */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 36 }}>
              <img 
                src="/logo.png" 
                alt="AgriShield AI Logo" 
                style={{ 
                  width: 48, 
                  height: 48, 
                  objectFit: 'contain',
                  background: '#FFFFFF',
                  borderRadius: 12,
                  padding: 4,
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.12)'
                }} 
              />
              <span style={{ fontSize: '1.4rem', fontWeight: 800, color: '#FFFFFF', letterSpacing: '-0.02em' }}>
                {t('appName')}
              </span>
            </div>

            {/* Tagline */}
            <h1 style={{ fontSize: '1.8rem', fontWeight: 800, lineHeight: 1.3, marginBottom: 14, color: '#FFFFFF' }}>
              {t('tagline')}
            </h1>
            <p style={{ fontSize: '0.95rem', color: '#DCFCE7', lineHeight: 1.6, opacity: 0.9, maxWidth: 420 }}>
              {t('hero.subtitle')}
            </p>
          </div>

          {/* Feature Badges */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14, marginTop: 40 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: '0.88rem', color: '#F0FDF4' }}>
              <div style={{ background: 'rgba(255, 255, 255, 0.15)', padding: 6, borderRadius: 8 }}>
                <Leaf size={16} color="#FFFFFF" />
              </div>
              <span>MobileNetV3 Leaf Disease Classification</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: '0.88rem', color: '#F0FDF4' }}>
              <div style={{ background: 'rgba(255, 255, 255, 0.15)', padding: 6, borderRadius: 8 }}>
                <Zap size={16} color="#FFFFFF" />
              </div>
              <span>{t('risk.title')}</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: '0.88rem', color: '#F0FDF4' }}>
              <div style={{ background: 'rgba(255, 255, 255, 0.15)', padding: 6, borderRadius: 8 }}>
                <ShieldCheck size={16} color="#FFFFFF" />
              </div>
              <span>{t('ipm.title')}</span>
            </div>
          </div>
        </div>

        {/* RIGHT SECTION — Centered Signup Card */}
        <div style={{
          padding: '48px 40px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          background: '#FFFFFF'
        }}>
          {/* Header */}
          <div style={{ marginBottom: 24 }}>
            <h2 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#17211B', letterSpacing: '-0.02em', marginBottom: 6 }}>
              {t('auth.createAccount')}
            </h2>
            <p style={{ fontSize: '0.9rem', color: '#647067', margin: 0 }}>
              {t('auth.joinAgriShield')}
            </p>
          </div>

          {/* Global Backend Error Alert */}
          {serverError && (
            <div 
              role="alert"
              style={{
                padding: '12px 14px',
                borderRadius: 10,
                background: '#FEF2F2',
                border: '1px solid #FCA5A5',
                color: '#991B1B',
                fontSize: '0.86rem',
                marginBottom: 20,
                display: 'flex',
                alignItems: 'center',
                gap: 10
              }}
            >
              <AlertCircle size={18} color="#991B1B" style={{ flexShrink: 0 }} />
              <span>{serverError}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} noValidate style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {/* Full Name Field */}
            <div>
              <label 
                htmlFor="signup-name" 
                style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#17211B', marginBottom: 6 }}
              >
                {t('profile.fullName')}
              </label>
              <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                <div style={{ position: 'absolute', left: 14, color: '#647067', display: 'flex', alignItems: 'center' }}>
                  <User size={18} color={nameError ? '#DC2626' : '#16A34A'} />
                </div>
                <input
                  id="signup-name"
                  type="text"
                  value={name}
                  onChange={handleNameChange}
                  onBlur={() => setNameError(validateNameFormat(name))}
                  placeholder={t('profile.fullName')}
                  aria-invalid={Boolean(nameError)}
                  aria-describedby={nameError ? 'name-error' : undefined}
                  style={{
                    width: '100%',
                    height: '46px',
                    padding: '0 14px 0 42px',
                    borderRadius: 10,
                    border: nameError ? '1.5px solid #DC2626' : '1px solid #E2E8E4',
                    fontSize: '0.92rem',
                    color: '#17211B',
                    outline: 'none',
                    background: nameError ? '#FEF2F2' : '#F9FAF9',
                    boxSizing: 'border-box',
                    transition: 'border-color 0.2s ease, background 0.2s ease'
                  }}
                />
              </div>
              {nameError && (
                <div id="name-error" style={{ fontSize: '0.78rem', color: '#DC2626', marginTop: 4, fontWeight: 500 }}>
                  {nameError}
                </div>
              )}
            </div>

            {/* Email Address Field */}
            <div>
              <label 
                htmlFor="signup-email" 
                style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#17211B', marginBottom: 6 }}
              >
                {t('auth.email')}
              </label>
              <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                <div style={{ position: 'absolute', left: 14, color: '#647067', display: 'flex', alignItems: 'center' }}>
                  <Mail size={18} color={emailError ? '#DC2626' : '#16A34A'} />
                </div>
                <input
                  id="signup-email"
                  type="email"
                  value={email}
                  onChange={handleEmailChange}
                  onBlur={() => setEmailError(validateEmailFormat(email))}
                  placeholder={t('auth.emailPlaceholder')}
                  aria-invalid={Boolean(emailError)}
                  aria-describedby={emailError ? 'signup-email-error' : undefined}
                  style={{
                    width: '100%',
                    height: '46px',
                    padding: '0 14px 0 42px',
                    borderRadius: 10,
                    border: emailError ? '1.5px solid #DC2626' : '1px solid #E2E8E4',
                    fontSize: '0.92rem',
                    color: '#17211B',
                    outline: 'none',
                    background: emailError ? '#FEF2F2' : '#F9FAF9',
                    boxSizing: 'border-box',
                    transition: 'border-color 0.2s ease, background 0.2s ease'
                  }}
                />
              </div>
              {emailError && (
                <div id="signup-email-error" style={{ fontSize: '0.78rem', color: '#DC2626', marginTop: 4, fontWeight: 500 }}>
                  {emailError}
                </div>
              )}
            </div>

            {/* Password Field */}
            <div>
              <label 
                htmlFor="signup-password" 
                style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#17211B', marginBottom: 6 }}
              >
                {t('auth.password')}
              </label>
              <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                <div style={{ position: 'absolute', left: 14, color: '#647067', display: 'flex', alignItems: 'center' }}>
                  <Lock size={18} color={passwordError ? '#DC2626' : '#16A34A'} />
                </div>
                <input
                  id="signup-password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={handlePasswordChange}
                  onBlur={() => setPasswordError(validatePasswordFormat(password))}
                  placeholder={t('auth.passwordPlaceholder')}
                  aria-invalid={Boolean(passwordError)}
                  aria-describedby={passwordError ? 'signup-password-error' : undefined}
                  style={{
                    width: '100%',
                    height: '46px',
                    padding: '0 44px 0 42px',
                    borderRadius: 10,
                    border: passwordError ? '1.5px solid #DC2626' : '1px solid #E2E8E4',
                    fontSize: '0.92rem',
                    color: '#17211B',
                    outline: 'none',
                    background: passwordError ? '#FEF2F2' : '#F9FAF9',
                    boxSizing: 'border-box',
                    transition: 'border-color 0.2s ease, background 0.2s ease'
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  style={{
                    position: 'absolute',
                    right: 12,
                    background: 'none',
                    border: 'none',
                    color: '#647067',
                    cursor: 'pointer',
                    padding: 4,
                    display: 'flex',
                    alignItems: 'center'
                  }}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {passwordError && (
                <div id="signup-password-error" style={{ fontSize: '0.78rem', color: '#DC2626', marginTop: 4, fontWeight: 500 }}>
                  {passwordError}
                </div>
              )}
            </div>

            {/* Confirm Password Field */}
            <div>
              <label 
                htmlFor="signup-confirm-password" 
                style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#17211B', marginBottom: 6 }}
              >
                {t('auth.confirmPassword')}
              </label>
              <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                <div style={{ position: 'absolute', left: 14, color: '#647067', display: 'flex', alignItems: 'center' }}>
                  <ShieldCheck size={18} color={confirmError ? '#DC2626' : '#16A34A'} />
                </div>
                <input
                  id="signup-confirm-password"
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={handleConfirmChange}
                  onBlur={() => setConfirmError(validateConfirmFormat(confirmPassword, password))}
                  placeholder={t('auth.confirmPasswordPlaceholder')}
                  aria-invalid={Boolean(confirmError)}
                  aria-describedby={confirmError ? 'confirm-password-error' : undefined}
                  style={{
                    width: '100%',
                    height: '46px',
                    padding: '0 44px 0 42px',
                    borderRadius: 10,
                    border: confirmError ? '1.5px solid #DC2626' : '1px solid #E2E8E4',
                    fontSize: '0.92rem',
                    color: '#17211B',
                    outline: 'none',
                    background: confirmError ? '#FEF2F2' : '#F9FAF9',
                    boxSizing: 'border-box',
                    transition: 'border-color 0.2s ease, background 0.2s ease'
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  aria-label={showConfirmPassword ? 'Hide confirm password' : 'Show confirm password'}
                  style={{
                    position: 'absolute',
                    right: 12,
                    background: 'none',
                    border: 'none',
                    color: '#647067',
                    cursor: 'pointer',
                    padding: 4,
                    display: 'flex',
                    alignItems: 'center'
                  }}
                >
                  {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {confirmError && (
                <div id="confirm-password-error" style={{ fontSize: '0.78rem', color: '#DC2626', marginTop: 4, fontWeight: 500 }}>
                  {confirmError}
                </div>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              style={{
                width: '100%',
                height: '48px',
                borderRadius: 10,
                background: loading ? '#86EFAC' : 'linear-gradient(135deg, #16A34A 0%, #15803D 100%)',
                color: '#FFFFFF',
                fontSize: '0.95rem',
                fontWeight: 700,
                border: 'none',
                cursor: loading ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 8,
                boxShadow: loading ? 'none' : '0 4px 12px rgba(22, 163, 74, 0.25)',
                transition: 'all 0.2s ease',
                marginTop: 6
              }}
            >
              {loading ? (
                <>
                  <div style={{
                    width: 18,
                    height: 18,
                    border: '2px solid #FFFFFF',
                    borderTopColor: 'transparent',
                    borderRadius: '50%',
                    animation: 'spin 0.8s linear infinite'
                  }} />
                  <span>{t('auth.creatingAccount')}</span>
                </>
              ) : (
                <>
                  <span>{t('auth.createAccount')}</span>
                  <ArrowRight size={18} />
                </>
              )}
            </button>
          </form>

          {/* Bottom Login Link */}
          <div style={{ textAlign: 'center', marginTop: 24, fontSize: '0.88rem', color: '#647067' }}>
            <span>{t('auth.alreadyAccount')} </span>
            <button
              type="button"
              onClick={() => onNavigate && onNavigate('login')}
              style={{
                background: 'none',
                border: 'none',
                color: '#15803D',
                fontWeight: 700,
                cursor: 'pointer',
                textDecoration: 'underline',
                padding: 0,
                fontSize: '0.88rem'
              }}
            >
              {t('auth.signIn')}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

export default SignupPage;
