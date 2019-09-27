let assert = require('assert')
let createHtmlDom = require('../../../htmldom')


describe('prepend', function () {
  it(`prepend('<a></a>')`, function() {
    let $ = createHtmlDom('<ul class="title"><li>3</ul>')

    $('.title').append('<li>1<li>2')

    assert.equal($('ul > li').length, 3)
    assert.equal($('li').html(), '1')
  })

  it(`multiple prepend`, function () {
    let $ = createHtmlDom('<ul class="title"></ul><ul></ul><div></div>')

    $('ul').append('<li>1<a></a><li>2')

    assert.equal($('ul > li').length, 4)
    assert.equal($('a').length, 2)
  })
})