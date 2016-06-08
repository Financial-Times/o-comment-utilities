const generateId = require('../generateId/generateId.js');

function getCamelCaseName (str) {
	const parts = str.split('-');
	let result = parts[0];

	for (let i = 1; i < parts.length; i++) {
		result += parts[i].charAt(0).toUpperCase() + parts[i].slice(1);
	}

	return result;
}

module.exports = function (config) {
	let el = config.context;

	if (!el) {
		el = document.body;
	} else if (!(el instanceof HTMLElement)) {
		el = document.querySelector(el);
	}

	const instances = el.querySelectorAll('[data-o-component="'+ config.classNamespace +'"]');

	let item;
	let meetsReqs;
	const widgets = [];

	for (let i = 0; i < instances.length; i++) {
		item = instances[i];

		meetsReqs = !item.getAttribute('data-' + config.classNamespace + '-built');
		if (config.auto) {
			meetsReqs = meetsReqs && item.getAttribute('data-' + config.classNamespace + '-auto-init') !== "false";
		}

		if (meetsReqs) {
			if (!item.id) {
				// generate an ID
				item.id = config.classNamespace + '--' + generateId();
			}

			// prevent rebuilding it again
			item.setAttribute('data-' + config.classNamespace + '-built', "true");

			const widgetConfig = {};
			let match;
			let itemsInConfig;
			let currentLevel;
			let camelCaseConfigName;


			function getAttributeValue (valueRead) {
				const intValue = parseInt(valueRead, 10);
				if (!isNaN(valueRead) && intValue) {
					return intValue;
				} else {
					return valueRead;
				}
			}

			for (let j = 0; j < item.attributes.length; j++) {
				match = item.attributes[j].name.match(new RegExp('data-' + config.classNamespace + '-config-(.*)'));
				if (match && match.length) {
					itemsInConfig = match[1].split('--');
					currentLevel = widgetConfig;

					for (let k = 0; k < itemsInConfig.length; k++) {
						camelCaseConfigName = getCamelCaseName(itemsInConfig[k]);
						if (k === itemsInConfig.length - 1) {
							// last level
							currentLevel[camelCaseConfigName] = getAttributeValue(item.attributes[j].value);
						} else {
							// there's one more level
							if (!currentLevel[camelCaseConfigName]) {
								currentLevel[camelCaseConfigName] = {};
								currentLevel = currentLevel[camelCaseConfigName];
							}
						}
					}
				}
			}

			/* eslint-disable */ // Constructor name should start with uppercase, but in this case the constructor is a variable
			const widget = new config.module(item, widgetConfig);
			/* eslint-enable */

			document.body.dispatchEvent(new CustomEvent(config.eventNamespace + '.ready', {
				detail: {
					id: item.id,
					instance: widget
				},
				bubble: true
			}));

			widgets.push(widget);
		}
	}

	return widgets;
};
