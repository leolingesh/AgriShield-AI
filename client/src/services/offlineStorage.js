/**
 * Local offline cache manager for rural resilience
 */

const STORAGE_KEYS = {
  OFFLINE_ANALYSES: 'agrishield_offline_analyses',
  CACHED_CROPS: 'agrishield_cached_crops',
  SAVED_ALERTS: 'agrishield_cached_alerts'
};

export const offlineStorage = {
  saveAnalysis: (analysis) => {
    try {
      const existing = offlineStorage.getAnalyses();
      const updated = [analysis, ...existing.filter(a => (a._id || a.id) !== (analysis._id || analysis.id))].slice(0, 30);
      localStorage.setItem(STORAGE_KEYS.OFFLINE_ANALYSES, JSON.stringify(updated));
    } catch (e) {
      console.warn('Failed to save to local cache:', e);
    }
  },

  getAnalyses: () => {
    try {
      const raw = localStorage.getItem(STORAGE_KEYS.OFFLINE_ANALYSES);
      return raw ? JSON.parse(raw) : [];
    } catch (e) {
      return [];
    }
  },

  cacheCrops: (crops) => {
    try {
      localStorage.setItem(STORAGE_KEYS.CACHED_CROPS, JSON.stringify(crops));
    } catch (e) {}
  },

  getCachedCrops: () => {
    try {
      const raw = localStorage.getItem(STORAGE_KEYS.CACHED_CROPS);
      return raw ? JSON.parse(raw) : [];
    } catch (e) {
      return [];
    }
  }
};
