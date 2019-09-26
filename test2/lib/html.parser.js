let assert = require('assert')
let Parser = require('../../lib2/html.parser')


describe('Parser', function () {
  describe('attributes', function() {
    it('key = value', function () {
      let { nodes } = new Parser(`<input key = value>`)


      assert.deepEqual(nodes[0].attributes, {
        key: 'value'
      })
    })

    it('key="value"', function () {
      let { nodes } = new Parser(`<input key="value">`)


      assert.deepEqual(nodes[0].attributes, {
        key: 'value'
      })
    })


    it("key='value'", function () {
      let { nodes } = new Parser(`<input key='value'>`)


      assert.deepEqual(nodes[0].attributes, {
        key: 'value'
      })
    })

    it('Empty attribute', function () {
      let { nodes } = new Parser('<input checked>')


      assert.deepEqual(nodes[0].attributes, {
        checked: ''
      })
    })

    it('Double-quoted value', function () {
      let { nodes } = new Parser(`<input key='""'>`)

      assert.deepEqual(nodes[0].attributes, {
        key: `""`
      })
    })

    it('Vue dynamic attribute name', function () {
      let { nodes } = new Parser(`<img :src="'/path/to/images/' + fileName">`)

      assert.deepEqual(nodes[0].attributes, {
        ':src': `'/path/to/images/' + fileName`
      })
    })

    it('Multiple row', function () {
      let { nodes } = new Parser(`<input
        k=v
        k2=v2 
      >`)

      assert.deepEqual(nodes[0].attributes, {
        k: 'v',
        k2: 'v2'
      })
    })
  })

  describe('children', function() {
    it('Void tag', function () {
      let { nodes } = new Parser(`<br><div></div>`)

      assert.deepEqual(nodes[0].children, [])
      assert.equal(nodes[0].type, 'tag')
      assert.equal(nodes[0].tagType, 'voidTag')
    })

    it('Self closing tag', function () {
      let { nodes } = new Parser(`<iamge /><div></div>`)

      assert.deepEqual(nodes[0].children, [])
      assert.equal(nodes[0].type, 'tag')
      assert.equal(nodes[0].tagType, 'selfClosingTag')
    })

    it('div tag', function () {
      let { nodes } = new Parser(`<div>
        <p>1
        <p>2
      </div>`)

      assert.equal(nodes[0].children.length, 3)
    })

    it('li tag', function () {
      let { nodes } = new Parser(`<ul>
        <li>
          <div>1</div>
        <li>
          <div>2</div>
      </ul>`)

      // [text, li, li]
      assert.equal(nodes[0].children.length, 3)

      // [text, div, text]
      assert.equal(nodes[0].children[1].children.length, 3)
    })
  })
})