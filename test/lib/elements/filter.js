let assert = require('assert')
let createHtmlDom = require('../../../htmldom')


describe('filter', function () {
  it(`filter(function() {})`, function() {
    let $ = createHtmlDom('<div title="1"></div><div title="2" class="box"></div><div title="3"></div>')

    let pos = []

    let result = $('div').filter(function(index) {
      pos.push(index)
      return $(this).hasClass('box')
    })

    assert.deepEqual(pos, [0, 1, 2])
    assert.equal(result.length, 1)
    assert.equal(result.attr('title'), 2)
  })

  it(`filter('.cls')`, function() {
    let $ = createHtmlDom('<div title="1"></div><div title="2" class="box"></div><div title="3"></div>')

    let result = $('div').filter('.box')

    assert.equal(result.length, 1)
    assert.equal(result.attr('title'), 2)
  })
})