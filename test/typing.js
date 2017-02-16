// @flow

import * as fp from '../source/fp.js';

import type { Maybe } from '@iml/maybe';

import type { Fn1, Fn2 } from '../source/fp.js';

const c2 = fp.curry2((a: number, b: number) => a > b);

(c2: Fn2<number, number, boolean>);
(c2(5): Fn1<number, boolean>);
(c2(5)(6): boolean);
(c2(5): Fn1<number, boolean>);
(c2(5)(6): boolean);
(c2: Fn2<number, number, boolean>);
(c2(6, 5): boolean);

const mapper = fp.map((x: number) => x + 1);

(mapper: Fn1<number[], number[]>);
(mapper([1]): number[]);
(fp.map((x: string) => x + 'bar', ['foo']): string[]);
(fp.map((x: string | number) => 'a' + x, ['foo', 1]): string[]);

const f = fp.flow((a: number) => a + 1, (a: number) => a + 1);
(f: Fn1<number, number>);
const f1 = fp.flow((a: number) => a + 1, (a: number) => 'a' + a);
(f1: Fn1<number, string>);

(fp.bindMethod: (fn: string, xs: Object) => any);
(fp.bindMethod('foo'): Function);
(fp.bindMethod('foo', {}): () => mixed);
(fp.bindMethod('foo')({}): () => mixed);

const tappit = (x: string): string => x + 'bar';

(fp.tap(tappit, ['foo']): Array<string>);
(fp.tap(tappit)(['foo']): Array<string>);

(fp.find((x: number) => x === 3, []): Maybe<number>);

class ClassType1 {}
class ClassType2 {}
class ClassType3 {}
class ClassType4 {}
class ClassType5 {}

const withClass1 = [ClassType1, (x: ClassType1) => x];
const withClass2 = [ClassType2, (x: ClassType2) => x];
const withClass3 = [ClassType3, (x: ClassType3) => x];
const withClass4 = [ClassType4, (x: ClassType4) => x];
const withClass5 = [ClassType5, (x: ClassType5) => x];

(fp.match([withClass1, withClass2])(new ClassType2()): mixed);
(fp.match([withClass1, withClass2, withClass3])(new ClassType3()): mixed);
(fp.match([
  withClass1,
  withClass2,
  withClass3,
  withClass4
])(new ClassType4()): mixed);
(fp.match([
  withClass1,
  withClass2,
  withClass3,
  withClass4,
  withClass5
])(new ClassType5()): mixed);
