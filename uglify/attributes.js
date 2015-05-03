// @see http://stackoverflow.com/questions/706384/boolean-html-attributes
var REG = require('../lib/reg');
var uglifyJS = require("uglify-js");
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
  var html = [];

  if (options.removeJsType && dom.name === 'script' && dom.attributes.type === 'text/javascript') {
    delete dom.attributes.type;
  }

  if (options.removeCssType && dom.name === 'style' && dom.attributes.type === 'text/css') {
    delete dom.attributes.type;
  }
  for (var i in dom.attributes) {
    var key = i.replace(REG.ATTR_BUG, '');
    var optionEqual = (options.booleanAttributes && isBooleanAttr(i)) || dom.attributes[i] === null;

    if (optionEqual) {
      html.push(' ' + key);
    } else {
      var value = dom.attributes[i];
      // uglify inline events
      if (key.indexOf('on') === 0) {
        try {
          var jsCode = 'function __(){' + value +'}';
          jsCode = uglifyJS.minify(jsCode, {
            fromString: true
          });
          value = jsCode.code
                        .replace('function __(){', '')
                        .replace(/\}$/, '');
        } catch (e) {}
      }
      html.push(' ' + key + '="' + value.replace(REG.DOUBLE_QUOTES, '&quot;') + '"');
    }
  }

  return html.join('');
};