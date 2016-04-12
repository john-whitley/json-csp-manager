import JsonCspUtilsTypeException from './exceptions/json-csp-utils-type-exception';

/**
 * Provides some utility functions
 */
class JsonCspUtils {

  /**
   * Returns true if both array candidates are identical.
   *
   * @param {array} candidateA the first candidate to compare
   * @param {array} candidateB the second candidate to compare
   *
   * @return {boolean} true if the arrays are the same
   *
   * @throws {JsonCspUtilsTypeException} candidateA or candidateB are
   *         not arrays
   */
  static arraysAreEqual(candidateA, candidateB) {
    if (!(Array.isArray(candidateA) && Array.isArray(candidateB))) {
      throw new JsonCspUtilsTypeException('arrayEquals requires two arrays passed into it');
    }

    const setA = new Set(candidateA);
    const setB = new Set(candidateB);

    if (setA.size === setB.size) {
      for (const candidate of setA) {
        if (!setB.has(candidate)) {
          return false;
        }
      }

      return true;
    }

    return false;
  }

  /**
   * Returns true if both array candidates are not identical.
   *
   * @param {array} candidateA the first candidate to compare
   * @param {array} candidateB the second candidate to compare
   *
   * @return {boolean} true if the arrays are the different
   *
   * @throws {JsonCspUtilsTypeException} candidateA or candidateB are
   *         not arrays
   */
  static arraysAreNotEqual(candidateA, candidateB) {
    return !JsonCspUtils.arraysAreEqual(candidateA, candidateB);
  }
}

export default JsonCspUtils;
