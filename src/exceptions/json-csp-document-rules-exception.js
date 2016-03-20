class JsonCspDocumentRulesException extends Error {
  constructor(message) {
    super(message);

    this.name = 'JsonCspDocumentRulesException';
  }
}

export default JsonCspDocumentRulesException;
