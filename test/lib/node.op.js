let assert = require('assert')
let HtmlParser = require('../../lib/html.parser')
let { cloneNode } = require('../../lib/node.op')

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