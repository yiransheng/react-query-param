let counter = 0;
export function uid() {
  // symbols are already unique but `Symbol()` is hard 
  // to read for debug logging
  const integer = (++counter) * 387420489 % 1000000000;
  return Symbol(integer.toString(32));
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
