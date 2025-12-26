const admin = require('firebase-admin');
const path = require('path');
const dotenv = require('dotenv');

dotenv.config();

// Initialize Firebase Admin
let serviceAccount;

// Option 1: Load from Environment Variable (Best for Vercel/Render/Cloud)
if (process.env.FIREBASE_SERVICE_ACCOUNT) {
    try {
        serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
    } catch (error) {
        console.error('Error parsing FIREBASE_SERVICE_ACCOUNT environment variable:', error);
    }
}
// Option 2: Load from Local File (Best for Local Dev)
else {
    const serviceAccountPath = process.env.SERVICE_ACCOUNT_PATH || path.join(__dirname, '../simple-write-ego-firebase-adminsdk-fbsvc-7702cd276d.json');
    try {
        serviceAccount = require(serviceAccountPath);
    } catch (error) {
        console.error('Error loading service account file:', error.message);
        console.error(`Ensure the file exists at: ${serviceAccountPath} OR set FIREBASE_SERVICE_ACCOUNT env var.`);
    }
}

if (serviceAccount) {
    try {
        admin.initializeApp({
            credential: admin.credential.cert(serviceAccount)
        });
        console.log('Firebase Admin Initialized Successfully');
    } catch (error) {
        console.error('Firebase Admin Initialization Failed:', error);
    }
}

const db = admin.firestore();
const auth = admin.auth();

module.exports = { admin, db, auth };
