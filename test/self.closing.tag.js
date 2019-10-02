 let Parser = require('../lib/html.parser')
 let assert = require('assert')


 describe('rawTag', function () {

    it('textarea', function () {
      let { nodes } = new Parser(`<textarea/><div>1</div>`)

      assert.deepEqual(nodes[0].tagType, 'selfClosingTag')
      assert.deepEqual(nodes[1].name, 'div')
      assert.deepEqual(nodes[1].children[0].data, '1')
    })
 })