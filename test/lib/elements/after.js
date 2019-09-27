let assert = require('assert')
let createHtmlDom = require('../../../htmldom')

describe('after', function () {
  it(`after('<a></a>')`, function() {
    let $ = createHtmlDom('<ul class="title"><li>2</li></ul>')

    $('li').after('<li><span>1</span><li>')

    assert.equal($('ul > li').length, 3)
    assert.equal($('ul > li').html(), '2')
  })

  it(`multiple after`, function () {
    let $ = createHtmlDom('<ul class="title"><li>1</li></ul><ul></ul><div></div>')

    $('.title > li').after('<li>2</li>')

    assert.equal($('li').html(), '1')
    assert.equal($('.title li')[1].parent === $('.title')[0], true)
  })

  it('root after', function () {
    let $ = createHtmlDom('<div></div>')

    $('div').after('<p>')

    assert.equal($('p')[0].parent === null, true)
    assert.equal($('div')[0].parent === null, true)
    assert.equal($.html(), '<div></div><p></p>')
  })
})