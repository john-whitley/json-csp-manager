require("babel-polyfill");
var assert    = require("chai").assert;
var JsonCspDocument = require("../../../lib/json-csp-document").default;

var ValidJsonCsp = require("../../unit/data/json-csp").ValidJsonCsp;
var InvalidJsonCsp = require("../../unit/data/json-csp").InvalidJsonCsp;

describe('JsonCspDocument validation', function() {
  var validJsonCspStrings = ValidJsonCsp.exampleStrings();

  var invalidJsonCspStrings = InvalidJsonCsp.exampleStrings();

  it('validates valid strings', function() {

    validJsonCspStrings.forEach(function(candidate) {
      var candidateDocument = new JsonCspDocument(candidate);
      assert.isOk(candidateDocument.isValid());
    });

  });

  it('validates invalid strings', function() {

    invalidJsonCspStrings.forEach(function(candidate) {
      var candidateDocument = new JsonCspDocument(candidate);
      assert.isNotOk(candidateDocument.isValid());
    });

  });

});
