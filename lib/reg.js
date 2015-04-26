// whitespace
exports.WHITESPACE = /^\s+/;

// document type
exports.DOCTYPE = /^<!doctype[^>]*>/i;

// comment start
exports.COMMENT_START = /^<!--/;

// comment end
exports.COMMENT_END = /([\s\S]*?)-->/;

// raw text elements
exports.RAW_TAG = /^<(script|style|textarea)/;

var STYLE_RAW = /[\s\S]*?(?=<\/style>)/;
var SCRIPT_RAW = /[\s\S]*?(?=<\/script>)/;
var TEXTARE_RAW = /[\s\S]*?(?=<\/textarea>)/;

// raw text element end
exports.RAW_TAG_END = function(name) {
  switch (name) {
    case 'style':
      return STYLE_RAW;
    case 'script':
      return SCRIPT_RAW;
    case 'textarea':
      return TEXTARE_RAW;
  }
};

// open tag
exports.OPEN_TAG = /^<(\w+)/;

// attrs content
exports.TAG_CONTENT = /^(?:'[^']*'|"[^"]*"|[^>])*/;

// attr match
exports.ATTR = /([^=<>\"\'\s\/]+)(?:\s*=\s*('[^']*'|"[^"]*"|[^\s]*)|\s|$)/g;

// quote trail
exports.TRIM_QUOTES  = /^['"]|['"]$/g;

// single quote
exports.DOUBLE_QUOTES = /"/g;

// close tag
exports.CLOSE_TAG = /^<\/(\w+)\s*>/;

// css selector
exports.cssSelector = function(selector) {
  var name = selector.match(/^\w+/);
  var cls = selector.match(/\.\w+/g);
  var id = selector.match(/#(\w+)/);
  var attrs = selector.match(/\[([^\]]+)\]/);
  var obj = {
    name: name ? name[0] : '',
    attrs: {}
  };

  if (id) {
    obj.attrs.id = id[1]; 
  }

  if (cls) {
    obj.attrs.class = cls.join(' ').replace(/\./g, '');
  }

  if (attrs) {
    attrs = attrs[1];
    var index = attrs.indexOf('=');

    if (index === -1) {
      obj.attrs[attrs] = '';
    } else {
      obj.attrs[attrs.slice(0, index)] = attrs.slice(index + 1).replace(exports.TRIM_QUOTES, '');
    }
  }

  return obj;
};