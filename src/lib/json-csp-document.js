import TypeException from './exceptions/json-csp-document-type-exception';
import RulesException from './exceptions/json-csp-document-rules-exception';
import Validator from 'jsonschema';
import JsonCspSchema from './json-schema/json-csp';
import Utils from './json-csp-utils';
import uuid5 from 'uuid5';

/**
 * Represents a JSON CSP document.  There will be a number of
 * documents that make up a CSP policy.  This fragmentation allows for
 * management-as-you-want-to with different files in your projects;
 * and/or the ability to include rules from other project(s).
 */
class JsonCspDocument {

  /**
   * Take the JSON CSP candidate and build a class around it to ensure
   * that we can use it to take meaning from it.
   *
   * @param {string|object} cspRules the JSON CSP details
   * @param {string} id the identification of the object
   *
   * @throws {JsonCspDocumentRulesException} the constructor can cope with
   *                                         the type you passed in,
   *                                         but there is something
   *                                         wrong with the data.
   * @throws {JsonCspDocumentTypeException} the constructor cannot
   *                                        cope with the type you
   *                                        passed in.
   */
  constructor(cspRules, id) {
    /**
     * @property {object} cspRules the validated JSON CSP rules in an
     *                             object for this class to use.
     */
    this.cspRules = null;

    /**
     * @property {object} privateId the ID of this document.
     */
    this.privateId = id;

    const cspRulesType = typeof cspRules;

    if (cspRulesType === 'string') {
      try {
        /**
         * @property {object} cspRules the validated JSON CSP rules in an
         *                             object for this class to use.
         */
        this.cspRules = JSON.parse(cspRules);
      } catch (exception) {
        throw new RulesException(`expected a JSON parsable string. Got: ${exception}`);
      }
    } else if (cspRulesType === 'object' && cspRules !== null) {
      this.cspRules = cspRules;
    } else {
      throw new TypeException(`expected a JSON parsable string, or an object. Got: ${cspRulesType}`);
    }
  }

  /**
   * The document ID of this document.
   *
   * @return {string} the document ID
   */
  get documentId() {
    if (typeof this.privateId !== 'string') {
      this.privateId = uuid5(this.toJson());
    }

    return this.privateId;
  }

  /**
   * Get the JSON CSP object suitable for jsonschema
   *
   * @return {object} jsonschema compatible object
   */
  get jsonCspSchema() {
    return JsonCspSchema.schema;
  }

  /**
   * Get the JSON CSP object suitable for jsonschema
   *
   * @return {object} jsonschema compatible object
   */
  get jsonSchemaValidator() {
    const validator = new Validator.Validator();

    validator.addSchema(this.jsonCspSchema);

    return validator;
  }

  /**
   * Get the validation object with any/all explanation of errors
   *
   * @return {object} jsonschema validate object
   */
  validate() {
    const validator = this.jsonSchemaValidator;

    return validator.validate(this.cspRules, this.jsonCspSchema.id);
  }

  /**
   * Summary of whether the validation passed
   *
   * @return {boolean} true if the validation passed
   */
  isValid() {
    const validation = this.validate();

    return validation.valid;
  }

  /**
   * Get the value of the CSP rules for the given key.
   *
   * @param {string} key the key of the CSP to get the value of.
   *
   * @return {mixed} the content of the CSP for the given key.
   */
  getCspValueOf(key) {
    return this.cspRules[key];
  }

  /**
   * Get this document as a JSON CSP document.
   *
   * @return {string} the JSON CSP representation of this document.
   */
  toJson() {
    return JSON.stringify(this.cspRules);
  }

  /**
   * Get the value of the CSP rules for the given key as an array ready
   * for merging.
   *
   * @param {string} key the key of the CSP to get the value of.
   *
   * @return {string[]} the CSP value shape
   */
  getCspArrayValueOf(key) {
    const candidate = this.getCspValueOf(key);

    if (typeof candidate === 'string') {
      return [candidate];
    } else if (typeof candidate === 'undefined') {
      return [];
    }

    return candidate;
  }

  /**
   * There are some values that are incompatible.  This method filters
   * out the incompatible values.
   *
   * @param {Set} setOfMergedValues the merged values to filter.
   *
   * @return {Set} the filtered merged values.
   */
  filterValuesOfMergeableKey(setOfMergedValues) {
    const MAX_SIZE_IF_NONE_IN_ARRAY = 1;

    if (setOfMergedValues.has('\'none\'') && setOfMergedValues.size > MAX_SIZE_IF_NONE_IN_ARRAY) {
      setOfMergedValues.delete('\'none\'');
    }

    return setOfMergedValues;
  }

