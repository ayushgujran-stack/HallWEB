import { defineConfig } from 'vite';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

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
  plugins: [copyStaticAssets(), rootRedirect()],
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
