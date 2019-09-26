let { parser : cssParser, match: cssMatch} = require('./selector')


/**
 * DFS
 */
function depthFirstSearch (node, callback) {
  let stack = [node]

  while (stack.length) {
    let current = stack.shift()
  
    if (current.type === 'tag') {
      callback(current)
    }      
    
    if (current.children) {
      stack = current.children.concat(stack)
    }
  }
}


let FILTER_CHILDREN = Symbol('filter')


class QuerySelector {
  /**
   * Query the node list by css selector
   * @example
   * let q = new QuerySelector('div .title', { children: []})
   */
  constructor (selector, rootNode) {
    this.selector = selector

    let selectorData = cssParser(selector)

    let list = []
    let first = selectorData.shift()


    depthFirstSearch(rootNode, function (node) {
      if (cssMatch(node, first)) {
        list.push(node)
      }
    })


    this[FILTER_CHILDREN](list, selectorData)
  }
  /**
   * @see https://www.w3.org/TR/selectors-3/
   * E   F:  an F element descendant of an E element
   * E > F:  an F element child of an E element
   * E + F:  an F element immediately preceded by an E element
   * E ~ F:  an F element preceded by an E element
   */
  [FILTER_CHILDREN] (list, selectorData) {
    list = list.filter(node => {
      let length = selectorData.length
      let j = 0

      while (j < length) {
        let selector = selectorData[j]

        switch (selector.operator) {
          case '>':
            if (!cssMatch(node.parent, selector)) return false

            node = node.parent
            break
          case '+':
            break
          default:
            while (node) {
              node = node.parent

              if (!node) return false

              if (cssMatch(node, selector)) {
                break
              }
            }
        }

        j++
      }

      return true
    })


    list.forEach((node, index) => {
      this[index] = node
    })

    this.__length__ = list.length
  }

  get length () {
    return this.__length__
  }

  find () {

  }

  html () {

  }
}


module.exports = QuerySelector