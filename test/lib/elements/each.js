let assert = require('assert')
let createHtmlDom = require('../../../htmldom')

describe('each', function () {
  it(`each(function() { })`, function() {
    let $ = createHtmlDom('<ul class="title"><li>1</li><li>2</li></ul>')
    let result = []

    $('li').each(function (index, item) {
      result.push([index, item])
    })

    assert.deepEqual(result, [
      [0, $('li')[0]],
      [1, $('li')[1]]
    ])
  })

  it('each change', function () {
    let $ = createHtmlDom('<li>1</li><li>2</li>')

    $('li').each(function (index, item) {
      $(item).addClass('c' + index)
    })

    assert.equal($.html(), `<li class="c0">1</li><li class="c1">2</li>`)
  })
  
})