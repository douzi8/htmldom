let assert = require('assert')
let createHtmlDom = require('../../htmldom')


describe('$.html', function () {
  it('one root', function () {
    let htmlCode = `<div>
      <p>1</p>
      <!-- 注释 -->
      2
      <input class="demo"/>
      <br>
    </div>`

    let $ = createHtmlDom(htmlCode)


    assert.equal($.html(), htmlCode)
  })

  it('multiple root', function () {
    let htmlCode = `
    <div>
     1
    </div>
    <p>
      <a> 2 </a>
    </p>
    3
  `
    let $ = createHtmlDom(htmlCode)

    assert.equal($.html(), htmlCode)
  })

  it('script element', function () {
    let htmlCode = `
      <script type="text/javascript">
        alert(1)
      </script>
    `

    let $ = createHtmlDom(htmlCode)

    assert.equal($.html(), htmlCode)
  })
})