const fs = require('fs');
const path = require('path');

const rootDir = path.resolve(__dirname, '..');
const clientPublic = path.join(rootDir, 'client', 'public');
const clientDist = path.join(rootDir, 'client', 'dist');
const appDir = path.join(rootDir, 'App');
const appPublic = path.join(appDir, 'public');
const appDist = path.join(appDir, 'dist');

if (!fs.existsSync(appPublic)) {
  fs.mkdirSync(appPublic, { recursive: true });
}

const logoSrc = path.join(clientPublic, 'logo.png');
const svgSrc = path.join(clientPublic, 'favicon.svg');
const appManifest = path.join(appDir, 'manifest.json');
const appSW = path.join(appDir, 'sw.js');
const offlinePage = path.join(appDir, 'offline.html');

// Copy icons to App/public/ & client/public/ & client/dist/
if (fs.existsSync(logoSrc)) {
  ['icon-512.png', 'icon-192.png', 'apple-touch-icon.png'].forEach(filename => {
    fs.copyFileSync(logoSrc, path.join(appPublic, filename));
    fs.copyFileSync(logoSrc, path.join(clientPublic, filename));
    if (fs.existsSync(clientDist)) {
      fs.copyFileSync(logoSrc, path.join(clientDist, filename));
    }
  });
  console.log('✔ App PNG icons synchronized to App/public, client/public & client/dist');
}

if (fs.existsSync(svgSrc)) {
  fs.copyFileSync(svgSrc, path.join(appPublic, 'favicon.svg'));
  if (fs.existsSync(clientDist)) {
    fs.copyFileSync(svgSrc, path.join(clientDist, 'favicon.svg'));
  }
}

if (fs.existsSync(appManifest)) {
  fs.copyFileSync(appManifest, path.join(appPublic, 'manifest.json'));
  fs.copyFileSync(appManifest, path.join(clientPublic, 'manifest.json'));
  if (fs.existsSync(clientDist)) {
    fs.copyFileSync(appManifest, path.join(clientDist, 'manifest.json'));
  }
}

if (fs.existsSync(appSW)) {
  fs.copyFileSync(appSW, path.join(clientPublic, 'sw.js'));
  if (fs.existsSync(clientDist)) {
    fs.copyFileSync(appSW, path.join(clientDist, 'sw.js'));
  }
}

if (fs.existsSync(offlinePage)) {
  if (fs.existsSync(clientDist)) {
    fs.copyFileSync(offlinePage, path.join(clientDist, 'offline.html'));
  }
}

// Bundle client/dist recursively into App/dist so App is 100% self-contained!
function copyDirSync(src, dest) {
  if (!fs.existsSync(src)) return;
  if (!fs.existsSync(dest)) fs.mkdirSync(dest, { recursive: true });

  const entries = fs.readdirSync(src, { withFileTypes: true });
  for (let entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);
    if (entry.isDirectory()) {
      copyDirSync(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

if (fs.existsSync(clientDist)) {
  copyDirSync(clientDist, appDist);
  console.log('✔ Standalone app bundle synced to App/dist for 100% self-contained portability!');
}
