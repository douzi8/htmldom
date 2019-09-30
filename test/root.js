let assert = require('assert')
let createHtmlDom = require('../htmldom')


describe('$.root', function () {
  it('prepend', function() {
    let $ = createHtmlDom('<div></div>')

    $.root().prepend('<head></head>').find('head').attr('k', 'v')

    assert.equal($.html(), `<head k="v"></head><div></div>`)
    assert.equal($.html() === $.root().html(), true)
  })

  it('append', function () {
    let $ = createHtmlDom('<div></div>')

    $.root().append('<button></button>').find('button').attr('k', 'v')

    assert.equal($.html(), `<div></div><button k="v"></button>`)
    assert.equal($.html() === $.root().html(), true)
    assert.equal($('button')[0], $.root().find('button')[0])
  })
})