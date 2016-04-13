import JsonCspDocument from './json-csp-document';
import JsonCspReport from './json-csp-report';
import JsonCspManagerTypeException from './exceptions/json-csp-manager-type-exception';

/**
 * Manages the JSON CSP merging of JSON CSP documents, and provides
 * an output.
 */
class JsonCspManager {

  /**
   * Get the report instance that will contain the reasons for how the
   * merged JSON CSP document merged.
   *
   * @return {JsonCspReport} the instance that reports on this merge.
   */
  get jsonCspReport() {
    if (!(this.privateJsonCspReport instanceof JsonCspReport)) {
      /**
       * @parameter {JsonCspReport} privateJsonCspReport the report of
       *                            this merge
       */
      this.privateJsonCspReport = new JsonCspReport();
    }

    return this.privateJsonCspReport;
  }

  /**
   * Should the report about this managers merge need to be cleared,
   * then this clears it.
   *
   * @return {void}
   */
  clearJsonCspReport() {
    this.privateJsonCspReport = null;
  }

  /**
   * Get all existing JsonCspDocument instances in this manager
   *
   * @returns {JsonCspDocument[]} the JsonCspDocument instances in this manager
   */
  get jsonCspDocuments() {
    if (!Array.isArray(this.privateJsonCspDocuments)) {
      /**
       * @property {JsonCspDocument[]} privateJsonCspDocuments the
       *           internal storage for the setter/getter for
       *           jsonCspDocuments.
       */
      this.privateJsonCspDocuments = [];
    }

    return this.privateJsonCspDocuments;
  }

  /**
   * Set new/overwrite any existing JsonCspDocument instances in this manager
   *
   * @param {JsonCspDocument[]} jsonCspDocuments the array of JsonCspDocuments
   *
   * @throws {JsonCspManagerTypeException} jsonCspDocuments was not an array of JsonCspDocument
   */
  set jsonCspDocuments(jsonCspDocuments) {
    if (Array.isArray(jsonCspDocuments)) {
      jsonCspDocuments.forEach((jsonCspDocument) => {
        if (!(jsonCspDocument instanceof JsonCspDocument)) {
          throw new JsonCspManagerTypeException('jsonCspDocuments must only contain instances of JsonCspDocument classes');
        }
      });
    } else {
      throw new JsonCspManagerTypeException('jsonCspDocuments must be an array');
    }

    this.privateJsonCspDocuments = jsonCspDocuments;
    this.clearJsonCspReport();
  }

  /**
   * Add another JsonCspDocument into the manager
   *
   * @param {JsonCspDocument} jsonCspDocument the json document to be added
   *
   * @returns {JsonCspDocument[]} the JsonCspDocument instances in this manager
   *
   * @throws {JsonCspManagerTypeException} jsonCspDocuments was not an array of JsonCspDocument
   */
  addJsonCspDocument(jsonCspDocument) {
    if (jsonCspDocument instanceof JsonCspDocument) {
      this.jsonCspDocuments.push(jsonCspDocument);
    } else {
      throw new JsonCspManagerTypeException('jsonCspDocuments must be an array');
    }

    return this.jsonCspDocuments;
  }

  /**
   * Get a new iterator of this.jsonCspDocuments.
   *
   * @returns {Iterator} of {@link JsonCspDocument} instances that this manager manages.
   */
  *jsonCspDocumentsIterator() {
    let index = 0;

    while (index < this.jsonCspDocuments.length) {
      yield this.jsonCspDocuments[index++];
    }
  }

  /**
   * Merge together all the documents managed by this manager.
   *
   * @return {JsonCspDocument} the merged documents as a single document.
   */
  get mergedJsonCspDocument() {
    if (this.privateJsonCspDocuments.length) {
      const iterator = this.jsonCspDocumentsIterator();
      let mergedJsonCspDocument = new JsonCspDocument({});
      let nextJsonCspDocument = iterator.next();

      while (nextJsonCspDocument.done === false) {
        const toMergeIn = nextJsonCspDocument.value;

        mergedJsonCspDocument = mergedJsonCspDocument.mergeWith(toMergeIn, this.jsonCspReport);

        nextJsonCspDocument = iterator.next();
      }

      return mergedJsonCspDocument;
    }

    return new JsonCspDocument('{}');
  }
}

export default JsonCspManager;
