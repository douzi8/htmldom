let assert = require('assert')
let createHtmlDom = require('../../../htmldom')


describe('find', function() {
  it('null', function() {
    let $ = createHtmlDom('<div>1</div>')

    assert.equal($('div').find('a').length, 0)
  })

  it('one selector', function() {
    let $ = createHtmlDom('<div><a>1</a></div><a>2</a>')

    assert.equal($('div').find('a').length, 1)
    assert.equal($('div').find('a').html(), '1')
  })

  it('multiple selector', function() {
    let $ = createHtmlDom('<div class="title"><div><div>11</div>2</div></div>')


    assert.equal($('.title').find('div > div').length, 2)

    assert.equal($('.title').find('div > div > div').length, 1)
  })

})