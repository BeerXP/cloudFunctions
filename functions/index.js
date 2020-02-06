// The Cloud Functions for Firebase SDK to create Cloud Functions and setup triggers.
const functions = require('firebase-functions');

// The Firebase Admin SDK to access the Firebase Realtime Database.
const admin = require('firebase-admin');
admin.initializeApp();


exports.createNewUser = functions.auth.user().onCreate((user) => {
  const emailUser = user.email;
  const nameUser = user.displayName;

  let db = admin.firestore();
  let userRef = db.collection('Users').doc(user.uid);

  userRef.set({
    name: nameUser,
    email: emailUser,
    following: [],
    followers: [],
    createdAt: new Date(),
    updatedAt: new Date()
  });


  //functions.firestore.document('Users/{user.uid}').set({name: nameUser, email: emailUser});
  return user;
});