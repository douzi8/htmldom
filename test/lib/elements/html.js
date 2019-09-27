let assert = require('assert')
let createHtmlDom = require('../../../htmldom')


describe('html', function() {
  it('text', function() {
    let $ = createHtmlDom('<div>1</div>')

    assert.equal($('div').html(), '1')
  })

  it('comment', function() {
    let $ = createHtmlDom('<div><!-- 注释 --></div>')

    assert.equal($('div').html(), '<!-- 注释 -->')
  })

  it('tag', function() {
    let $ = createHtmlDom('<div>1<div>2</div>3</div>')

    assert.equal($('div').html(), '1<div>2</div>3')
  })
})