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


  it('each replaceWith', function() {
    let $ = createHtmlDom('<li>1</li><li>2</li>')

    $('li').each((index, item) => {
      let $item = $(item)

      $item.replaceWith(`<view>${$item.html()}</view>`)
    })

    assert.equal($('view').length, 2)
    assert.equal($('li').length, 0)
    assert.equal($('view')[0].parent, null)
    assert.equal($('view')[1].parent, null)
  })
  
})