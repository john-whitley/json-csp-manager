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
      oneOf: [
        {
          type: 'array',
          items: { enum: ['\'none\''] },
          additionalItems: false
        },
        {
          type: 'array',
          items: {
	    anyOf: [
	      {type: 'string', enum: ['\'data\'', '\'self\'']},
	      {type: 'string', format: 'hostname'},
	      {type: 'string', format: 'uri'}
	    ]
          },
          additionalItems: false
        }
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
      id: 'http://jsoncsp',
      description: 'Definition of a valid JSON-CSP document',
      type: 'object',
      properties: {
        'base-uri': {type: 'string', format: 'uri'},
        'child-src': JsonCsp.schemaForSrc,
        'connect-src': JsonCsp.schemaForSrc,
        'default-src': JsonCsp.schemaForSrc,
        'font-src': JsonCsp.schemaForSrc,
        'form-action': JsonCsp.schemaForSrc,
        'frame-ancestors': JsonCsp.schemaForSrc,
        'frame-src': JsonCsp.schemaForSrc,
        'img-src': JsonCsp.schemaForSrc,
        'media-src': JsonCsp.schemaForSrc,
        'object-src': JsonCsp.schemaForSrc,
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
        'script-src': JsonCsp.schemaForSrc,
        'style-src': JsonCsp.schemaForSrc,
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
