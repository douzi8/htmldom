var Parser = require('../../lib/parser');
var assert = require('assert');

describe('Parser dom', function() {
  it('multiple parent', function() {
    var parser = new Parser([
      { type: 'text', value: 'text' },
      { type: 'comment', value: 'comemnt' },
      { type: 'opentag', name: 'div' }
    ]);

    assert.equal(parser.dom.children[0].type, 'text');
    assert.equal(parser.dom.children[1].type, 'comment');
    assert.equal(parser.dom.children[2].type, 'tag');
  });

  it('ul li', function() {
    var parser = new Parser([
      { type: 'opentag', name: 'ul' },
      { type: 'opentag', name: 'li' },
      { type: 'opentag', name: 'div' },
      { type: 'closetag', name: 'li' },
      { type: 'closetag', name: 'ul' }
    ]);

    assert.equal(parser.dom.children[0].children[0].children[0].name, 'div');
  });

  it('Void elements', function() {
    var parser = new Parser([
      { type: 'voidtag', name: 'img' },
      { type: 'voidtag', name: 'input' },
      { type: 'opentag', name: 'h3' }
    ]);

    assert.equal(parser.dom.children[0].name, 'img');
    assert.equal(parser.dom.children[1].name, 'input');
    assert.equal(parser.dom.children[2].name, 'h3');
  });
});