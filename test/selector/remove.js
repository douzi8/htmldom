var HtmlDom = require('../../htmldom');
var assert = require('assert');

describe('remove', function() {
  it('root element', function() {
    var html = new HtmlDom('<div><ul><li></div><ul>');
    var $ = html.$;

    $('div').remove();
    assert.equal(html.html(), '<ul></ul>');
  });

  it('child element', function() {
    var html = new HtmlDom('<div><ul><li></div><ul>');
    var $ = html.$;

    $('div ul').remove();
    assert.equal(html.html(), '<div></div><ul></ul>');
  });

  it('child element', function() {
    var html = new HtmlDom('<div><ul><li><div><ul></div></div></div><ul>');
    var $ = html.$;

    assert.equal($('div ul').length, 2);
    $('div ul').remove();
    assert.equal(html.html(), '<div></div><ul></ul>');
  });
});
