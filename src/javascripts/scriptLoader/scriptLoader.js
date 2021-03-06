/**
 * Reference to the &lt;head&gt; DOM object
 * @type {Object}
 */
const head = document.head || document.getElementsByTagName('head')[0];

/**
 * The actual function which does the script loading.
 * @param  {object}   options  Several configuration options (e.g. url)
 * @param  {Function} callback function (err)
 * @return {undefined}
 */
function scriptLoader (options, callback) {
	let script;
	let callbackIssued;
	let error;
	let success;
	let url;
	let charset;

	/**
	 * Parameter validation.
	 */
	if (typeof callback !== 'function') {
		throw Error("Callback not specified");
	}

	if (typeof options === 'string') {
		// url
		url = options;
	} else if (options && typeof options === 'object') {
		if (!options.url) {
			callback(new Error("URL is not specified"));
			return;
		}

		url = options.url;
		if (options.charset) {
			charset = options.charset;
		}
	} else {
		callback(new Error("Configuration not specified or has the wrong type."));
		return;
	}



	callbackIssued = false;

	error = function (e) {
		if (!callbackIssued) {
			callbackIssued = true;

			callback(e || new Error("Timeout"));
		}
	};

	success = function () {
		if (!callbackIssued) {
			callbackIssued = true;

			callback(null);
		}
	};

	script = document.createElement("script");
	script.async = true;

	if (charset) {
		script.charset = charset;
	}

	script.src = url;

	const destroy = function () {
		if (script) {
			// Handle memory leak in IE
			script.onload = script.onreadystatechange = null;

			// Remove the script
			if ( script.parentNode ) {
				script.parentNode.removeChild( script );
			}

			// Dereference the script
			script = null;
		}
	};

	script.onload = script.onreadystatechange = function( _, isAbort ) {
		if ( isAbort || !script.readyState || /loaded|complete/.test( script.readyState ) ) {
			destroy();

			if (isAbort) {
				error(new Error("Aborted."));
				return;
			}

			success();
		}
	};

	script.onerror = function () {
		destroy();
		error(new Error("Error loading script."));
	};

	head.insertBefore( script, head.firstChild );
}

module.exports = scriptLoader;
