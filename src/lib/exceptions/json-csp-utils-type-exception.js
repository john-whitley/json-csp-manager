/**
 * Represents a type error in the JsonCspUtils class.
 * This would be thrown if bad variables were passed into one of the
 * utility functions.
 *
 * @extends Error
 */
class JsonCspUtilsTypeException extends Error {

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
    this.name = 'JsonCspUtilsTypeException';
  }
}

export default JsonCspUtilsTypeException;
