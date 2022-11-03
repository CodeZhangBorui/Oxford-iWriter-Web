var _ = require('../lodash/lodash.js')
var File = require('./lib/file');
var Env = require('./lib/env');

var file = new File();

file.createEnv = function(opt) {
    return new Env(_.extend({}, this._options, opt));
};

module.exports = file;
