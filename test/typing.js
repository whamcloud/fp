// @flow

import * as fp from '../source/fp.js';

import type { Maybe } from '@iml/maybe';

import type { Fn1, Fn2 } from '../source/fp.js';

const c2 = fp.curry2((a:number, b:number) => a > b);

(c2:Fn2<number, number, boolean>);
(c2(5):Fn1<number, boolean>);
(c2(5)(6):boolean);
(c2(5):Fn1<number, boolean>);
(c2(5)(6):boolean);
(c2:Fn2<number, number, boolean>);
(c2(6, 5):boolean);

const mapper = fp.map((x:number) => x + 1);

(mapper:Fn1<number[], number[]>);
(mapper([ 1 ]):number[]);
(fp.map((x:string) => x + 'bar', [ 'foo' ]):string[]);
(fp.map((x:string | number) => 'a' + x, [
  'foo',
  1
]):string[]);

const f = fp.flow(
  (a:number) => a + 1,
  (a:number) => a + 1
);
(f:Fn1<number, number>);
const f1 = fp.flow(
  (a:number) => a + 1,
  (a:number) => 'a' + a
);
(f1:Fn1<number, string>);

(fp.bindMethod:(fn:string, xs:Object) => any);
(fp.bindMethod('foo'):Function);
(fp.bindMethod('foo', {}):() => mixed);
(fp.bindMethod('foo')({}):() => mixed);

const tappit = (x:string):string => x + 'bar';
const tappit2 = fp.tap((x:string) => x + 'bar');

(fp.tap(tappit, [ 'foo' ]):Array<string>);
(fp.tap(tappit)([ 'foo' ]):Array<string>);

(fp.find((x:number) => x === 3, []):Maybe<number>);
