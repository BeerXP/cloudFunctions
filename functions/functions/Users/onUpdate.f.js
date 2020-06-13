// The Cloud Functions for Firebase SDK to create Cloud Functions and setup triggers.
const functions = require('firebase-functions');
const admin = require('firebase-admin');
const db = admin.firestore();

// Exclui o usuário nos seguidores de quem acabou de ser deixado de ser seguido
exports.updateFollowersOnDelete = functions.firestore
	.document('Users/{userId}')
	.onUpdate((change, context) => {
		// Retrieve the current and previous value
		const data = change.after.data();
		const previousData = change.before.data();

		if (
			data.displayName === previousData.displayName &&
			data.email === previousData.email
		)
			return null;

		// functions.auth.user().
	});
