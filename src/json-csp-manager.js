import JsonCspDocument from './json-csp-document';
import JsonCspManagerTypeException from './exceptions/json-csp-manager-type-exception';

/**
 * Manages the JSON CSP merging of JSON CSP documents, and provides
 * an output.
 */
class JsonCspManager {

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

}

export default JsonCspManager;
