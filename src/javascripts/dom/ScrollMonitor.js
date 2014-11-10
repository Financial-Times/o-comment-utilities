"use strict";

var eventListener = require('./eventListener.js');

function ScrollMonitor (el, callback) {
	var elToListen = el;
	var elToReadPosition = el;
	if (el === document.body || el === document.getElementsByTagName('html')[0] || window) {
		elToReadPosition = [document.body, document.getElementsByTagName('html')[0]];
		elToListen = window;
	}

	var started = false;


	var lastTime = 0;
	var throttle = 300;
	var scrollPosition;
	var i;

	function onScroll () {
		if (new Date().getTime() - lastTime > throttle) {
			lastTime = new Date().getTime();

			if (elToReadPosition instanceof Array) {
				scrollPosition = 0;
				for (i = 0; i < elToReadPosition.length; i++) {
					if (elToReadPosition[i].scrollTop > 0) {
						scrollPosition = elToReadPosition[i].scrollTop;
					}
				}
			} else {
				scrollPosition = elToReadPosition.scrollTop;
			}

			callback(scrollPosition);
		}
	}

	this.start = function () {
		if (!started) {
			started = true;

			eventListener.addEventListener('scroll', elToListen, onScroll);
		}
	};

	this.stop = function () {
		if (started) {
			started = false;
			
			eventListener.removeEventListener('scroll', elToListen, onScroll);
		}
	};

	this.start.call(this);
}
module.exports = ScrollMonitor;
