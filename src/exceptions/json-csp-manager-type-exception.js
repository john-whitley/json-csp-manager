/**
 * Represents an error adding data to a JsonCspManager.
 * This would be thrown if the entity passed into the JsonCspManager
 * was not something which the manager could handle.
 *
 * @extends Error
 */
class JsonCspManagerTypeException extends Error {

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
    this.name = 'JsonCspManagerTypeException';
  }
}

export default JsonCspManagerTypeException;
