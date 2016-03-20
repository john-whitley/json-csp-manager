import TypeException from './exceptions/json-csp-document-type-exception';
import RulesException from './exceptions/json-csp-document-rules-exception';
import Validator from 'jsonschema';
import JsonCspSchema from './json-schema/json-csp';

class JsonCspDocument {

  constructor(cspRules) {
    const cspRulesType = typeof cspRules;

    if (cspRulesType === 'string') {
      try {
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

  get jsonCspSchema() {
    return JsonCspSchema.schema;
  }

  get jsonSchemaValidator() {
    const validator = new Validator.Validator();

    validator.addSchema(this.jsonCspSchema);

    return validator;
  }

  validate() {
    const validator = this.jsonSchemaValidator;

    return validator.validate(this.cspRules, JsonCspSchema.schema.id);
  }

  isValid() {
    const validation = this.validate();

    return validation.valid;
  }
}

export default JsonCspDocument;
