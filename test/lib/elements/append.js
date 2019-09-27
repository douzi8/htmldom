let assert = require('assert')
let createHtmlDom = require('../../../htmldom')


describe('append', function () {
  it(`append('<a></a>')`, function() {
    let $ = createHtmlDom('<ul class="title"></ul>')

    $('.title').append('<li>1<li>2')

    assert.equal($('ul > li').length, 2)
  })

  it(`multiple append`, function () {
    let $ = createHtmlDom('<ul class="title"></ul><ul></ul><div></div>')

    $('ul').append('<li>1<a></a><li>2')

    assert.equal($('ul > li').length, 4)
    assert.equal($('a').length, 2)
  })
})