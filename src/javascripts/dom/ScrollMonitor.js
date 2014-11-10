"use strict";

var eventListener = require('./eventListener.js');

function ScrollMonitor (el, callback) {
	if (el === document.body || el === document.getElementsByTagName('html')[0]) {
		el = [document.body, document.getElementsByTagName('html')[0]];
	}

	var started = false;


	var lastTime = 0;
	var throttle = 300;
	var scrollPosition;
	var i;

	function onScroll () {
		if (new Date().getTime() - lastTime > throttle) {
			lastTime = new Date().getTime();

			if (el instanceof Array) {
				scrollPosition = 0;
				for (i = 0; i < el.length; i++) {
					if (el[i].scrollTop > 0) {
						scrollPosition = el[i].scrollTop;
					}
				}
			} else {
				scrollPosition = el.scrollTop;
			}

			callback(scrollPosition);
		}
	}

	this.start = function () {
		if (!started) {
			started = true;

			eventListener.addEventListener('scroll', el, onScroll);
		}
	};

	this.stop = function () {
		if (started) {
			started = false;
			
			eventListener.removeEventListener('scroll', el, onScroll);
		}
	};

	this.start.call(this);
}
module.exports = ScrollMonitor;
