const cookie = require('../cookie/cookie.js');

/**
 * Check if the cookies which shows that a user is possibly logged in are set.
 * @return {Boolean} If the user is logged in or not
 */
function isLoggedIn () {
	return !!getSession();
}

/**
 * Reads the user's session identifier.
 * @return {String} Session ID
 */
function getSession () {
	const session = cookie.get('FTSession');
	if (session) {
		return session;
	} else {
		return null;
	}
}

/**
 * Exports the above defined utility functions.
 * @type {Object}
 */
module.exports = {
	isLoggedIn: isLoggedIn,
	getSession: getSession
};
