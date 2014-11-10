/**
 * Adds an event listener to a DOM object. Bubbling disabled.
 * @param {String}     event   Type of the event (e.g. click)
 * @param {DOMObject} elem    DOM object to which the handler will be attached.
 * @param {Function}   handler Event handler function.
 */
exports.addEventListener = function (event, elem, handler) {
    if (elem instanceof Array) {
        for (var i = 0; i < elem.length; i++) {
            exports.addEventListener(event, elem[i], handler);
        }

        return;
    }

    if (elem.addEventListener) {
        // W3C DOM
        elem.addEventListener(event, handler, false);
    } else if (elem.attachEvent) {
        // IE DOM
        elem.attachEvent("on" + event, handler);
    } else {
        elem[event] = handler;
    }
};

/**
 * Removes an event listener from a DOM object. Bubbling disabled.
 * @param {String}     event   Type of the event (e.g. click)
 * @param {DOMObject} elem    DOM object from which the handler will be removed.
 * @param {Function}   handler Event handler function that should be removed.
 */
exports.removeEventListener = function (event, elem, handler) {
    if (elem instanceof Array) {
        for (var i = 0; i < elem.length; i++) {
            exports.removeEventListener(event, elem[i], handler);
        }

        return;
    }

    if (elem.removeEventListener) {
        elem.removeEventListener(event, handler, false);
    } else if (elem.detachEvent) {
        elem.detachEvent('on' + event, handler);
    }
};
