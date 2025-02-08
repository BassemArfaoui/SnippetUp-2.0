// // src/firebase.js
// import { initializeApp } from 'firebase/app';  // Import the initializeApp function
// import { getAuth, GoogleAuthProvider, GithubAuthProvider } from 'firebase/auth';  // Import the Firebase Authentication module

// // Firebase config object (you'll get this from Firebase Console)
// const firebaseConfig = {
//   apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
//   authDomain:process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
//   projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
//   storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
//   messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
//   appId: process.env.REACT_APP_FIREBASE_APP_ID,
//   measurementId:process.env.REACT_APP_FIREBASE_MEASUREMENT_ID,
// };

// // Initialize Firebase
// const app = initializeApp(firebaseConfig);  // Initialize Firebase app
// const auth = getAuth(app);  // Get Firebase authentication instance

// // Export auth and providers for use in other files
// export { auth, GoogleAuthProvider, GithubAuthProvider };
