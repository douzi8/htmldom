var VOID_ELEMENTS = require('./elements').VOID_ELEMENTS;
var util = require('utils-extend');
var CssDom = require('cssdom');
var UglifyJS = require("uglify-js");
var jsBeautify = require('js-beautify').js_beautify;

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

/**
 * uglify html code.
 * use cssdom uglify css code
 * use 
 */
exports.stringify = function(doms, options) {
  var html = '';
  options = util.extend({
    indent: '  ',
    uglifyJS: {
      fromString: true
    }
  }, options);

  function recurse(dom) {
    var html = [];
    var name = dom.name;

    switch (dom.type) {
      case 'documentType':
        html.push(dom.value);
        break;
      case 'text':
        html.push(dom.value.trim());
        break;
      case 'tag':
        html.push('<' + name);
        for (var i in dom.attributes) {
          html.push(' ' + i + '="' + dom.attributes[i] + '"');
        }
        html.push('>');

        if (VOID_ELEMENTS.indexOf(name) == -1) {
          if (name === 'style') {
            var css = new CssDom(dom.children[0].value);
            html.push(css.stringify());
          } else if (isJs(name, dom.attributes.type)) {
            try {
              var result = UglifyJS.minify(dom.children[0].value, options.uglifyJS);
              html.push(result.code);
            } catch (e) {
              html.push(dom.children[0].value);
            }
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
          } else if (isJs(name, dom.attributes.type)) {
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