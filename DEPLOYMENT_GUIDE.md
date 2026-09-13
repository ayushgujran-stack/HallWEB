# Deployment Guide: Dual Website Hosting

This repository is set up to host as **two completely separate websites**:

| Website | Audience | Deployed From | Default Routes |
| :--- | :--- | :--- | :--- |
| **Website 1: Customer & Hall Owner Site** | Customers & Venue Hosts | `dist-site/` | `/` & `/customer/` (Storefront), `/owner/` (Host Workspace) |
| **Website 2: Super Admin Portal** | Platform Auditors & Super Admins | `dist-admin/` | `/` (Admin Verification & Compliance Control Tower) |

> **Security & Segregation**: `dist-site` has all admin code, links, and routes completely removed. `dist-admin` is an isolated dashboard deployed at its own URL.
>
> **Shared Real-Time Database**: Both websites connect to the **same Firebase backend** (`shared/js/firebase-config.js`). When a hall owner lists or updates a venue on Website 1, the Super Admin on Website 2 sees it live in real time.

---

## Option A: Deploying to Vercel (Recommended)

Since you already use Vercel, you can host both websites from this single GitHub repository in 2 minutes:

### Step 1: Deploy Website 1 (Customer & Hall Owner Site)
1. Go to [vercel.com/new](https://vercel.com/new) and import this repository.
2. Configure project settings:
   - **Project Name**: `venueluxe` (or `my-hall-booking`)
   - **Framework Preset**: `Other`
   - **Build Command**: `npm run build:site`
   - **Output Directory**: `dist-site`
3. Click **Deploy**.
4. Your customer & hall owner website is live at `https://venueluxe.vercel.app` (or your custom domain).

---

### Step 2: Deploy Website 2 (Super Admin Portal)
1. In Vercel, click **Add New... > Project** and select the **same GitHub repository** again.
2. Configure project settings:
   - **Project Name**: `venueluxe-admin` (or `my-hall-admin`)
   - **Framework Preset**: `Other`
   - **Build Command**: `npm run build:admin`
   - **Output Directory**: `dist-admin`
3. Click **Deploy**.
4. Your admin verification portal is live at `https://venueluxe-admin.vercel.app` (or `https://admin.yourdomain.com`).

---

## Option B: Deploying with Firebase Hosting (Multi-Site)

If you prefer to host both sites under Firebase Hosting:

1. In Firebase Console, go to **Hosting** and click **Add another site**:
   - Site 1: `venueluxe-site`
   - Site 2: `venueluxe-admin`
2. Link your targets in the terminal:
   ```bash
   npx firebase target:apply hosting site venueluxe-site
   npx firebase target:apply hosting admin venueluxe-admin
   ```
3. Build and deploy both:
   ```bash
   npm run build
   npx firebase deploy --only hosting
   ```

---

## Connecting the Shared Live Database (Firebase)

To connect both sites to your live Firebase Cloud Firestore database:
1. Open [shared/js/firebase-config.js](file:///Users/ayushrajeshpoojary/PROJECTS/hall%20booking%20/THE%20Website/stitch_venuecraft_marketplace_platform/shared/js/firebase-config.js).
2. Paste your Firebase project keys:
   ```js
   const firebaseConfig = {
     apiKey: "YOUR_API_KEY",
     authDomain: "YOUR_PROJECT.firebaseapp.com",
     projectId: "YOUR_PROJECT_ID",
     storageBucket: "YOUR_PROJECT.appspot.com",
     messagingSenderId: "YOUR_SENDER_ID",
     appId: "YOUR_APP_ID"
   };
   ```
3. Commit and push — both Vercel sites will auto-deploy and share live venue submissions, booking holds, and audit statuses instantly!
