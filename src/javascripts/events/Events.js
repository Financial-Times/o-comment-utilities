/**
 * When instantiated, it creates an isolated event collection.
 * These events can be handled and triggered using the resulted object.
 */
function Events () {
    "use strict";

    /**
     * Isolated set of events.
     * @type {Object}
     */
    var events = {};

    /**
     * Registers a new event handler to a specified event which will be called each time the event is triggered.
     * @param  {string}   event    Name of the event.
     * @param  {Function} handler Handler function which will be called when the event is triggered.
     */
    this.on = function (event, handler) {
        if (typeof event !== 'string' || typeof handler !== 'function') {
            return;
        }

        if (!events[event]) {
            events[event] = [];
        }
        events[event].push({
            callback: handler
        });
    };

    /**
     * Registers a new event handler to a specified event which will be called only the first time the event is triggered.
     * @param  {string}   event    Name of the event.
     * @param  {Function} handler Handler function which will be called when the event is triggered.
     */
    this.one = function (event, handler) {
        if (typeof event !== 'string' || typeof handler !== 'function') {
            return;
        }

        if (!events[event]) {
            events[event] = [];
        }
        events[event].push({
            callback: handler,
            once: true
        });
    };


    /**
     * Helper function to get the index of the handler from the array of handlers attached to an event.
     * @param  {Array}    arr      Array in which to search.
     * @param  {Function} handler  Handler function which is searched in the Array.
     * @return {number}            Index where the handler was found or -1 if not found.
     */
    function getIndexOfHandler (arr, handler) {
        for (var i=0; i<arr.length; i++) {
            if (arr[i].callback === handler) {
                return i;
            }
        }

        return -1;
    }

    /**
     * Removes event handler(s).
     * If there's no parameters, all event handlers are removed.
     * If only the event is specified, all event handlers are removed from that event handler.
     * If an event handler is specified as well, only that specific event handler will be removed.
     * @param  {string}   event   Optional. Name of the event from which the event handler should be removed.
     * @param  {Function} handler Optional. Handler function to be removed.
     */
    this.off = function (event, handler) {
        var eventNotSet = (typeof event === 'undefined');
        var handlerNotSet = (typeof handler === 'undefined');
        var eventCorrect = (typeof event === 'string');
        var handlerCorrect = (typeof handler === 'function');

        if (eventNotSet) {
            events = {};
        } else {
            if (eventCorrect) {
                if (events[event]) {
                    if (handlerNotSet) {
                        delete events[event];
                    } else if (handlerCorrect) {
                        var index = getIndexOfHandler(events[event], handler);

                        if (index > -1) {
                            events[event].splice(index, 1);
                        }
                    }
                }
            }
        }
    };

    /**
     * Triggers an event which causes the call of each handler attached.
     * @param  {string} event      Name of the event which will be triggered.
     * @param  {any}    customData Optional. Data to be passed to handlers.
     */
    this.trigger = function (event, customData) {
        var i;

        if (events[event]) {
            if (!(customData instanceof Array)) {
                customData = [customData];
            }

            i=0;
            while (i < events[event].length) {
                events[event][i].callback.apply(this, customData);

                if (events[event][i].once === true) {
                    events[event].splice(i, 1);
                } else {
                    i++;
                }
            }
        }
    };
}
module.exports = Events;