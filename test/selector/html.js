var fs = require('fs');
var path = require('path');
var HtmlDom = require('../../htmldom');
var assert = require('assert');

describe('html', function() {
  var html = new HtmlDom('<div id="demo"><!--comment-->1</div><div>2</div>');
  var $ = html.$;

  it('none', function() {
    assert.equal($('table').html(), null);
    assert.equal($('table').html('').length, 0);
  });

  it('get', function() {
    assert.equal($('div').html(), '<!--comment-->1');
  });

  it('set', function() {
    $('div').html('txt');

    assert.equal(html.dom.children[0].children[0].parent, $('div')[0]);
    assert.equal(html.dom.children[1].children[0].parent, $('div')[1]);
    assert.equal(html.html(), '<div id="demo">txt</div><div>txt</div>');
  });

  it('set parent html', function() {
    var html = new HtmlDom('<div><div></div></div>');
    var $ = html.$;

    assert.equal($('div').length, 2);
    $('div').html(1);
    
    assert.equal(html.dom.children[0].children[0].parent, $('div')[0]);
    assert.equal(html.html(), '<div>1</div>');
  });

  it('recurse', function() {
    var html = new HtmlDom('<div><div>');
    var $ = html.$;

    $('div').html('<ul><li>1<li>2');

    assert.equal(html.html(), '<div><ul><li>1</li><li>2</li></ul></div>');
  });

  it('selfClosed', () => {
    var html = new HtmlDom(`<meta><div><input value="3"></div>`);

      assert.equal(html.html({
        selfClosed: true
      }), '<meta/><div><input value="3"/></div>')
  })
});