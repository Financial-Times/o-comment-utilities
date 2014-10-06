var contentLoaded = require('./contentLoaded.js');

module.exports = function (callback) {
    "use strict";
    
    contentLoaded(window, callback);
};