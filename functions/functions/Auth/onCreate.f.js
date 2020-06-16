// The Cloud Functions for Firebase SDK to create Cloud Functions and setup triggers.
const functions = require('firebase-functions');
// The Firebase Admin SDK to access the Firebase Realtime Database.
const admin = require('firebase-admin');
const db = admin.firestore();

exports.createNewUser = functions.auth.user().onCreate((user) => {
	const emailUser = user.email;
	const nameUser = user.displayName;

	let userRef = db.collection('Users').doc(user.uid);
	userRef.set({
		uid: user.uid,
		displayName: nameUser !== null ? nameUser : '',
		email: emailUser,
		photoURL:
			'https://firebasestorage.googleapis.com/v0/b/beerxp-prd.appspot.com/o/images%2Fprofiles%2Fprofile_default.png?alt=media',
		following: 0,
		followers: 0,
		drinkins: 0,
		bio: '',
		phoneNumber: '',
		badges: [],
		createdAt: new Date(),
		updatedAt: new Date(),
		lastLogin: new Date(),
	});
	return user;
});
