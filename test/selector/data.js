var HtmlDom = require('../../htmldom');
var assert = require('assert');

describe('data', function() {
  it('null', function() {
    var html = new HtmlDom('');
    var $ = html.$;

    assert.equal($('div').data('key'), null);
  });

  it('true, false or null', function() {
    var html = new HtmlDom('<div data-value="true" data-id="false" data-null="null"></div>');
    var $ = html.$;

    assert.equal($('div').data('value'), true);
    assert.equal($('div').data('id'), false);
    assert($('div').data('null') === null);
  });

  it('number', function() {
    var html = new HtmlDom('<div data-id="10"></div>');
    var $ = html.$;

    assert($('div').data('id') === 10);
  });

  it('object', function() {
    var html = new HtmlDom("<div data-id='{\"key\": [1]}'></div>");
    var $ = html.$;

    assert.deepEqual($('div').data('id'), {
      key: [1]
    });
  });

  it('array', function() {
    var html = new HtmlDom("<div data-id='[1, 2, 3]'></div>");
    var $ = html.$;

    assert.deepEqual($('div').data('id'), [1, 2, 3]);
  });

  it('string', function() {
    var html = new HtmlDom("<div data-id='title'></div>");
    var $ = html.$;

    assert($('div').data('id') === "title");
  });

  it('captial', function() {
    var html = new HtmlDom('<div data-age-name="1"></div>');
    var $ = html.$;

    assert.equal($('div').data('ageName'), 1);
    assert.equal($('div').data('age-name'), 1);
  });

  it('set', function() {
    var html = new HtmlDom('<div></div>');
    var $ = html.$;

    $('div').data('id', 5);
    assert($('div').data('id') === 5);
  });
});