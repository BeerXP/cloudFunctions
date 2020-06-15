// The Cloud Functions for Firebase SDK to create Cloud Functions and setup triggers.
const functions = require('firebase-functions');
const admin = require('firebase-admin');
const db = admin.firestore();
const FieldValue = require('firebase-admin').firestore.FieldValue;

// Atualiza o count de seguindo
exports.updateDrinkinsCount = functions.firestore
	.document('Users/{userId}/Drinkins/{drinkinId}')
	.onWrite((change, context) => {
		var docRef = db.collection('Users').doc(context.params.userId);
		if (!change.before.exists) {
			// New document Created : add one to count
			docRef.update({ drinkins: FieldValue.increment(1) });
		} else if (change.before.exists && change.after.exists) {
			// Updating existing document : Do nothing
		} else if (!change.after.exists) {
			// Deleting document : subtract one from count
			docRef.update({ drinkins: FieldValue.increment(-1) });
		}
		return;
	});
