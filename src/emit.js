'use strict';

const t = require('./types');

function emitObject(node) {
  const obj = {};
  for (let i = 1; i < node.children.length; i += 1) {
    if (i % 2 !== 0) {
      const k = emit(node.children[i - 1]); // eslint-disable-line no-use-before-define
      const v = emit(node.children[i]); // eslint-disable-line no-use-before-define
      obj[k] = v;
    }
  }
  return obj;
}

function emitArray(node) {
  const arr = [];
  for (let i = 1; i < node.children.length; i += 1) {
    if (i % 2 !== 0) {
      const k = emit(node.children[i - 1]); // eslint-disable-line no-use-before-define
      const v = emit(node.children[i]); // eslint-disable-line no-use-before-define
      arr[k] = v;
    }
  }
  return arr;
}

function emitNumber(node) {
  return Number(node.value);
}

function emitString(node) {
  return String(node.value);
}

function emitNull() {
  return null;
}

function emitBoolean(node) {
  return node.value;
}

function emit(node) {
  switch (node.type) {
    case t.NODE_OBJECT:
      return emitObject(node);

    case t.NODE_ARRAY:
      return emitArray(node);

    case t.NODE_NUMBER:
      return emitNumber(node);

    case t.NODE_STRING:
      return emitString(node);

    case t.NODE_BOOLEAN:
      return emitBoolean(node);

    case t.NODE_NULL:
      return emitNull(node);

    default:
      throw TypeError(`Unknown node type ${node.type}`);
  }
}

module.exports = emit;
