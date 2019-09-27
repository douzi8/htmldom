let assert = require('assert')
let HtmlParser = require('../../lib/html.parser')
let { cloneNode, nodeStyle } = require('../../lib/node.op')

describe('cloneNode', function() {
  it('has children', function() {
    let { nodes } = new HtmlParser(`<div>1<a class="link">2</a>3</div>`)
    let node = nodes[0]
    let newNode = cloneNode(node)
    
    
    assert.equal(node.children[0] !== newNode.children[0], true)
    assert.equal(node.children[1].attributes !== newNode.children[1].attributes, true)

    assert.deepEqual(node, newNode)
  })

  it('none children', function() {
    let { nodes } = new HtmlParser(`<div></div>`)
    let node = nodes[0]
    let newNode = cloneNode(node)

    assert.deepEqual(node, newNode)
  })

  it('parent', function () {
    let { nodes } = new HtmlParser(`<div><button>1</button></div>`)
    let node = nodes[0]
    let newNode = cloneNode(node)

    
    assert.equal(newNode !== node, true)
     
    assert.equal(node.children[0].parent === node, true)

    assert.equal(newNode.children[0].parent === newNode, true)

    assert.equal(newNode.parent, null)
  })
})

describe('nodeStyle', function() {
  it('empty style', function () {
    let { nodes } = new HtmlParser(`<div></div>`)
    let node = nodes[0]


    assert.deepEqual(node.style, {})
  })

  it(`get style`, function () {
    let { nodes } = new HtmlParser(`<div style="color : red; height:200px;"></div>`)
    let node = nodes[0]


    assert.deepEqual(node.style, {
      height: '200px',
      color: 'red'
    })
  })

  it('clear style', function () {
    let { nodes } = new HtmlParser(`<div class="demo" style="color : red; height:200px;"></div>`)
    let node = nodes[0]

    node.style = {}

    assert.deepEqual(node.attributes, {
      class: 'demo'
    })
  })

  it('set style', function () {
    let { nodes } = new HtmlParser(`<div class="demo" style="color : red; height:200px;"></div>`)
    let node = nodes[0]

    node.style = {
      color: '#333',
      width: '100px'
    }

    assert.equal(node.attributes.style, 'color:#333;width:100px')
  })
})