let assert = require('assert')
let createHtmlDom = require('../../../htmldom')


describe('prev', function() {
  it('prev()', function() {
    let $ = createHtmlDom(`
      <div id="d1"></div>
      <div id="d2"></div>
      <a></a>
    `)

    let prev = $('a').prev()

    assert.equal(prev.length, 1)
    assert.equal(prev.attr('id'), 'd2')

    let prev2 = $('#d1').prev()

    assert.equal(prev2.length, 0)
  })


  it(`prev('.selected')`, function() {
    let $ = createHtmlDom(`
      <div>
        <div class="selected">
        </div>
        <a></a>
        <div class="d1">
        </div>
        <a></a>
        <div class="selected">
        </div>
        <a></a>
      </div>
    `)

    let prev = $('a').prev('.selected')


    assert.equal($('a').length, 3)
    assert.equal(prev.length, 2)
    assert.equal(prev.eq(0).hasClass('selected'), true)
    assert.equal(prev.eq(1).hasClass('selected'), true)
  })
})