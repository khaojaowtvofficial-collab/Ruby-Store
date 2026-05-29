#!/usr/bin/env node
/**
 * Ruby Store — Auto Content Hash Build Script
 * สร้าง hash จาก content ของไฟล์ → อัปเดต HTML อัตโนมัติทุก deploy
 * ใช้: node build.js
 */
const fs   = require('fs');
const path = require('path');
const crypto = require('crypto');

const dir = __dirname;

// ไฟล์ที่ต้องการ hash
const FILES = ['app.js', 'db.js', 'style.css', 'i18n.js'];

// คำนวณ MD5 hash (8 chars) จาก content
function hashFile(filePath) {
  const content = fs.readFileSync(filePath);
  return crypto.createHash('md5').update(content).digest('hex').slice(0, 8);
}

// หา hash ทุกไฟล์
const hashes = {};
FILES.forEach(f => {
  const fp = path.join(dir, f);
  if (fs.existsSync(fp)) {
    hashes[f] = hashFile(fp);
    console.log(`  ${f} → ?v=${hashes[f]}`);
  }
});

// อัปเดต HTML ทุกไฟล์
const htmlFiles = fs.readdirSync(dir).filter(f => f.endsWith('.html'));
let totalUpdates = 0;

htmlFiles.forEach(htmlFile => {
  const fp = path.join(dir, htmlFile);
  let content = fs.readFileSync(fp, 'utf8');
  let changed = false;

  FILES.forEach(jsFile => {
    if (!hashes[jsFile]) return;
    // เปลี่ยน src/href ที่มี ?v= หรือไม่มี
    const patterns = [
      new RegExp(`(src|href)=["']${jsFile.replace('.', '\\.')}(\\?v=[^"']*)?["']`, 'g'),
    ];
    patterns.forEach(re => {
      const updated = content.replace(re, `$1="${jsFile}?v=${hashes[jsFile]}"`);
      if (updated !== content) { content = updated; changed = true; }
    });
  });

  if (changed) {
    fs.writeFileSync(fp, content);
    totalUpdates++;
    console.log(`  Updated: ${htmlFile}`);
  }
});

console.log(`\n✅ Build complete — ${totalUpdates} HTML files updated`);
