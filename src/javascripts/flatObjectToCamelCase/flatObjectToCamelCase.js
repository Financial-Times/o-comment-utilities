"use strict";

function transform (currentName, level, sourceObj, resultObj) {
	for (var key in sourceObj) {
		if (sourceObj.hasOwnProperty(key)) {
			currentName += (level === 0 ? key : key.charAt(0).toUpperCase() + key.slice(1));

			if (sourceObj[key] && typeof sourceObj[key] === 'object' && !(sourceObj[key] instanceof Array) && Object.keys(sourceObj).length) {
				transform(currentName, level + 1, sourceObj[key], resultObj);
			} else {
				resultObj[currentName] = sourceObj[key];
			}
		}
	}
}

module.exports = function (sourceObj) {
	var resultObj = {};
	transform('', 0, sourceObj, resultObj);

	return resultObj;
};
