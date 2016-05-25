module.exports = function () {
	const w = window;
	const d = document;
	const e = d.documentElement;
	const g = d.getElementsByTagName('body')[0];
	const x = w.outerWidth || g.clientWidth || e.clientWidth;
	const y = w.outerHeight || g.clientHeight || e.clientHeight;

	return {
		width: x,
		height: y
	};
};
