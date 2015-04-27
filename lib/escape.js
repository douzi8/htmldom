exports.escape = function(str) {
  return str.replace(/[<=>"' ]/g, escape);
};

exports.unescape = function(str) {
  return str.replace(/(%3C|%3D|%3E|%22|%27|%20)/g, unescape);
};