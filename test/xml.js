var assert = require('assert');
var HtmlDom = require('../../htmldom');

describe('xml', function() {
  it('doc', function() {
    var html = new HtmlDom('<?xml version="1.0" encoding="utf-8" ?><tag><item>1</item></tag>');
    var $ = html.$;

    assert.equal($('tag item').html(), 1);
    assert.equal($('TAG item').html(), 1);
    $('tag item').html(2);
    assert.equal(html.html(), '<?xml version="1.0" encoding="utf-8" ?><tag><item>2</item></tag>');
  });
});