const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'backend/src/config/serviceAccountKey.json');

try {
    const content = fs.readFileSync(filePath, 'utf8');
    // Minify the JSON to remove newlines and extra spaces
    const minified = JSON.stringify(JSON.parse(content));

    console.log('\n=== COPY THE TEXT BELOW FOR RENDER ===\n');
    console.log(minified);
    console.log('\n=== END OF TEXT ===\n');
    console.log('Instructions:');
    console.log('1. Go to Render -> Environment');
    console.log('2. Key: FIREBASE_SERVICE_ACCOUNT');
    console.log('3. Value: Paste the text above (it is one long line).');
} catch (err) {
    console.error('Error reading file:', err.message);
}
