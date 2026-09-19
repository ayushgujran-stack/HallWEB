import { defineConfig } from 'vite';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function syncEnvFile() {
  const envPath = path.resolve(__dirname, '.env');
  const targetPath = path.resolve(__dirname, 'shared/js/env.js');
  const envVars = {
    VITE_APP_TITLE: "Halls Now"
  };

  if (fs.existsSync(envPath)) {
    const content = fs.readFileSync(envPath, 'utf8');
    content.split('\n').forEach(line => {
      const trimmed = line.trim();
      if (trimmed && !trimmed.startsWith('#') && trimmed.includes('=')) {
        const [key, ...rest] = trimmed.split('=');
        const val = rest.join('=').trim().replace(/^["']|["']$/g, '');
        if (key.trim().startsWith('VITE_')) {
          envVars[key.trim()] = val;
        }
      }
    });
  }

  const jsContent = `// Auto-generated from .env\nwindow.__ENV = ${JSON.stringify(envVars, null, 2)};\n`;
  fs.writeFileSync(targetPath, jsContent, 'utf8');
}

function envSyncPlugin() {
  return {
    name: 'env-sync-plugin',
    buildStart() {
      syncEnvFile();
    },
    configureServer(server) {
      syncEnvFile();
      server.watcher.add(path.resolve(__dirname, '.env'));
      server.watcher.on('change', (file) => {
        if (file.endsWith('.env')) {
          syncEnvFile();
          console.log('✓ Synced .env to shared/js/env.js');
        }
      });
    }
  };
}

function copyStaticAssets() {
  return {
    name: 'copy-static-assets',
    closeBundle() {
      const copyDir = (src, dest) => {
        const srcPath = path.resolve(__dirname, src);
        const destPath = path.resolve(__dirname, dest);
        if (fs.existsSync(srcPath)) {
          fs.cpSync(srcPath, destPath, { recursive: true });
          console.log(`✓ Copied ${src} to ${dest}`);
        }
      };

      copyDir('shared', 'dist/shared');
      copyDir('customer/js', 'dist/customer/js');
      copyDir('customer/css', 'dist/customer/css');
      copyDir('owner/js', 'dist/owner/js');
      copyDir('owner/css', 'dist/owner/css');
      copyDir('admin/js', 'dist/admin/js');
      copyDir('admin/css', 'dist/admin/css');
    }
  };
}

function rootRedirect() {
  return {
    name: 'root-redirect',
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        if (req.url === '/' || req.url === '/index.html') {
          res.writeHead(302, { Location: '/customer/' });
          res.end();
          return;
        }
        next();
      });
    }
  };
}

export default defineConfig({
  server: {
    port: 5180,
    strictPort: true,
    host: true
  },
  plugins: [envSyncPlugin(), copyStaticAssets(), rootRedirect()],
  build: {
    outDir: 'dist',
    rollupOptions: {
      input: {
        customer: path.resolve(__dirname, 'customer/index.html'),
        owner: path.resolve(__dirname, 'owner/index.html'),
        admin: path.resolve(__dirname, 'admin/index.html'),
        root: path.resolve(__dirname, 'index.html'),
      }
    }
  }
});
