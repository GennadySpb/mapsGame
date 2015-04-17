var _ = require('underscore');
var Events = require('./backboneEvents');

var AppDispatcher = _.extend({}, Events);

module.exports = AppDispatcher;
