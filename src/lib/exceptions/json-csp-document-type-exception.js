/**
 * Represents an error constructing a JsonCspDocument instance.
 * This would be thrown if the entity passed into the JsonCspDocument at
 * construction time was not something which the constructor could handle.
 *
 * @extends Error
 */
class JsonCspDocumentTypeException extends Error {

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
    this.name = 'JsonCspDocumentTypeException';
  }
}

export default JsonCspDocumentTypeException;
