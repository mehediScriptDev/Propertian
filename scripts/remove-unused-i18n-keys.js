const fs = require('fs');
const path = require('path');

function readJson(p) {
  return JSON.parse(fs.readFileSync(p, 'utf8'));
}

function writeJson(p, obj) {
  fs.writeFileSync(p, JSON.stringify(obj, null, 2) + '\n', 'utf8');
}

function deletePath(obj, parts) {
  if (!obj || parts.length === 0) return;
  const key = parts[0];
  if (!(key in obj)) return;
  if (parts.length === 1) {
    delete obj[key];
    return;
  }
  deletePath(obj[key], parts.slice(1));
  // if child became empty object, remove it
  if (obj[key] && typeof obj[key] === 'object' && Object.keys(obj[key]).length === 0) {
    delete obj[key];
  }
}

function removeKeysFromFile(filePath, keys) {
  const full = readJson(filePath);
  for (const k of keys) {
    const parts = k.split('.');
    deletePath(full, parts);
  }
  // cleanup: recursively remove any empty objects that may remain
  function cleanup(o) {
    if (!o || typeof o !== 'object') return false;
    for (const p of Object.keys(o)) {
      if (cleanup(o[p])) delete o[p];
    }
    return Object.keys(o).length === 0;
  }
  cleanup(full);
  writeJson(filePath, full);
}

const repoRoot = path.resolve(__dirname, '..');
const srcI18n = path.join(repoRoot, 'src', 'i18n', 'translations');
const enFile = path.join(srcI18n, 'en.json');
const frFile = path.join(srcI18n, 'fr.json');
const tmpEn = path.join(repoRoot, 'tmp-unused-i18n-en.txt');
const tmpFr = path.join(repoRoot, 'tmp-unused-i18n-fr.txt');

if (!fs.existsSync(tmpEn) || !fs.existsSync(tmpFr)) {
  console.error('tmp unused files not found. Run the scanner first.');
  process.exit(1);
}

const enKeys = fs.readFileSync(tmpEn, 'utf8').split(/\r?\n/).filter(Boolean);
const frKeys = fs.readFileSync(tmpFr, 'utf8').split(/\r?\n/).filter(Boolean);

console.log('Removing', enKeys.length, 'keys from', enFile);
removeKeysFromFile(enFile, enKeys);
console.log('Removing', frKeys.length, 'keys from', frFile);
removeKeysFromFile(frFile, frKeys);

console.log('Done.');
