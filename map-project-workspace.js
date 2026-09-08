const fs = require('fs');
const path = require('path');

const targetDirectory = './src';

function scanProjectTree(dir, depth = 0) {
  if (!fs.existsSync(dir)) return;
  const files = fs.readdirSync(dir);
  
  files.forEach(file => {
    const fullPath = path.join(dir, file);
    if (file === 'node_modules' || file.startsWith('.')) return;
    
    const stats = fs.statSync(fullPath);
    const indentationString = '  '.repeat(depth);
    
    if (stats.isDirectory()) {
      console.log(`${indentationString}📁 ${file}/`);
      scanProjectTree(fullPath, depth + 1);
    } else {
      console.log(`${indentationString}📄 ${file}`);
    }
  });
}

console.log('🏗️ Mapping current surgecrm codebase infrastructure:');
scanProjectTree(targetDirectory);
