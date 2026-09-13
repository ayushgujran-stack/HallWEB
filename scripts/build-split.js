// scripts/build-split.js
// Splits the build into two distinct standalone websites for independent hosting:
// 1. dist-site: Customer Storefront & Hall Owner Workspace (excludes all admin code)
// 2. dist-admin: Super Admin Portal (standalone at root /, excludes customer/owner code)

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const distDir = path.resolve(rootDir, 'dist');

function copyDir(src, dest) {
  if (!fs.existsSync(src)) return;
  fs.mkdirSync(dest, { recursive: true });
  const entries = fs.readdirSync(src, { withFileTypes: true });
  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);
    if (entry.isDirectory()) {
      copyDir(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

function buildCustomerOwnerSite() {
  const siteDir = path.resolve(rootDir, 'dist-site');
  if (fs.existsSync(siteDir)) {
    fs.rmSync(siteDir, { recursive: true, force: true });
  }
  fs.mkdirSync(siteDir, { recursive: true });

  // 1. Root redirect index.html
  if (fs.existsSync(path.join(distDir, 'index.html'))) {
    fs.copyFileSync(path.join(distDir, 'index.html'), path.join(siteDir, 'index.html'));
  }

  // 2. Customer portal
  copyDir(path.join(distDir, 'customer'), path.join(siteDir, 'customer'));

  // 3. Owner workspace
  copyDir(path.join(distDir, 'owner'), path.join(siteDir, 'owner'));

  // 4. Shared resources
  copyDir(path.join(distDir, 'shared'), path.join(siteDir, 'shared'));

  // 5. Assets
  copyDir(path.join(distDir, 'assets'), path.join(siteDir, 'assets'));

  // 6. Vercel deployment config for Customer & Owner site
  const siteVercelJson = {
    "cleanUrls": true,
    "rewrites": [
      { "source": "/", "destination": "/customer/index.html" },
      { "source": "/customer", "destination": "/customer/index.html" },
      { "source": "/customer/:path*", "destination": "/customer/index.html" },
      { "source": "/owner", "destination": "/owner/index.html" },
      { "source": "/owner/:path*", "destination": "/owner/index.html" }
    ]
  };
  fs.writeFileSync(path.join(siteDir, 'vercel.json'), JSON.stringify(siteVercelJson, null, 2));

  console.log('✓ Successfully created dist-site (Customer & Hall Owner website)');
}

function buildAdminSite() {
  const adminDir = path.resolve(rootDir, 'dist-admin');
  if (fs.existsSync(adminDir)) {
    fs.rmSync(adminDir, { recursive: true, force: true });
  }
  fs.mkdirSync(adminDir, { recursive: true });

  // 1. Create root index.html from admin/index.html with adjusted paths
  const adminHtmlPath = path.join(distDir, 'admin/index.html');
  if (fs.existsSync(adminHtmlPath)) {
    let adminHtml = fs.readFileSync(adminHtmlPath, 'utf8');
    // Replace ../shared with ./shared
    adminHtml = adminHtml.replace(/\.\.\/shared\//g, './shared/');
    fs.writeFileSync(path.join(adminDir, 'index.html'), adminHtml);
  }

  // 2. Admin assets (js, css)
  copyDir(path.join(distDir, 'admin/js'), path.join(adminDir, 'js'));
  copyDir(path.join(distDir, 'admin/css'), path.join(adminDir, 'css'));

  // 3. Preserved /admin/ path for backwards compatibility
  copyDir(path.join(distDir, 'admin'), path.join(adminDir, 'admin'));

  // 4. Shared resources
  copyDir(path.join(distDir, 'shared'), path.join(adminDir, 'shared'));

  // 5. Assets
  copyDir(path.join(distDir, 'assets'), path.join(adminDir, 'assets'));

  // 6. Vercel deployment config for Admin site
  const adminVercelJson = {
    "cleanUrls": true,
    "rewrites": [
      { "source": "/(.*)", "destination": "/index.html" }
    ]
  };
  fs.writeFileSync(path.join(adminDir, 'vercel.json'), JSON.stringify(adminVercelJson, null, 2));

  console.log('✓ Successfully created dist-admin (Super Admin website)');
}

// Execute
const args = process.argv.slice(2);
const siteOnly = args.includes('--site-only');
const adminOnly = args.includes('--admin-only');

if (siteOnly) {
  buildCustomerOwnerSite();
} else if (adminOnly) {
  buildAdminSite();
} else {
  buildCustomerOwnerSite();
  buildAdminSite();
}
