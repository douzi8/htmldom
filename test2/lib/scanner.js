let assert = require('assert')
let Scanner = require('../../lib2/scanner')


describe('scanner', function () {
  it('Empty string', function () {
     let scan = new Scanner('')

     assert.deepEqual(scan.doms, [])
  })

  it('Void tag', function () {
    let { doms } = new Scanner('<link><br><img><input>')

    for (let item of doms) {
      assert.equal(item.type, 'voidTag')
    }
  })


  it('Self closing tag', function () {
    let { doms } = new Scanner('<br/><img /><input />')

    for (let item of doms) {
      assert.equal(item.type, 'selfClosingTag')
    }
  })


  it('text', function () {
    let { doms } = new Scanner('text content')

    assert.deepEqual(doms[0], {
      type: 'text',
      value: 'text content'
    })
  })

  it('Space character', function () {
    let { doms } = new Scanner('<div> 1 </div>')

    assert.deepEqual(doms[1], {
      type: 'text',
      value: ' 1 '
    })
  })

  it('comment', function () {
    let { doms } = new Scanner('<!-- content -->')

    assert.deepEqual(doms[0], {
      type: 'comment',
      value: ' content '
    })
  })

  

})