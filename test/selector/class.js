var fs = require('fs');
var path = require('path');
var HtmlDom = require('../../htmldom');
var assert = require('assert');

describe('class', function() {
  var html = new HtmlDom('<div class="demo1 demo2"><div class="demo2 demo3"><div>');
  var $ = html.$;

  it('hasClass', function() {
    var div = $('div');

    assert.equal(div.hasClass(), false);
    assert.equal(div.hasClass('demo1'), true);
    assert.equal(div.hasClass('demo4'), false);
    assert.equal(div.hasClass('demo1 demo2'), true);
    assert.equal(div.hasClass('demo2 demo3'), true);
    assert.equal(div.hasClass('demo2 demo4'), false);
  });

  it('addClass', function() {
    var div = $('div');

    div.addClass('demo4');
    assert.equal(div.hasClass('demo4'), true);
    assert.equal(div[2].attributes.class, 'demo4');
    div.addClass('demo5 demo6');
    assert.equal(div[2].attributes.class, 'demo4 demo5 demo6');
    div.addClass('demo4');
    assert.equal(div[2].attributes.class, 'demo4 demo5 demo6');
  });

  it('removeClass', function() {
    var div = $('div');

    div.removeClass();
    div.each(function(index, item) {
      assert.equal(item.attributes.class, undefined);
    });
    div.addClass('demo1 demo2 demo3');
    div.removeClass('demo1');
    assert.equal(div.hasClass('demo1'), false);
    div.removeClass('demo2 demo3').removeClass('demo4');
    div.each(function(index, item) {
      assert.equal(item.attributes.class, undefined);
    });
  });
});