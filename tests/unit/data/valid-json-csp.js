var ValidJsonCsp = function () { };

ValidJsonCsp.prototype.examples = function() {
  return [
    {
      example: '{"default-src": ["\'self\'", "domain.com"], "script-src": ["\'self\'"]}',
      title: 'Taken straight from https://gist.github.com/jonathanKingston/5699b440f608960dc089'
    },
  ];
};

ValidJsonCsp.prototype.exampleStrings = function() {
  var examples = this.examples();
  var exampleStrings = [];

  examples.forEach(function(example) {
    exampleStrings.push(example.example);
  });

  return exampleStrings;
};

exports.default = ValidJsonCsp;
