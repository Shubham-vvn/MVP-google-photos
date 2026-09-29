import fs from 'fs';
import path from 'path';

const rootDir = process.cwd();
const publicDir = path.join(rootDir, 'public');

const htmlPath = path.join(publicDir, 'index.html');
const cssPath = path.join(publicDir, 'css', 'style.css');
const jsPath = path.join(publicDir, 'js', 'app.js');
const outputPath = path.join(publicDir, 'standalone.html');

console.log('Bundling frontend into a single self-contained file...');

let html = fs.readFileSync(htmlPath, 'utf8');
const css = fs.readFileSync(cssPath, 'utf8');
const js = fs.readFileSync(jsPath, 'utf8');

// Replace external CSS link with inline <style>
html = html.replace(
  '<link rel="stylesheet" href="css/style.css">',
  `<style>\n/* INLINED STYLES FOR SINGLE-FILE DEPLOYMENT */\n${css}\n</style>`
);

// Replace external JS script with inline <script>
html = html.replace(
  '<script src="js/app.js"></script>',
  `<script>\n// INLINED CLIENT LOGIC FOR SINGLE-FILE DEPLOYMENT\n${js}\n</script>`
);

fs.writeFileSync(outputPath, html, 'utf8');
console.log(`✅ Successfully generated single-file bundle: ${outputPath}`);
