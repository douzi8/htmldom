// @see http://www.w3.org/html/wg/drafts/html/master/syntax.html#void-elements
const VOID_ELEMENTS = [
  'area', 
  'base', 
  'br', 
  'col', 
  'embed', 
  'hr', 
  'img', 
  'input', 
  'keygen', 
  'link',
  'menuitem', 
  'meta', 
  'param', 
  'source', 
  'track', 
  'wbr'
];

let newVoid = []

let TagSelfClosed = false

function config ({
  voidElements,
  selfClosed = false
}) {
  if (Array.isArray(voidElements)) {
    newVoid = voidElements
  } else {
    newVoid = []
  }
  
  TagSelfClosed = selfClosed
}

function getVoidEls () {
  return VOID_ELEMENTS.concat(newVoid)
}

function getSelfClosed () {
  return TagSelfClosed
}

exports.config = config

exports.getVoidEls = getVoidEls

exports.getSelfClosed = getSelfClosed

exports.OPTIONAL_TAGS = {
  head: ['body'],
  li: ['li'],
  dt: ['dt', 'dd'],
  dd: ['dd', 'dt'],
  p: ['address', 'article', 'aside', 'blockquote', 'details', 'div', 'dl', 'fieldset', 'figcaption', 'figure', 'footer', 'form', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'header', 'hgroup', 'hr', 'main', 'menu', 'nav', 'ol', 'p',' pre', 'section', 'table', 'ul'],
  option: ['option'],
  caption: ['caption', 'thead', 'tbody'],
  colgroup: ['tbody', 'tr', 'tfoot'],
  col: ['col', 'tbody', 'tr'],
  thead: ['tbody', 'tfoot'],
  tbody: ['tbody', 'tfoot'],
  tfoot: ['tbody'],
  tr: ['tr', 'tbody'],
  td: ['td', 'th', 'tr', 'tbody'],
  th: ['td', 'th', 'tr', 'tbody']
};

exports.CHILD = {
  ul: ['li'],
  ol: ['li'],
  dl: ['dt', 'dd'],
  tr: ['th', 'td'],
  table: ['tbody', 'thead', 'tfoot', 'caption', 'tr'],
  tbody: ['tr'],
  thead: ['tr']
};
