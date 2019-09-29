let assert = require('assert')
let createHtmlDom = require('../../../htmldom')


describe('replaceWith', function () {
  it(`replaceWith('<a></a>')`, function() {
    let $ = createHtmlDom('<div><li class="title">1<li>2</div>')

    $('.title').replaceWith('<view></view>')

    assert.equal($('.title').length, 0)
    assert.equal($('li').html(), '2')
    assert.equal($('view')[0].parent === $('div')[0], true)
  })

  it(`multiple before`, function () {
    let $ = createHtmlDom('<ul class="title"><li class="replace"></li></ul><ul class="title"><li></li><li class="replace"></li></ul>')

    $('.replace').replaceWith('<div>1</div>')

    assert.equal($('div').length, 2)
    assert.equal($('div')[0].parent === $('.title')[0], true)
    assert.equal($('div')[1].parent === $('.title')[1], true)
  })

  it('root before', function () {
    let $ = createHtmlDom('<div></div>')

    $('div').replaceWith('<p>1')

    assert.equal($('p')[0].parent === null, true)
    assert.equal($('div').length, 0)
    assert.equal($.html(), '<p>1</p>')
  })
})