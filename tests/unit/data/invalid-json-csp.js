var InvalidJsonCsp = function () { };

InvalidJsonCsp.prototype.examples = function() {
  return [
    {
      example: '{"default-src": ["\'broken\'", "domain.com"], "script-src": ["\'none\'"]}',
      title: 'Invalid constant in default-src'
    },
    {
      example: '{"default-src": ["\'broken\'", "domain com"], "script-src": ["\'none\'"]}',
      title: 'Invalid hostname in default-src'
    },
    {
      example: '{"default-src": ["\'self\'", "domain.com"], "script-src": ["\'broken\'"]}',
      title: 'Invalid constant in script-src'
    },
    {
      example: '{"default-src": ["\'self\'", "\'none\'"]}',
      title: 'Invalid none and self in script-src'
    },
  ];
};

InvalidJsonCsp.prototype.exampleStrings = function() {
  var examples = this.examples();
  var exampleStrings = [];

  examples.forEach(function(example) {
    exampleStrings.push(example.example);
  });

  return exampleStrings;
};

exports.default = InvalidJsonCsp;
