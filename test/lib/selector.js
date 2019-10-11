let assert = require('assert')
let {
  parser,
  match
} = require('../../lib/selector')


describe('selector', function() {
  describe('parser', function() {
    it('#id', function() {
      let resullt = parser('#title')


      assert.deepEqual(resullt[0].attrs[0], {
        key: 'id',
        operator: '=',
        value: 'title'
      })
    })

    it('class', function() {
      let resullt = parser('.cls1.cls2')

      assert.deepEqual(resullt[0].class, ['cls1', 'cls2'])
    })

    it('tag name', function() {
      let resullt = parser('div')

      assert.deepEqual(resullt[0].name, 'div')
    })

    it('attribute name', function() {
      let resullt = parser('[name]')

      assert.deepEqual(resullt[0].attrs[0], {
        key: 'name',
        operator: '',
        value: ''
      })
    })

    it('[attribute=value]', function() {
      let resullt = parser('[attribute = value]')

      assert.deepEqual(resullt[0].attrs[0], {
        key: 'attribute',
        operator: '=',
        value: 'value'
      })
    })

    it('[attribute^=value]', function() {
      let resullt = parser('[attribute ^= value]')

      assert.deepEqual(resullt[0].attrs[0], {
        key: 'attribute',
        operator: '^',
        value: 'value'
      })
    })

    it('[attribute~=value]', function() {
      let resullt = parser('[attribute ~="value"]')

      assert.deepEqual(resullt[0].attrs[0], {
        key: 'attribute',
        operator: '~',
        value: 'value'
      })
    })

    it('[attribute*=value]', function() {
      let resullt = parser(`[attribute *='value']`)

      assert.deepEqual(resullt[0].attrs[0], {
        key: 'attribute',
        operator: '*',
        value: 'value'
      })
    })

    it('multiple attribute', function() {
      let resullt = parser(`#title[attribute *='value']`)

      assert.deepEqual(resullt[0].attrs, [{
          key: 'id',
          operator: '=',
          value: 'title'
        },
        {
          key: 'attribute',
          operator: '*',
          value: 'value'
        }
      ])
    })


    it('children', function() {
      let resullt = parser('.cls > a [name][data-id=6]')

      assert.deepEqual(resullt[0].attrs, [
      {
        key: 'name',
        operator: '',
        value: ''
      },
      {
        key: 'data-id',
        operator: '=',
        value: '6'
      }])

      assert.deepEqual(resullt[1], {
        name: 'a',
        operator: ''
      })

      assert.deepEqual(resullt[2], {
        class: ['cls'],
        operator: '>'
      })
    })


    it('div > p', function () {
      let resullt = parser('div > p')

      assert.equal(resullt[1].operator, '>')
    })

    it('div + p', function () {
      let resullt = parser('div  + p')

      assert.equal(resullt[1].operator, '+')
    })

    it('div ~ p', function () {
      let resullt = parser('div~p')

      assert.equal(resullt[1].operator, '~')
    })

    it('*', function () {
      let resullt = parser(' * ')

      let resullt2 = parser('div > * ')


      assert.equal(resullt[0].operator, '*')
      assert.equal(resullt2[0].operator, '*')
      assert.equal(resullt2[1].operator, '>')
    })

    it('empty string', function () {
      let resullt = parser('')

      assert.deepEqual(resullt, null)
    })

  })

  describe('match', function () {
    it('tagname', function() {
      let node = {
        name: 'div',
        attributes: {}
      }

      let selector = {
        name: 'div'
      }

      assert.equal(match(node, selector), true)
    })

    it('classname', function() {
      let node = {
        name: 'div',
        attributes: {
          class: 'title body'
        },
        classList: new Set(['title', 'body'])
      }

      let selector = {
        class: ['body']
      }

       let selector2 = {
        class: ['body', 'footer']
      }

      assert.equal(match(node, selector), true)

      assert.equal(match(node, selector2), false)
    })

    it('id', function () {
      let node = {
        name: 'div',
        attributes: {
          id: 'box'
        }
      }

      let selector = {
        attrs: [{
          key: 'id',
          operator: '=',
          value: 'box'
        }]
      }

      assert.equal(match(node, selector), true)
    })

    it('[key]', function () {
      let node = {
        name: 'div',
        attributes: {
          title: 'hello'
        }
      }

      let selector = {
        attrs: [{
          key: 'title'
        }]
      }

       let selector2 = {
        attrs: [{
          key: 'data-id'
        }]
      }

      assert.equal(match(node, selector), true)

      assert.equal(match(node, selector2), false)
    })

    it('[key=value]', function () {
      let node = {
        name: 'div',
        attributes: {
          title: 'hello'
        }
      }

      let selector = {
        attrs: [{
          key: 'title',
          operator: '=',
          value: 'hello'
        }]
      }

      assert.equal(match(node, selector), true)
    })


    it('[key^=value]', function () {
      let node = {
        name: 'div',
        attributes: {
          title: 'hello'
        }
      }

      let selector = {
        attrs: [{
          key: 'title',
          operator: '^',
          value: 'he'
        }]
      }

      assert.equal(match(node, selector), true)
    })

    it('[key$=value]', function () {
      let node = {
        name: 'div',
        attributes: {
          title: 'hello'
        }
      }

      let selector = {
        attrs: [{
          key: 'title',
          operator: '$',
          value: 'llo'
        }]
      }

      assert.equal(match(node, selector), true)
    })

    it('[key*=value]', function () {
      let node = {
        name: 'div',
        attributes: {
          title: 'hello'
        }
      }

      let node2 = {
        name: 'div',
        attributes: {
        }
      }

      let selector = {
        attrs: [{
          key: 'title',
          operator: '*',
          value: 'ell'
        }]
      }



      assert.equal(match(node, selector), true)
      assert.equal(match(node2, selector), false)
    })

    it('[key~=value]', function () {
      let node = {
        name: 'div',
        attributes: {
          title: 'hello world'
        }
      }

      let node2 = {
        name: 'div',
        attributes: {
          title: 'he llo world'
        }
      }

      let selector = {
        attrs: [{
          key: 'title',
          operator: '~',
          value: 'hello'
        }]
      }

      assert.equal(match(node, selector), true)
      assert.equal(match(node2, selector), false)
    })

    it('*', function () {
      let node = {
        name: 'div',
        attributes: {}
      }

      let selector = {
        operator: '*'
      }

      assert.equal(match(node, selector), true)
    })

  })
})