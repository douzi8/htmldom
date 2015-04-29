var util = require('utils-extend');
var CssDom = require('cssdom');
var uglifyJS = require("uglify-js");
var ELS = require('../lib/elements');
var VOID_ELEMENTS = ELS.VOID_ELEMENTS;
var OPTIONAL_TAGS = ELS.OPTIONAL_TAGS;
var uglifyAttributes = require('./attributes');

function isJs(name, type, types) {
  return name === 'script' && (!type || types.indexOf(type) !== -1);
}

module.exports = function(doms, options) {
  var html = '';
  options = util.extend({
    // checked="checked" => checked
    booleanAttributes: false,
    removeJsType: true,
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

  function recurse(dom) {
    var html = [];
    var name = dom.name;

    switch (dom.type) {
      case 'documentType':
        html.push(dom.value);
        break;
      case 'comment':
        if (dom.isIEHack) {
          html.push('<!--' + dom.value.trim() + '-->');
        }
        break;
      case 'text':
        html.push(dom.value.trim());
        break;
      case 'tag':
        html.push('<' + name + uglifyAttributes(dom, options) + '>');

        if (VOID_ELEMENTS.indexOf(name) == -1) {

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
            var textHtml = new HtmlDom(dom.children[0].value);
            html.push(textHtml.stringify(options));
          } else {
            dom.children.forEach(function(item) {
              html.push(recurse(item));
            });
          }

          html.push('</' + name + '>');
        }
        break;
    }
    return html.join('');
  }

  for (var i = 0, l = doms.length; i < l; i++) {
    html += recurse(doms[i]);
  }

  return html.trim();
};