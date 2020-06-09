/* eslint-disable promise/catch-or-return */
// The Cloud Functions for Firebase SDK to create Cloud Functions and setup triggers.
const functions = require('firebase-functions');

const admin = require('firebase-admin');
const db = admin.firestore();

// Cria a Activity para o Like que ocorreu
exports.addActivitiesOnLike = functions.firestore
	.document('Users/{userId}/Drinkins/{drinkinID}/Likes/{likeId}')
	.onCreate((change, context) => {
		db.collection('Users')
			.doc(context.params.userId)
			.collection('Drinkins')
			.doc(context.params.drinkinID)
			.collection('Likes')
			.doc(context.params.likeId)
			.get()
			.then((drinkin) => {
				db.collection('Users')
					.doc(drinkin.data().ownerUid)
					.collection('Activities')
					.add({
						type: 'like',
						// imgUrl: context.params.drinkinID.imgUrl,
						ownerUid: drinkin.data().ownerUid,
						postOwnerName: drinkin.data().ownerName,
						postOwnerPhotoUrl: drinkin.data().ownerPhotoUrl,
						drinkinUid: context.params.drinkinID,
						timestamp: drinkin.data().timestamp,
					});
				return;
			});
		return;
	});

// Envia push notification informando que existe um novo like
exports.sendPushNotifications = functions.firestore
	.document('Users/{userId}/Drinkins/{drinkinID}/Likes/{likeId}')
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
						} curtiu uma publicação sua`,
						image: userFrom.data().photoUrl,
					},
				};
				// Recupera as informações do usuário que acabou de ganhar um seguidor (Destinatário)
				// eslint-disable-next-line promise/no-nesting
				db.collection('Users')
					.doc(context.params.likeId)
					.get()
					.then((userTo) => {
						// Se for o próprio usuário não envia o push
						if (userFrom.data().uid === userTo.data().uid) return;

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
