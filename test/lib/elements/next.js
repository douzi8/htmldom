let assert = require('assert')
let createHtmlDom = require('../../../htmldom')


describe('next', function() {
  it('next()', function() {
    let $ = createHtmlDom(`
      <div id="d1"></div>
      <div id="d2"></div>
      <a></a>
    `)

    let next = $('#d2').next()

    assert.equal(next.length, 1)
    assert.equal(next[0].name, 'a')

    let next2 = $('a').next()

    assert.equal(next2.length, 0)
  })


  it(`next('.selected')`, function() {
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


    let next = $('div').next().next('.selected')

    assert.equal(next.length, 1)
    assert.equal(next.eq(0).hasClass('selected'), true)
  })
})