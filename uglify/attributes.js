// @see http://stackoverflow.com/questions/706384/boolean-html-attributes
var REG = require('../lib/reg');
var uglifyJS = require("uglify-js");
var CssDom = require('cssdom');
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
var util = require('utils-extend');

function isBooleanAttr(name) {
  return booleanAttributes.indexOf(name) !== -1;
}



module.exports = function(dom, options) {
  var html = [];
  var name = dom.name;
  var type = dom.attributes.type;

  if (options.removeJsType && name === 'script' && type === 'text/javascript') {
    delete dom.attributes.type;
  } else if (options.removeCssType && name === 'style' && type === 'text/css') {
    delete dom.attributes.type;
  }

  for (var i in dom.attributes) {
    var key = i.replace(REG.ATTR_BUG, '');
    var value = dom.attributes[i];
    var optionEqual = (options.booleanAttributes && isBooleanAttr(i)) || !util.isString(value);

    if (optionEqual) {
      html.push(' ' + key);
    } else {
      value = value.replace(REG.DOUBLE_QUOTES, '&quot;');
      html.push(' ' + key + '=');
      html.push('"' + value +'"');
    }
  }

  return html.join('');
};