/* @flow */

export const __ = {};

function _type (val) {
  if (val === null)
    return 'Null';
  else if (val === undefined)
    return 'Undefined';
  else
    return Object.prototype.toString
      .call(val)
      .slice(8, -1);
}

export function curry (n: number, fn: Function ) : Function {
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

export const map = curry(2, function m (f : Function, x : any) : any {
  if (x && typeof x.map === 'function')
    return x.map(curry(1, f));
  else
    return f(x);
});

export const filter = curry(2, function filter (f, xs) {
  if (xs && typeof xs.filter === 'function')
    return xs.filter(curry(1, f));
  else
    return f(xs);
});

export const reduce = curry(3, function reducer (accum, f, xs) {
  if (typeof accum === 'function')
    accum = accum();

  if (Array.isArray(xs))
    return xs.reduce(curry(2, f), accum);
  if (xs && typeof xs.reduce === 'function')
    return xs.reduce(accum, curry(2, f));
  else
    return f(accum, xs);
});

export const deepEq = curry(2, function deepEqFactory (a, b) {
  return (function deepEq (a, b, visitedA, visitedB) {

    var aType = _type(a);
    var bType = _type(b);

    if (isColl(aType) && isColl(bType) && (aType === bType)) { // Collection check.

      // Cycle checks.
      throwForCycle(visitedA, a);
      throwForCycle(visitedB, b);

      var aKeys = Object.keys(a);
      var bKeys = Object.keys(b);

      if (aKeys.length !== bKeys.length) // Length check.
        return false;

      var keysInBoth = aKeys.every(function aInB (x) {
        return x in b;
      });

      if (!keysInBoth)
        return false;

      return aKeys.every(function recurse (x) { // Recursive check.
        return deepEq(a[x], b[x], visitedA, visitedB);
      });
    } else {
      return eq(a, b); // Strict check.
    }

    function isColl (t) {
      return t === 'Array' || t === 'Object';
    }

    function throwForCycle (visited, xs) {
      if (visited.indexOf(xs) !== -1)
        throw new Error('Cycle detected, cannot determine equality.');

      visited.push(xs);
    }

  }(a, b, [], []));
});

export const find = curry(2, function find (f, xs) {
  return filter(f, xs)[0];
});

export const pluck = curry(2, function pluck (key, xs) {
  return map(function plucker (xs) {
    return xs[key];
  }, xs);
});

export const identity = (x: any): any => x;

export const always = (x: any): Function => () => x;

export const True = always(true);

export const difference = curry(2, function difference (xs, ys) {
  return xs.reduce(function reduceDiffs (arr, x) {
    if (ys.indexOf(x) === -1)
      arr.push(x);

    return arr;
  }, []);
});

export const lens = curry(2, function lens (get, set) {
  set = curry(2, set);
  innerLens.set = set;

  innerLens.map = curry(2, function map (fn, xs) {
    return flow(get, fn, set(__, xs))(xs);
  });

  function innerLens (x) {
    return get(x);
  }

  return innerLens;
});

export const lensProp = function lensProp (prop: string): Function {
  return lens(
    function get (x) {
      return x[prop];
    },
    function set (val, x) {
      x[prop] = val;

      return x;
    }
  );
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

export const flowN = curry(2, function flowN (n, fns) {
  fns = lensProp('0').map(invoke, fns);
  var wrappedFlow = wrapArgs(flow.apply(null, fns));

  return curry(n, wrappedFlow);
});

export function flowLens (): Function {
  var args = new Array(arguments.length);

  for (var i = 0, l = arguments.length; i < l; i++) {
    args[i] = arguments[i];
  }

  return lens(
    flow.apply(null, args),
    function set (val, xs) {
      args.reduce(function reducer (xs, l, index) {
        if (index === args.length - 1)
          return l.set(val, xs);
        else
          return l(xs);
      }, xs);

      return xs;
    }
  );
}

export function pathLens (path: Array<string>): Function {
  var pathType = _type(path);
  if (pathType !== 'Array')
    throw new TypeError('pathLens must receive the path in the form of an array. Got: ' + pathType);

  var lenses = map(lensProp, path);

  return lens(
    safe(1, flow.apply(null, lenses), undefined),
    function set (val, xs) {
      lenses.reduce(function reducer (xs, l, index) {
        if (index === lenses.length - 1)
          return l.set(val, xs);

        var x = l(xs);

        if (x != null)
          return x;

        x = {};

        l.set(x, xs);
        return x;
      }, xs);

      return xs;
    }
  );
}

export function cond (): Function {
  var args = new Array(arguments.length);

  for (var i = 0, l = arguments.length; i < l; i++) {
    args[i] = arguments[i];
  }

  return function condInner (xs) {
    var result;

    args.some(function findTruthy (pair) {
      if (pair[0](xs))
        return (result = pair[1](xs));
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

export const eq = curry(2, (a, b) => a === b);

export const eqLens = curry(3, function eqLens (l, a, b) {
  return eq(l(a), l(b));
});

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

export const head = (xs:Array<any>):Array<any> => xs[0];
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

export const unsafe = curry(2, function unsafe (fn, x) {
  if (!(x instanceof Error))
    return x;

  return fn(x);
});

export const tap = curry(2, function tap (fn, xs) {
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
