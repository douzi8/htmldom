var assert = require('assert');
var HtmlDom = require('../../htmldom');
var util = require('utils-extend');

describe('optional', function() {
  it('html head body', function() {
    var time1 = util.hrtime();
    var html = new HtmlDom('<html><head><body><div>');
    var time2 = util.hrtime();
    assert.equal(html.stringify(), '<html><head></head><body><div></div></body></html>');
  });

  it('ul li', function() {
    var html = new HtmlDom('<ul><li><div></div><div><li><div>');
    assert.equal(html.stringify(),'<ul><li><div></div><div></div></li><li><div></div></li></ul>');

    html = new HtmlDom('<li><div><ul><li><div><li></ul><li>');
    assert.equal(html.html(), '<li><div><ul><li><div></div></li><li></li></ul></div></li><li></li>');

    html = new HtmlDom('<li><div><ul><li><div></div></li><li></li></ul><li>');
    assert.equal(html.html(), '<li><div><ul><li><div></div></li><li></li></ul></div></li><li></li>');

    html = new HtmlDom('<ul><li><ul><li></li><div><li></li></div></ul></li></ul>');

    assert.equal(html.html(), '<ul><li><ul><li></li><div><li></li></div></ul></li></ul>');
  });

  it('dl dt dd', function() {
    var html = new HtmlDom('<dl><dt><dd><div><div><dt><dd><div></div><div></dl>');

    assert.equal(html.stringify(), '<dl><dt></dt><dd><div><div></div></div></dd><dt></dt><dd><div></div><div></div></dd></dl>');
  });

  it('p', function() {
    var html = new HtmlDom('<p><div><p><a><p></h3>');

    assert.equal(html.stringify(), '<p></p><div><p><a></a></p><p></p></div>');
  });

  it('div', function() {
    var html = new HtmlDom('<div><h3><div><div><ul><li></li>');

    assert.equal(html.stringify(), '<div><h3><div><div><ul><li></li></ul></div></div></h3></div>');
  });

  it('option', function() {
    var html = new HtmlDom('<select><option><option>');

    assert.equal(html.stringify(), '<select><option></option><option></option></select>');
  });

  it('table', function() {
    var html = new HtmlDom('<table><thead><tr><tr><tbody><tr><th><th><tr>');

    assert.equal(html.stringify(), '<table><thead><tr></tr><tr></tr></thead><tbody><tr><th></th><th></th></tr><tr></tr></tbody></table>');

    html = new HtmlDom('<table><tbody><tr><th><div><table><caption><tbody><tr><th><th><tr><td><td><tr><td><div></div></table></div><th><tr></table>');

    assert.equal(html.stringify(), '<table><tbody><tr><th><div><table><caption></caption><tbody><tr><th></th><th></th></tr><tr><td></td><td></td></tr><tr><td><div></div></td></tr></tbody></table></div></th><th></th></tr><tr></tr></tbody></table>');
  });
});