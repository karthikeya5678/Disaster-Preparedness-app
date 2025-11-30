const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, 'frontend/src');

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

    // Check if the file contains the hardcoded localhost URL
    if (content.includes('http://localhost:8080')) {
        console.log(`Processing ${filePath}...`);

        // Replace all instances of http://localhost:8080/api with /api
        // This relies on the client.ts base URL configuration we set earlier
        // OR we can replace it with the full Render URL if we want to be explicit,
        // but using the client (or relative path if using proxy) is better.
        // However, since we updated client.ts to point to Render, we should just use client.

        // Strategy:
        // 1. If it uses `axios.get('http://localhost:8080...')`, replace with `client.get('/...')`
        // 2. If it uses `fetch('http://localhost:8080...')`, replace with `fetch('${API_URL}...')` (more complex)
        // 3. Simplest for now: Replace the string literal directly with the Render URL
        //    This ensures it works everywhere immediately without complex refactoring of every file to import 'client'.

        const renderUrl = 'https://disaster-backend.onrender.com';
        content = content.replace(/http:\/\/localhost:8080/g, renderUrl);

        fs.writeFileSync(filePath, content);
    }
}

walk(srcDir);
