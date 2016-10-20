var NCMB = require('ncmb');
var config = require('../config');

var ncmb = new NCMB(config.application_key, config.client_key);
module.exports = ncmb;
