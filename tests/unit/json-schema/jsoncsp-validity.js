require("babel-polyfill");
var assert    = require("chai").assert;
var JsonCspSchema = require("../../../lib/json-schema/json-csp").default;
var Validator = require('jsonschema').Validator;
var JsonCspSchema = require("../../../lib/json-schema/json-csp").default;
var ValidJsonCsp = require("../../unit/data/json-csp").ValidJsonCsp;
var InvalidJsonCsp = require("../../unit/data/json-csp").InvalidJsonCsp;

describe('jsonschema of JsonCsp is valid', function() {

  var validJsonCspStrings = ValidJsonCsp.exampleStrings();

  var invalidJsonCspStrings = InvalidJsonCsp.exampleStrings();

  it('returns an object', function() {
    assert.typeOf(JsonCspSchema.schema, 'object', 'schema is an object');
  });

  it('returns valid JSON string', function() {
    var candidateObject = null;
    var candidate = JsonCspSchema.toJson();
    assert.typeOf(candidate, 'string', 'schema is returned as a string');

    try {
      candidateObject = JSON.parse(candidate);
    }
    catch (e) {
    }

    assert.typeOf(candidateObject, 'object', 'schema string is valid JSON');
  });

  it('loads into a jsonschema correctly', function() {
    var validator = new Validator();

    var candidate = validator.addSchema(JsonCspSchema.schema);

    assert.deepEqual(candidate, JsonCspSchema.schema, 'Schema was correctly installed');
  });

  it('recognises valid JSON CSP', function() {
    var validator = new Validator();
    var schema = JsonCspSchema.schema;
    var schemaId = schema.id;

    validator.addSchema(schema);

    validJsonCspStrings.forEach(function(candidate) {
      var candidateObject = JSON.parse(candidate);
      var result = validator.validate(candidateObject, schemaId);

      assert.isOk(result.valid, `"${candidate}" is a valid jsoncsp string`);
    });
  });

  it('recognises invalid JSON CSP', function() {
    var validator = new Validator();
    var schema = JsonCspSchema.schema;
    var schemaId = schema.id;

    validator.addSchema(schema);

    invalidJsonCspStrings.forEach(function(candidate) {
      var candidateObject = JSON.parse(candidate);
      var result = validator.validate(candidateObject, schemaId);

      assert.isNotOk(result.valid, `"${candidate}" is an invalid jsoncsp string`);
    });
  });

});
