'use strict';

const tokenize = require('./tokenize');
const parse = require('./parse');
const emit = require('./emit');

function unserialize(value) {
  const tokens = tokenize(value);
  const ast = parse(tokens);
  return emit(ast);
}

module.exports = unserialize;
