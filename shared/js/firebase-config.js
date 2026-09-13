// Firebase Configuration for VenueLuxe Platform
// Project: hall-booking-b0830

const firebaseConfig = {
  apiKey: "AIzaSyBFpsx-TAWWNIAuuipwaxjm5Le8EfxF73Y",
  authDomain: "hall-booking-b0830.firebaseapp.com",
  projectId: "hall-booking-b0830",
  storageBucket: "hall-booking-b0830.firebasestorage.app",
  messagingSenderId: "863658007513",
  appId: "1:863658007513:web:be2591dea40185bb5097c8",
  measurementId: "G-EWM8HT69QF"
};

// Initialize Firebase SDK when loaded
let fbApp = null;
let fbAuth = null;
let fbDb = null;

try {
  if (typeof firebase !== 'undefined' && firebase.initializeApp) {
    // Avoid double initialization
    fbApp = firebase.apps.length ? firebase.app() : firebase.initializeApp(firebaseConfig);
    fbAuth = firebase.auth();
    fbDb = firebase.firestore();
    console.log('[Firebase] Successfully connected to project:', firebaseConfig.projectId);
  } else {
    console.warn('[Firebase] SDK not loaded globally yet; waiting for script load.');
  }
} catch (err) {
  console.error('[Firebase] Initialization error:', err);
}

// Attach to window for platform-wide access
window.fbConfig = firebaseConfig;
window.fbApp = fbApp;
window.fbAuth = fbAuth;
window.fbDb = fbDb;
