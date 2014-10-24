"use strict";
    
var contentLoaded = require('./contentLoaded.js');

module.exports = function (callback) {
    contentLoaded(window, callback);
};
