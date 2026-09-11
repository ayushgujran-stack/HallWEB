import { defineConfig } from 'vite';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function copyStaticJs() {
  return {
    name: 'copy-static-js',
    closeBundle() {
      const srcDir = path.resolve(__dirname, 'js');
      const destDir = path.resolve(__dirname, 'dist/js');
      if (fs.existsSync(srcDir)) {
        fs.cpSync(srcDir, destDir, { recursive: true });
        console.log('✓ Successfully copied js/ directory to dist/js/');
      }
    }
  };
}

export default defineConfig({
  plugins: [copyStaticJs()],
  build: {
    outDir: 'dist'
  }
});
