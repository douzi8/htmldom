var REG = require('../../lib/reg');
var assert = require('assert');

describe('Reg', function() {
  it('DOCTYPE', function() {
    // html 4.01 Strict
    // Strict
    assert('<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01//EN" "http://www.w3.org/TR/html4/strict.dtd">'.match(REG.DOCTYPE));
    // Transitional
    assert('<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">'.match(REG.DOCTYPE));
    // XHTML 1.0
    assert('<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">'.match(REG.DOCTYPE));
    // html5
    assert('<!DOCTYPE HTML>'.match(REG.DOCTYPE));
  });

  it('COMMENT_START', function() {
    assert('<!--'.match(REG.COMMENT_START));
  });

  it('COMMENT_END', function() {
    assert.equal('1-->'.match(REG.COMMENT_END)[0], '1-->');
    assert('-->'.match(REG.COMMENT_END));
  });

  it('RAW_TAG', function() {
    assert.equal('<script>'.match(REG.RAW_TAG)[1], 'script');
    assert.equal('<style>'.match(REG.RAW_TAG)[1], 'style');
    assert.equal('<textarea>'.match(REG.RAW_TAG)[1], 'textarea');
    assert.equal('<div>'.match(REG.RAW_TAG), undefined);
  });

  it('RAW_TAG_END', function() {
    assert.equal('</script>'.match(REG.RAW_TAG_END('script'))[0], '');
    assert.equal('1</script>'.match(REG.RAW_TAG_END('script'))[0], '1');
    assert.equal('1</style>'.match(REG.RAW_TAG_END('style'))[0], '1');
    assert.equal('1</textarea>'.match(REG.RAW_TAG_END('textarea'))[0], '1');
  });

  it('OPEN_TAG', function() {
    var match = '<div id="">'.match(REG.OPEN_TAG);

    assert.equal(match[0], '<div');
    assert.equal(match[1], 'div');
  });

  it('TAG_CONTENT', function() {
    var str = 'id="1" 中文="{k: \'v\'}", key=\'\'';
    var match = str.match(REG.TAG_CONTENT);

    assert.equal(match[0], str);
  });

  it('ATTR', function() {
    var str = 'id="1" id="2" checked 中文="{k: \'v\'}"key=\'""\' disable';
    var attrs = {};

    str.replace(REG.ATTR, function(match, key, value) {
      if (!attrs.hasOwnProperty(key)) {
        value = value ? value.replace(REG.TRIM_QUOTES, '').replace(REG.DOUBLE_QUOTES, "'") : '';
        attrs[key] = value;
      }
    });

    assert.deepEqual(attrs, {
      id: '1',
      checked: '',
      '中文': "{k: 'v'}",
      key: "''",
      disable: ''
    });
  });

  it('CLOSE_TAG', function() {
    assert('</div>'.match(REG.CLOSE_TAG));
    assert('</A >'.match(REG.CLOSE_TAG));
  });
});