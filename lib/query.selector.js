let { parser : cssParser, match: cssMatch} = require('./selector')
const { isString } = require('./util')


/**
 * DFS
 */
function depthFirstSearch (node, callback) {
  let stack = [...node.children]

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
let SET_LIST = Symbol('list')

function getPrevNodeSibling (node) {
  let parent = node.parent

  if (!parent) return null

  let children = parent.children.filter(node => node.type === 'tag')

  let pos = children.indexOf(node)

  let prev = children[pos - 1]

  return prev ? prev : null
}

function getPrevNodeSiblings (node) {
  let parent = node.parent

  if (!parent) return null

  let children = parent.children.filter(node => node.type === 'tag')

  let pos = children.indexOf(node)

  return pos === 0 ? null : children.slice(0, pos)
}

function filterNode (node, selectorData) {
  let length = selectorData.length
  let j = 0

  while (j < length) {
    let selector = selectorData[j]

    switch (selector.operator) {
      case '>':
        if (!node.parent || !cssMatch(node.parent, selector)) return false

        node = node.parent
        break
      case '+':
        let prev = getPrevNodeSibling(node)

        if (!prev || !cssMatch(prev, selector)) return false

        node = prev
        break
      case '~':
        let prevs = getPrevNodeSiblings(node)
        let hasMatch = false

        if (!prevs) return false

        let prevsLength = prevs.length
        
        while (prevsLength--) {
          let prevItem = prevs[prevsLength]

          if (cssMatch(prevItem, selector)) {
            hasMatch = true
            node = prevItem
            break
          }
        }  

        if (!hasMatch) return false

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
}



class QuerySelector {
  /**
   * Query the node list by css selector
   * @example
   * let q = new QuerySelector('div .title', { children: []})
   */
  constructor (selector, rootNode) {
    if (isString(selector)) {
      this.selector = selector

      let selectorData = cssParser(selector)
      let list = []

      if (selectorData) {
        let first = selectorData.shift()


        depthFirstSearch(rootNode, function (node) {
          if (cssMatch(node, first)) {
            list.push(node)
          }
        })
        
        this[FILTER_CHILDREN](list, selectorData)
      } else {
        this[SET_LIST](list)
      }
      
    } else {

      if (!Array.isArray(selector)) {
        selector = [selector]
      }

      this[SET_LIST](selector)
    }
    
  }
  /**
   * @see https://www.w3.org/TR/selectors-3/
   * E   F:  an F element descendant of an E element
   * E > F:  an F element child of an E element
   * E + F:  an F element immediately preceded by an E element
   * E ~ F:  an F element preceded by an E element
   */
  [FILTER_CHILDREN] (list, selectorData) {
    list = list.filter(function(node) {
      return filterNode(node, selectorData)
    })

    this[SET_LIST](list)
  }

  [SET_LIST] (list) {
    list.forEach((node, index) => {
      this[index] = node
    })

    this.__length__ = list.length
  }

  [Symbol.iterator]() { 
    let index = 0
    let self = this
    
    return {
      next () {
        if (index < self.length) {
          return {
            value: self[index++],
            done: false
          }
        }

        return {
          done: true
        }
      }
    } 
  }

  get length () {
    return this.__length__
  }

  /**
   * @example
   * $('div').find('a')
   */
  find (selector) {
    let result = new Set()

    for (let i = 0; i < this.length; i++) {

      let $ = new QuerySelector(selector, this[i])


      for (let j = 0; j < $.length; j++) {
        result.add($[j])
      }
    }

    let $elements = new this.constructor([...result])

    return $elements
  }
}


module.exports = QuerySelector