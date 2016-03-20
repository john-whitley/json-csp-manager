require("babel-polyfill");

exports.something = require("./routes/something.js");
exports.others = require("./routes/others.js");

exports.JsonCspReaderTypeException = require('./lib/exceptions/json-csp-reader-type-exception.js');
exports.JsonCspReader = require('./lib/json-csp-reader.js');

