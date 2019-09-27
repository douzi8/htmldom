let assert = require('assert')
let createHtmlDom = require('../../../htmldom')


describe('eq', function () {
  it('positive number', function() {
    let $ = createHtmlDom('<div title="1"></div><div title="2"></div><div title="3"></div>')

    assert.equal($('div').eq(1).attr('title'), '2')
  })

  it('negative', function () {
    let $ = createHtmlDom('<div title="1"></div><div title="2"></div><div title="3"></div>')

    assert.equal($('div').eq(-1).attr('title'), '3')
  })


  it('exceed', function() {
    let $ = createHtmlDom('<div title="1"></div><div title="2"></div><div title="3"></div>')

    assert.equal($('div').eq(10).length, 0)
  })
})