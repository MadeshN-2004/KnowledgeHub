const fs = require('fs');
const path = require('path');

// Create directories
const dirs = ['models', 'routes', 'middleware', 'services'];
dirs.forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir);
    console.log(`✅ Created directory: ${dir}`);
  }
});

// Create empty files
const files = [
  'models/User.js',
  'models/Document.js', 
  'middleware/auth.js',
  'services/geminiService.js',
  'routes/auth.js',
  'routes/documents.js',
  'routes/search.js',
  'routes/ai.js'
];

files.forEach(file => {
  if (!fs.existsSync(file)) {
    fs.writeFileSync(file, '// TODO: Add code here\n');
    console.log(`✅ Created file: ${file}`);
  }
});

console.log('🎯 All files created! Now copy the code from the artifact.');