import React from "react";

let counter = 0;
export function uid() {
  // symbols are already unique but `Symbol()` is hard
  // to read for debug logging
  const integer = ++counter * 387420489 % 1000000000;
  return Symbol(integer.toString(32));
}

export function arrayShallowEqual(arr1, arr2) {
  if (!Array.isArray(arr1) || !Array.isArray(arr2)) {
    return false;
  }
  if (arr1.length !== arr2.length) {
    return false;
  }
  for (let i = 0; i < arr1.length; i++) {
    if (arr1[i] !== arr2[i]) {
      return false;
    }
  }
  return true;
}

export function flatMap(array, fn) {
  const arityOne = x => fn(x);
  return [].concat(...array.map(arityOne));
}

export function normalizeQueryValues(values) {
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

export function oncePerTick(fn) {
  let called = false;
  return () => {
    if (!called) {
      called = true;
      Promise.resolve().then(() => {
        try {
          fn();
        } finally {
          called = false;
        }
      });
    }
  };
}

export function renderChildren(children) {
  if (!children) {
    return null;
  }
  if (React.Children.count(children) <= 1) {
    return children;
  }
  return <div>{children}</div>;
}

const strictEqual = (a, b) => a === b;
export function memoize(func) {
  let prevArg = Symbol();
  let result;
  return (arg) => {
    if (!strictEqual(prevArg, arg)) {
      result = func(arg);
      if (typeof result === "function") {
        result = memoize(result);
      }
    } 
    prevArg = arg;
    return result;
  };
}
