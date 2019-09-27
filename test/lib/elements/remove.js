let assert = require('assert')
let createHtmlDom = require('../../../htmldom')


describe('remove', function () {
  it('empty tag', function () {
    let $ = createHtmlDom('<div></div>')

    $('a').remove()

    assert.equal($.html(), '<div></div>')
  })

  it('find tag', function () {
    let $ = createHtmlDom('<div><a></a></div><a></a>')

    $('div > a').remove()

    assert.equal($('a').length, 1)
    
    $('a').remove()


    assert.equal($('a').length, 0)
    
    assert.equal($.html(), '<div></div>')
  })
})