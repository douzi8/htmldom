var VOID_ELEMENTS = require('./elements').VOID_ELEMENTS;
var CssDom = require('cssdom');
var jsBeautify = require('js-beautify').js_beautify;
var util = require('utils-extend');

function getIndent(indent, depth) {
  var str = '';

  while (depth--) {
    str += indent;
  }

  return str;
}

exports.stringify = function(doms) {
  var depth;
  var html = '';

  function recurse(dom) {
    var html = '';
    switch (dom.type) {
      case 'documentType':
        html += dom.value;
        break;
      case 'text':
        html += dom.value;
        break;
      case 'comment':
        html += '<!--' + dom.value + '-->';
        break;
      case 'tag':
        html += '<' + dom.name;
        for (var i in dom.attributes) {
          html += ' ' + i + '="' + dom.attributes[i] + '"';
        }
        html += '>';

        if (VOID_ELEMENTS.indexOf(dom.name) == -1) {
          dom.children.forEach(function(item) {
            html += recurse(item);
          });

          html += '</' + dom.name + '>';
        }
    }
    return html;
  }

  for (var i = 0, l = doms.length; i < l; i++) {
    depth = '';
    html += recurse(doms[i]);
  }

  return html;
};

exports.beautify = function(doms, options) {
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
        html.push(dom.value.trim());
        break;
      case 'comment':
        html.push('<!--' + dom.value.trim() + '-->');
        break;
      case 'tag':
        html.push(newline + '<' + name);
        for (var i in dom.attributes) {
          html.push(' ' + i + '="' + dom.attributes[i] + '"');
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
          } else if (name === 'script' && (!dom.attributes.type || dom.attributes.type === 'text/javascript')) {
            var jsbeaut = jsBeautify(dom.children[0].value, options.jsBeautify).replace(/\n/g, newline);

            html.push(newline + jsbeaut);
          } else {
            dom.children.forEach(function(item) {
              html.push(recurse(item, depth + 1));
            });
          }
          html.push(newline + '</' + name + '>');
        }
    }
    depth++;
    return html.join('');
  }

  for (var i = 0, l = doms.length; i < l; i++) {
    html.push(recurse(doms[i], 0));
  }

  return html.join('').trim();
};