var HtmlDom = require('../../htmldom');
var assert = require('assert');

describe('after', function() {
  it('null', function() {
    var html = new HtmlDom('<div>');
    var $ = html.$;

    $('table').after('1');
    assert.equal($('table').length, 0);
  });

  it('txt', function() {
    var html = new HtmlDom('<div>');
    var $ = html.$;

    $('div').after('1');
    assert.equal(html.html(), '<div></div>1');
  });

  it('html', function() {
    var html = new HtmlDom('<ul><li key="1"><li key="2">');
    var $ = html.$;

    $('li[key=2]').after('<li key="3"><li key="4"><li key="5">');


    assert.equal($('ul li').length, 5);
    assert.equal($('ul li').eq(2).attr('key'), 3);
    assert.equal($('ul li')[2].parent, $('ul')[0]);
  });
});