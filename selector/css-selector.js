// css selector
module.exports = function(selector) {
  var obj = {
    name: '',
    attrs: []
  };
  selector = selector.replace(/^(\w+)/, function(match, $1) {
    obj.name = $1;
    return '';
  });
  selector = selector.replace(/#(\w+)/, function(match, $1) {
    obj.attrs.push({
      name: 'id',
      operator: '=',
      value: $1
    });
  });
  selector = selector.replace(/\.(\w+)/g, function(match, $1) {
    obj.class = obj.class || [];
    obj.class.push($1);
    return '';
  });
  selector.replace(/\[([^\]]+)\]/, function(match, $1) {
    var index = $1.indexOf('=');

    if (index === -1) {
      obj.attrs.push({
        name: $1
      });
    } else {
      var name = $1.slice(0, index);
      var value = $1.slice(index + 1).replace(/^['"]|['"]$/g, '');
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
  });

  return obj;
};