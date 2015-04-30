var fs = require('fs');
var path = require('path');
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

    assert.deepEqual(div[0], {
      type: 'tag',
      name: 'div',
      _serverCode: {},
      attributes: {
        'data-id': '2',
        key: 'value'
      },
      children: [],
      parent: null
    });
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

  it('lowercase', function() {
    var html = new HtmlDom('<div ID="test">');

    assert.equal(html.$('div').attr('Id'), 'test');
  });
});