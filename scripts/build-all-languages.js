const fs = require('fs');
const path = require('path');
const { en } = require('./translations/en.master.js');
const hi = require('./translations/hi.data.js');

const LOCALES_DIR = path.join(__dirname, '..', 'client', 'src', 'locales');

// Helper to create language bundle from localized dictionary terms
function createLangBundle({
  appName, tagline, sihBadge,
  nav, hero, location, weather, crop, upload, result, risk, ipm, voice, ask, audio,
  alerts, offline, demo, crops, cropCategories, stages, diseases, severity, common,
  earlyWarning, prevention, ipmActions, monitoring, history, profile, admin, auth, pwa, camera, footer
}) {
  return {
    appName, tagline, sihBadge,
    nav, hero, location, weather, crop, upload, result, risk, ipm, voice, ask, audio,
    alerts, offline, demo, crops, cropCategories, stages, diseases, severity, common,
    earlyWarning, prevention, ipmActions, monitoring, history, profile, admin, auth, pwa, camera, footer
  };
}

// Generate ta, te, kn, ml, mr, bn, gu, pa, or, as, ur
// We load each language dataset and write to client/src/locales/

// Let's create the individual language definition files in scripts/translations/
