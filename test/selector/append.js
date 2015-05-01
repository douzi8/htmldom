var HtmlDom = require('../../htmldom');
var assert = require('assert');

describe('append', function() {
  it('null', function() {
    var html = new HtmlDom('<div>');
    var $ = html.$;

    $('div').append();
    assert.equal($('div').html(), '');
  });

  it('txt', function() {
    var html = new HtmlDom('<div>');
    var $ = html.$;

    $('div').append('1');
    assert.equal($('div').html(), '1');
  });

  it('html', function() {
    var html = new HtmlDom('<div></div><div></div>');
    var $ = html.$;

    $('div').append('<h3>title');
    assert.equal($('div > h3').length, 2);
  });
});