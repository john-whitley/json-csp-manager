/**
 * Represents an error constructing a JsonCspDocument instance.
 * This would be thrown if the CSP rules string was not able to have
 * been parsed; or was invalid in some other way.
 *
 * @extends Error
 */
class JsonCspDocumentRulesException extends Error {

  /**
   * Ensures that the exception has a more meaningful name to help future
   * debugging processes
   *
   * @param {string} message to set in the exception.  This is taken
   *                 from the standard {@link Error} class.
   */
  constructor(message) {
    super(message);

    /**
     * @property {string} name the overridden name from Error
     */
    this.name = 'JsonCspDocumentRulesException';
  }
}

export default JsonCspDocumentRulesException;
