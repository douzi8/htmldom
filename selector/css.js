var REG = {
  TAG: /^(\w+)/,
  ID: /^#(\w+)/,
  CLASS: /^\.(\w+)/,
  ATTR: /^\[([^\]]+)\]/,
  ALL: /^\*/,
  SINGLE_QUOTE: /^'[^]*'/,
  DOUBLE_QUOTE: /^"[^]*"/,
  SPACE: /^\s+/,
  CLASS_SPLIT: /\s+/,
  CSS_OP: /^\s*([>+~])\s*/
};

/**
 * @example
 * div.cls#id
 * {
 *   name: div,
 *   class: ['cls'],
 *   attrs: [
 *     { name: 'id', operator: '=', value: '' }
 *   ] 
 * }
 */
function parser(selector) {
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

    if (match(REG.ALL)) {
      continue;
    }
    
    throw new Error(selector + ' is not a valid selector');
  }

  return obj;
}

function match(tag, selector) {
  if (selector.name && tag.name !== selector.name) {
    return false;
  }
  var i;

  if (selector.class) {
    if (!tag.attributes.class) return false;
    var cls = tag.attributes.class.split(REG.CLASS_SPLIT);
    for (i = 0; i < selector.class.length; i++) {
      if (cls.indexOf(selector.class[i]) === -1) {
        return false;
      }
    }
  }

  for (i = 0, l = selector.attrs.length; i < l; i++) {
    var item = selector.attrs[i];
    var itemValue = item.value;
    var tagValue = tag.attributes[item.name] || '';

    switch (item.operator) {
      case '=':
        if (tagValue !== itemValue) {
          return false;
        }
        break;
      case '^':
        if (tagValue.indexOf(itemValue) !== 0) {
          return false;
        }
        break;
      case '$':
        if (tagValue.slice(tagValue.length - itemValue.length) !== itemValue) {
          return false;
        }
        break;
      case '~':
        var reg = new RegExp('(^|\\b)' + itemValue + '(\\b|$)');
        if (!reg.test(tagValue)) {
          return false;
        }
        break;
      case '*':
        if (tagValue.indexOf(itemValue) === -1) {
          return false;
        }
        break;
      default:
        if (!tag.attributes.hasOwnProperty(item.name)) {
          return false;
        }
    }
  }

  return true;
}

/* 
 * .item li > a
  [{
    name: 'a'
  }, {
    operator: '>',
    name: 'li',
    attrs: [{

    }]
  }, {
    class: ['item']
  }] 
*/
function split(selector) {
  var ret = [''];
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
    if (matched = match(REG.ATTR)) {
      ret[ret.length - 1] += matched[0];
      continue;
    }

    if (matched = match(REG.CSS_OP)) {
      ret.push(matched[1]);
      ret.push('');
    } else if (match(REG.SPACE)) {
      ret.push('');
    }

    ret[ret.length - 1] += selector[0];
    selector = selector.slice(1);
  }

  var result = [];

  ret.reduceRight(function(pre, current) {
    if (REG.CSS_OP.test(current)) {
      return current;
    } else {
      var parserObj = parser(current);

      if (pre) {
        parserObj.operator = pre;
      }

      result.push(parserObj);
    }
  }, '');

  return result;
}

exports.parser = parser;

exports.match = match;

exports.split = split;