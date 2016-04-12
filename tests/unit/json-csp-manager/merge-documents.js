var assert    = require("chai").assert;
var JsonCspDocument = require("../../../lib/json-csp-document").default;
var JsonCspManager = require("../../../lib/json-csp-manager").default;

describe('JsonCspManager can manage JsonCspDocuments', function() {

  it('The merge works when there are no documents to merge', function() {
    var validJsonCspDocuments = [];

    var jsonCspManager = new JsonCspManager();
    jsonCspManager.jsonCspDocuments = validJsonCspDocuments;
    const candidate = jsonCspManager.mergedJsonCspDocument;

    assert.ok(jsonCspManager.jsonCspReport.hasNoErrors, 'There were no errors in the merge');

    assert.instanceOf(candidate, JsonCspDocument, 'We get a valid JsonCspDocument');
    assert.ok(candidate.isValid(), 'The merge is valid');
  });

  it('The simple, no conflicting rules, merge works', function() {
    var validJsonCspDocuments = [
      new JsonCspDocument('{"default-src": "\'none\'"}'),
      new JsonCspDocument('{"script-src": "\'self\'"}'),
      new JsonCspDocument('{"img-src": "\'self\'"}'),
      new JsonCspDocument('{"img-src": "example.com"}'),
      new JsonCspDocument('{"report-uri": "report.example.com/csp-report"}'),
    ];

    var jsonCspManager = new JsonCspManager();
    jsonCspManager.jsonCspDocuments = validJsonCspDocuments;

    const candidate = jsonCspManager.mergedJsonCspDocument;

    assert.ok(jsonCspManager.jsonCspReport.hasNoErrors, 'There were no errors in the merge');

    assert.instanceOf(candidate, JsonCspDocument, 'The merge is a JsonCspDocument');
    assert.ok(candidate.isValid(), 'The merge is valid');
  });

  it('A single mergeable rule: none to self; the merge works', function() {
    var validJsonCspDocuments = [
      new JsonCspDocument('{"script-src": "\'none\'"}'),
      new JsonCspDocument('{"script-src": "\'self\'"}'),
    ];

    var jsonCspManager = new JsonCspManager();
    jsonCspManager.jsonCspDocuments = validJsonCspDocuments;

    const candidate = jsonCspManager.mergedJsonCspDocument;

    assert.ok(jsonCspManager.jsonCspReport.hasNoErrors, 'There were no errors in the merge');

    assert.instanceOf(candidate, JsonCspDocument, 'The merge is a JsonCspDocument');
    assert.ok(candidate.isValid(), 'The merge is valid');
  });

  it('A single mergeable rule: none to self to self and data; the merge works', function() {
    var validJsonCspDocuments = [
      new JsonCspDocument('{"script-src": "\'none\'"}'),
      new JsonCspDocument('{"script-src": "\'self\'"}'),
      new JsonCspDocument('{"script-src": "\'data\'"}'),
    ];

    var jsonCspManager = new JsonCspManager();
    jsonCspManager.jsonCspDocuments = validJsonCspDocuments;

    const candidate = jsonCspManager.mergedJsonCspDocument;

    assert.ok(jsonCspManager.jsonCspReport.hasNoErrors, 'There were no errors in the merge');

    assert.instanceOf(candidate, JsonCspDocument, 'The merge is a JsonCspDocument');
    assert.ok(candidate.isValid(), 'The merge is valid');
  });

  it('A single mergeable rule: none to self and data; the merge works', function() {
    var validJsonCspDocuments = [
      new JsonCspDocument('{"script-src": "\'none\'"}'),
      new JsonCspDocument('{"script-src": ["\'self\'", "\'data\'"]}'),
    ];

    var jsonCspManager = new JsonCspManager();
    jsonCspManager.jsonCspDocuments = validJsonCspDocuments;

    const candidate = jsonCspManager.mergedJsonCspDocument;

    assert.ok(jsonCspManager.jsonCspReport.hasNoErrors, 'There were no errors in the merge');

    assert.instanceOf(candidate, JsonCspDocument, 'The merge is a JsonCspDocument');
    assert.ok(candidate.isValid(), 'The merge is valid');
  });

  it('A single mergeable rule: none to self and data; the merge works', function() {
    var validJsonCspDocuments = [
      new JsonCspDocument('{"script-src": "\'none\'"}'),
      new JsonCspDocument('{"script-src": ["\'self\'", "\'data\'"]}'),
    ];

    var jsonCspManager = new JsonCspManager();
    jsonCspManager.jsonCspDocuments = validJsonCspDocuments;

    const candidate = jsonCspManager.mergedJsonCspDocument;

    assert.ok(jsonCspManager.jsonCspReport.hasNoErrors, 'There were no errors in the merge');

    assert.instanceOf(candidate, JsonCspDocument, 'The merge is a JsonCspDocument');
    assert.ok(candidate.isValid(), 'The merge is valid');
  });

  it('A single mergeable rule: none to data and self and base-uri; the merge works', function() {
    var validJsonCspDocuments = [
      new JsonCspDocument('{"script-src": "\'none\'"}'),
      new JsonCspDocument('{"script-src": ["\'self\'", "\'data\'"], "base-uri": "example.com"}'),
    ];

    var jsonCspManager = new JsonCspManager();
    jsonCspManager.jsonCspDocuments = validJsonCspDocuments;

    const candidate = jsonCspManager.mergedJsonCspDocument;

    assert.ok(jsonCspManager.jsonCspReport.hasNoErrors, 'There were no errors in the merge');

    assert.instanceOf(candidate, JsonCspDocument, 'The merge is a JsonCspDocument');
    assert.ok(candidate.isValid(), 'The merge is valid');
  });

  it('A single mergeable rule: none and base-uri to data and self; the merge works', function() {
    var validJsonCspDocuments = [
      new JsonCspDocument('{"script-src": "\'none\'", "base-uri": "example.com"}'),
      new JsonCspDocument('{"script-src": ["\'self\'", "\'data\'"]}'),
    ];

    var jsonCspManager = new JsonCspManager();
    jsonCspManager.jsonCspDocuments = validJsonCspDocuments;

    const candidate = jsonCspManager.mergedJsonCspDocument;

    assert.ok(jsonCspManager.jsonCspReport.hasNoErrors, 'There were no errors in the merge');

    assert.instanceOf(candidate, JsonCspDocument, 'The merge is a JsonCspDocument');
    assert.ok(candidate.isValid(), 'The merge is valid');
  });

  it('A single mergeable rule: none and base-uri to data and self and base-uri - same base-uri; the merge works', function() {
    var validJsonCspDocuments = [
      new JsonCspDocument('{"script-src": "\'none\'", "base-uri": "example.com"}'),
      new JsonCspDocument('{"script-src": ["\'self\'", "\'data\'"], "base-uri": "example.com"}'),
    ];

    var jsonCspManager = new JsonCspManager();
    jsonCspManager.jsonCspDocuments = validJsonCspDocuments;

    const candidate = jsonCspManager.mergedJsonCspDocument;

    assert.ok(jsonCspManager.jsonCspReport.hasNoErrors, 'There were no errors in the merge');

    assert.instanceOf(candidate, JsonCspDocument, 'The merge is a JsonCspDocument');
    assert.ok(candidate.isValid(), 'The merge is valid');
  });

  it('A single mergeable rule: none and base-uri to data and self and base-uri - different base-uri; the merge reports errors', function() {
    var validJsonCspDocuments = [
      new JsonCspDocument('{"script-src": "\'none\'", "base-uri": "example.com"}'),
      new JsonCspDocument('{"script-src": ["\'self\'", "\'data\'"], "base-uri": "www.example.com"}'),
    ];

    var jsonCspManager = new JsonCspManager();
    jsonCspManager.jsonCspDocuments = validJsonCspDocuments;

    const candidate = jsonCspManager.mergedJsonCspDocument;

    assert.ok(jsonCspManager.jsonCspReport.hasErrors, 'There were errors in the merge');

    assert.instanceOf(candidate, JsonCspDocument, 'The merge is a JsonCspDocument');
    assert.ok(candidate.isValid(), 'The merge is valid');
  });

});
