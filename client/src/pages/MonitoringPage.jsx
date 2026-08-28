import React, { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useLocation } from '../context/LocationContext';
import CropMonitoringCard from '../components/CropMonitoringCard';
import { Layers, Plus, X, Sprout, Check } from 'lucide-react';
import { CROPS_DATA } from '../components/CropSelector';

export const MonitoringPage = ({ onStartScanWithCrop }) => {
  const { t } = useLanguage();
  const { location } = useLocation();

  const [plots, setPlots] = useState([]);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  // Form State
  const [plotName, setPlotName] = useState('');
  const [cropId, setCropId] = useState('tomato');
  const [growthStage, setGrowthStage] = useState('Vegetative');
  const [sowingDate, setSowingDate] = useState(new Date().toISOString().split('T')[0]);
  const [acres, setAcres] = useState(2.0);

  const fetchPlots = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/crops/monitoring/list');
      const data = await res.json();
      if (data.success) {
        setPlots(data.plots || []);
      }
    } catch (err) {
      console.warn('Failed to load plots:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPlots();
  }, []);

  const handleAddPlot = async (e) => {
    e.preventDefault();
    const cropObj = CROPS_DATA.find(c => c.id === cropId) || CROPS_DATA[0];

    try {
      const res = await fetch('/api/crops/monitoring/add', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          cropName: cropObj.name,
          cropId: cropObj.id,
          plotName: plotName || `${cropObj.name} Field`,
          location,
          sowingDate,
          growthStage,
          acres: Number(acres)
        })
      });
      const data = await res.json();
      if (data.success) {
        setIsAddOpen(false);
        setPlotName('');
        fetchPlots();
      }
    } catch (err) {
      console.error('Error adding plot:', err);
    }
  };

  const handleDeletePlot = async (plotId) => {
    try {
      await fetch(`/api/crops/monitoring/${plotId}`, { method: 'DELETE' });
      setPlots(prev => prev.filter(p => (p._id !== plotId && p.id !== plotId)));
    } catch (e) {}
  };

  return (
    <div className="app-container">
      {/* Title */}
      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 16,
        marginBottom: 24
      }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#16A34A', fontSize: '0.85rem', fontWeight: 700, marginBottom: 4 }}>
            <Layers size={18} />
            <span>Farm Plot Tracking & Phenology</span>
          </div>
          <h1 style={{ fontSize: '1.9rem', color: '#17211B', letterSpacing: '-0.02em', marginBottom: 4 }}>
            {t('nav.monitoring')} ({plots.length} Active Plots)
          </h1>
          <p style={{ fontSize: '0.88rem', color: '#647067' }}>
            Monitor crop growth stages, sowing timelines, and historical risk progression across all your farm blocks.
          </p>
        </div>

        <button
          onClick={() => setIsAddOpen(true)}
          className="btn-primary"
          style={{ padding: '12px 22px' }}
        >
          <Plus size={18} />
          <span>Add New Plot</span>
        </button>
      </div>

      {/* Grid of Monitored Plots */}
      {plots.length > 0 ? (
        <div className="grid-2">
          {plots.map(plot => (
            <CropMonitoringCard
              key={plot._id || plot.id}
              plot={plot}
              onInspect={() => onStartScanWithCrop(plot.cropId)}
              onDelete={handleDeletePlot}
            />
          ))}
        </div>
      ) : (
        <div className="glass-card" style={{ padding: '40px 20px', textAlign: 'center' }}>
          <Sprout size={48} color="#16A34A" style={{ margin: '0 auto 12px auto' }} />
          <h3 style={{ fontSize: '1.2rem', color: '#17211B', marginBottom: 8 }}>No Monitored Plots Yet</h3>
          <p style={{ fontSize: '0.88rem', color: '#647067', marginBottom: 20 }}>
            Add your farm fields to track growth stages and receive tailored early pest warnings.
          </p>
          <button onClick={() => setIsAddOpen(true)} className="btn-primary">
            <Plus size={18} /> Add Your First Plot
          </button>
        </div>
      )}

      {/* Add Plot Modal */}
      {isAddOpen && (
        <div style={{
          position: 'fixed',
          inset: 0,
          zIndex: 1000,
          background: 'rgba(23, 33, 27, 0.75)',
          backdropFilter: 'blur(8px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: 16
        }}>
          <div className="glass-card" style={{
            maxWidth: 520,
            width: '100%',
            padding: '24px',
            position: 'relative',
            background: '#FFFFFF'
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: 18
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <Sprout size={22} color="#16A34A" />
                <h3 style={{ fontSize: '1.2rem', color: '#17211B' }}>Add Farm Plot</h3>
              </div>
              <button
                onClick={() => setIsAddOpen(false)}
                style={{ padding: 6, borderRadius: '50%', background: '#F1F5F2', color: '#17211B', border: 'none', cursor: 'pointer' }}
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleAddPlot} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div>
                <label className="input-label">Plot Name / Identifier</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. North Riverbed (Block 1)"
                  value={plotName}
                  onChange={(e) => setPlotName(e.target.value)}
                  className="input-field"
                />
              </div>

              <div>
                <label className="input-label">{t('crop.selectTitle')}</label>
                <select
                  value={cropId}
                  onChange={(e) => setCropId(e.target.value)}
                  className="input-field"
                  style={{ cursor: 'pointer' }}
                >
                  {CROPS_DATA.map(c => (
                    <option key={c.id} value={c.id} style={{ background: '#FFFFFF', color: '#17211B' }}>
                      {c.icon} {c.name} ({c.category})
                    </option>
                  ))}
                </select>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div>
                  <label className="input-label">{t('crop.growthStage')}</label>
                  <select
                    value={growthStage}
                    onChange={(e) => setGrowthStage(e.target.value)}
                    className="input-field"
                    style={{ cursor: 'pointer' }}
                  >
                    <option value="Seedling">🌱 Seedling</option>
                    <option value="Vegetative">🌿 Vegetative</option>
                    <option value="Tillering">🌾 Tillering</option>
                    <option value="Flowering">🌸 Flowering</option>
                    <option value="Fruiting">🍅 Fruiting</option>
                    <option value="Maturity">🌾 Maturity</option>
                  </select>
                </div>

                <div>
                  <label className="input-label">Plot Size (Acres)</label>
                  <input
                    type="number"
                    step="0.5"
                    min="0.1"
                    value={acres}
                    onChange={(e) => setAcres(e.target.value)}
                    className="input-field"
                  />
                </div>
              </div>

              <div>
                <label className="input-label">Sowing Date</label>
                <input
                  type="date"
                  value={sowingDate}
                  onChange={(e) => setSowingDate(e.target.value)}
                  className="input-field"
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 10 }}>
                <button
                  type="button"
                  onClick={() => setIsAddOpen(false)}
                  className="btn-secondary"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-primary"
                >
                  <Check size={18} /> Save Plot
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default MonitoringPage;
