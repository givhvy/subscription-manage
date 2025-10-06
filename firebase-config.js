// Firebase Configuration
// IMPORTANT: Thay thế bằng Firebase config của bạn từ Firebase Console
const firebaseConfig = {
    apiKey: "AIzaSyC0RVDvVQNX01wYrix7LoU7cs7oPXykKwk",
    authDomain: "subscription-ecf4d.firebaseapp.com",
    projectId: "subscription-ecf4d",
    storageBucket: "subscription-ecf4d.firebasestorage.app",
    messagingSenderId: "811268450795",
    appId: "1:811268450795:web:4a7a4712bbe856605e11ae"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Initialize Firestore
const db = firebase.firestore();

// Export db for use in other files
window.db = db;
