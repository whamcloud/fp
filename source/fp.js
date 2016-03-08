// @flow

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

export const __ = {};

type Container = Array<any>|Object|Function;

function _type (val): string {
  if (val === null)
    return 'Null';
  else if (val === undefined)
    return 'Undefined';
  else
    return Object.prototype.toString
      .call(val)
      .slice(8, -1);
}

export function curry (n: number, fn: Function): Function {
  return function innerCurry () {
    var args = new Array(arguments.length);
    for (var i = 0, l = arguments.length; i < l; i++) {
      args[i] = arguments[i];
    }

    var gaps = n - args.length;
    gaps += args.filter(function findGaps (x) {
      return x === __;
    }).length;

    if (gaps > 0)
      return curry(gaps, function () {
        var innerArgs = new Array(arguments.length);
        for (var i = 0, l = arguments.length; i < l; i++) {
          innerArgs[i] = arguments[i];
        }

        var filledArgs = args.map(function (x) {
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

export const partial = curry(3, function partial (arity:number, fn:Function, initialArgs:Array<any>):Function {
  return curry(arity, function ():any {
    var args = new Array(arguments.length);
    for (var i = 0, l = arguments.length; i < l; i++) {
      args[i] = arguments[i];
    }

    return fn.apply(null, initialArgs.concat(args));
  });
});

export const map = curry(2, function m (f: Function, x:Container):any {
  if (x && typeof x.map === 'function')
    return x.map(curry(1, f));
  else
    return f(x);
});

export const filter = curry(2, function filter (f: Function, xs:Container):any {
  if (xs && typeof xs.filter === 'function')
    return xs.filter(curry(1, f));
  else
    return f(xs);
});

export const reduce = curry(3, function reducer (accum:any, f:Function, xs:Container):any {
  if (typeof accum === 'function')
    accum = accum();

  if (Array.isArray(xs))
    return xs.reduce(curry(2, f), accum);
  if (xs && typeof xs.reduce === 'function')
    return xs.reduce(accum, curry(2, f));
  else
    return f(accum, xs);
});

export const find = curry(2, function find (f:Function, xs:Container):any {
  return filter(f, xs)[0];
});

export const pluck = curry(2, function pluck (key, xs) {
  return map(function plucker (xs) {
    return xs[key];
  }, xs);
});

export const identity = (x:any):any => x;

export const always = (x:any):Function => () => x;

export const True = always(true);
export const False = always(false);

export const difference = curry(2, function difference (xs, ys) {
  return xs.reduce(function reduceDiffs (arr, x) {
    if (ys.indexOf(x) === -1)
      arr.push(x);

    return arr;
  }, []);
});

const getConst = (x:any) => {
  return {
    value: x,
    map () { return this; }
  };
};

export const view = curry(2, function view (lens, x) {
  return lens(getConst)(x).value;
});

const getIdentity = (x:any) => {
  return {
    value: x,
    map (fn) {
      return getIdentity(fn(x));
    }
  };
};


export const over = curry(3, (lens, fn, xs) => {
  return lens((ys) => getIdentity(fn(ys)))(xs).value;
});


export const set = curry(3, (lens, value, xs) => {
  return over(lens, always(value), xs);
});

export const lens = curry(2, function lens (get: (xs: any) => any, set:<T>(v:any, xs:T) => T) {
  return (fn:(xs:any) => any) => (xs:any) => map(
    (v) => set(v, xs),
    fn(get(xs))
  );
});

const getValue = (x:{value: any}):any => x.value;

export const mapped = curry(2, function (fn:Function, x:any):Object {
  return getIdentity(map(flow(fn, getValue), x));
});

export const lensProp = (prop: string|number): Function => {
  return lens((xs) => xs[prop], (v, xs) => {
    const keys = Object.keys(xs);
    const container = Array.isArray(xs) ? [] : {};

    const out = keys.reduce((container, key) => {
      container[key] = xs[key];
      return container;
    }, container);
    out[prop] = v;

    return out;
  });
};

export function flow (): Function {
  var args = new Array(arguments.length);

  for (var i = 0, l = arguments.length; i < l; i++) {
    args[i] = arguments[i];
  }

  return function flowInner (xs: any): any {
    return args.reduce(function reducer (xs, fn) {
      return fn(xs);
    }, xs);
  };
}

export function compose (): Function {
  const args = new Array(arguments.length);
  for (var i = 0, l = arguments.length; i < l; i++) {
    args[i] = arguments[i];
  }

  return flow.apply(null, args.reverse());
}

export const flowN = curry(2, function flowN (n, fns) {
  fns = over(lensProp(0), invoke, fns);
  var wrappedFlow = wrapArgs(flow.apply(null, fns));

  return curry(n, wrappedFlow);
});

export function cond (): Function {
  var args = new Array(arguments.length);

  for (var i = 0, l = arguments.length; i < l; i++) {
    args[i] = arguments[i];
  }

  return function condInner (xs) {
    var result;

    args.some(function findTruthy (pair) {
      if (pair[0](xs)) {
        result = pair[1](xs);
        return true;
      }
    });

    return result;
  };
}

export function shallowClone (xs: any): any {
  var type = _type(xs);

  if (type === 'Array')
    return xs.slice();
  else if (type === 'Object')
    return Object.keys(xs).reduce(function reducer (obj, key) {
      obj[key] = xs[key];

      return obj;
    }, {});

  throw new Error('shallow clone works with Array or Object. Got: ' + type);
}

export const not = (x:any):boolean => !x;

export const eq = curry(2,
  (a, b) => _type(a) === 'Object' && typeof a.equals === 'function' ? a.equals(b) : a === b);

export const eqFn = curry(4, function eqFn (fnA, fnB, a, b) {
  return eq(fnA(a), fnB(b));
});

export const invoke = curry(2, function invoke(fn, args) {
  if (!Array.isArray(args))
    throw new Error('Error in fp.invoke - Cannot call invoke with non-array');

  return fn.apply(null, args);
});

export const safe = curry(3, function safe (arity, fn, def) {
  return curry(arity, function safeCheck () {
    for (var i = 0, l = arguments.length; i < l; i++) {
      if (arguments[i] == null)
        return def;
    }

    try {
      return fn.apply(null, arguments);
    } catch (e) {
      return def;
    }
  });
});

export const noop = () => {};

export const and = curry(2, function and (predicates, val) {
  return predicates.reduce(function reducer (curr, predicate) {
    return curr && predicate(val);
  }, true);
});

export const or = curry(2, function or (predicates, val) {
  return predicates.reduce(function reducer (curr, predicate) {
    return curr || predicate(val);
  }, false);
});

export const bindMethod = curry(2, function bindMethod (meth, obj) {
  return obj[meth].bind(obj);
});

export const invokeMethod = curry(3, function invokeMethod (meth, args, obj) {
  return flow(bindMethod(meth), invoke(__, args))(obj);
});

export const invokeMethodN = curry(3, function invokeMethodN (arity:number, meth:string, obj:any):Function {
  return curry(arity, function ():any {
    return obj[meth].apply(obj, arguments);
  });
});

export const zipObject = curry(2, function zipObject (keys, vals) {
  var keysType = _type(keys);
  var valsType = _type(vals);
  if (keysType !== 'Array')
    throw new TypeError('zipObject keys must be an Array. Got: ' + keysType);
  if (valsType !== 'Array')
    throw new TypeError('zipObject values must be an Array. Got: ' + valsType);

  return keys.reduce(function reduceToObject (obj, val, index) {
    obj[val] = vals[index];
    return obj;
  }, {});
});

export const some = curry(2, function some (fn, xs) {
  if (xs && typeof xs.some === 'function')
    return xs.some(curry(1, fn));
  else
    return !!fn(xs);
});

export const every = curry(2, function every (fn, xs) {
  if (xs && typeof xs.every === 'function')
    return xs.every(curry(1, fn));
  else
    return !!fn(xs);
});

export function unwrap (xs:Array<any>):Array<any> {
  return xs.reduce(function reducer (arr, x) {
    return arr.concat(x);
  }, []);
}

export const head = view(lensProp(0));
export const tail = flow(invokeMethod('slice', [-1]), head);

export const arrayWrap = (x: any): any => [x];

export function once (fn: Function): Function {
  var called = false;

  return function innerOnce () {
    if (called)
      return;

    called = true;

    fn.apply(null, arguments);
  };
}

export const either = curry(2, function either (fn, x) {
  if (x instanceof Error)
    return x;

  return fn(x);
});

export const maybe = curry(2, function maybe (fn:Function, x:any) {
  if (x === null)
    return x;

  return fn(x);
});

export const unsafe = curry(2, function unsafe (fn, x) {
  if (!(x instanceof Error))
    return x;

  return fn(x);
});

export const tap = curry(2, function tap (fn: Function, xs: any): any {
  if (xs && typeof xs.tap === 'function')
    xs.tap(curry(1, fn));
  else
    fn(xs);

  return xs;
});

export const mapFn = curry(2, function mapFn (fns, args) {
  return map(invoke(__, args), fns);
});

export const chainL = curry(2, function chainL (fn, args) {
  return args.reduce(curry(2, fn));
});

export const wrapArgs = function wrapArgs (fn: Function): Function {
  return function innerWrapArgs () {
    return fn.call(null, [].slice.call(arguments));
  };
};

export const xProd = curry(2, function xprod (a: any, b: any): Array<Array<any>> {
  const result = [];

  a.forEach(function (a) {
    b.forEach(function (b) {
      result.push([a, b]);
    });
  });

  return result;
});

export const flip = curry(2, function flip (arity, fn) {
  return curry(arity, function flipper () {
    var args = new Array(arguments.length);

    for (var i = 0, l = arguments.length; i < l; i++) {
      args[i] = arguments[i];
    }
    args.reverse();
    return fn.apply(null, args);
  });
});

export const anyPass = curry(2, function anyPass (fns, x) {
  return some(invoke(__, [x]), fns);
});

export const zipBy = curry(3, (fn:Function, left:Array<any>, right:Array<any>) => {
  var min = Math.min(left.length, right.length);
  left.length = min;
  right.length = min;

  return left.reduce((prev:Array<any>, cur:any, idx:number) => {
    return prev.concat(fn(cur, right[idx]));
  }, []);
});
