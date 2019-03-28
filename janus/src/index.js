'use strict';

const colors = require('colors');
const matchers = require('./matchers');
const janus = {
  SILENT: false
};

// Repeats a string n times
const repeat = (str, n) => Array(n).join(str);

// Repeats an indent (of four spaces) n times
const indent = n => repeat('    ', n);

// Indents a string with multiple lines
const indentLines = (str, n) => indent(n) + str.replace(/\n/g, `\n${indent(n)}`);

// Runs every beforeEach callback in the stack
const runEveryBeforeEach = () => {
  beforeEachStack.forEach((level) => level.forEach(cb => cb()));
};

// Logs a string to the console
const log = str => !janus.SILENT && console.log(str);

// Keeps some counters used to print the summary after the execution of a test suite is completed
const summary = { success: 0, fail: 0, disabled: 0 };

// The stack of beforeEach callbacks
const beforeEachStack = [ [] ];
let indentLevel = 0;

// Declares a testing group
const group = (title, cb) => {
  beforeEachStack.push([]);
  indentLevel++;
  log(`\n${indent(indentLevel)}⇨ ${title}`.blue);
  cb();
  indentLevel--;
  beforeEachStack.pop();
};

// Declares a test unit
const check = (title, cb) => {
  runEveryBeforeEach();

  try{
    cb();
    log(`${indent(indentLevel + 1)}${' Passed '.bgGreen.black} ${title.green}`);
    summary.success++;
  } catch(e) {
    log(`${indent(indentLevel + 1)}${' Failed '.bgRed.black} ${title.red}`);
    log(indentLines(e.stack.red, indentLevel + 2));
    summary.fail++;
  }
};

// Disables a test unit
const xcheck = (title, cb) => {
  log(`${indent(indentLevel + 1)}${' Not Checked '.bgWhite.black} ${title.gray}`);
  summary.disabled++;
};

// The assertion function
const verify = (val) => {
  if (val) return true;

  throw new Error('Your Assertion was Incorrect! Please act accordingly!');
};

// Injects all matchers as properties of our assertion function
Object.assign(verify, matchers);

// Prints the test summary and finishes the process with the appropriate exit code
const report = () => {
  log(`\n${repeat('.', 60)}\n`);
  log('Report:\n');
  log(`  Success: ${summary.success}`.green);
  log(`  Fail: ${summary.fail}`.red);
  log(`  Not Checked: ${summary.disabled}\n\n`.yellow);

  if (summary.fail > 0) process.exit(1);
  process.exit(0);
};

// A dead simple (and not human-proof) implementation of the beforeAll function
const beforeAll = cb => cb();

// A simple and functional beforeEach implementation
const beforeEach = (cb) => {
  beforeEachStack[beforeEachStack.length - 1].push(cb);
};

// Exports janus's DSL
const dsl = { verify, check, xcheck, report, group, beforeEach, beforeAll };
module.exports = Object.assign(janus, dsl);
