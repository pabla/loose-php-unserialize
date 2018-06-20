'use strict';

const t = require('./types');

const parseNumber = (tokens, current) => [
  current + 1,
  {
    type: t.NODE_NUMBER,
    value: tokens[current].value,
  },
];

const parseString = (tokens, current) => [
  current + 1,
  {
    type: t.NODE_STRING,
    value: tokens[current].value,
  },
];

const parseBoolean = (tokens, current) => [
  current + 1,
  {
    type: t.NODE_BOOLEAN,
    value: Number(tokens[current].value) === 1,
  },
];

const parseNull = (tokens, current) => [
  current + 1,
  {
    type: t.NODE_NULL,
    value: null,
  },
];

const parseArray = (tokens, current) => {
  let index = current + 1;
  let token = tokens[index];
  let node;
  let child;
  if (token && token.type !== t.TOKEN_NUMBER) {
    node = {
      type: t.NODE_OBJECT,
      children: [],
    };
  } else {
    node = {
      type: t.NODE_ARRAY,
      children: [],
    };
  }
  while (token && token.type !== t.TOKEN_BRACKET_CLOSE) {
    // eslint-disable-next-line no-use-before-define
    [index, child] = parseToken(tokens, index);
    node.children.push(child);
    token = tokens[index];
  }
  index += 1;
  return [index, node];
};

const parseToken = (tokens, current) => {
  const token = tokens[current];
  switch (token.type) {
    case t.TOKEN_NUMBER:
      return parseNumber(tokens, current);

    case t.TOKEN_STRING:
      return parseString(tokens, current);

    case t.TOKEN_BOOLEAN:
      return parseBoolean(tokens, current);

    case t.TOKEN_NULL:
      return parseNull(tokens, current);

    case t.TOKEN_BRACKET_OPEN:
      return parseArray(tokens, current);

    default:
      throw new TypeError(`Unknown token type ${token.type}`);
  }
};

function parse(tokens) {
  let current = 0;
  let ast;
  let node;
  while (current < tokens.length) {
    [current, node] = parseToken(tokens, current);
    if (!ast) {
      ast = node;
    }
  }
  return ast;
}

module.exports = parse;
