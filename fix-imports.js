const fs = require('fs');
const path = require('path');

function walkSync(currentDirPath, callback) {
  fs.readdirSync(currentDirPath).forEach(function (name) {
    var filePath = path.join(currentDirPath, name);
    var stat = fs.statSync(filePath);
    if (stat.isFile()) {
      callback(filePath, stat);
    } else if (stat.isDirectory()) {
      walkSync(filePath, callback);
    }
  });
}

const targetDir = path.resolve(__dirname, 'apps/web/src');
let changedCount = 0;

walkSync(targetDir, function (filePath) {
  if (filePath.endsWith('.ts') || filePath.endsWith('.tsx')) {
    let content = fs.readFileSync(filePath, 'utf8');
    let original = content;

    // Match standard format: import { ... } from '@/lib/ai/...'
    content = content.replace(/from\s+['"]@\/lib\/ai[^'"]*['"]/g, "from '@ais/ai-engine'");

    // Match relative format from some deep files, e.g. '../../ai/templates'
    content = content.replace(/from\s+['"](?:\.\.\/)+ai\/templates['"]/g, "from '@ais/ai-engine'");
    content = content.replace(/from\s+['"](?:\.\.\/)+ai\/(?:providers|types|smart-routing|usage-tracker)['"]/g, "from '@ais/ai-engine'");

    if (content !== original) {
      fs.writeFileSync(filePath, content, 'utf8');
      console.log('Fixed:', filePath);
      changedCount++;
    }
  }
});
console.log('Total files changed:', changedCount);
