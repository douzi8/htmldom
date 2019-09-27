let assert = require('assert')
let createHtmlDom = require('../../../htmldom')



describe('outerHTML()', function() {
  it('empty html', function() {
    let $ = createHtmlDom('<div>1</div>')

    assert.equal($('a').outerHTML(), null)
  })

  it('return html string', function () {
    let htmlCode = '<div id="demo">1<a></a>2</div>'
    let $ = createHtmlDom(htmlCode)

    assert.equal($('#demo').outerHTML(), htmlCode)
  })
})