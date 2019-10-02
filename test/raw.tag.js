 let Parser = require('../lib/html.parser')
 let assert = require('assert')


 describe('rawTag', function () {
    it('script', function () {
      let { nodes } = new Parser(`<script type="text/javascript">alert(1)</script>`)

      assert.deepEqual(nodes[0].attributes, {
        type: 'text/javascript'
      })
      assert.deepEqual(nodes[0].textContent, 'alert(1)')
    })

    it('style', function () {
      let { nodes } = new Parser(`<style type="text/css">.title{}</style>`)

      assert.deepEqual(nodes[0].attributes, {
        type: 'text/css'
      })
      assert.deepEqual(nodes[0].textContent, '.title{}')
    })

    it('textarea', function () {
      let { nodes } = new Parser(`<textarea><div>1</div><a></a>2</textarea>`)

      assert.deepEqual(nodes[0].textContent, '<div>1</div><a></a>2')
    })
 })