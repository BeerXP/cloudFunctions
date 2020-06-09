/** EXPORT ALL FUNCTIONS
 *
 *   Loads all `.function.js` files
 *   Exports a cloud function matching the file name
 *
 *   Based on this thread:
 *     https://github.com/firebase/functions-samples/issues/170
 */
const glob = require('glob');
const camelCase = require('camelcase');
const files = glob.sync('./**/*.f.js', { cwd: __dirname });

//Firebase config
const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp(functions.config().firebase);

for (let f = 0, fl = files.length; f < fl; f++) {
	const file = files[f];
	// convert filepath to name, e.g. /functions/users/onCreate.f.js => usersOnCreate
	const functionName = camelCase(
		file.slice(0, -5).replace('./functions', './').split('/').join('_')
	); // Strip off '.f.js'

	// const functionName = camelCase(file.slice(0, -12).split('/'));

	// Create a staging version for each function
	// const functionNameStaging = functionName + '_staging';

	if (
		!process.env.FUNCTION_NAME ||
		process.env.FUNCTION_NAME === functionName
	) {
		exports[functionName] = require(file);
	}

	// if (
	// 	!process.env.FUNCTION_NAME_STAGING ||
	// 	process.env.FUNCTION_NAME_STAGING === functionNameStaging
	// ) {
	// 	exports[functionNameStaging] = require(file);
	// }
}
