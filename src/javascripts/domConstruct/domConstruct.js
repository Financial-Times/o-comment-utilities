"use strict";

var generateId = require('../generateId/generateId.js');

module.exports = function (config) {
	var el = config.context;

	if (!el) {
		el = document.body;
	} else if (!(el instanceof HTMLElement)) {
		el = document.querySelector(el);
	}

	var instances = el.querySelectorAll('[data-o-component="'+ config.baseClass +'"]');

	var item;
	var meetsReqs;
	var widgets = [];

	for (var i = 0; i < instances.length; i++) {
		item = instances[i];

		meetsReqs = !item.getAttribute('data-' + config.baseClass + '-built');
		if (config.auto) {
			meetsReqs = meetsReqs && item.getAttribute('data-' + config.baseClass + '-auto-init') !== "false";
		}

		if (meetsReqs) {
			if (!item.id) {
				// generate an ID
				item.id = config.baseClass + '--' + generateId();
			}

			// prevent rebuilding it again
			item.setAttribute('data-' + config.baseClass + '-built', "true");

			var widgetConfig = {};
			var match;
			var itemsInConfig;
			var currentLevel;

			for (var j = 0; j < item.attributes.length; j++) {
				match = item.attributes[j].name.match(new RegExp('data-' + config.baseClass + '-config-(.*)'));
				if (match && match.length) {
					itemsInConfig = match[1].split('-');
					currentLevel = widgetConfig;

					for (var k = 0; k < itemsInConfig.length; k++) {
						if (k === itemsInConfig.length - 1) {
							// last level
							currentLevel[itemsInConfig[k]] = item.attributes[j].value;
						} else {
							// there's one more level
							if (!currentLevel[itemsInConfig[k]]) {
								currentLevel[itemsInConfig[k]] = {};
								currentLevel = currentLevel[itemsInConfig[k]];
							}
						}
					}
				}
			}

			var widget = new config.Widget(item, widgetConfig);

			document.body.dispatchEvent(new CustomEvent(config.namespace + '.ready', {
				detail: {
					id: item.id,
					instance: widget
				},
				bubble: true
			}));

			widget.init();

			widgets.push(widget);
		}
	}

	return widgets;
};
