let assert = require('assert')
let createHtmlDom = require('../htmldom')


describe('$.nodes', function () {
  it('div', function () {
    let $ = createHtmlDom(`<div id="test" class="title header" style="color:red;width:200px;"></div>`)
    let node = $('#test')[0]

    assert.equal(node.name, 'div')

    assert.equal(node.type, 'tag')

    assert.deepEqual(node.attributes, {
      id: 'test',
      class: 'title header',
      style: 'color:red;width:200px;'
    })

    assert.deepEqual(node.classList, new Set(['title', 'header']))

    assert.deepEqual(node.style, {
      color: 'red',
      width: '200px'
    })     
  })

  it('rawTag', function () {
    let $ = createHtmlDom(`<script>alert(1)</script>`)
    let node = $('script')

    assert.deepEqual(node[0], {
      type: 'tag',
      name: 'script',
      tagType: 'rawTag',
      attributes: {},
      textContent: 'alert(1)',
      parent: null,
      children: []
    })
  })

  it('selfClosingTag', function () {
    let $ = createHtmlDom(`<image src="" />`)

    assert.deepEqual($.nodes[0], { 
      type: 'tag',
      name: 'image',
      attributes: { src: '' },
      tagType: 'selfClosingTag',
      children: [],
      parent: null 
    })
  })


  it('voidTag', function () {
    let $ = createHtmlDom(`<input>`)

    assert.deepEqual($.nodes[0], { 
      type: 'tag',
      name: 'input',
      attributes: {  },
      tagType: 'voidTag',
      children: [],
      parent: null 
    })
  })

  it('text', function() {
    let $ = createHtmlDom(`text data`)

    assert.deepEqual($.nodes[0], {
      type: 'text',
      data: 'text data',
      parent: null
    })
  })

  it('comment', function() {
    let $ = createHtmlDom(`<!--comment data-->`)

    assert.deepEqual($.nodes[0], {
      type: 'comment',
      data: 'comment data',
      parent: null
    })
  })
})