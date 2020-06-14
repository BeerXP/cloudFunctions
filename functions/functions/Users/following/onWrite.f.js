// The Cloud Functions for Firebase SDK to create Cloud Functions and setup triggers.
const functions = require('firebase-functions');
const admin = require('firebase-admin');
const db = admin.firestore();
const FieldValue = require('firebase-admin').firestore.FieldValue;

// Cria o usuário nos seguidores de quem acabou de ser seguido
exports.updateFollowers = functions.firestore
	.document('Users/{userId}/following/{followindUserId}')
	.onWrite((change, context) => {
		// Variável que grava o ID do novo seguidor
		var newFollower = db
			.collection('Users')
			.doc(context.params.followindUserId)
			.collection('followers')
			.doc(context.params.userId);
		//Variável que atualiza o contador de following
		var newFollowingCount = db
			.collection('Users')
			.doc(context.params.userId);
		//Variável que atualiza o contador de followers
		var newFollowerCount = db
			.collection('Users')
			.doc(context.params.followindUserId);
		if (!change.before.exists) {
			// New document Created : add new follower
			newFollower.set({ uid: context.params.userId });
			newFollowingCount.update({ following: FieldValue.increment(1) });
			newFollowerCount.update({ followers: FieldValue.increment(1) });
			// } else if (change.before.exists && change.after.exists) {
			// Updating existing document : Do nothing
		} else if (!change.after.exists) {
			// Deleting document : delete the follower
			newFollowingCount.update({ following: FieldValue.increment(-1) });
			newFollowerCount.update({ followers: FieldValue.increment(-1) });
			newFollower.delete();
		}
	});
