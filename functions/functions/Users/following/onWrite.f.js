// The Cloud Functions for Firebase SDK to create Cloud Functions and setup triggers.
const functions = require('firebase-functions');
const admin = require('firebase-admin');
const db = admin.firestore();
FieldValue = require('firebase-admin').firestore.FieldValue;

// Cria o usuário nos seguidores de quem acabou de ser seguido
exports.updateFollowers = functions.firestore
	.document('Users/{userId}/following/{followindUserId}')
	.onWrite((change, context) => {
		var docRef = db
			.collection('Users')
			.doc(context.params.followindUserId)
			.collection('followers')
			.doc(context.params.userId);
		if (!change.before.exists) {
			// New document Created : add new follower
			docRef.set({ uid: context.params.userId });
		} else if (change.before.exists && change.after.exists) {
			// Updating existing document : Do nothing
		} else if (!change.after.exists) {
			// Deleting document : delete the follower
			docRef.delete();
		}
	});

// Atualiza o count de seguindo
exports.updateFollowingCount = functions.firestore
	.document('Users/{userId}/following/{followindUserId}')
	.onWrite((change, context) => {
		var docRef = db.collection('Users').doc(context.params.userId);
		if (!change.before.exists) {
			// New document Created : add one to count
			docRef.update({ following: FieldValue.increment(1) });
		} else if (change.before.exists && change.after.exists) {
			// Updating existing document : Do nothing
		} else if (!change.after.exists) {
			// Deleting document : subtract one from count
			docRef.update({ following: FieldValue.increment(-1) });
		}
		return;
	});

// Atualiza o count de seguidores
exports.updateFollowersCount = functions.firestore
	.document('Users/{userId}/following/{followindUserId}')
	.onWrite((change, context) => {
		var docRef = db.collection('Users').doc(context.params.followindUserId);
		if (!change.before.exists) {
			// New document Created : add one to count
			docRef.update({ followers: FieldValue.increment(1) });
		} else if (change.before.exists && change.after.exists) {
			// Updating existing document : Do nothing
		} else if (!change.after.exists) {
			// Deleting document : subtract one from count
			docRef.update({ followers: FieldValue.increment(-1) });
		}
		return;
	});
