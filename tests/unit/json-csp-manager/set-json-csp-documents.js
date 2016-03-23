var assert    = require("chai").assert;
var JsonCspDocument = require("../../../lib/json-csp-document").default;
var JsonCspManager = require("../../../lib/json-csp-manager").default;

describe('JsonCspManager can manage JsonCspDocuments', function() {

  var invalidJsonCspDocuments = [
    [ null, {}, 'broken', '{"default-src": "none"}' ],
    null,
    {},
    'broken', '{"default-src": "none"}'
  ];

  var validJsonCspDocuments = [
    new JsonCspDocument('{"default-src": "none"}'),
    new JsonCspDocument('{"script-src": "self"}'),
    new JsonCspDocument('{"img-src": "example.com"}'),
  ];

  it('cannot set unexpected objects', function() {
    var manager = new JsonCspManager();
    invalidJsonCspDocuments.forEach(function(candidate) {
      var candidateExceptionName = null;

      try {
        manager.jsonCspDocuments = candidate;
      }
      catch (candidateException) {
        candidateExceptionName = candidateException.name;
      }

      assert.equal(candidateExceptionName, 'JsonCspManagerTypeException', `Cannot set ${JSON.stringify(candidate)}`);
    });
  });

  it('cannot add unexpected objects', function() {
    var manager = new JsonCspManager();
    invalidJsonCspDocuments.forEach(function(candidate) {
      var candidateExceptionName = null;
      try {
        manager.addJsonCspDocument(candidate);
      }
      catch (candidateException) {
        candidateExceptionName = candidateException.name;
      }

      assert.equal(candidateExceptionName, 'JsonCspManagerTypeException');
    });
  });

  it('can set an array of JsonCspDocuments', function () {
    var manager = new JsonCspManager();

    manager.jsonCspDocuments = validJsonCspDocuments;
    assert.deepEqual(manager.jsonCspDocuments, validJsonCspDocuments, 'The documents are stored as expected');
  });

  it('can add an array of JsonCspDocuments', function () {
    var manager = new JsonCspManager();

    validJsonCspDocuments.forEach(function(candidate) {
      manager.addJsonCspDocument(candidate);
    });

    assert.deepEqual(manager.jsonCspDocuments, validJsonCspDocuments, 'The documents are stored as expected');
  });
});
