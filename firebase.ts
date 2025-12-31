// firebase.ts
import { initializeApp, getApps, getApp } from "firebase/app";
import type { FirebaseApp } from "firebase/app";
import type { Analytics } from "firebase/analytics";

const firebaseConfig = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY!,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN!,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID!, // <- 이게 비면 터짐
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET!,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID!,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID!,
    measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID!,
};

export const app: FirebaseApp = getApps().length ? getApp() : initializeApp(firebaseConfig);

export async function getAnalyticsInstance(): Promise<Analytics | null> {
    if (process.env.NEXT_PUBLIC_APP_ENV_VALUE !== "production") return null;
    if (typeof window === "undefined") return null;

    if (!firebaseConfig.projectId) return null;

    const { isSupported, getAnalytics } = await import("firebase/analytics");
    if (!(await isSupported())) return null;

    return getAnalytics(app);
}
