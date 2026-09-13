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

function initFirebaseApp() {
  try {
    if (typeof firebase !== 'undefined' && firebase.initializeApp) {
      if (!fbApp) {
        fbApp = firebase.apps.length ? firebase.app() : firebase.initializeApp(firebaseConfig);
        fbAuth = firebase.auth();
        fbDb = firebase.firestore();
        console.log('[Firebase] Successfully connected to project:', firebaseConfig.projectId);
        
        window.fbApp = fbApp;
        window.fbAuth = fbAuth;
        window.fbDb = fbDb;

        // Auto-trigger Firestore sync if store is loaded
        if (window.appStore && typeof window.appStore.initFirestoreSync === 'function') {
          window.appStore.initFirestoreSync();
        }
      }
      return true;
    }
  } catch (err) {
    console.error('[Firebase] Initialization error:', err);
  }
  return false;
}

// Immediate attempt
initFirebaseApp();

// If not loaded yet, retry every 300ms until scripts load (up to 12s)
if (!fbDb && typeof window !== 'undefined') {
  window.addEventListener('load', () => initFirebaseApp());
  const retryInterval = setInterval(() => {
    if (initFirebaseApp()) {
      clearInterval(retryInterval);
    }
  }, 300);
  setTimeout(() => clearInterval(retryInterval), 12000);
}

// Attach to window for platform-wide access
window.fbConfig = firebaseConfig;
window.fbApp = fbApp;
window.fbAuth = fbAuth;
window.fbDb = fbDb;
window.initFirebaseApp = initFirebaseApp;
