'use strict';

const t = require('./types');

const tokenizeChar = (type, value, input, current) =>
  value === input[current] ? [1, { type, value }] : [0, null];

const tokenizeSeq = (type, first, regexp, input, current) => {
  if (input[current] === first) {
    let value = '';
    let consumedChars = 0;
    let char = input[current + consumedChars];
    while (!value.match(regexp)) {
      value += char;
      consumedChars += 1;
      char = input[current + consumedChars];
    }
    const m = value.match(regexp);
    if (m && m[1] !== undefined) {
      return [consumedChars, { type, value: m[1] }];
    }
    return [consumedChars, { type }];
  }
  return [0, null];
};

const skipWhiteSpace = (input, current) =>
  /\s/.test(input[current]) ? [1, null] : [0, null];

const tokenizeArrayOpen = (input, current) =>
  tokenizeSeq(t.TOKEN_BRACKET_OPEN, 'a', /^a:\d+:\{$/, input, current);

const tokenizeArrayClose = (input, current) =>
  tokenizeChar(t.TOKEN_BRACKET_CLOSE, '}', input, current);

const tokenizeString = (input, current) =>
  tokenizeSeq(t.TOKEN_STRING, 's', /^s:\d+:"(.*?)";$/, input, current);

const tokenizeNumber = (input, current) =>
  tokenizeSeq(t.TOKEN_NUMBER, 'i', /^i:(\d+);$/, input, current);

const tokenizeFloat = (input, current) =>
  tokenizeSeq(t.TOKEN_NUMBER, 'd', /^d:(\d+(\.\d+)?);$/, input, current);

const tokenizeBoolean = (input, current) =>
  tokenizeSeq(t.TOKEN_BOOLEAN, 'b', /^b:(1|0);$/, input, current);

const tokenizeNull = (input, current) =>
  tokenizeSeq(t.TOKEN_NULL, 'N', /^N;$/, input, current);

const tokenizers = [
  skipWhiteSpace,
  tokenizeBoolean,
  tokenizeNumber,
  tokenizeFloat,
  tokenizeString,
  tokenizeNull,
  tokenizeArrayOpen,
  tokenizeArrayClose,
];

function tokenize(input) {
  let current = 0;
  const tokens = [];
  while (current < input.length) {
    let tokenized = false;
    // eslint-disable-next-line no-loop-func
    tokenizers.forEach(tokenizer => {
      if (tokenized) {
        return;
      }
      const [consumedChars, token] = tokenizer(input, current);
      if (consumedChars !== 0) {
        tokenized = true;
        current += consumedChars;
      }
      if (token) {
        tokens.push(token);
      }
    });
    if (!tokenized) {
      throw new TypeError(
        `I dont know what this character is: ${input.slice(current)}`
      );
    }
  }
  return tokens;
}

module.exports = tokenize;
