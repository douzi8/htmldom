var path = require('path');
var HtmlDom = require('../../htmldom');
var assert = require('assert');

describe('style', function() {
  var html = new HtmlDom('<h1 style="height: 200px">');
  var $ = html.$;
  var h1 = $('h1');

  it('get', function() {
    assert.equal(h1.css('height'), '200px');
    assert.equal(h1.css('width'), undefined);
  });

  it('set', function() {
    assert.equal(h1.css('height', '100px').css('height'), '100px');
    assert.equal(h1.css('width', '150px').css('width'), '150px');
  });

  it('remove', function() {
    assert.equal(h1.css('width'), '150px');
    h1.css('width', '');
    h1.css('height', null);
    h1.css('color', '');
    assert.equal(h1.css('height'), undefined);
    assert.equal(h1.css('width'), '');
  });

  it('multiple', function() {
    h1[0].attributes.style = '';

    h1.css('width', 200);
    h1.css({
      width: '',
      height: 200
    });

    assert.equal(h1.css('width'), '');
    assert.equal(h1.css('height'), 200);
  })
});