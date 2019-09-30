let assert = require('assert')
let createHtmlDom = require('../htmldom')


let beautifyCode1 =
`<ul>
  <li>1</li>
  <li>2</li>
</ul>
<div>3</div>`



let beautifyCode2 =
`<div>
  <!-- 注释 -->
  <button>click</button>
  1
  <!-- 注释2 -->
</div>`

let beautifyCode3 =
`<div>
--1
--<div>2</div>
--3
--<ul>
----<li></li>
--</ul>
</div>`

describe('$.beautify', function () {
  describe('$.beautify()', function () {
    it('ul li', function () {
      let $ = createHtmlDom('<ul><li>1<li>2</ul><div>3</div>')

      assert.equal($.beautify(), beautifyCode1)
    })

    it('comment', function () {
      let $ = createHtmlDom('<div><!-- 注释 --><button>click</button>1<!-- 注释2 --></div>')

      assert.equal($.beautify(), beautifyCode2)
    })

    it('text', function () {
      let $ = createHtmlDom('<div>  3 4  </div>')

      assert.equal($.beautify(), '<div>3 4</div>')
    })
  })

  describe(`{indent: ''}`, function () {
    it('p', function () {
      let $ = createHtmlDom('<div>1<div>2</div>3<ul><li></ul></div>')

      assert.equal($.beautify({
        indent: '--'
      }), beautifyCode3)
    })
  })
})