"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.uid = uid;
exports.arrayShallowEqual = arrayShallowEqual;
exports.flatMap = flatMap;
exports.normalizeQueryValues = normalizeQueryValues;
exports.oncePerTick = oncePerTick;
exports.renderChildren = renderChildren;
exports.memoize = memoize;

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

var counter = 0;
function uid() {
  // symbols are already unique but `Symbol()` is hard
  // to read for debug logging
  var integer = ++counter * 387420489 % 1000000000;
  return Symbol(integer.toString(32));
}

function arrayShallowEqual(arr1, arr2) {
  if (!Array.isArray(arr1) || !Array.isArray(arr2)) {
    return false;
  }
  if (arr1.length !== arr2.length) {
    return false;
  }
  for (var i = 0; i < arr1.length; i++) {
    if (arr1[i] !== arr2[i]) {
      return false;
    }
  }
  return true;
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
  if (typeof values === "string" && values) {
    return [values];
  }
  if (typeof values === "number" && !isNaN(values)) {
    return [values.toString()];
  }
  if (typeof values === "boolean") {
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

function renderChildren(children) {
  if (!children) {
    return null;
  }
  if (_react2.default.Children.count(children) <= 1) {
    return children;
  }
  return _react2.default.createElement(
    "div",
    null,
    children
  );
}

var strictEqual = function strictEqual(a, b) {
  return a === b;
};
function memoize(func) {
  var prevArg = Symbol();
  var result = void 0;
  return function (arg) {
    if (!strictEqual(prevArg, arg)) {
      result = func(arg);
    }
    prevArg = arg;
    return result;
  };
}