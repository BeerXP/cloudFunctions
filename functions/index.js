// The Cloud Functions for Firebase SDK to create Cloud Functions and setup triggers.
const functions = require("firebase-functions");

// The Firebase Admin SDK to access the Firebase Realtime Database.
const admin = require("firebase-admin");
admin.initializeApp();

// ******* Users Auth() functions start **********

exports.createNewUser = functions.auth.user().onCreate(user => {
	const emailUser = user.email;
	const nameUser = user.displayName;

	let db = admin.firestore();
	let userRef = db.collection("Users").doc(user.uid);

	userRef.set({
		uid: user.uid,
		name: nameUser,
		email: emailUser,
		following: [],
		followers: [],
		drinkins: [],
		badges: [],
		createdAt: new Date(),
		updatedAt: new Date()
	});

	return user;
});

// exports.updateUserAuth = functions.auth.user().onUpdate((user) => {
//   const emailUser = user.email;
//   const nameUser = user.displayName;

//   let db = admin.firestore();
//   let userRef = db.collection('Users').doc(user.uid);

//   userRef.set({
//     name: nameUser,
//     email: emailUser,
//     updatedAt: new Date()
//   });

//   return user;
// });

// ******* Users Auth() functions end **********

// ******* Users functions end **********

// Listen for changes in all documents in the 'Users' collection
exports.updateUsers = functions.firestore
	.document("Users/{userId}")
	.onUpdate((change, context) => {
		//     // Retrieve the current and previous value
		const data = change.after.data();
		const previousData = change.before.data();

		//     // We'll only update if the name has changed.
		//     // This is crucial to prevent infinite loops.
		if (
			data.name === previousData.name &&
			data.email === previousData.email
			// data.followers === previousData.followers &&
			// data.following === previousData.following
		)
			return null;

		//     // Valida se houve mudança dos seguidores
		//     // if (data.followers !== previousData.followers) {

		//     // }

		//     // Retrieve the current count of name changes

		//     // Then return a promise of a set operation to update the count
		return change.after.ref.set(
			{
				updatedAt: new Date()
			},
			{ merge: true }
		);
	});

exports.updateFollowing = functions.firestore
	.document("Users/{userId}")
	.onWrite((change, context) => {
		// Retrieve the current and previous value
		const data = change.after.data();
		const previousData = change.before.data();

		// We'll only update if the name has changed.
		// This is crucial to prevent infinite loops.
		// if (
		// 	data.name === previousData.name &&
		// 	data.email === previousData.email &&
		// 	data.followers === previousData.followers &&
		// 	data.following === previousData.following
		// )
		// 	return null;

		// Valida se houve mudança dos seguidores
		if (data.following !== previousData.following4) {
			console.log("Data:", data.following);
		}

		// firestore
		// 	.collection("Users")
		// 	.doc(context.params.followUser)
		// 	.update({ followers: context.params.userId });

		// Then return a promise of a set operation to update the count
		// return change.after.ref.set({
		//   updatedAt: new Date()
		// }, { merge: true });
	});
