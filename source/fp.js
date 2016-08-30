//
// INTEL CONFIDENTIAL
//
// Copyright 2013-2016 Intel Corporation All Rights Reserved.
//
// The source code contained or described herein and all documents related
// to the source code ("Material") are owned by Intel Corporation or its
// suppliers or licensors. Title to the Material remains with Intel Corporation
// or its suppliers and licensors. The Material contains trade secrets and
// proprietary and confidential information of Intel or its suppliers and
// licensors. The Material is protected by worldwide copyright and trade secret
// laws and treaty provisions. No part of the Material may be used, copied,
// reproduced, modified, published, uploaded, posted, transmitted, distributed,
// or disclosed in any way without Intel's prior express written permission.
//
// No license under any patent, copyright, trade secret or other intellectual
// property right is granted to or conferred upon you by disclosure or delivery
// of the Materials, either expressly, by implication, inducement, estoppel or
// otherwise. Any license under such intellectual property rights must be
// express and approved by Intel in writing.


export const __ = {
  '@@functional/placeholder': true
};

function _type (val):string {
  if (val === null)
    return 'Null';
  else if (val === undefined)
    return 'Undefined';
  else
    return Object.prototype.toString
      .call(val)
      .slice(8, -1);
}

export const curry0 = fn => curry(0, fn);

export const curry1 = fn => curry(1, fn);

export const curry2 = fn => curry(2, fn);

export const curry3 = fn => curry(3, fn);

export const curry4 = fn => curry(4, fn);

function curry (n, fn) {
  return function innerCurry () {
    var args = new Array(arguments.length);
    for (var i = 0, l = arguments.length; i < l; i++)
      args[i] = arguments[i];

    var gaps = n - args.length;
    gaps += args
      .filter(x => x === __)
      .length;

    if (gaps > 0)
      return curry (gaps, (...innerArgs) => {
        const filledArgs = args.map(x => {

          if (x === __)
            return innerArgs.shift();

          return x;
        });

        return fn.apply(null, filledArgs.concat(innerArgs).slice(0, n));
      });
    else
      return fn.apply(null, args.slice(0, n));
  };
}

export const map = curry2((fn, xs) => xs.map(curry1(fn)));

export const filter = curry2((fn, xs) => xs.filter(curry1(fn)));

export const tap = curry2((fn, xs) => {
  if (typeof xs.tap === 'function')
    xs = xs.tap(curry1(fn));
  else
    xs.forEach(curry1(fn));

  return xs;
});

export const reduce = curry3((accum, f, xs) => {
  return (Array.isArray(xs)) ? xs.reduce(curry2(f), accum) : xs.reduce(accum, curry2(f));
});

export const some = curry2((fn, xs) => xs.some(curry1(fn)));

export const every = curry2((fn, xs) => xs.every(curry(1, fn)));

export const find = curry2((fn, xs) => filter(fn, xs)[0]);

export const pluck = curry2((key, xs) => map(xs => xs[key], xs));

export const identity = x => x;

export const always = x => () => x;

export const True = always(true);
export const False = always(false);

export const lens = curry2((get, set) => {
  return fn => xs => map(
    (v) => set(v, xs),
    fn(get(xs))
  );
});

export const differenceBy = curry3(function differenceBy (fn, xs, ys) {
  const result = xs.reduce((arr, x) => {
    if (!find(y => fn(x) === fn(y), ys))
      arr.push(x);

    return arr;
  }, []);

  return uniqBy(fn, result);
});

export const difference = differenceBy(identity);

export const intersectionBy = curry(3, function intersectionBy <T>(fn:(p:T) => mixed, xs:T[], ys:T[]):T[] {
  const result = xs.reduce((arr:T[], x:T) => {
    if (find(y => fn(x) === fn(y), ys))
      arr.push(x);

    return arr;
  }, []);

  return uniqBy(fn, result);
});

const getConst = x => {
  return {
    value: x,
    map () { return this; }
  };
};

export const view = curry2((lens, xs) => lens(getConst)(xs).value);

const getIdentity = x => ({
  value: x,
  map (fn) {
    return getIdentity(fn(x));
  }
});

export const over = curry3((lens, fn, xs) => lens(
  ys => getIdentity(fn(ys))
)(xs).value);

export const set = curry3((lens, value, xs) => over(lens, always(value), xs));

const getValue = x => x.value;

export const mapped = curry2((fn, x) => getIdentity(map(flow(fn, getValue), x)));

export const lensProp = prop => lens(
  xs => xs[prop],
  (v, xs) => {
    const keys = Object.keys(xs);
    const container = Array.isArray(xs) ? [] : {};

    const out = keys.reduce((container, key) => {
      container[key] = xs[key];
      return container;
    }, container);
    out[prop] = v;

    return out;
  }
);


export const flow = (...fns) => (...args) => fns.reduce(
  (xs, fn, idx) => idx === 0 ? fn.apply(null, xs) : fn(xs),
  args
);

export const compose = (...fns) => flow.apply(null, fns.reverse());

export const cond = (...args) => x => {
  var result;

  args.some(pair => {
    if (pair[0](x)) {
      result = pair[1](x);
      return true;
    }
  });

  return result;
};


export const not = x => !x;

export const eq = curry2(
  (a, b) => _type(a) === 'Object' && typeof a.equals === 'function' ?
  a.equals(b) :
  a === b
);

export const eqFn = curry4((fnA, fnB, a, b) => eq(fnA(a), fnB(b)));

export const invoke = curry2((fn, args) => fn.apply(null, args));

export const noop = () => {};

export const and = curry2((predicates, val) => predicates.reduce(
  (curr, predicate) => curr && predicate(val),
  true)
);

export const or = curry2((predicates, val) => predicates.reduce(
  (curr, predicate) => curr || predicate(val),
  false
));

export const bindMethod = curry2((meth, obj) => obj[meth].bind(obj));

export const invokeMethod = curry3((meth, args, obj) => obj[meth].apply(obj, args));

export const zipObject = curry2((keys, vals) =>
  keys.reduce((obj, val, index) => {
    obj[val] = vals[index];
    return obj;
  }, {})
);

export const unwrap = xs => xs.reduce((arr, x) => arr.concat(x), []);

export const head = xs => xs[0];

export const tail = xs => xs.slice(1);

export const arrayWrap = x => [x];

export function once (fn) {
  var called = false;

  return function innerOnce () {
    if (called)
      return;

    called = true;

    fn.apply(null, arguments);
  };
}

export const either = curry2((fn, x) => x instanceof Error ? x : fn(x));

export const mapFn = curry2((fns, args) => map(invoke(__, args), fns));

export const chainL = curry2((fn, args) => args.reduce(curry2(fn)));

export const xProd = curry2((a, b) => {
  const result = [];

  a.forEach(a => {
    b.forEach(b => result.push([a, b]));
  });

  return result;
});

export const anyPass = curry2((fns, x) => some(fn => fn(x), fns));

export const zipBy = curry3((fn, left, right) => {
  var min = Math.min(left.length, right.length);
  left.length = min;
  right.length = min;

  return left.reduce((prev:Array<any>, cur:any, idx:number) => {
    return prev.concat(fn(cur, right[idx]));
  }, []);
});

export const memoize = fn => {
  const cache = [];

  return function memo (...args) {
    var result;

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

export const uniqBy = curry2((fn, xs) => {
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
});

export const times = curry2((fn, num) => {
  const list = [];
  let idx = 0;

  while (idx < num) {
    list[idx] = fn(idx);
    idx += 1;
  }

  return list;
});
