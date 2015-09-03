module.exports = function (el) {
	let left = 0;
	let top = 0;

	let obj = el;
	if (obj.offsetParent) {
		do {
			left += obj.offsetLeft;
			top += obj.offsetTop;

			obj = obj.offsetParent;
		} while (obj);

		return {
			left: left,
			top: top
		};
	} else {
		return {
			top: el.offsetTop,
			left: el.offsetLeft
		};
	}
};
