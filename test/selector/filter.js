var HtmlDom = require('../../htmldom');
var assert = require('assert');

describe('filter', function() {
  var html = new HtmlDom('<ul><li data-id="1"><li data-id="2">');
  var $ = html.$;

  it('string', function() {
    assert.equal($('li').filter('[data-id]').length, 2);
    assert.equal($('li').filter('[data-id=1]').length, 1);
  });

  it('function', function() {
    var filter1 = $('li').filter(function(index) {
      if ($(this[index]).attr('data-id') == 1) {
        return true;
      } else {
        return false;
      }
    });

    assert.equal(filter1.length, 1);
    assert.equal(filter1.attr('data-id'), 1);
  });
});
