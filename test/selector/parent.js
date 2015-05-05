var HtmlDom = require('../../htmldom');
var assert = require('assert');

describe('parent', function() {
  it('null', function() {
    var html = new HtmlDom('<div>');
    var $ = html.$;
    var parent = $('div').parent();

    assert.equal(parent.length, 1);
    assert.equal(parent.parent().length, 0);
  });

  it('parent()', function() {
    var html = new HtmlDom('<div><a></div><div><a>');
    var $ = html.$;
    var parent = $('a').parent();

    assert.equal(parent.length, 2);
  });

  it('parent(selector)', function() {
    var html = new HtmlDom('<div><a></div><div class="cls"><a>');
    var $ = html.$;
    var parent = $('a').parent('.cls');

    assert.equal(parent.length, 1);
  });
});