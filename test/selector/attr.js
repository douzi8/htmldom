var HtmlDom = require('../../htmldom');
var assert = require('assert');

describe('attr', function() {
  var html = new HtmlDom('<div id="test" data-id="1">');
  var $ = html.$;

  it('none', function() {
    assert.equal($('table').attr('key'), undefined);
    assert.equal($('table').attr('key', 'value').length, 0);
  });

  it('set one', function() {
    var div = $('div').attr('id', 'id');
    assert.equal(div.attr('id'), 'id');
  });

  it('remove attr', function() {
    var div = $('div').attr('id', null);

    assert.equal(div.attr('id'), undefined);
  });

  it('multiple attr', function() {
    var div = $('div');

    div.attr({
      id: null,
      'data-id': 2,
      key: 'value'
    });

    assert.equal(div.attr('id'), null);
    assert.equal(div.attr('data-id'), '2');
    assert.equal(div.attr('key'), 'value');
  });

  it('quote value', function() {
    var html = new HtmlDom('<ul data-value="\'1\'">');

    assert.equal(html.$('ul').attr('data-value'), "'1'");
  });

  it('set number or boolean', function() {
    $('div').attr('id', 1);
    $('div').attr('value', true);
    assert.equal($('div').attr('id'), '1');
    assert.equal($('div').attr('value'), 'true');

    $('div').attr({
      value: false
    });

    assert.equal($('div').attr('value'), 'false');
  });

  /*it('lowercase', function() {
    var html = new HtmlDom('<div ID="test">');

    assert.equal(html.$('div').attr('Id'), 'test');
  });*/

  it('function', function() {
    var html = new HtmlDom('<h1 title="1">');
    var $ = html.$;

    $('h1').attr('title', function(index, oldValue) {
      assert.equal(oldValue, 1);
      return oldValue + '2';
    });

    assert.equal($('*').attr('title'), '12');
  });
});