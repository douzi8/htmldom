var REG = {
  TAG: /^(\w+)/,
  ID: /^#(\w+)/,
  CLASS: /^\.(\w+)/,
  ATTR: /^\[([^\]]+)\]/,
  SINGLE_QUOTE: /^'[^]*'/,
  DOUBLE_QUOTE: /^"[^]*"/,
  SPACE: /^\s+/
};

exports.parser = function(selector) {
  var obj = {
    attrs: []
  };
  var str = selector;
  function match(reg) {
    var result = str.match(reg);

    if (result) {
      str = str.slice(result[0].length);
      return result;
    } else {
      return false;
    }
  }
  var matched = match(REG.TAG);
  
  obj.name = matched ? matched[0] : '';

  while (str) {
    if (matched = match(REG.ID)) {
      obj.attrs.push({
        name: 'id',
        operator: '=',
        value: matched[1]
      });
      continue;
    }

    if (matched = match(REG.CLASS)) {
      obj.class = obj.class || [];
      obj.class.push(matched[1]);
      continue;
    }

    if (matched = match(REG.ATTR)) {
      matched = matched[1];
      var index = matched.indexOf('=');

      if (index === -1) {
        obj.attrs.push({
          name: matched
        });
      } else {
        var name = matched.slice(0, index);
        var value = matched.slice(index + 1).replace(/^['"]|['"]$/g, '');
        var operator = name[name.length - 1];
        var ops = ['^', '$', '~', '*'];

        if (ops.indexOf(operator) === -1) {
          operator = '=';
        } else {
          name = name.slice(0, name.length - 1);
        }

        obj.attrs.push({
          name: name,
          operator: operator,
          value: value
        });
      }
      continue;
    }
    
    throw new Error(selector + ' is not a valid selector');
  }

  return obj;
}

// css selector
exports.split = function(selector) {
  var split = [''];
  var matched;

  function match(reg) {
    var result = selector.match(reg);

    if (result) {
      selector = selector.slice(result[0].length);
      return result;
    } else {
      return false;
    }
  }

  selector = selector.trim();

  while (selector) {
    if (match(REG.SPACE)) {
      split.push('');
    }

    if (matched = match(REG.SINGLE_QUOTE)) {
      split[split.length - 1] += matched[0];
      continue;
    }

    if (matched = match(REG.DOUBLE_QUOTE)) {
      split[split.length - 1] += matched[0];
      continue;
    }

    split[split.length - 1] += selector[0];
    selector = selector.slice(1);
  }

  return split;
};