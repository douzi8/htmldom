let assert = require('assert')
let Parser = require('../../lib/html.parser')


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

    it('Same key', function () {
      let { nodes } = new Parser(`<input id="1" id="2">`)

      assert.deepEqual(nodes[0].attributes, {
        id: '1'
      })
    })

    it('None whitespace', function () {
      let { nodes } = new Parser(`<input k="1"k2="2"k3="v3 v3">`)

      assert.deepEqual(nodes[0].attributes, {
        k: '1',
        k2: '2',
        k3: 'v3 v3'
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

      assert.equal(nodes[0].tagType, null)
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

  describe('rawTag', function () {
    it('script', function () {
      let { nodes } = new Parser(`<script type="text/javascript">alert(1)</script>`)

      assert.deepEqual(nodes[0].attributes, {
        type: 'text/javascript'
      })
      assert.deepEqual(nodes[0].value, 'alert(1)')
    })

    it('style', function () {
      let { nodes } = new Parser(`<style type="text/css">.title{}</style>`)

      assert.deepEqual(nodes[0].attributes, {
        type: 'text/css'
      })
      assert.deepEqual(nodes[0].value, '.title{}')
    })

    it('textarea', function () {
      let { nodes } = new Parser(`<textarea><div>1</div><a></a>2</textarea>`)

      assert.deepEqual(nodes[0].value, '<div>1</div><a></a>2')
    })
  })

  describe('classList', function () {
    it('[]', function () {
      let { nodes } = new Parser(`<input>`)

      assert.deepEqual([...nodes[0].classList], [])
    })

    it('[a,b]', function () {
      let { nodes } = new Parser(`<input class="a b demo">`)


      assert.deepEqual([...nodes[0].classList], ['a', 'b', 'demo'])
    })

  })


  describe('comment', function () {
    let { nodes } = new Parser(`
      <div class="cls">
   <!-- 代码注释 -->
  <div>
     1 3
  </div>
<!-- 代码注释 -->  
</div>
    `)

    console.log(nodes[1])
  })
})