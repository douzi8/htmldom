var HtmlDom = require('../../htmldom');
var assert = require('assert');

describe('prepend', function() {
  it('null', function() {
    var html = new HtmlDom('<div>');
    var $ = html.$;

    $('div').prepend();
    assert.equal($('div').html(), '');
  });

  it('txt', function() {
    var html = new HtmlDom('<div>2');
    var $ = html.$;

    $('div').prepend('1');
    assert.equal($('div').html(), '12');
  });

  it('html', function() {
    var html = new HtmlDom('<div><a></a></div><div><a></a></div>');
    var $ = html.$;

    $('div').prepend('<h3>title');
    assert.equal($('h3 + a').length, 2);
    assert.equal($('div').html(), '<h3>title</h3><a></a>');
  });
});