var assert = require('assert');
var HtmlDom = require('../../htmldom');

describe('escape', function() {
  it('underscore', function() {
    var html = new HtmlDom('<div <%= id %>><%= id %></div>', [/<%([\s\S]+?)%>/g]);

    assert.equal(html.html(), '<div <%= id %>><%= id %></div>');
  });

  it('same code in attribute', function() {
    var html = new HtmlDom('<div <%= id %> <%= id %>></div>', [/<%([\s\S]+?)%>/g]);

    assert.equal(html.html(), '<div <%= id %><%= id %>></div>');
  });

  it('multiple', function() {
    var html = new HtmlDom('<div <%= a%><%= a%><%= a%>></div>', [/<%([\s\S]+?)%>/g]);

    assert.equal(html.html(), '<div <%= a%><%= a%><%= a%>></div>');
  });
});