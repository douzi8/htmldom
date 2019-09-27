let assert = require('assert')
let createHtmlDom = require('../../../htmldom')


describe('addClass', function () {
  it(`addClass('a')`, function() {
    let $ = createHtmlDom('<div class="title"></div>')

    let $el = $('div')
    
    $el.addClass('a')

    assert.equal($el[0].attributes.class, 'title a')

    $el.addClass('b')

    assert.equal($el[0].attributes.class, 'title a b')
  })


  it(`addClass('a b c')`, function() {
    let $ = createHtmlDom('<div></div>')

    let $el = $('div')
    
    $el.addClass('a b c')

    assert.equal($el[0].attributes.class, 'a b c')

    $el.addClass('b d')

    assert.equal($el[0].attributes.class, 'a b c d')
  })
})