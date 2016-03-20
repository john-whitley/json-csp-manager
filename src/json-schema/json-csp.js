/**
 * Provides the JSON schema for JSON CSP.
 */
class JsonCsp {

  /**
   * There are a lot of different CSP rules that act similarly, that
   * require an involved JSON schema rule.  This returns the shape
   * required for "*-src" and similar CSP rules.
   *
   * @return {object} the JSON schema shape for a CSP rule that can act
   *                  as a normal "*-src"
   */
  static get schemaForSrc() {
    return {
      anyOf: [
        {type: 'string', enum: ['\'data\'', '\'none\'', '\'self\'']},
        {type: 'string', format: 'hostname'},
        {type: 'string', format: 'uri'}
      ]
    };
  }

  /**
   * Get the object to use with jsonschema to provide JSON CSP validation.
   *
   * @return {object} the JSON schema for JSON CSP
   */
  static get schema() {
    return {
      title: 'JSON-CSP',
      id: '/jsoncsp',
      description: 'Definition of a valid JSON-CSP document',
      type: 'object',
      properties: {
        'base-uri': {type: 'string', format: 'uri'},
        'child-src': {
          type: 'array',
          items: JsonCsp.schemaForSrc
        },
        'connect-src': {
          type: 'array',
          items: JsonCsp.schemaForSrc
        },
        'default-src': {
          type: 'array',
          items: JsonCsp.schemaForSrc
        },
        'font-src': {
          type: 'array',
          items: JsonCsp.schemaForSrc
        },
        'form-action': {
          type: 'array',
          items: JsonCsp.schemaForSrc
        },
        'frame-ancestors': {
          type: 'array',
          items: JsonCsp.schemaForSrc
        },
        'frame-src': {
          type: 'array',
          items: JsonCsp.schemaForSrc
        },
        'img-src': {
          type: 'array',
          items: JsonCsp.schemaForSrc
        },
        'media-src': {
          type: 'array',
          items: JsonCsp.schemaForSrc
        },
        'object-src': {
          type: 'array',
          items: JsonCsp.schemaForSrc
        },
        'plugin-types': {
          type: 'array',
          items: {
            anyOf: [
              {type: 'string', pattern: '^[^/]+/[^/]+$'}
            ]
          }
        },
        'report-uri': {type: 'string', format: 'uri'},
        sandbox: {
          type: 'array',
          items: {
            anyOf: [
              {type: 'string', enum: ['allow-forms', 'allow-same-origin', 'allow-scripts', 'allow-top-navigation']}
            ]
          }
        },
        'script-src': {
          type: 'array',
          items: JsonCsp.schemaForSrc
        },
        'style-src': {
          type: 'array',
          items: JsonCsp.schemaForSrc
        }
      }
    };
  }

  /**
   * Get the JSON string of JSON CSP.
   *
   * @return {string} the JSON schema for JSON CSP
   */
  static toJson() {
    return JSON.stringify(JsonCsp.schema);
  }
}

export default JsonCsp;
