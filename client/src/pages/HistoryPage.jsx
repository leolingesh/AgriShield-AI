import React, { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import HistoryCard from '../components/HistoryCard';
import AnalysisResult from '../components/AnalysisResult';
import { History, Search, ArrowLeft, RefreshCw, Eye, Trash2 } from 'lucide-react';
import { CROPS_DATA } from '../components/CropSelector';

export const HistoryPage = ({ onSelectAnalysis, selectedAnalysis, onClearSelectedAnalysis }) => {
  const { t } = useLanguage();
  const [analyses, setAnalyses] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCropFilter, setSelectedCropFilter] = useState('ALL');
  const [selectedRiskFilter, setSelectedRiskFilter] = useState('ALL');
  const [loading, setLoading] = useState(true);

  const fetchAnalyses = async () => {
    setLoading(true);
    try {
      let url = '/api/analyses?limit=50';
      if (selectedCropFilter !== 'ALL') url += `&crop=${selectedCropFilter}`;
      if (selectedRiskFilter !== 'ALL') url += `&riskLevel=${selectedRiskFilter}`;

      const res = await fetch(url);
      const data = await res.json();
      if (data.success) {
        setAnalyses(data.analyses || []);
      }
    } catch (err) {
      console.warn('Failed to load history:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalyses();
  }, [selectedCropFilter, selectedRiskFilter]);

  const handleDeleteAnalysis = async (id) => {
    try {
      await fetch(`/api/analyses/${id}`, { method: 'DELETE' });
      setAnalyses(prev => prev.filter(a => (a._id !== id && a.id !== id)));
    } catch (e) {}
  };

  const filteredList = analyses.filter(a => {
    const term = searchTerm.toLowerCase();
    const cropName = (a.cropName || '').toLowerCase();
    const cond = (a.aiAnalysis?.condition || '').toLowerCase();
    return cropName.includes(term) || cond.includes(term);
  });

  const getBadge = (lvl = 'LOW') => {
    if (lvl === 'CRITICAL') return <span className="badge badge-critical">{t('risk.critical')}</span>;
    if (lvl === 'HIGH') return <span className="badge badge-high">{t('risk.high')}</span>;
    if (lvl === 'MEDIUM') return <span className="badge badge-medium">{t('risk.medium')}</span>;
    return <span className="badge badge-low">{t('risk.low')}</span>;
  };

  // If a single analysis is opened for detail view
  if (selectedAnalysis) {
    return (
      <div className="app-container">
        <button
          onClick={onClearSelectedAnalysis}
          className="btn-secondary"
          style={{ marginBottom: 20, display: 'inline-flex', alignItems: 'center', gap: 8 }}
        >
          <ArrowLeft size={16} /> Back to Analysis Archive
        </button>

        <AnalysisResult
          analysis={selectedAnalysis}
          onNewScan={onClearSelectedAnalysis}
        />
      </div>
    );
  }

  return (
    <div className="app-container">
      {/* Title */}
      <div style={{ marginBottom: 24 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#9333EA', fontSize: '0.85rem', fontWeight: 700, marginBottom: 4 }}>
          <History size={18} />
          <span>Diagnostic Records Archive</span>
        </div>
        <h1 style={{ fontSize: '1.9rem', color: '#17211B', letterSpacing: '-0.02em', marginBottom: 4 }}>
          {t('nav.history')} ({analyses.length})
        </h1>
      </div>

      {/* Filter and Search Bar */}
      <div className="glass-card" style={{ padding: '16px', marginBottom: 24 }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: 12
        }}>
          {/* Search Box */}
          <div style={{ position: 'relative' }}>
            <Search size={16} color="#647067" style={{ position: 'absolute', left: 12, top: 13 }} />
            <input
              type="text"
              placeholder={t('crop.searchPlaceholder')}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input-field"
              style={{ paddingLeft: 36 }}
            />
          </div>

          {/* Crop Filter */}
          <div>
            <select
              value={selectedCropFilter}
              onChange={(e) => setSelectedCropFilter(e.target.value)}
              className="input-field"
              style={{ cursor: 'pointer' }}
            >
              <option value="ALL" style={{ background: '#FFFFFF', color: '#17211B' }}>🌾 {t('crop.selectTitle')}</option>
              {CROPS_DATA.map(c => (
                <option key={c.id} value={c.name} style={{ background: '#FFFFFF', color: '#17211B' }}>
                  {c.icon} {c.name}
                </option>
              ))}
            </select>
          </div>

          {/* Risk Level Filter */}
          <div>
            <select
              value={selectedRiskFilter}
              onChange={(e) => setSelectedRiskFilter(e.target.value)}
              className="input-field"
              style={{ cursor: 'pointer' }}
            >
              <option value="ALL" style={{ background: '#FFFFFF', color: '#17211B' }}>⚠️ {t('risk.title')}</option>
              <option value="LOW" style={{ background: '#FFFFFF', color: '#15803D' }}>🟢 {t('risk.low')}</option>
              <option value="MEDIUM" style={{ background: '#FFFFFF', color: '#B45309' }}>🟡 {t('risk.medium')}</option>
              <option value="HIGH" style={{ background: '#FFFFFF', color: '#C2410C' }}>🟠 {t('risk.high')}</option>
              <option value="CRITICAL" style={{ background: '#FFFFFF', color: '#B91C1C' }}>🔴 {t('risk.critical')}</option>
            </select>
          </div>
        </div>
      </div>

      {/* Grid / Table View of Analyses */}
      {loading ? (
        <div className="glass-card" style={{ padding: '40px', textAlign: 'center' }}>
          <RefreshCw size={28} className="spin" style={{ color: '#16A34A', margin: '0 auto 12px auto' }} />
          <p style={{ color: '#647067' }}>Loading diagnostic archive...</p>
        </div>
      ) : filteredList.length > 0 ? (
        <>
          {/* Desktop Table View */}
          <div className="desktop-table-container glass-card" style={{ overflowX: 'auto', marginBottom: 24 }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.88rem' }}>
              <thead>
                <tr style={{ background: '#F7F9F7', borderBottom: '1px solid #E5EAE6', color: '#647067', fontWeight: 600 }}>
                  <th style={{ padding: '14px 16px' }}>Date</th>
                  <th style={{ padding: '14px 16px' }}>{t('result.cropDetected')}</th>
                  <th style={{ padding: '14px 16px' }}>{t('result.condition')}</th>
                  <th style={{ padding: '14px 16px' }}>{t('result.confidence')}</th>
                  <th style={{ padding: '14px 16px' }}>{t('result.severity')}</th>
                  <th style={{ padding: '14px 16px', textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredList.map((item, idx) => {
                  const ai = item.aiAnalysis || {};
                  const risk = item.riskAssessment || {};
                  return (
                    <tr key={item._id || item.id || idx} style={{ borderBottom: '1px solid #E5EAE6' }}>
                      <td style={{ padding: '14px 16px', color: '#647067', whiteSpace: 'nowrap' }}>
                        {new Date(item.createdAt).toLocaleDateString()}
                      </td>
                      <td style={{ padding: '14px 16px', fontWeight: 700, color: '#17211B' }}>
                        🌾 {item.cropName}
                      </td>
                      <td style={{ padding: '14px 16px', color: '#17211B' }}>
                        {ai.condition || 'Foliar Check'}
                      </td>
                      <td style={{ padding: '14px 16px', color: '#16A34A', fontWeight: 700 }}>
                        {Math.round((ai.confidence || 0.85) * 100)}%
                      </td>
                      <td style={{ padding: '14px 16px' }}>
                        {getBadge(risk.riskLevel || ai.severity)}
                      </td>
                      <td style={{ padding: '14px 16px', textAlign: 'right' }}>
                        <div style={{ display: 'inline-flex', gap: 8 }}>
                          <button
                            type="button"
                            onClick={() => onSelectAnalysis(item)}
                            className="btn-secondary"
                            style={{ padding: '6px 12px', minHeight: 32, fontSize: '0.78rem' }}
                          >
                            <Eye size={14} /> View
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteAnalysis(item._id || item.id)}
                            style={{ padding: '6px 10px', borderRadius: 8, background: '#FEE2E2', border: '1px solid #FCA5A5', color: '#DC2626', cursor: 'pointer' }}
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Mobile Card Grid View */}
          <div className="mobile-cards-container grid-2">
            {filteredList.map(item => (
              <HistoryCard
                key={item._id || item.id}
                analysis={item}
                onView={() => onSelectAnalysis(item)}
                onDelete={handleDeleteAnalysis}
              />
            ))}
          </div>
        </>
      ) : (
        <div className="glass-card" style={{ padding: '40px 20px', textAlign: 'center' }}>
          <History size={48} color="#647067" style={{ margin: '0 auto 12px auto' }} />
          <h3 style={{ fontSize: '1.2rem', color: '#17211B', marginBottom: 6 }}>No Diagnostic Records Found</h3>
          <p style={{ fontSize: '0.85rem', color: '#647067' }}>
            No analyses match your search criteria. Try clearing filters or run a new crop scan.
          </p>
        </div>
      )}

      <style>{`
        @media (max-width: 768px) {
          .desktop-table-container { display: none !important; }
          .mobile-cards-container { display: grid !important; }
        }
        @media (min-width: 769px) {
          .desktop-table-container { display: block !important; }
          .mobile-cards-container { display: none !important; }
        }
      `}</style>
    </div>
  );
};

export default HistoryPage;
