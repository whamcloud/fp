// @flow

import * as fp from '../source/fp.js';
import type {Functor, Tapable} from '../source/fp.js';

type unaryFn<T, R> = (a:T) => R;
type binaryFn<T1, T2, R> = (a:T1, b:T2) => R;


const c1 = fp.curry1((a:number) => a + 1);

(c1:unaryFn<number, number>);
(c1(fp.__):unaryFn<number, number>);
(c1():unaryFn<number, number>);
(c1(5):number);
(c1()(5):number);
(c1()(fp.__)((fp.__))(5):number);
(fp.curry1((a:number) => a + 1):unaryFn<number, number>);


const c2 = fp.curry2((a:number, b:number) => a > b);

(c2:binaryFn<number, number, boolean>);
(c2(fp.__, 5):unaryFn<number, boolean>);
(c2(fp.__, 5)(6):boolean);
(c2(5):unaryFn<number, boolean>);
(c2(5)(6):boolean);
(c2():binaryFn<number, number, boolean>);
(c2()(6, 5):boolean);
(c2()(6)(5):boolean);
(c2()(fp.__, 5):unaryFn<number, boolean>);
(c2()(fp.__, 5)(6):boolean);
(c2(fp.__, 5):unaryFn<number, boolean>);
(c2(fp.__, 5)(6):boolean);

const mapper = fp.map((x:number) => x + 1);

(mapper:unaryFn<number[], number[]>);
(mapper([1]):number[]);
(fp.map((x:string) => x + 'bar', ['foo']):string[]);
(fp.map((x:string | number) => 'a' + x, ['foo', 1]):string[]);
(fp.map(fp.__, [1]):unaryFn<unaryFn<number, number>, number[]>);

class Mappable<A> {
  value:A;
  constructor (v:A) {
    this.value = v;
  }
  map <B>(fn:(a:A) => B):Mappable<B> {
    return new Mappable(fn(this.value));
  }
}

const m = new Mappable(3);

(mapper(m):Functor<number>);
(fp.map((x:number):number => x + 2, new Mappable(3)):Functor<number>);
(fp.map((x:string | number) => 'a' + x, new Mappable('foo')):Functor<string>);
(fp.map(fp.__, new Mappable(1)):unaryFn<unaryFn<number, number>, Functor<number>>);

const f = fp.flow(
  (a:number) => a + 1,
  (a:number) => a + 1
);
(f:unaryFn<number,number>);
const f1 = fp.flow(
  (a:number) => a + 1,
  (a:number) => 'a' + a
);
(f1:unaryFn<number,string>);

(fp.bindMethod:(fn:string, xs:Object) => any);
(fp.bindMethod('foo'):Function);
(fp.bindMethod('foo', {}):() => mixed);
(fp.bindMethod(fp.__, {})('foo'):() => mixed);
(fp.bindMethod('foo', fp.__)('foo'):() => mixed);

class Tapper<A> {
  value:A;
  constructor (v:A) {
    this.value = v;
  }
  tap (fn:(a:A) => any):Tapper<A> {
    fn(this.value);
    return this;
  }
}

const fooTap = new Tapper('foo');
const tappit = (x:string):string => x + 'bar';
const tappit2 = fp.tap((x:string) => x + 'bar');

(tappit2(fooTap):Tapable<string>);
(fp.tap(tappit, ['foo']):Array<string>);
(fp.tap(tappit, fooTap):Tapable<string>);
(fp.tap(tappit)(['foo']):Array<string>);
(fp.tap(tappit)(fooTap):Tapable<string>);
(fp.tap(fp.__, ['foo'])(tappit):Array<string>);
(fp.tap(fp.__, fooTap)(tappit):Tapable<string>);
