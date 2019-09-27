let assert = require('assert')
let createHtmlDom = require('../../../htmldom')


describe('clone', function () {
  it(`clone()')`, function() {
    let htmlCode = '<ul class="title"><li>1</li></ul>'
    let $ = createHtmlDom(htmlCode)

    let $title = $('.title')
    let $newEl = $title.clone()

    assert.equal($title[0] === $newEl[0], false)

    assert.equal($newEl.outerHTML(), htmlCode)

    $newEl.removeClass()

    $newEl.find('li').remove()

    assert.equal($title.outerHTML(), htmlCode)

    assert.equal($newEl.outerHTML(), '<ul></ul>')
  })

  it(`multiple clone`, function () {
    
  })
})