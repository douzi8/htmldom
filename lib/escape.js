var map = (function() {
  var arr1 = ['<', '=', '>','"', "'", ' '];
  var arr2 = ['&lt;', '&#61;', '&gt;', '&quot;', '&#x27;', '&nbsp;'];
  var escape = {};
  var unescape = {};

  for (var i = 0, l = arr1.length; i < l; i++) {
    escape[arr1[i]] = arr2[i];
    unescape[arr2[i]] = arr1[i];
  }

  return {
    escape: escape,
    unescape: unescape
  };
})();

exports.escape = function(str) {
  return str.replace(/[<=>"' ]/g, function(match) {
    return map.escape[match];
  });
};

exports.unescape = function(str) {
  return str.replace(/(&lt;|&#61;|&gt;|&quot;|&#x27;|&nbsp;)/g, function(match) {
    return map.unescape[match];
  });
};