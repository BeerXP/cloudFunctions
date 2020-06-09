// The Cloud Functions for Firebase SDK to create Cloud Functions and setup triggers.
const functions = require('firebase-functions');

const admin = require('firebase-admin');
const db = admin.firestore();

// Cria a Activity para o DrinkIn que ocorreu
exports.addActivitiesOnDrinkin = functions.firestore
	.document('Users/{userId}/Drinkins/{drinkinID}')
	.onCreate((change, context) => {
		// eslint-disable-next-line promise/catch-or-return
		db.collection('Users')
			.doc(context.params.userId)
			.collection('Drinkins')
			.doc(context.params.drinkinID)
			.get()
			.then((drinkin) => {
				db.collection('Users')
					.doc(context.params.userId)
					.collection('Activities')
					.add({
						type: 'drinkin',
						imgUrl: drinkin.data().imgUrl,
						ownerUid: drinkin.data().ownerUid,
						postOwnerName: drinkin.data().postOwnerName,
						postOwnerPhotoUrl: drinkin.data().postOwnerPhotoUrl,
						drinkinUid: context.params.drinkinID,
						timestamp: drinkin.data().time,
					});
				return;
			});
		return;
	});
