require("babel-polyfill");
var assert    = require("chai").assert;
var JsonCspDocument = require("../../../lib/json-csp-document").default;

describe('JsonCspDocument validation', function() {
  it('validates correct objects', function() {
    candidateObject = new JsonCspDocument({});

    assert.isOk(candidateObject.isValid());
  });
});
