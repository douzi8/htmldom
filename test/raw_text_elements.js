var assert = require('assert');
var HtmlDom = require('../../htmldom');

describe('optional', function() {
  it('textarea', function() {
    var html = new HtmlDom('<textarea><div><h3></textarea>');

    assert.equal(html.stringify(), '<textarea><div><h3></textarea>');
  });

  it('style', function() {
    var html = new HtmlDom('<style>.a{}</style>');

    assert.equal(html.stringify(), '<style></style>');
  });

  it('script', function() {
    var html = new HtmlDom('<script>var a = 3;</script>');

    assert.equal(html.stringify(), '<script>var a=3;</script>');
  });
});