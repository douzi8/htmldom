let assert = require('assert')
let createHtmlDom = require('../../../htmldom')


describe('attr', function () {
  it(`css('key')`, function() {
    let $ = createHtmlDom('<div style="color:red;width : 200px;"></div>')


    assert.equal($('div').css('color'), 'red')
    assert.equal($('null').attr('class'), null)
  })

  it(`css('key', 'value')`, function() {
    let $ = createHtmlDom('<div></div>')

    $('div').css('color', 'red')
    $('div').css('width', '200px')

    assert.equal($('div')[0].attributes.style, 'color:red;width:200px')
  })

  it(`css('key', null)`, function() {
    let $ = createHtmlDom('<div style="color:red;"></div>')


    $('div').css('color', null)

    assert.equal($('div')[0].attributes.style === undefined, true)
  })

  it(`css({})`, function () {
    let $ = createHtmlDom('<div style="display:block;-webkit-flex-direction: column;position:fixed"></div>')

    $('div').css({
      display: 'none',
      height: '100px',
      k: '',
      position: null
    })

    assert.deepEqual($('div')[0].style, {
      display: 'none',
      height: '100px',
      '-webkit-flex-direction': 'column',
      k: ''
    })
  })
})