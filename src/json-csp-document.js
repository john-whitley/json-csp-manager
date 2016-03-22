import TypeException from './exceptions/json-csp-document-type-exception';
import RulesException from './exceptions/json-csp-document-rules-exception';
import Validator from 'jsonschema';
import JsonCspSchema from './json-schema/json-csp';

/**
 * Represents a JSON CSP document.  There will be a number of
 * documents that make up a CSP policy.  This fragmentation allows for
 * management-as-you-want-to with different files in your projects;
 * and/or the ability to include rules from other project(s).
 */
class JsonCspDocument {

  /**
   * Take the JSON CSP candidate and build a class around it to ensure that we can use it to take meaning from it.
   *
   * @param {string|object} cspRules the JSON CSP details
   *
   * @throws {JsonCspDocumentRulesException} the constructor can cope with
   *                                         the type you passed in,
   *                                         but there is something
   *                                         wrong with the data.
   * @throws {JsonCspDocumentTypeException} the constructor cannot
   *                                        cope with the type you
   *                                        passed in.
   */
  constructor(cspRules) {
    /**
     * @property {object} cspRules the validated JSON CSP rules in an
     *                             object for this class to use.
     */
    this.cspRules = null;

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
}

export default JsonCspDocument;
