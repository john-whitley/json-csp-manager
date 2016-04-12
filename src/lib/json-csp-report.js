/**
 * Represents a JSON CSP Report.  This contains the reasons why rules
 * merged, or conflicted.
 */
class JsonCspReport {

  /**
   * Create the placeholders for the storage of the reasons this report
   * contains.
   */
  constructor() {
    /**
     * @parameter {Map} privateInformation the information (successful
     *                  merges)
     */
    this.privateInformation = new Map([]);

    /**
     * @parameter {Map} privateErrors the information (failed merges)
     */
    this.privateErrors = new Map([]);
  }

  /**
   * Get the information about successful merges
   *
   * @return {Map} the information about successful merges
   */
  get information() {
    return this.privateInformation;
  }

  /**
   * Get the information about failed merges
   *
   * @return {Map} the information about failed merges
   */
  get errors() {
    return this.privateErrors;
  }

  /**
   * Add another bit of information about a successful merge
   *
   * @param {string} key the CSP rule name
   * @param {string} value the CSP value
   * @param {JsonCspDocument} jsonCspDocument the document that added
   *                          this rule
   *
   * @return {void}
   */
  addInformation(key, value, jsonCspDocument) {
    let keyStore = this.information;

    if (!(keyStore instanceof Map)) {
      keyStore = new Map([]);
    }

    let valueStore = keyStore.get(key);

    if (!(valueStore instanceof Map)) {
      valueStore = new Map([]);
    }

    let values = valueStore.get(value);

    if (!(values instanceof Map)) {
      values = new Map([]);
    }

    values.set(jsonCspDocument.documentId, jsonCspDocument);

    valueStore.set(value, values);

    keyStore.set(key, valueStore);

    this.privateInformation = keyStore;
  }

  /**
   * Add another bit of information about a failed merge
   *
   * @param {string} key the CSP rule name
   * @param {string} value the CSP value
   * @param {JsonCspDocument} jsonCspDocument the document that added
   *                          this rule
   *
   * @return {void}
   */
  addError(key, value, jsonCspDocument) {
    let keyStore = this.privateErrors;

    if (!(keyStore instanceof Map)) {
      keyStore = new Map([]);
    }

    let valueStore = keyStore.get(key);

    if (!(valueStore instanceof Map)) {
      valueStore = new Map([]);
    }

    let values = valueStore.get(value);

    if (!(values instanceof Map)) {
      values = new Map([]);
    }

    values.set(jsonCspDocument.documentId, jsonCspDocument);

    valueStore.set(value, values);

    keyStore.set(key, valueStore);

    this.privateErrors = keyStore;
  }

  /**
   * There are no errors in the report
   *
   * @return {boolean} true if there are no errors in the report
   */
  get hasNoErrors() {
    const NO_ERRORS = 0;
    let errors = 0;

    this.privateErrors.forEach((keyStore) => {
      keyStore.forEach((valueStore) => {
        if (typeof valueStore.size === 'number') {
          errors += valueStore.size;
        }
      });
    });

    return errors === NO_ERRORS;
  }

  /**
   * There are errors in the report
   *
   * @return {boolean} true if there are errors in the report
   */
  get hasErrors() {
    return !this.hasNoErrors;
  }
}

export default JsonCspReport;
