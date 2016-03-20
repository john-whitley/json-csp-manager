class JsonCsp {

  static get schemaForSrc() {
    return {
      anyOf: [
        {type: 'string', enum: ['\'data\'', '\'none\'', '\'self\'']},
        {type: 'string', format: 'hostname'},
        {type: 'string', format: 'uri'}
      ]
    };
  }

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

  static toJson() {
    return JSON.stringify(JsonCsp.schema);
  }
}

export default JsonCsp;
