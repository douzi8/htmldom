// @see http://stackoverflow.com/questions/706384/boolean-html-attributes
var REG = require('../lib/reg');
var booleanAttributes = [
  'checked', 
  'selected', 
  'disabled', 
  'readonly',
  'multiple',
  'defer',
  'nowrap',
  'compact',
  'noshade'
];

function isBooleanAttr(name) {
  return booleanAttributes.indexOf(name) !== -1;
}


module.exports = function(dom, options) {
  var html = '';

  if (options.removeJsType && dom.name === 'script' && dom.attributes.type === 'text/javascript') {
    delete dom.attributes.type;
  }

  if (options.removeCssType && dom.name === 'style' && dom.attributes.type === 'text/css') {
    delete dom.attributes.type;
  }

  for (var i in dom.attributes) {
    html += ' ';
    var optionEqual = (options.booleanAttributes && isBooleanAttr(i)) || dom.attributes[i] === null;
    if (optionEqual) {
      html += i;
    } else {
      html += i + '="' + dom.attributes[i].replace(REG.DOUBLE_QUOTES, '&quot;') + '"';
    }
  }

  return html;
};