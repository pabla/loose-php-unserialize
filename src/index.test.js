'use strict';

const test = require('tape');
const unserialize = require('./index');

test('unserialize empty array', t => {
  const buf = 'a:0:{}';
  t.deepEqual(unserialize(buf), []);
  t.end();
});

test('unserialize float', t => {
  const buf = 'd:123.45;';
  t.equal(unserialize(buf), 123.45);
  t.end();
});

test('unserialize various types', t => {
  const buf =
    'a:5:{s:7:"boolean";b:1;s:7:"integer";i:123;s:5:"float";d:123.45;s:4:"null";N;s:6:"string";s:6:"Hello!";}';
  t.deepEqual(unserialize(buf), {
    boolean: true,
    integer: 123,
    float: 123.45,
    null: null,
    string: 'Hello!',
  });
  t.end();
});

test('unserialize empty string', t => {
  const buf = 's:0:"";';
  t.equal(unserialize(buf), '');
  t.end();
});

test('unserialize string', t => {
  const buf = 's:26:"This is an awesome string!";';
  t.equal(unserialize(buf), 'This is an awesome string!');
  t.end();
});

test('unserialize string with semicolon', t => {
  const buf = 's:43:"Семён Слепаков: Ол&#233;-Ол&#233;-Ол&#233;!";';
  t.equal(unserialize(buf), 'Семён Слепаков: Ол&#233;-Ол&#233;-Ол&#233;!');
  t.end();
});
