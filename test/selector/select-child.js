var HtmlDom = require('../../htmldom');
var assert = require('assert');


describe('find child', function() {
  it('two depth', function() {
    var html = new HtmlDom('<div><ul><li></ul><ul>')

    assert.equal(html.$('div ul').length, 2);
  });

  it('more', function() {
    var html = new HtmlDom('<div><ul><li class="item"><li class="item"><li class="item"></ul></div><ul><li class="item">')

    assert.equal(html.$('div ul li.item').length, 3);
  });
});