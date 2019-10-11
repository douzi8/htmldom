let assert = require('assert')
let createHtmlDom = require('../../../htmldom')


describe('html()', function() {
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

  it('script', function() {
    let $ = createHtmlDom(`<script> console.log('') </script>`)

    assert.equal($('script').html(), ` console.log('') `)
  })

  it('style', function() {
    let $ = createHtmlDom(`<style>.titletl{}</style>`)

    assert.equal($('style').html(), `.titletl{}`)
  })
})


describe(`html('<div></div>')`, function () {
  it(`html('')`, function () {
    let $ = createHtmlDom('<div>1<!--2--></div>')

    $('div').html('').addClass('title')

    assert.equal($.html(), '<div class="title"></div>')
  })

  it(`html('<div></div>')`, function() {
    let $ = createHtmlDom('<div>1</div><a>2</a>')

    $('*').html('<span>1</span>')

    assert.equal($.html(), '<div><span>1</span></div><a><span>1</span></a>')

    $('*').html('<!-- -->')

    assert.equal($.html(), '<div><!-- --></div><a><!-- --></a>')
  })

  it(`new node's parent`, function () {
    let $ = createHtmlDom('<div></div><div></div>')

    $('div').html('<p>1</p><p>2</p>')


    assert.equal($('div > p').length, 4)

    assert.equal($('div p').html() === '1', true)
  })

  it('script', function() {
    let $ = createHtmlDom('<script></script><script></script>')

    $('script').html('alert(1)')

    assert.equal($.nodes[0].textContent, 'alert(1)')

    assert.deepEqual($.nodes[0].children, [])

    assert.equal($.html(), `<script>alert(1)</script><script>alert(1)</script>`)
  })
})