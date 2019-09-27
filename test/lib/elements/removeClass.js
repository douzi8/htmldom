let assert = require('assert')
let createHtmlDom = require('../../../htmldom')


describe('removeClass', function () {
  it(`removeClass()`, function() {
    let $ = createHtmlDom('<div class="title"></div>')
    let $el = $('div')
    
    $el.removeClass()

    assert.equal($el[0].attributes.class, void 0)
  })


  it(`removeClass('a')`, function() {
    let $ = createHtmlDom('<div class="a b"></div>')
    let $el = $('div')
    
    $el.removeClass('a')


    assert.equal($el[0].attributes.class, 'b')
  })

  it(`removeClass('a b c')`, function() {
    let $ = createHtmlDom('<div class="a b c"></div><div class="d"></div>')
    let $el = $('div')

    $el.removeClass('a b d')

    assert.equal($el[0].attributes.class, 'c')

    assert.equal($el[1].attributes.class, void 0)
  })
})