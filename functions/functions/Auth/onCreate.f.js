// The Cloud Functions for Firebase SDK to create Cloud Functions and setup triggers.
const functions = require('firebase-functions');

// The Firebase Admin SDK to access the Firebase Realtime Database.
const admin = require('firebase-admin');
const db = admin.firestore();

// ******* Users Auth() functions start **********

// exports.createNewUser = functions.auth.user().onCreate((user) => {
// 	const emailUser = user.email;
// 	const nameUser = user.displayName;

// 	let db = admin.firestore();
// 	let userRef = db.collection('Users').doc(user.uid);

// 	userRef.set({
// 		uid: user.uid,
// 		displayName: nameUser,
// 		email: emailUser,
// 		following: [],
// 		followers: [],
// 		drinkins: [],
// 		badges: [],
// 		createdAt: new Date(),
// 		updatedAt: new Date(),
// 		lastLogin: new Date(),
// 	});

// 	return user;
// });
