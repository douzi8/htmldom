let assert = require('assert')
let Parser = require('../lib/html.parser')

describe('Optional tags', function () {
  it('ul li', function () {
    let { nodes } = new Parser(`<ul><li><li></ul><div></div>`)


    assert.equal(nodes[0].children.length, 2)
    assert.equal(nodes[1].name, 'div')
  })

  it('p', function() {
    let { nodes } = new Parser(`<p>1<div></div>2</p>`)

    /** 
     * <p>1</p><div></div>2<p></p>
     */

     assert.equal(nodes[1].name, 'div')
     
     assert.deepEqual(nodes[2], {
       parent: null,
       type: 'text',
       data: '2'
     })
     assert.equal(nodes[3].name, 'p')
  })
})