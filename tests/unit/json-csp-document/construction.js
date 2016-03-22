var assert    = require("chai").assert;
var JsonCspDocument = require("../../../lib/json-csp-document").default;
var JsonCspDocumentTypeException = require("../../../lib/exceptions/json-csp-document-type-exception").default;

describe('JsonCspDocument construction', function() {
  const validJsonStrings = [
    '{ }',
    '{ "a": "b" }'
  ];

  const validObjects = [
    { },
    { "a": "b" }
  ];

  const invalidJsonStrings = [
    '{ ',
    '{ "a" => "b" }'
  ];

  const invalidObjects = [
    null
  ];

  it('copes with valid JSON strings', function() {
    validJsonStrings.forEach((candidate) => {
      var candidateObject = null;

      try {
        candidateObject = new JsonCspDocument(candidate);
      }
      catch (e) {
        console.log(`Failed to construct candidateObject: ${e}`);
      }

      assert.instanceOf(candidateObject, JsonCspDocument, `JSON string ${candidate} allows construction of class`);
    });
  });

  it('copes with valid objects', function() {
    validObjects.forEach((candidate) => {
      var candidateObject = null;

      try {
        candidateObject = new JsonCspDocument(candidate);
      }
      catch (e) {
        console.log(`Failed to construct candidateObject: ${e}`);
      }

      assert.instanceOf(candidateObject, JsonCspDocument, `Object ${candidate} allows construction of class`);
    });
  });

  it('copes with invalid JSON strings', function() {
    invalidJsonStrings.forEach((candidate) => {
      var candidateObject = null;
      var candidateExceptionName = null;

      try {
        candidateObject = new JsonCspDocument(candidate);
      }
      catch (candidateException) {
        candidateExceptionName = candidateException.name;
      }

      assert.equal(candidateExceptionName, 'JsonCspDocumentRulesException', `JSON string ${candidate} throws the correct exception`);
      assert.isNull(candidateObject, `JSON string ${candidate} does not allow construction of class`);
    });
  });

  it('copes with invalid objects', function() {
    invalidObjects.forEach((candidate) => {
      var candidateObject = null;

      try {
        candidateObject = new JsonCspDocument(candidate);
      }
      catch (candidateException) {
        assert.equal(candidateException.name, 'JsonCspDocumentTypeException', `Object ${candidate} throws the correct exception`);
      }

      assert.isNull(candidateObject, `Object ${candidate} does not allow construction of class`);
    });
  });
});
