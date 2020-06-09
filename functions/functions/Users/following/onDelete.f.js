// The Cloud Functions for Firebase SDK to create Cloud Functions and setup triggers.
const functions = require('firebase-functions');

const admin = require('firebase-admin');
const db = admin.firestore();

// Exclui o usuário nos seguidores de quem acabou de ser deixado de ser seguido
exports.updateFollowersOnDelete = functions.firestore
	.document('Users/{userId}/following/{followindUserId}')
	.onDelete((change, context) => {
		db.collection('Users')
			.doc(context.params.followindUserId)
			.collection('followers')
			.doc(context.params.userId)
			.delete();
	});
