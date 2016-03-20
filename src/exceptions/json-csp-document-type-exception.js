class JsonCspDocumentTypeException extends Error {
  constructor(message) {
    super(message);

    this.name = 'JsonCspDocumentTypeException';
  }
}

export default JsonCspDocumentTypeException;
