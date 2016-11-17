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
    var optionEqual = (options.booleanAttributes && isBooleanAttr(i)) || !value;

    if (optionEqual) {
      html.push(' ' + key);
    } else {
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
      } else if (key === 'style') {
        // ugliy inline style
        value = 'a{' + value + '}';
        var css = new CssDom(value);
        value = css.stringify()
                   .replace('a{', '')
                   .replace(/\}$/, ''); 
      }

      value = value.replace(REG.DOUBLE_QUOTES, '&quot;');
      html.push(' ' + key + '=');
      // data-url="accident/test"
      if (options.removeAttributeQuotes && !/(\s|\/)/.test(value)) {
        html.push(value);
      } else {
        html.push('"' + value +'"');
      }
    }
  }

  return html.join('');
};