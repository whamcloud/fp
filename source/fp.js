//
// Copyright (c) 2018 DDN. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.

import * as maybe from "@iml/maybe";

export const unary = fn => x => fn(x);

export const map = fn => xs => xs.map(unary(fn));

export const filter = fn => xs => xs.filter(unary(fn));

export const tap = fn => xs => {
  xs.forEach(unary(fn));

  return xs;
};

export const reduce = accum => f => xs => {
  return Array.isArray(xs) ? xs.reduce((x, y) => f(x, y), accum) : xs.reduce(accum, (x, y) => f(x, y));
};

export const some = fn => xs => xs.some(unary(fn));

export const every = fn => xs => xs.every(unary(fn));

export const find = fn => xs => maybe.of(xs.find(fn));

export const pluck = key => xs => map(xs => xs[key])(xs);

export const identity = x => x;

export const always = x => () => x;

export const True = always(true);
export const False = always(false);

export const lens = get => set => {
  return fn => xs => map(v => set(v, xs))(fn(get(xs)));
};

export const differenceBy = fn => xs => ys => {
  const result = xs.reduce((arr, x) => {
    if (!ys.find(y => fn(x) === fn(y))) arr.push(x);

    return arr;
  }, []);

  return uniqBy(fn)(result);
};

export const difference = differenceBy(identity);

export const intersectionBy = fn => xs => ys => {
  const result = xs.reduce((arr: T[], x: T) => {
    if (ys.find(y => fn(x) === fn(y))) arr.push(x);

    return arr;
  }, []);

  return uniqBy(fn)(result);
};

const getConst = x => {
  return {
    value: x,
    map() {
      return this;
    }
  };
};

export const view = lens => xs => lens(getConst)(xs).value;

const getIdentity = x => ({
  value: x,
  map(fn) {
    return getIdentity(fn(x));
  }
});

export const over = lens => fn => xs => lens(ys => getIdentity(fn(ys)))(xs).value;

export const set = lens => value => xs => over(lens)(always(value))(xs);

const getValue = x => x.value;

export const mapped = fn => x =>
  getIdentity(
    map(
      flow(
        fn,
        getValue
      )
    )(x)
  );

export const lensProp = prop =>
  lens(xs => xs[prop])((v, xs) => {
    const keys = Object.keys(xs);
    const container = Array.isArray(xs) ? [] : {};

    const out = keys.reduce((container, key) => {
      container[key] = xs[key];
      return container;
    }, container);
    out[prop] = v;

    return out;
  });

export const flow = (...fns) => (...args) =>
  fns.reduce((xs, fn, idx) => (idx === 0 ? fn.apply(null, xs) : fn(xs)), args);

export const compose = (...fns) => flow.apply(null, fns.reverse());

export const cond = (...args) => x => {
  let result;

  args.some(pair => {
    if (pair[0](x)) {
      result = pair[1](x);
      return true;
    }
  });

  return result;
};

export const not = x => !x;

export const eq = a => b => (a && typeof a.equals === "function" ? a.equals(b) : a === b);

export const eqFn = fnA => fnB => a => b => eq(fnA(a))(fnB(b));

export const invoke = fn => args => fn.apply(null, args);

export const noop = () => {};

export const and = predicates => val => predicates.reduce((curr, predicate) => curr && predicate(val), true);

export const or = predicates => val => predicates.reduce((curr, predicate) => curr || predicate(val), false);

export const bindMethod = meth => obj => obj[meth].bind(obj);

export const invokeMethod = meth => args => obj => obj[meth].apply(obj, args);

export const zipObject = keys => vals =>
  keys.reduce((obj, val, index) => {
    obj[val] = vals[index];
    return obj;
  }, {});

export const unwrap = xs => xs.reduce((arr, x) => arr.concat(x), []);

export const head = xs => maybe.of(xs[0]);

export const tail = xs => xs.slice(1);

export const last = xs => maybe.of(xs.slice(-1)[0]);

export const arrayWrap = x => [x];

export function once(fn) {
  let called = false;

  return function innerOnce() {
    if (called) return;

    called = true;

    fn.apply(null, arguments);
  };
}

export const either = fn => x => (x instanceof Error ? x : fn(x));

export const mapFn = fns => args => map(x => invoke(x)(args))(fns);

export const chainL = fn => args => args.reduce((x, y) => fn(x, y));

export const xProd = a => b => {
  const result = [];

  a.forEach(a => {
    b.forEach(b => result.push([a, b]));
  });

  return result;
};

export const anyPass = fns => x => some(fn => fn(x))(fns);

export const zipBy = fn => left => right => {
  const min = Math.min(left.length, right.length);
  left.length = min;
  right.length = min;

  return left.reduce((prev: Array<any>, cur: any, idx: number) => {
    return prev.concat(fn(cur, right[idx]));
  }, []);
};

export const memoize = fn => {
  const cache = [];

  return function memo(...args) {
    let result;

    const match = cache.some(xs => {
      const cacheHit = args.length === xs.length - 1 && args.every((x, idx) => x === xs[idx]);

      if (cacheHit) {
        result = xs.slice(xs.length - 1).pop();
        return true;
      } else {
        return false;
      }
    });

    if (match) {
      return result;
    } else {
      const out = fn.apply(null, args);
      cache.push(args.concat([out]));
      return out;
    }
  };
};

export const uniqBy = fn => xs => {
  const set = [];
  const out = [];

  xs.forEach(x => {
    const result = fn(x);

    if (set.indexOf(result) === -1) {
      set.push(result);
      out.push(x);
    }
  });

  return out;
};

export const times = fn => num => {
  const list = [];
  let idx = 0;

  while (idx < num) {
    list[idx] = fn(idx);
    idx += 1;
  }

  return list;
};

function isClass(x: mixed) {
  return typeof x === "function" && x.toString().indexOf("class") > -1;
}

export const match = xs => x => {
  const result = xs.find(([k]) => {
    return (isClass(k) && x instanceof k) || (typeof k === "function" && !isClass(k) && k() === x) || x === k;
  });

  if (result) return result[1](x);
  else throw new Error(`could not match on ${String.toString(x)}`);
};
