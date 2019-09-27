let assert = require('assert')
let createHtmlDom = require('../../../htmldom')


describe('parent', function() {
  it('parent()', function() {
    let $ = createHtmlDom(`
      <div><a id="1"></a><a id="2"></a></div>
      <a id="3"></a>
    `)

    assert.equal($('a').parent().length, 1)
    assert.equal($('a').parent()[0].name, 'div')
  })

  it(`parent('.cls')`, function() {
    let $ = createHtmlDom(`
      <div>
        <div><a id="1"></a><a id="2"></a></div>
        <div class="head"><a id="3"></a></div>
      </div>
    `)

    assert.equal($('a').parent('.head').length, 1)
    assert.equal($('a').parent('div').length, 2)
    assert.equal($('a').parent('').length, 0)
  })

  it('return check', function() {
    let $ = createHtmlDom(`<div><div><a></a></div></div>`)

    $('a').parent().remove()

    assert.equal($.html(), '<div></div>')
  })
})