"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.uid = uid;
exports.flatMap = flatMap;
exports.normalizeQueryValues = normalizeQueryValues;
exports.oncePerTick = oncePerTick;

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

var counter = 0;
function uid() {
  // symbols are already unique but `Symbol()` is hard 
  // to read for debug logging
  var integer = ++counter * 387420489 % 1000000000;
  return Symbol(integer.toString(32));
}

function flatMap(array, fn) {
  var _ref;

  var arityOne = function arityOne(x) {
    return fn(x);
  };
  return (_ref = []).concat.apply(_ref, _toConsumableArray(array.map(arityOne)));
}

function normalizeQueryValues(values) {
  // null or undefined
  if (values == null) {
    return [];
  }
  if (typeof values === "string") {
    return [values];
  }
  if (typeof values === "number" || typeof values === "boolean") {
    return [values.toString()];
  }
  if (Array.isArray(values)) {
    return flatMap(values, normalizeQueryValues);
  }
  return [];
}

function oncePerTick(fn) {
  var called = false;
  return function () {
    if (!called) {
      called = true;
      Promise.resolve().then(function () {
        try {
          fn();
        } finally {
          called = false;
        }
      });
    }
  };
}