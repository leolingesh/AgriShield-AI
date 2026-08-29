import React, { useState, useEffect } from 'react';
import { LanguageProvider } from './context/LanguageContext';
import { LocationProvider } from './context/LocationContext';
import { WeatherProvider } from './context/WeatherContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import OfflineBanner from './components/OfflineBanner';
import SihDemoModal from './components/SihDemoModal';
import InstallPwaPrompt from './components/InstallPwaPrompt';

// Pages
import Dashboard from './pages/Dashboard';
import AnalyzePage from './pages/AnalyzePage';
import EarlyWarningPage from './pages/EarlyWarningPage';
import MonitoringPage from './pages/MonitoringPage';
import HistoryPage from './pages/HistoryPage';
import ProfilePage from './pages/ProfilePage';
import AdminPage from './pages/AdminPage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';

export function AppContent() {
  const { isAuthenticated, authLoading } = useAuth();
  const [activeTab, setActiveTab] = useState(() => {
    const hash = window.location.hash.replace('#', '');
    return hash && ['dashboard', 'analyze', 'early-warning', 'monitoring', 'history', 'profile', 'admin', 'login', 'signup'].includes(hash)
      ? hash
      : 'dashboard';
  });
  const [isDemoModalOpen, setIsDemoModalOpen] = useState(false);
  const [scanCropId, setScanCropId] = useState('tomato');
  const [activeDemoCase, setActiveDemoCase] = useState(null);
  const [selectedAnalysis, setSelectedAnalysis] = useState(null);

  // Browser Back/Forward navigation support
  useEffect(() => {
    const handlePopState = (event) => {
      if (event.state && event.state.tab) {
        setActiveTab(event.state.tab);
      } else {
        const hash = window.location.hash.replace('#', '');
        if (hash) setActiveTab(hash);
        else setActiveTab('dashboard');
      }
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigateToTab = (tab) => {
    if (tab !== activeTab) {
      window.history.pushState({ tab }, '', `#${tab}`);
      setSelectedAnalysis(null);
      setActiveTab(tab);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleStartScanWithCrop = (cropId) => {
    setScanCropId(cropId || 'tomato');
    setActiveDemoCase(null);
    navigateToTab('analyze');
  };

  const handleSelectDemoCase = (demoCase) => {
    setActiveDemoCase(demoCase);
    setScanCropId(demoCase.cropId);
    navigateToTab('analyze');
  };

  const handleSelectAnalysis = (analysis) => {
    setSelectedAnalysis(analysis);
    navigateToTab('history');
  };

  // Auth Initialization: Show clean loading state while verifying session token
  if (authLoading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#F8FAF8' }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12, color: '#16A34A', fontWeight: 600, fontSize: '0.92rem' }}>
          <div style={{
            width: 32,
            height: 32,
            border: '3px solid #16A34A',
            borderTopColor: 'transparent',
            borderRadius: '50%',
            animation: 'spin 0.8s linear infinite'
          }} />
          <span>Checking authentication...</span>
        </div>
        <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  // Protected Gate: If user is not authenticated, display Login or Signup Page
  if (!isAuthenticated) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', background: '#F8FAF8' }}>
        <OfflineBanner />
        <main style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          {activeTab === 'signup' ? (
            <SignupPage onNavigate={(tab) => navigateToTab(tab)} />
          ) : (
            <LoginPage onNavigate={(tab) => navigateToTab(tab)} />
          )}
        </main>
        <Footer />
      </div>
    );
  }

  // Redirect authenticated user if activeTab is set to 'login' or 'signup'
  const currentTab = (activeTab === 'login' || activeTab === 'signup') ? 'dashboard' : activeTab;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <OfflineBanner />
      <Navbar
        activeTab={currentTab}
        setActiveTab={navigateToTab}
        onOpenDemo={() => setIsDemoModalOpen(true)}
      />

      <main style={{ flex: 1 }}>
        {currentTab === 'dashboard' && (
          <Dashboard
            onNavigate={navigateToTab}
            onStartScanWithCrop={handleStartScanWithCrop}
            onSelectAnalysis={handleSelectAnalysis}
          />
        )}

        {currentTab === 'analyze' && (
          <AnalyzePage
            initialCropId={scanCropId}
            initialDemoCase={activeDemoCase}
          />
        )}

        {currentTab === 'early-warning' && (
          <EarlyWarningPage
            onStartScanWithCrop={handleStartScanWithCrop}
          />
        )}

        {currentTab === 'monitoring' && (
          <MonitoringPage
            onStartScanWithCrop={handleStartScanWithCrop}
          />
        )}

        {currentTab === 'history' && (
          <HistoryPage
            selectedAnalysis={selectedAnalysis}
            onSelectAnalysis={(item) => setSelectedAnalysis(item)}
            onClearSelectedAnalysis={() => setSelectedAnalysis(null)}
          />
        )}

        {currentTab === 'profile' && (
          <ProfilePage />
        )}

        {currentTab === 'admin' && (
          <AdminPage />
        )}
      </main>

      <Footer />

      {/* SIH Demo Interactive Modal */}
      <SihDemoModal
        isOpen={isDemoModalOpen}
        onClose={() => setIsDemoModalOpen(false)}
        onSelectDemoCase={handleSelectDemoCase}
      />

      {/* PWA App Install Banner */}
      <InstallPwaPrompt />
    </div>
  );
}

export default function App() {
  return (
    <LanguageProvider>
      <LocationProvider>
        <WeatherProvider>
          <AuthProvider>
            <AppContent />
          </AuthProvider>
        </WeatherProvider>
      </LocationProvider>
    </LanguageProvider>
  );
}
