var semicolon = /\s*;\s*/;

exports.parser = function(style) {
  var result = {};
  if (!style) return result;

  var match = style.split(semicolon);

  for (var i = 0, l = match.length; i < l; i++) {
    var index = match[i].indexOf(':');

    if (index !== -1) {
      var key = match[i].slice(0, index).trim();
      var value = match[i].slice(index + 1).trim();

      result[key] = value;
    }
  }

  return result;
};

exports.stringify = function(style) {
  var code = [];

  for (var i in style) {
    code.push(i + ':' + style[i] + ';');
  }

  return code.join('');
};