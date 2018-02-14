// whitespace
exports.WHITESPACE = /^\s+/;

// document type
exports.DOCTYPE = /^<!doctype[^>]*>/i;

// comment start
exports.COMMENT_START = /^<!--/;

// comment end
exports.COMMENT_END = /([\s\S]*?)-->/;

// ie hack
exports.IE_HACK = '<![endif]';

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
exports.OPEN_TAG = /^<([\w-]+)/;

// attrs content
exports.TAG_CONTENT = /^(?:'[^']*'|"[^"]*"|[^>])*/;

// attr match
exports.ATTR = /([^=<>"'\s/]+)(?:\s*=\s*('[^']*'|"[^"]*"|[^\s]*))?/g;

// quote trail
exports.TRIM_QUOTES  = /^['"]|['"]$/g;

// single quote
exports.DOUBLE_QUOTES = /"/g;

// close tag
exports.CLOSE_TAG = /^<\/([\w-]+)\s*>/;

exports.ATTR_BUG = /__\d+$/;