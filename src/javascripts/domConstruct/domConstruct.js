"use strict";

var sizzle = require('sizzle');

module.exports = function (config) {
    var instances = sizzle('.' + config.baseClass);

    var item;
    for (var i = 0; i < instances.length; i++) {
        item = instances[i];

        if (item.getAttribute('data-' + config.baseClass + '-autoconstruct') === "true" && item.id && item.innerHTML === "") {
            var widgetConfig = {
                elId: item.id
            };
            var match;

            for (var j = 0; j < item.attributes.length; j++) {
                match = item.attributes[j].name.match(new RegExp('data-' + config.baseClass + '-config-(.*)'));
                if (match && match.length) {
                    widgetConfig[match[1]] = item.attributes[j].value;
                }
            }

            var widget = new config.Widget(widgetConfig);

            document.body.dispatchEvent(new CustomEvent(config.namespace + '.domConstruct', {
            	detail: {
            		id: item.id,
            		instance: widget
            	},
            	bubble: true
            }));

            widget.load();
        }
    }
};
