let assert = require('assert')
let createHtmlDom = require('../../../htmldom')


describe('hasClass', function () {
  it(`true`, function() {
    let $ = createHtmlDom('<div class="a b"></div><div class="b c d"></div>')
    let $el = $('div')

    assert.equal($el.hasClass('b'), true)
    assert.equal($el.hasClass('d'), true)
  })


  it(`false`, function() {
    let $ = createHtmlDom('<div></div>')

    let $el = $('div')
    
    assert.equal($el.hasClass('a'), false)
  })
})