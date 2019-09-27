let assert = require('assert')
let createHtmlDom = require('../../../htmldom')


describe('before', function () {
  it(`before('<a></a>')`, function() {
    let $ = createHtmlDom('<ul class="title"><li>2</li></ul>')

    $('li').before('<li><span>1</span><li>')

    assert.equal($('ul > li').length, 3)
    assert.equal($('ul > li').html(), '<span>1</span>')
  })

  it(`multiple before`, function () {
    let $ = createHtmlDom('<ul class="title"><li></li></ul><ul></ul><div></div>')

    $('.title > li').before('<div>1</div>')

    assert.equal($('div').length, 2)
    assert.equal($('.title div')[0].parent === $('.title')[0], true)
  })

  it('root before', function () {
    let $ = createHtmlDom('<div></div>')

    $('div').before('<p>')

    assert.equal($('p')[0].parent === null, true)
    assert.equal($('div')[0].parent === null, true)
    assert.equal($.html(), '<p></p><div></div>')
  })
})