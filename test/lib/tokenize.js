let assert = require('assert')
let Tokenize = require('../../lib/tokenize')


describe('scanner', function () {
  it('Empty string', function () {
     let scan = new Tokenize('')

     assert.deepEqual(scan.doms, [])
  })

  it('Void tag', function () {
    let { doms } = new Tokenize('<link><br><img><input>')

    for (let item of doms) {
      assert.equal(item.type, 'voidTag')
    }
  })


  it('Self closing tag', function () {
    let { doms } = new Tokenize('<br/><img /><input />')

    for (let item of doms) {
      assert.equal(item.type, 'selfClosingTag')
    }
  })


  it('text', function () {
    let { doms } = new Tokenize('text content')

    assert.deepEqual(doms[0], {
      type: 'text',
      value: 'text content'
    })
  })

  it('Space character', function () {
    let { doms } = new Tokenize('<div> 1 </div>')

    assert.deepEqual(doms[1], {
      type: 'text',
      value: ' 1 '
    })
  })

  it('comment', function () {
    let { doms } = new Tokenize('<!-- content --><!-- content2 -->')

    assert.deepEqual(doms[0], {
      type: 'comment',
      value: ' content '
    })

    assert.deepEqual(doms[1], {
      type: 'comment',
      value: ' content2 '
    })
  })


})