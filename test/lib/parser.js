var Parser = require('../../lib/parser');
var assert = require('assert');

describe('Parser dom', function() {
  it('multiple parent', function() {
    var parser = new Parser([
      { type: 'text', value: 'text' },
      { type: 'comment', value: 'comemnt' },
      { type: 'opentag', name: 'div' }
    ]);

    assert.deepEqual(parser.result, [
      { type: 'text', value: 'text', parent: null },
      { type: 'comment', value: 'comemnt', parent: null },
      { type: 'tag', name: 'div', children: [], parent: null }
    ]);
  });

  it('ul li', function() {
    var parser = new Parser([
      { type: 'opentag', name: 'ul' },
      { type: 'opentag', name: 'li' },
      { type: 'opentag', name: 'div' },
      { type: 'closetag', name: 'li' },
      { type: 'closetag', name: 'ul' }
    ]);

    assert.equal(parser.result[0].children[0].children[0].name, 'div');
  });

  it('Void elements', function() {
    var parser = new Parser([
      { type: 'voidtag', name: 'img' },
      { type: 'voidtag', name: 'input' },
      { type: 'opentag', name: 'h3' }
    ]);

    assert.deepEqual(parser.result, [
      { type: 'tag', name: 'img', children: [], parent: null },
      { type: 'tag', name: 'input', children: [], parent: null },
      { type: 'tag', name: 'h3', children: [], parent: null }
    ]);
  });
});