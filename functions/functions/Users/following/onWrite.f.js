const functions = require('firebase-functions');
const admin = require('firebase-admin');
const db = admin.firestore();
const FieldValue = require('firebase-admin').firestore.FieldValue;

exports.updateFollowers = functions.firestore
	.document('Users/{userId}/following/{followindUserId}')
	.onWrite((change, context) => {
		var newFollower = db
			.collection('Users')
			.doc(context.params.followindUserId);
		var newFollowingCount = db
			.collection('Users')
			.doc(context.params.userId);
		if (!change.before.exists) {
			newFollower
				.collection('followers')
				.doc(context.params.userId)
				.set({ uid: context.params.userId });
			newFollowingCount.update({ following: FieldValue.increment(1) });
			newFollower.update({ followers: FieldValue.increment(1) });
		} else if (!change.after.exists) {
			newFollowingCount.update({ following: FieldValue.increment(-1) });
			newFollowerCount.update({ followers: FieldValue.increment(-1) });
			newFollower.delete();
		}
	});
