var util = require('utils-extend');
var CssDom = require('cssdom');
var uglifyJS = require("uglify-js");
var uglifyAttributes = require('./attributes');
var elements = require('../lib/elements')

function isJs(name, type, types) {
  return name === 'script' && (!type || types.indexOf(type) !== -1);
}

function recurse(dom, options) {
  var html = [];
  var name = dom.name;

  switch (dom.type) {
    case 'documentType':
      html.push(dom.value);
      break;
    case 'comment':
      if (dom.isIEHack) {
        dom.value = dom.value
                       .replace(/(\[[^\]]+\]\s*>)\s+/, '$1')
                       .replace(/\s+(<!\[endif\])$/, '$1');
        html.push('<!--' + dom.value + '-->');
      }
      break;
    case 'text':
      html.push(dom.value.trim());
      break;
    case 'tag':
      html.push('<' + name + uglifyAttributes(dom, options) + elements.closeTag(options.selfClosed, dom));


      if (!dom.isVoid) {
        if (name === 'style') {
          var css = new CssDom(dom.children[0].value);
          html.push(css.stringify());
        } else if (isJs(name, dom.attributes.type, options.jsCodeType)) {
          try {
            var result = uglifyJS.minify(dom.children[0].value, options.uglifyJS);
            html.push(result.code);
          } catch (e) {
            html.push(dom.children[0].value);
          }
        } else if (isJs(name, dom.attributes.type, options.templateType)) {
          var HtmlDom = require('../htmldom');
          var textHtml = new HtmlDom(dom.children[0].value, null, options._escape);
          html.push(textHtml.stringify(options));
        } else {
          dom.children.forEach(function(item) {
            html.push(recurse(item, options));
          });
        }

        html.push('</' + name + '>');
      }
      break;
  }
  return html.join('');
}

module.exports = function(nodes, options) {
  var html = '';
  options = util.extend({
    // checked="checked" => checked
    booleanAttributes: false,
    // key="value" => key=value
    removeAttributeQuotes: false,
    // <script type="text/javascript"></script> => <script></script>
    removeJsType: true,
    // <style type="text/css"></style> => <style></style>
    removeCssType: true,
    // Custom js code type, like <script type="text/config">{ key: 'value' }</script>
    jsCodeType: [],
    // Js template
    // <script type="text/template"><div></div></script>
    templateType: [],
    // <ul><li></li></ul> => <ul><li></ul>
    removeOptionalTags: false,
    uglifyJS: {
      fromString: true
    }
  }, options);

  options.jsCodeType.push('type/javascript');

  for (var i = 0, l = nodes.length; i < l; i++) {
    html += recurse(nodes[i], options);
  }
  
  return html.trim();
};