module.exports = function(tag, selector) {
  if (selector.name) {
    if (tag.name !== selector.name) {
      return false;
    }
  }

  if (selector.class) {
    if (!tag.attributes.class) return false;
    for (var i = 0; i < selector.class.length; i++) {
      if (tag.attributes.class.indexOf(selector.class[i]) === -1) {
        return false;
      }
    }
  }

  for (var i = 0, l = selector.attrs.length; i < l; i++) {
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