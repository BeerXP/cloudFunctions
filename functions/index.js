/* eslint-disable promise/catch-or-return */
// The Cloud Functions for Firebase SDK to create Cloud Functions and setup triggers.
const functions = require('firebase-functions');

// The Firebase Admin SDK to access the Firebase Realtime Database.
const admin = require('firebase-admin');
admin.initializeApp(functions.config().firebase);

const db = admin.firestore();

// const db = admin.firestore();

// ******* Users Auth() functions start **********

// exports.createNewUser = functions.auth.user().onCreate((user) => {
// 	const emailUser = user.email;
// 	const nameUser = user.displayName;

// 	let db = admin.firestore();
// 	let userRef = db.collection('Users').doc(user.uid);

// 	userRef.set({
// 		uid: user.uid,
// 		displayName: nameUser,
// 		email: emailUser,
// 		following: [],
// 		followers: [],
// 		drinkins: [],
// 		badges: [],
// 		createdAt: new Date(),
// 		updatedAt: new Date(),
// 		lastLogin: new Date(),
// 	});

// 	return user;
// });

// exports.updateUserAuth = functions.auth.user().onUpdate((user) => {
//   const emailUser = user.email;
//   const nameUser = user.displayName;

//   let db = admin.firestore();
//   let userRef = db.collection('Users').doc(user.uid);

//   userRef.set({
//     name: nameUser,
//     email: emailUser,
//     updatedAt: new Date()
//   });

//   return user;
// });

// ******* Users Auth() functions end **********

// ******* Users functions end **********

// Listen for changes in all documents in the 'Users' collection
// exports.updateUsers = functions.firestore
// 	.document('Users/{userId}')
// 	.onUpdate((change, context) => {
// 		//     // Retrieve the current and previous value
// 		const data = change.after.data();
// 		const previousData = change.before.data();

// 		//     // We'll only update if the name has changed.
// 		//     // This is crucial to prevent infinite loops.
// 		if (
// 			data.displayName === previousData.displayName &&
// 			data.email === previousData.email
// 			// data.followers === previousData.followers &&
// 			// data.following === previousData.following
// 		)
// 			return null;

// 		//     // Valida se houve mudança dos seguidores
// 		//     // if (data.followers !== previousData.followers) {

// 		//     // }

// 		//     // Retrieve the current count of name changes

// 		//     // Then return a promise of a set operation to update the count
// 		return change.after.ref.set(
// 			{
// 				updatedAt: new Date(),
// 			},
// 			{ merge: true }
// 		);
// 	});

// Envia push notification informando que existe um novo seguidor
exports.sendPushOnNewFollower = functions.firestore
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
	});

// Cria o usuário nos seguidores de quem acabou de ser seguido
exports.updateFollowersOnCreate = functions.firestore
	.document('Users/{userId}/following/{followindUserId}')
	.onCreate((change, context) => {
		db.collection('Users')
			.doc(context.params.followindUserId)
			.collection('followers')
			.doc(context.params.userId)
			.set({ uid: context.params.userId });
	});

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
