var fs = require('fs');
var path = require('path');
var HtmlDom = require('../../htmldom');
var assert = require('assert');

describe('found', function() {
  var html = new HtmlDom('<div><h3><a class="link"></a></h3></div><div><h3>1</h3></div>');
  var $ = html.$;

  it('tag', function() {
    assert.equal($('div').find('h3').length, 2);
    assert.equal($('div').find('h3').html(), '<a class="link"></a>');
    assert.equal($('div').find('a').length, 1);
  });

  it('class', function() {
    assert.equal($('div .link').length, 1);
    $('div h3').html('').addClass('title');
    assert.equal(html.html(), '<div><h3 class="title"></h3></div><div><h3 class="title"></h3></div>');
  });

  it('child unique', function() {
    var html = new HtmlDom('<ul><li><ul><li></ul><li><ul><li></ul></ul><ul><li></ul>');
    var $ = html.$;

    assert.equal($('ul').length, 4);
    assert.equal($('ul').find('li').length, 5);
    assert.equal($('ul').find('ul > li').length, 2);
  });

  it('filter parent', function() {
    var html = new HtmlDom('<div><div><div>');
    var $ = html.$;

    assert.equal($('div').length, 3);
    assert.equal($('div').find('div').length, 2);
    assert.equal($('div').find('div div').length, 1);
    assert.equal($('div').find('div').find('div').length, 1);
  });

  it('filter child', function() {
    var html = new HtmlDom('<div><div><a></div></div><div><a>');
    var $ = html.$;

    assert.equal($('a').length, 2);
    $('div').find('div').append('<a>').append('<a>');
    assert.equal($('div').find('div > a').length, 3);
  });

  it('child', function() {
    var html = new HtmlDom('<div><div><div><a></div></div><a></a></div>');
    var $ = html.$;

    assert.equal($('div').find('div + a').length, 1);
    assert.equal($('div').find('div div a').length, 1);
    assert.equal($('div').find('div div div a').length, 0);
  });

  it('multiple parent', function() {
    var html = new HtmlDom('<div><ul><li><li></div><div><ul><li><li>');
    var $ = html.$;

    assert.equal($('div').find('li').length, 4);
    assert.equal($('div').find('ul li').length, 4);
    assert.equal($('div').find('ul li + li').length, 2);
  });
});