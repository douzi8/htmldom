var REG = {
  TAG: /^([\w-]+)/,
  ID: /^#([\w-]+)/,
  CLASS: /^\.([\w-]+)/,
  ATTR: /^\[([^\]]+)\]/,
  ALL: /^\*/,
  SPACE: /^\s+/,
  CLASS_SPLIT: /\s+/,
  CSS_OP: /^\s*([>+~\s])\s*/,
  OBJECT: /^[\[\{]/,
  CAPTIAL: /([A-Z])/g,
  NUMBER: /^[0-9]+$/
};

module.exports = REG;