var documentReady = require('../documentReady/documentReady.js');
var sizzle = require('sizzle');

module.exports = function (Widget, baseClass) {
    "use strict";

    documentReady(function () {
        var instances = sizzle('.' + baseClass);

        var item;
        for (var i = 0; i < instances.length; i++) {
            item = instances[i];

            if (item.getAttribute('data-' + baseClass + '-autoconstruct') === "true" && item.id) {
                var config = {
                    elId: item.id
                };
                var match;

                for (var j = 0; j < item.attributes.length; j++) {
                    match = item.attributes[j].name.match(new RegExp('data-' + baseClass + '-config-(.*)'));
                    if (match && match.length) {
                        config[match[1]] = item.attributes[j].value;
                    }
                }

                var widget = new Widget(config);
                widget.load();

                item.setAttribute('data-' + baseClass + '-widget-id', baseClass + '-widget-' + item.id);
                window[baseClass + '-widget-' + item.id] = widget;
            }
        }
    });
};