let assert = require('assert')
let createHtmlDom = require('../htmldom')


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

  it('Multiple $', function () {
    let $ = createHtmlDom('<a>1</a>')
    let $2 = createHtmlDom('<a>2</a>')

    $('a').addClass('demo1').attr({
      k: 'v'
    }).html('')

    $2('a').addClass('demo2 demo3').attr({
      k2: 'v2'
    })

    assert.equal($.html(), `<a class="demo1" k="v"></a>`)
    assert.equal($2.html(), `<a class="demo2 demo3" k2="v2">2</a>`)
  })
})