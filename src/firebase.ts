import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import type { Analytics } from "firebase/analytics";
import { getPerformance } from "firebase/performance";
import type { FirebasePerformance } from "firebase/performance";

const firebaseConfig = {
  apiKey: "AIzaSyBbEGApYgd8SAk0MWC9Nv8Q_jUlWGBcU2I",
  authDomain: "pi-bot-2663e.firebaseapp.com",
  projectId: "pi-bot-2663e",
  storageBucket: "pi-bot-2663e.firebasestorage.app",
  messagingSenderId: "1045145735937",
  appId: "1:1045145735937:web:7bb9b586a32aeff43bc100",
  measurementId: "G-DLX6QEZMP5"
};

// Initialize Firebase app
const app = initializeApp(firebaseConfig);

// Initialize Analytics and Performance Monitoring
export const analytics: Analytics = getAnalytics(app);
export const perf: FirebasePerformance = getPerformance(app);

// Log which environment is being used for analytics
// if (typeof window !== "undefined") {
//   console.log(
//     `%c[Firebase Analytics] Initialized for ${currentEnv.toUpperCase()} environment`,
//     "color: #FFA000; font-weight: bold; font-size: 12px;",
//   );
//   console.log(
//     `%cMeasurement ID: ${firebaseConfig.measurementId}`,
//     "color: #666; font-size: 11px;",
//   );
// }
