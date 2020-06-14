/* eslint-disable promise/catch-or-return */
// The Cloud Functions for Firebase SDK to create Cloud Functions and setup triggers.
const functions = require('firebase-functions');
const admin = require('firebase-admin');
const db = admin.firestore();
FieldValue = require('firebase-admin').firestore.FieldValue;

// Envia push notification informando que existe um novo seguidor
exports.sendPushNotifications = functions.firestore
	.document('Users/{userId}/following/{followindUserId}')
	.onCreate((change, context) => {
		console.log('AppName:', admin.app().name);

		// Recupera as informações do usuário que acabou adicionar um novo seguidor
		db.collection('Users')
			.doc(context.params.userId)
			.get()
			.then((userFrom) => {
				// Monta o payload da msg com o nome da pessoa, foto e a mensagem
				let payload = {
					notification: {
						title: 'BeerXP',
						body: `${
							userFrom.data().displayName
						} começou a seguir você!`,
						image: userFrom.data().photoUrl,
					},
				};

				// Recupera as informações do usuário que acabou de ganhar um seguidor (Destinatário)
				// eslint-disable-next-line promise/no-nesting
				db.collection('Users')
					.doc(context.params.followindUserId)
					.get()
					.then((userTo) => {
						// eslint-disable-next-line promise/no-nesting
						admin
							.messaging()
							.sendToDevice(userTo.data().token, payload)
							.then((response) => {
								console.info(
									'Successfully sent message:',
									response
								);
								return response;
							})
							.catch((error) => {
								console.error('Error sending message:', error);
								return error;
							});
						return;
					});
				return;
			});
		return;
	});
