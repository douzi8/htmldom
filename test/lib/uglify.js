let assert = require('assert')
let createHtmlDom = require('../../htmldom')


describe('$.uglify', function () {
  describe('$.uglify()', function () {
    it('remove comment', function () {
      let htmlCode = `
        <div>
          <!-- delete -->
        </div>
      `
      let $ = createHtmlDom(htmlCode)

      assert.equal($.uglify(), '<div></div>')
    })

    it('trim text', function() {
      let htmlCode = `
        <div>
          1
          <ul>
            <li>2
            <li>3
          </ul>
        </div>
      `

      let $ = createHtmlDom(htmlCode)

      assert.equal($.uglify(), '<div>1<ul><li>2</li><li>3</li></ul></div>')
    })

    it('script type', function () {
      let $ = createHtmlDom(`
        <script type="text/javascript" src="./b.js"></script>
        <script type="text/javascript">
          alert(1)
        </script>
      `)


      assert.equal($.uglify(), '<script src="./b.js"></script><script>alert(1)</script>')
    })

    it('style type', function () {
      let $ = createHtmlDom(`
        <style type="text/css" id="test">
         
        </style>
      `)


      assert.equal($.uglify(), '<style id="test"></style>')
    })

    it('uglify script js', function() {
      let $ = createHtmlDom(`
        <script type="text/template">
          window.alert(0)
        </script>
        <script type="text/javascript">
          window.alert(1)
        </script>
        <script>
          window.alert(2)
        </script>
      `)

      $('script').each((index, item) => {
        let type = $(item).attr('type')

        if (type && type !== 'text/javascript') return 

        let jsCode = item.value

        // Find a uglify plugin by yourself
        item.value = jsCode.replace('window.', '')
      })


      assert.equal($.uglify(), '<script type="text/template">window.alert(0)</script><script>alert(1)</script><script>alert(2)</script>')
    })
  })

  describe('{removeAttributeQuotes: true}', function () {

    it('href', function () {
      let $ = createHtmlDom(`<link href="//www.baidu.com/img/baidu.svg">`)

      assert.equal($.uglify({
        removeAttributeQuotes: true
      }), '<link href=//www.baidu.com/img/baidu.svg>')
    })

    it('whitespace', function () {
      let $ = createHtmlDom(`<a class="title big"></a>`)

      assert.equal($.uglify({
        removeAttributeQuotes: true
      }), '<a class="title big"></a>')
    })

    it(`"><=`, function () {
      let $ = createHtmlDom(`<a k="'" k2='"' k3=">" k4="<" k5="=" k6="v"></a>`)

      assert.equal($.uglify({
        removeAttributeQuotes: true
      }), `<a k="'" k2="&quot;" k3=">" k4="<" k5="=" k6=v></a>`)
    })
  })
})