const cookie = require('../cookie/cookie.js');

/**
 * There are some FT cookies which incorporates multiple key value pairs.
 * As separator they use ":".
 *
 * Example: key1=value1:key2=value2.
 *
 * This helps retrieving from such a cookie different values by keys.
 *
 * @param  {String} cookieName Name of the cookie
 * @param  {String} param      Parameter to search within the cookie's value.
 * @return {String} Value of the cookie parameter.
 */
function getCookieParam (cookieName, param) {
	let match;

	if (cookie.get(cookieName)) {
		match = cookie.get(cookieName).match(new RegExp('(^|[:])'+ param +'=([^:]*)'));
		if (match && match.length && match[2]) {
			return match[2];
		}
	}

	return null;
}

/**
 * Check if the cookies which shows that a user is possibly logged in are set.
 * @return {Boolean} If the user is logged in or not
 */
function isLoggedIn () {
	return !!getCookieParam('FT_User', 'EMAIL') || !!getCookieParam('FT_Remember', 'EMAIL');
}

/**
 * Reads the user's email address from the cookies set.
 * @return {String} Email address
 */
function getEmail () {
	return getCookieParam('FT_User', 'EMAIL') || getCookieParam('FT_Remember', 'EMAIL') || null;
}

/**
 * Reads the user's eRights ID from the cookies set.
 * @return {String} User ID
 */
function getUserId () {
	return getCookieParam('FT_User', 'ERIGHTSID') || null;
}

/**
 * Reads the user's session identifier.
 * @return {String} Session ID
 */
function getSession () {
	return isLoggedIn() ? cookie.get('FTSession') : null;
}

/**
 * Exports the above defined utility functions.
 * @type {Object}
 */
module.exports = {
	isLoggedIn: isLoggedIn,
	getEmail: getEmail,
	getUserId: getUserId,
	getSession: getSession
};
