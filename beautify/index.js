var VOID_ELEMENTS = require('../lib/elements').VOID_ELEMENTS;
var util = require('utils-extend');
var CssDom = require('cssdom');
var jsBeautify = require('js-beautify');
var REG = require('../lib/reg');

// for front
if (typeof window !== 'undefined') {
  window.jsBeautify = jsBeautify;
}

function getIndent(indent, depth) {
  var str = '';

  while (depth--) {
    str += indent;
  }

  return str;
}

function isJs(name, type) {
  return name === 'script' && (!type || type === 'text/javascript');
}

module.exports = function(nodes, options) {
  var html = [];
  options = util.extend({
    indent: '  ',
    jsBeautify: {
      indent_size: 2
    }
  }, options);

  function recurse(dom, depth) {
    var html = [];
    var indent = getIndent(options.indent, depth);
    var name = dom.name;
    var newline = '\n' + indent;

    switch (dom.type) {
      case 'documentType':
        html.push(dom.value);
        break;
      case 'text':
        var value = dom.value.trim();
        if (value) {
          html.push(newline + value);
        }
        break;
      case 'comment':
        if (dom.isIEHack) {
          dom.value = dom.value
            .replace(/(\[[^\]]+\]\s*>)\s+/, '$1')
            .replace(/\s+(<!\[endif\])$/, '$1');
        }
        html.push(newline + '<!--' + dom.value + '-->');
        break;
      case 'tag':
        html.push(newline + '<' + name);
        for (var i in dom.attributes) {
          var key = i.replace(REG.ATTR_BUG, '');
          if (dom.attributes[i] === null) {
            html.push(' ' + key);
          } else {
            html.push(' ' + key + '="' + dom.attributes[i].replace(REG.DOUBLE_QUOTES, '&quot;') + '"');
          }
        }
        html.push('>');

        if (VOID_ELEMENTS.indexOf(name) == -1) {
          // beautify style tag
          if (name === 'style') {
            var css = new CssDom(dom.children[0].value);
            var cssbeaut = css.beautify({
              indent: options.indent
            }).replace(/\n/g, newline);
            html.push(newline + cssbeaut);
          } else if (isJs(name, dom.attributes.type)) {
            if (dom.attributes.src) {
              html.push('</script>');
            } else {
              var jsbeaut = jsBeautify(dom.children[0].value, options.jsBeautify).replace(/\n/g, newline);
              html.push(newline + jsbeaut);
              html.push(newline + '</script>');
            }
          } else {
            dom.children.forEach(function(item) {
              html.push(recurse(item, depth + 1));
            });
          }
          if (name !== 'script') {
            html.push(newline + '</' + name + '>');
          }
        }
    }
    depth++;
    return html.join('');
  }

  for (var i = 0, l = nodes.length; i < l; i++) {
    html.push(recurse(nodes[i], 0));
  }

  return html.join('').trim();
};