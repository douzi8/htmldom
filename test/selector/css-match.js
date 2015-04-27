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
    assert.equal($('li').length, 2);
  });

  it('class', function() {
    assert.equal($('.cls1').length, 2);
    assert.equal($('.item.item2').length, 2);
    assert.equal($('.item.item3').length, 1);
  });

  it('id', function() {
    assert.equal($('#id').length, 1);
  });

  it('attributes', function() {
    assert.equal($('[title="list item1"]').length, 1);
  });

  it('^attributes', function() {
    assert.equal($('[class^=c]').length, 2);
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
});