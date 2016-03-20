class JsonCsp {

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
          items: {
            anyOf: [
              {type: 'string', enum: ['\'data\'', '\'none\'', '\'self\'']},
              {type: 'string', format: 'hostname'},
              {type: 'string', format: 'uri'}
            ]
          }
        },
        'connect-src': {
          type: 'array',
          items: {
            anyOf: [
              {type: 'string', enum: ['\'data\'', '\'none\'', '\'self\'']},
              {type: 'string', format: 'hostname'},
              {type: 'string', format: 'uri'}
            ]
          }
        },
        'default-src': {
          type: 'array',
          items: {
            anyOf: [
              {type: 'string', enum: ['\'data\'', '\'none\'', '\'self\'']},
              {type: 'string', format: 'hostname'},
              {type: 'string', format: 'uri'}
            ]
          }
        },
        'font-src': {
          type: 'array',
          items: {
            anyOf: [
              {type: 'string', enum: ['\'data\'', '\'none\'', '\'self\'']},
              {type: 'string', format: 'hostname'},
              {type: 'string', format: 'uri'}
            ]
          }
        },
        'form-action': {
          type: 'array',
          items: {
            anyOf: [
              {type: 'string', enum: ['\'data\'', '\'none\'', '\'self\'']},
              {type: 'string', format: 'hostname'},
              {type: 'string', format: 'uri'}
            ]
          }
        },
        'frame-ancestors': {
          type: 'array',
          items: {
            anyOf: [
              {type: 'string', enum: ['\'data\'', '\'none\'', '\'self\'']},
              {type: 'string', format: 'hostname'},
              {type: 'string', format: 'uri'}
            ]
          }
        },
        'frame-src': {
          type: 'array',
          items: {
            anyOf: [
              {type: 'string', enum: ['\'data\'', '\'none\'', '\'self\'']},
              {type: 'string', format: 'hostname'},
              {type: 'string', format: 'uri'}
            ]
          }
        },
        'img-src': {
          type: 'array',
          items: {
            anyOf: [
              {type: 'string', enum: ['\'data\'', '\'none\'', '\'self\'']},
              {type: 'string', format: 'hostname'},
              {type: 'string', format: 'uri'}
            ]
          }
        },
        'media-src': {
          type: 'array',
          items: {
            anyOf: [
              {type: 'string', enum: ['\'data\'', '\'none\'', '\'self\'']},
              {type: 'string', format: 'hostname'},
              {type: 'string', format: 'uri'}
            ]
          }
        },
        'object-src': {
          type: 'array',
          items: {
            anyOf: [
              {type: 'string', enum: ['\'data\'', '\'none\'', '\'self\'']},
              {type: 'string', format: 'hostname'},
              {type: 'string', format: 'uri'}
            ]
          }
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
          items: {
            anyOf: [
              {type: 'string', enum: ['\'data\'', '\'none\'', '\'self\'']},
              {type: 'string', format: 'hostname'},
              {type: 'string', format: 'uri'}
            ]
          }
        },
        'style-src': {
          type: 'array',
          items: {
            anyOf: [
              {type: 'string', enum: ['\'data\'', '\'none\'', '\'self\'']},
              {type: 'string', format: 'hostname'},
              {type: 'string', format: 'uri'}
            ]
          }
        }
      }
    };
  }

  static toJson() {
    return JSON.stringify(JsonCsp.schema);
  }
}

export default JsonCsp;
