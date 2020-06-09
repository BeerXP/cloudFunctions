// The Cloud Functions for Firebase SDK to create Cloud Functions and setup triggers.
const functions = require('firebase-functions');

// The Firebase Admin SDK to access the Firebase Realtime Database.
const admin = require('firebase-admin');
const db = admin.firestore();

// exports.updateUserAuth = functions.auth.user().onUpdate((user) => {
// 	const emailUser = user.email;
// 	const nameUser = user.displayName;

// 	let db = admin.firestore();
// 	let userRef = db.collection('Users').doc(user.uid);

// 	userRef.set({
// 		name: nameUser,
// 		email: emailUser,
// 		updatedAt: new Date(),
// 	});

// 	return user;
// });

// ******* Users Auth() functions end **********

// ******* Users functions end **********

// Listen for changes in all documents in the 'Users' collection
// exports.updateUsers = functions.firestore
// 	.document('Users/{userId}')
// 	.onUpdate((change, context) => {
// 		//     // Retrieve the current and previous value
// 		const data = change.after.data();
// 		const previousData = change.before.data();

// 		//     // We'll only update if the name has changed.
// 		//     // This is crucial to prevent infinite loops.
// 		if (
// 			data.displayName === previousData.displayName &&
// 			data.email === previousData.email
// 			// data.followers === previousData.followers &&
// 			// data.following === previousData.following
// 		)
// 			return null;

// 		//     // Valida se houve mudança dos seguidores
// 		//     // if (data.followers !== previousData.followers) {

// 		//     // }

// 		//     // Retrieve the current count of name changes

// 		//     // Then return a promise of a set operation to update the count
// 		return change.after.ref.set(
// 			{
// 				updatedAt: new Date(),
// 			},
// 			{ merge: true }
// 		);
// 	});
