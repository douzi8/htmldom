var REG = require('./reg');

/**
 * @example
 * div.cls#id > a
 * [{
 *   name: 'a',
 *   attrs: [] 
 * }, {
 *   name: div,
 *   class: ['cls'],
 *   operator: '>'
 *   attrs: [
 *     { name: 'id', operator: '=', value: '' }
 *   ] 
 * }]
 */
function parser(selector) {
  var str = selector.trim();
  var start = true;
  var ret = [];
  var item;
  var matched;

  function match(reg) {
    var result = str.match(reg);
    if (result) {
      str = str.slice(result[0].length);
      return result;
    } else {
      return false;
    }
  }

  while (str) {
    if (start) {
      item = {
        attrs: [],
        name: ''
      };

      if (matched = match(REG.TAG)) {
        item.name = matched[0].toLowerCase();
      }
      
      start = false;
      continue;
    }

    if (matched = match(REG.ID)) {
      item.attrs.push({
        name: 'id',
        operator: '=',
        value: matched[1]
      });
      continue;
    }

    if (matched = match(REG.CLASS)) {
      item.class = item.class || [];
      item.class.push(matched[1]);
      continue;
    }

    if (matched = match(REG.ATTR)) {
      matched = matched[1];
      var index = matched.indexOf('=');

      if (index === -1) {
        item.attrs.push({
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

        item.attrs.push({
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

    if (matched = match(REG.CSS_OP)) {
      item.operator = matched[1];
      ret.push(item);
      start = true;
      continue;
    }
    
    throw new Error(selector + ' is not a valid selector');
  }

  if (!start) {
    ret.push(item);
  }

  if (!ret.length) {
    throw new Error(selector + ' is not a valid selector');
  }

  return ret.reverse();
}
// Check the tag is matched
function match(tag, selector) {
  if (selector.name && tag.name !== selector.name) {
    return false;
  }
  var i, l;

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

exports.parser = parser;

exports.match = match;