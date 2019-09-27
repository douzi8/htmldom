let assert = require('assert')
let createHtmlDom = require('../../../htmldom')


describe('attr', function () {
  it(`attr('key')`, function() {
    let $ = createHtmlDom('<div class="title"></div>')


    assert.equal($('div').attr('class'), 'title')
    assert.equal($('null').attr('class'), null)
  })

  it(`attr('key', 'value')`, function () {
    let $ = createHtmlDom('<div class="title"></div><h2 class="title"></h2>')

    $('.title').attr('data-num', 1)

    assert.equal($('.title')[0].attributes['data-num'] === '1', true)
    assert.equal($('.title')[1].attributes['data-num'] === '1', true)
  })

  it(`attr('key', null)`, function () {
    let $ = createHtmlDom(`<div class="title" num="1"></div>`)

    $('.title').attr('num', null)

    assert.deepEqual($('.title')[0].attributes, {
      class: 'title'
    })
  })

  it(`attr('key', function(index, oldValue) { })`, function () {
    let $ = createHtmlDom('<div class="title" num="1"></div><h2 class="title" num="2"></h2><h3 class="title" num="3"></h3>')

    let pos = []


    $('.title').attr('num', function (index, oldValue) {
      pos.push({
        index,
        oldValue
      })

      return oldValue + oldValue
    })

    assert.deepEqual(pos, [{
      index: 0,
      oldValue: '1'
    }, {
      index: 1,
      oldValue: '2'
    }, {
      index: 2,
      oldValue: '3'
    }])

    assert.equal($('.title')[0].attributes.num, '11')

    assert.equal($('.title')[2].attributes.num, '33')
  })
  
  it(`attr({})`, function() {
    let $ = createHtmlDom(`<div class="title" num="1"></div>`)

    $('.title').attr({
      class: null,
      num: 2,
      k: 'v'
    })

    assert.deepEqual($('div')[0].attributes, {
      num: '2',
      k: 'v'
    })
  })
})