  /**
   * Merge keys that are mergeable.
   *
   * @param {JsonCspDocument} toMerge the document to merge with this one.
   * @param {string} key the key of the field to merge.
   * @param {JsonCspReport} jsonCspReport the report class to put reasons
   *                        why the CSP rules are present in
   *
   * @return {string[]} the merged field.
   */
  mergeMergeableKey(toMerge, key, jsonCspReport) {
    const mergeableKeys = JsonCspSchema.mergeableKeys;

    if (mergeableKeys.has(key)) {
      const thisValue = this.getCspArrayValueOf(key);
      const otherValue = toMerge.getCspArrayValueOf(key);

      otherValue.forEach((value) => {
        jsonCspReport.addInformation(key, value, toMerge);
      });

      const mergedValues = thisValue.concat(otherValue);
      const setOfMergedValues = new Set(mergedValues);
      const filteredSetOfMergedValues = this.filterValuesOfMergeableKey(setOfMergedValues);

      return Array.from(filteredSetOfMergedValues).sort();
    }

    throw new RulesException(`Unknown key in mergeMergeableKey: ${key}`);
  }

  /**
   * Merge keys that are at risk of conflicting.
   *
   * @param {JsonCspDocument} toMerge the document to merge with this one.
   * @param {string} key the key of the field to merge.
   * @param {JsonCspReport} jsonCspReport the report class to put reasons
   *                        why the CSP rules are present in
   *
   * @return {string[]} the merged field.
   *
   * @throws {RulesException} the key was not a valid conflicting key
   */
  mergeConflictingKey(toMerge, key, jsonCspReport) {
    const conflictingKeys = JsonCspSchema.conflictingKeys;

    if (conflictingKeys.has(key)) {
      const thisValue = this.getCspArrayValueOf(key);
      const otherValue = toMerge.getCspArrayValueOf(key);
      let mergedValues;

      if (thisValue.length && otherValue.length && Utils.arraysAreNotEqual(thisValue, otherValue)) {
        otherValue.forEach((value) => {
          jsonCspReport.addError(key, value, toMerge);
        });

        mergedValues = thisValue;
      } else {
        mergedValues = thisValue.concat(otherValue);
      }

      const setOfMergedValues = new Set(mergedValues);

      return Array.from(setOfMergedValues).sort();
    }

    throw new RulesException(`Unknown key in mergeConflictingKey: ${key}`);
  }

  /**
   * Merge another JsonCspDocument with this one.
   *
   * @param {JsonCspDocument} mergeIn the document to merge in.
   * @param {JsonCspReport} jsonCspReport the report class to put reasons
   *                        why the CSP rules are present in
   *
   * @return {JsonCspDocument} the merged document.
   */
  mergeWith(mergeIn, jsonCspReport) {
    if (!(mergeIn instanceof JsonCspDocument)) {
      const mergeInType = typeof mergeIn;

      throw new TypeException(`expected a JsonCspDocument.  Got: ${mergeInType}`);
    }

    if (!mergeIn.isValid) {
      throw new RulesException('The document to merge in is not valid');
    }

    if (!this.isValid) {
      throw new RulesException('The document to merge with is not valid');
    }

    const newCspObject = {};

    JsonCspSchema.mergeableKeys.forEach((value, key) => {
      const mergedValues = this.mergeMergeableKey(mergeIn, key, jsonCspReport);

      if (Array.isArray(mergedValues) && mergedValues.length) {
        newCspObject[key] = mergedValues;
      }
    });

    JsonCspSchema.conflictingKeys.forEach((value, key) => {
      const mergedValues = this.mergeConflictingKey(mergeIn, key, jsonCspReport);

      if (Array.isArray(value) && value.length) {
        newCspObject[key] = mergedValues;
      }
    });

    return new JsonCspDocument(newCspObject);
  }

  /**
   * Determine if this JSON CSP document has a particular rule with
   * value(s) present in it.
   *
   * @param {string} ruleName the name of the CSP rule to check for
   * @param {string|string[]} candidate the value, or array of values,
   *                          of the CSP rule to check for.  If an array,
   *                          then all values must be present.
   *
   * @return {boolean} true if the ruleName and candidate are present
   *                   in this document.
   */
  has(ruleName, candidate) {
    let candidateValues = candidate;

    if (!Array.isArray(candidate)) {
      candidateValues = [candidate];
    }

    const existingRuleNames = Object.keys(this.cspRules);
    const existingRuleNamesSet = new Set(existingRuleNames);

    if (existingRuleNamesSet.has(ruleName)) {
      const ruleValues = this.cspRules[ruleName];
      const ruleValuesSet = new Set(ruleValues);

      for (const candidateValue of candidateValues) {
        if (!ruleValuesSet.has(candidateValue)) {
          return false;
        }
      }

      return true;
    }

    return false;
  }

  /**
   * Return the CSP rules as a string suitable for an HTTP CSP response header
   *
   * @return {string} the CSP rules suitable for an HTTP CSP response header
   */
  toCsp() {
    const existingRuleNames = Object.keys(this.cspRules);
    const orderedRuleNames = existingRuleNames.sort();
    const cspStrings = [];

    for (const ruleName of orderedRuleNames) {
      const ruleValues = this.cspRules[ruleName];
      const orderedRuleValues = ruleValues.sort();
      const orderedRuleValuesString = orderedRuleValues.join(' ');

      const cspString = `${ruleName}: ${orderedRuleValuesString};`;

      cspStrings.push(cspString);
    }

    return cspStrings.join(' ');
  }
}

export default JsonCspDocument;
