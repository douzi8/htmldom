let assert = require('assert')
let {
  parser
} = require('../../lib2/selector')


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
      let resullt = parser('.cls a [name][data-id=6]')

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
        name: 'a'
      })

      assert.deepEqual(resullt[2], {
        class: ['cls']
      })
    })

  })
})