const functions = require('firebase-functions');
const admin = require('firebase-admin');
const db = admin.firestore();

exports.updateAuthOnUpdate = functions.firestore
	.document('Users/{userId}')
	.onUpdate((change, context) => {
		const data = change.after.data();
		const previousData = change.before.data();

		if (
			data.displayName === previousData.displayName &&
			data.email === previousData.email &&
			data.phoneNumber === previousData.phoneNumber &&
			data.photoURL === previousData.photoURL
		)
			return;

		admin
			.auth()
			.updateUser(context.params.userId, {
				email: data.email,
				displayName: data.displayName,
				phoneNumber: data.phoneNumber,
				photoURL: data.photoURL,
			})
			.then((user) => {
				return user;
			})
			.catch((error) => {
				console.log('Error updating user:', error);
				return null;
			});
	});
