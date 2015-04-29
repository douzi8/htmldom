var HtmlDom = require('../../htmldom');
var assert = require('assert');

describe('eq', function() {
  var html = new HtmlDom('<table><tr data-id="1"><th class="item1"><th class="item2"><tr data-id="2"><td><td>');
  var $ = html.$;

  it('positive number', function() {
    var tr = $('tr');

    assert.equal(tr.eq(0).attr('data-id'), '1');
    assert.equal(tr.eq(1).attr('data-id'), '2');
  });

  it('negative number', function() {
    var th = $('th');

    assert.equal(th.eq(-1).hasClass('item2'), true);
    assert.equal(th.eq(-1).hasClass('item1'), false);
  });
});