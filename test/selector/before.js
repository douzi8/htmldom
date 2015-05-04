var HtmlDom = require('../../htmldom');
var assert = require('assert');

describe('before', function() {
  it('null', function() {
    var html = new HtmlDom('<div>');
    var $ = html.$;

    $('table').before('1');
    assert.equal($('table').length, 0);
  });

  it('txt', function() {
    var html = new HtmlDom('<div>');
    var $ = html.$;

    $('div').before('1');
    assert.equal(html.html(), '1<div></div>');
  });

  it('html', function() {
    var html = new HtmlDom('<ul><li key="1"><li key="2">');
    var $ = html.$;

    $('li[key=2]').before('<li key="3"><li key="4"><li key="5">');


    assert.equal($('ul li').length, 5);
    assert.equal($('ul li').eq(1).attr('key'), 3);
    assert.equal($('ul li')[1].parent, $('ul')[0]);
  });
});