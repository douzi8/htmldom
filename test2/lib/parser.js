let assert = require('assert')
let Scanner = require('../../lib2/scanner')
let Parser = require('../../lib2/parser')


describe('Parser', function () {
  describe('attributes', function() {
    it('key = value', function () {
      let scan  = new Scanner(`<input key = value>`)
      let { nodes } = new Parser(scan.doms)


      assert.deepEqual(nodes[0].attributes, {
        key: 'value'
      })
    })

    it('key="value"', function () {
      let scan  = new Scanner(`<input key="value">`)
      let { nodes } = new Parser(scan.doms)


      assert.deepEqual(nodes[0].attributes, {
        key: 'value'
      })
    })


    it("key='value'", function () {
      let scan  = new Scanner(`<input key='value'>`)
      let { nodes } = new Parser(scan.doms)


      assert.deepEqual(nodes[0].attributes, {
        key: 'value'
      })
    })

    it('Empty attribute', function () {
      let scan  = new Scanner('<input checked>')
      let { nodes } = new Parser(scan.doms)


      assert.deepEqual(nodes[0].attributes, {
        checked: ''
      })
    })

    it('Double-quoted value', function () {
      let scan  = new Scanner(`<input key='""'>`)
      let { nodes } = new Parser(scan.doms)

      assert.deepEqual(nodes[0].attributes, {
        key: `""`
      })
    })

    it('Vue dynamic attribute name', function () {
      let scan  = new Scanner(`<img :src="'/path/to/images/' + fileName">`)
      let { nodes } = new Parser(scan.doms)

      assert.deepEqual(nodes[0].attributes, {
        ':src': `'/path/to/images/' + fileName`
      })
    })

    it('Multiple row', function () {
      let scan  = new Scanner(`<input
        k=v
        k2=v2 
      >`)
      let { nodes } = new Parser(scan.doms)

      assert.deepEqual(nodes[0].attributes, {
        k: 'v',
        k2: 'v2'
      })
    })
  })

  describe('children', function() {
    it('Void tag', function () {
      let scan  = new Scanner(`<br><div></div>`)
      let { nodes } = new Parser(scan.doms)

      assert.deepEqual(nodes[0].children, [])
      assert.equal(nodes[0].type, 'tag')
      assert.equal(nodes[0].tagType, 'voidTag')
    })

    it('Self closing tag', function () {
      let scan  = new Scanner(`<iamge /><div></div>`)
      let { nodes } = new Parser(scan.doms)

      assert.deepEqual(nodes[0].children, [])
      assert.equal(nodes[0].type, 'tag')
      assert.equal(nodes[0].tagType, 'selfClosingTag')
    })

    it('div tag', function () {
      let scan  = new Scanner(`<div>
        <p>1
        <p>2
      </div>`)
      let { nodes } = new Parser(scan.doms)

      assert.equal(nodes[0].children.length, 3)
    })

    it('li tag', function () {
      let scan  = new Scanner(`<ul>
        <li>
          <div>1</div>
        <li>
          <div>2</div>
      </ul>`)
      let { nodes } = new Parser(scan.doms)

      // [text, li, li]
      assert.equal(nodes[0].children.length, 3)

      // [text, div, text]
      assert.equal(nodes[0].children[1].children.length, 3)
    })
  })
})