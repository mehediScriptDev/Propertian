const fs = require('fs');
const path = require('path');

function walkDir(dir, extFilter = null) {
  const files = [];
  const items = fs.readdirSync(dir, { withFileTypes: true });
  for (const it of items) {
    const res = path.join(dir, it.name);
    if (it.isDirectory()) {
      if (it.name === 'node_modules' || it.name === 'src/i18n/translations') continue;
      files.push(...walkDir(res, extFilter));
    } else {
      if (!extFilter || extFilter.includes(path.extname(it.name))) files.push(res);
    }
  }
  return files;
}

function getKeys(obj, prefix = '') {
  const keys = [];
  for (const k of Object.keys(obj)) {
    const val = obj[k];
    const full = prefix ? `${prefix}.${k}` : k;
    if (val && typeof val === 'object' && !Array.isArray(val)) {
      keys.push(...getKeys(val, full));
    } else {
      keys.push(full);
    }
  }
  return keys;
}

function readJson(p) {
  return JSON.parse(fs.readFileSync(p, 'utf8'));
}

const repoRoot = path.resolve(__dirname, '..');
const srcDir = path.join(repoRoot, 'src');
const enPath = path.join(srcDir, 'i18n', 'translations', 'en.json');
const frPath = path.join(srcDir, 'i18n', 'translations', 'fr.json');

const en = readJson(enPath);
const fr = readJson(frPath);
const enKeys = getKeys(en);
const frKeys = getKeys(fr);

const files = walkDir(srcDir, ['.js', '.jsx', '.ts', '.tsx', '.mjs', '.cjs']);

function findUsages(keys) {
  const unused = [];
  for (const key of keys) {
    const regexes = [
      new RegExp(`t\\(\\s*['\"]${escapeRegExp(key)}['\"]\\s*\\)`),
      new RegExp(escapeRegExp(key))
    ];

    let found = false;
    for (const f of files) {
      const content = fs.readFileSync(f, 'utf8');
      for (const r of regexes) {
        if (r.test(content)) { found = true; break; }
      }
      if (found) break;
    }
    if (!found) unused.push(key);
  }
  return unused;
}

function escapeRegExp(string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

console.log('Scanned files:', files.length);
console.log('EN keys:', enKeys.length, 'FR keys:', frKeys.length);

const unusedEn = findUsages(enKeys);
const unusedFr = findUsages(frKeys);

console.log('\nUnused EN keys (' + unusedEn.length + '):');
console.log(unusedEn.join('\n'));

console.log('\nUnused FR keys (' + unusedFr.length + '):');
console.log(unusedFr.join('\n'));

// write outputs
fs.writeFileSync(path.join(repoRoot, 'tmp-unused-i18n-en.txt'), unusedEn.join('\n'));
fs.writeFileSync(path.join(repoRoot, 'tmp-unused-i18n-fr.txt'), unusedFr.join('\n'));

console.log('\nWrote tmp-unused-i18n-en.txt and tmp-unused-i18n-fr.txt');
