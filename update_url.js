const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, 'frontend/src');
const OLD_URL = 'https://disaster-backend.onrender.com';
const NEW_URL = 'https://disaster-preparedness-app.onrender.com';

function walk(dir) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const filePath = path.join(dir, file);
        const stat = fs.statSync(filePath);
        if (stat.isDirectory()) {
            walk(filePath);
        } else if (file.endsWith('.tsx') || file.endsWith('.ts')) {
            processFile(filePath);
        }
    }
}

function processFile(filePath) {
    let content = fs.readFileSync(filePath, 'utf8');

    if (content.includes(OLD_URL)) {
        console.log(`Updating URL in ${filePath}...`);
        // Replace all instances
        content = content.split(OLD_URL).join(NEW_URL);
        fs.writeFileSync(filePath, content);
    }
}

console.log(`Replacing "${OLD_URL}" with "${NEW_URL}"...`);
walk(srcDir);
console.log('Done.');
