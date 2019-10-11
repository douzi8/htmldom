let HtmlParser = require('../../lib/html.parser')
let QuerySelector = require('../../lib/query.selector')
let assert = require('assert')


function maskAsTree (nodes) {
  let root = {
    type: 'root',
    children: nodes
  }

  nodes.forEach(node => {
    node.parent = root
  })

  return root
}

describe('QuerySelector', function () {
  it('one tag', function () {
    let { nodes } = new HtmlParser('<div><a></a></div><a></a>')

    let q = new QuerySelector('a', {
      type: 'root',
      children: nodes
    })

    assert.equal(q.length,  2)
  })

  it('.class', function () {
    let { nodes } = new HtmlParser('<div class="demo demo title"><a></a></div><a></a>')

    let q = new QuerySelector('.demo', {
      type: 'root',
      children: nodes
    })

    let q2 = new QuerySelector('.test', {
      type: 'root',
      children: nodes
    })

    let q3 = new QuerySelector('.demo.title', {
      type: 'root',
      children: nodes
    })

    assert.equal(q.length,  1)
    assert.equal(q2.length,  0)
    assert.equal(q3.length,  1)
  })

  it('E F', function () {
    let { nodes } = new HtmlParser(`
      <div>
        <button />
      </div>
      <p>
        <button />
      </p>
    `)

    let q = new QuerySelector('div button', {
      type: 'root',
      children: nodes
    })

    assert.equal(q.length,  1)
  })


  it('E > F', function () {
    let { nodes } = new HtmlParser(`
      <div>
        <div>
          <a class="1"></a>
        </div>
      </div>
      <div>
        <a class="1"></a>
      </div>
    `)

    let q = new QuerySelector('div > a', {
      type: 'root',
      children: nodes
    })

    let q2 = new QuerySelector('div > div > a', {
      type: 'root',
      children: nodes
    })

    assert.equal(q.length,  2)

    assert.equal(q2.length,  1)
  })

  it('E + F', function () {
    let { nodes } = new HtmlParser(`
      <div title="hello">
        <span></span>
        <a class="1"></a>
        <div>2</div>
        3
        <a class="2"></a>
      </div>
    `)

    let q = new QuerySelector(`[title = "hello"] > div + a`, {
      type: 'root',
      children: nodes
    })

    let q2 = new QuerySelector('[key] > span + a', {
      type: 'root',
      children: nodes
    })

    let q3 = new QuerySelector('span + a + div + a', {
      type: 'root',
      children: nodes
    })

    assert.equal(q.length,  1)
    assert.equal(q[0].attributes.class, '2')
    assert.equal(q2.length,  0)
    assert.equal(q3.length,  1)
  })


  it('E ~ F', function () {
    let { nodes } = new HtmlParser(`
      <div class="demo1" is="1">1</div>
      <div class="demo1" is="2">2</div>
      999
      <div class="demo2">3</div>
      <div class="demo3">4</div>
    `)

    let q = new QuerySelector(`.demo1 ~ .demo1 ~ div`, maskAsTree(nodes))

    let q2 = new QuerySelector(`.demo1 ~ div`, maskAsTree(nodes))

    assert.equal(q.length,  2) 
    assert.equal(q2.length, 3)   
  })

  it('*', function () {
    let { nodes } = new HtmlParser(`
      <div class="demo1" is="1">
        1
        <p>
          2
          <a></a>
          <!-- 注释 -->
        </p>
        <span></span>
      </div>
    `)


    let q = new QuerySelector(`*`, maskAsTree(nodes))


    let q2 = new QuerySelector(`div > *`, maskAsTree(nodes))

    let q3 = new QuerySelector(`div  *`, maskAsTree(nodes))

    assert.equal(q.length,  4) 
    assert.equal(q2.length, 2)   
    assert.equal(q3.length, 3) 
  })

})


describe('find', function() {
  it(`.find('a')`, function () {
    let { nodes } = new HtmlParser(`
      <div>
        <a class="1"></a>
        <div>
          <a class="2"></a>
        </div>
      </div>
      <a class="3"></a>
    `)

    let q = new QuerySelector('div', {
      type: 'root',
      children: nodes
    })

    let children = q.find('a')

    assert.equal(children.length,  2)
  })

  it(`.find('e f')`, function () {
    let { nodes } = new HtmlParser(`
      <div>
        <a class="1"></a>
        <div class="box">
          <a class="2"></a>
          <div>
            <a class="4"></a>
          </div>
        </div>
      </div>
      <a class="3"></a>
    `)

    let q = new QuerySelector('div', {
      type: 'root',
      children: nodes
    })

    let children = q.find('.box > a')

    assert.equal(children.length,  1)
  })
})