var fs = require('fs');
var path = require('path');
var HtmlDom = require('../../htmldom');
var assert = require('assert');

function readFileSync(filepath) {
  return fs.readFileSync(path.join(__dirname, filepath), { encoding: 'utf8' });
}

describe('selecor', function() {
  var htmlcode = readFileSync('../html/selector.html');
  var html = new HtmlDom(htmlcode);
  var $ = html.$;

  it('none', function() {
    assert.equal($('table').length, 0);
  });

  it('tag', function() {
    assert.equal($('div').length, 1);
    assert.equal($('DIV').length, 1);
    assert.equal($('li').length, 2);
  });

  it('class', function() {
    assert.equal($('.cls1').length, 2);
    assert.equal($('.item.item2').length, 2);
    assert.equal($('.item.item3').length, 1);
    assert.equal($('.class-test').length, 1);
  });

  it('id', function() {
    assert.equal($('#id').length, 1);
    assert.equal($('#id-test').length, 1);
  });

  it('attributes', function() {
    assert.equal($('[title="list item1"]').length, 1);
  });

  it('^attributes', function() {
    assert.equal($('[class^=c]').length, 3);
  });

  it('$attributes', function() {
    assert.equal($('[class$=item3]').length, 1);
  });

  it('~attributes', function() {
    assert.equal($('[data-title~=come]').length, 1);
    assert.equal($('[class~=item2]').length, 2);
  });

  it('*attributes', function() {
    assert.equal($('[data-title*=come]').length, 2);
  });

  it('mixture', function() {
    assert.equal($('li.item2').length, 2);
    assert.equal($('div#id.cls1.cls2').length, 1);
    assert.equal($('ul[class="cls1"]').length, 1);
  });

  it('class', function() {
    var html = new HtmlDom('<div class="ab">');
    var $ = html.$;

    assert.equal($('.a').length, 0);
    assert.equal($('.b').length, 0);
    assert.equal($('.ab').length, 1);
  });

  it('element > element', function() {
    var html = new HtmlDom('<div><p value="1"><a><p value="2"></div><ul><li><ul><li>');
    var $ = html.$;

    assert.equal($('div > p').length, 2);
    assert.equal($('[value=1] > a').length, 1);
    assert.equal($('div > p > a').length, 1);
    assert.equal($('.cls > p > a').length, 0);
    assert.equal($('ul>li').length, 2);
  });

  it('element + element', function() {
    var html = new HtmlDom('<div class="cls"></div><p value="1"><p value="2"><h3></h3><p value="4">');
    var $ = html.$;

    assert.equal($('div + p').length, 1);
    assert.equal($('.cls + p + p').length, 1);
    assert.equal($('.cls + p + p').attr('value'), '2');
    assert.equal($('h3 + p').length, 1);

    var html2 = new HtmlDom('<div></div><!-- commnet -->text<div>');

    assert.equal(html2.$('div + div').length, 1);
  });

  it('element ~ element', function() {
    var html = new HtmlDom('<div class="cls"></div><p value="1"><p value="2"><h3></h3><p value="4">');
    var $ = html.$;

    assert.equal($('div ~ p').length, 3);
    assert.equal($('.cls ~ p ~ p').length, 2);
    assert.equal($('.cls ~ p ~ p').attr('value'), '2');
    assert.equal($('h3 ~ p').length, 1);
  });

  it('*', function() {
    var html = new HtmlDom('<div><h2><p></h2><h3><p></h3></div>');
    var $ = html.$;

    assert.equal($('*').length, 5);
    assert.equal($('div *').length, 4);
    assert.equal($('div * > p').length, 2);
  });
});