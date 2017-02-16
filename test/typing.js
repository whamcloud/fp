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

const class1RString = [ClassType1, (() => 'test': (x: ClassType1) => 'test')];
const class1RClass1 = [ClassType1, (x: ClassType1) => x];
const class2RString = [ClassType2, (x => 'foo': (x: ClassType2) => 'foo')];
const class2RClass2 = [ClassType2, (x: ClassType2) => x];
const class3RString = [ClassType3, (x => 'bar': (x: ClassType3) => 'bar')];
const class3RClass3 = [ClassType3, (x: ClassType3) => x];
const class4RClass4 = [ClassType4, (x: ClassType4) => x];
const class4RString = [ClassType4, (x => 'baz': (x: ClassType4) => 'baz')];
const class5RClass5 = [ClassType5, (x: ClassType5) => x];
const class5RString = [ClassType5, (x => 'bam': (x: ClassType5) => 'bam')];
// 2 entries
(fp.match([class1RClass1, class2RString])(new ClassType2()): 'foo');
(fp.match([
  [ClassType1, (x: ClassType1) => x],
  [ClassType2, (x: ClassType2) => x]
])(new ClassType2()): ClassType2);
(fp.match([
  ['foo', (x => 'foo': (x: 'foo') => 'foo')],
  ['bar', (x => 'bar': (x: 'bar') => 'bar')]
])('bar'): 'bar');
(fp.match([
  [() => 'foo', (x => 'foo': (x: 'foo') => 'foo')],
  [() => 'bar', (x => 'bar': (x: 'bar') => 'bar')]
])('foo'): 'foo');
// 3 entries
(fp.match([
  class1RString,
  class2RClass2,
  class3RClass3
])(new ClassType1()): 'test');
(fp.match([
  class1RString,
  class2RClass2,
  class3RString
])(new ClassType2()): ClassType2);
(fp.match([
  class1RString,
  class2RClass2,
  class3RString
])(new ClassType3()): 'bar');
(fp.match([
  class1RString,
  class2RClass2,
  class3RClass3
])(new ClassType3()): ClassType3);
(fp.match([
  ['foo', (x => 'foo': (x: 'foo') => 'foo')],
  ['bar', (x => 'bar': (x: 'bar') => 'bar')],
  ['baz', (x => 'baz': (x: 'baz') => 'baz')]
])('baz'): 'baz');
(fp.match([
  [() => 'foo', (x => 'foo': (x: 'foo') => 'foo')],
  [() => 'bar', (x => 'bar': (x: 'bar') => 'bar')],
  [() => 'baz', (x => 'baz': (x: 'baz') => 'baz')]
])('bar'): 'bar');

// 4 entries
(fp.match([
  class1RString,
  class2RClass2,
  class3RString,
  class4RClass4
])(new ClassType1()): 'test');
(fp.match([
  class1RString,
  class2RClass2,
  class3RString,
  class4RClass4
])(new ClassType2()): ClassType2);
(fp.match([
  class1RString,
  class2RClass2,
  class3RString,
  class4RClass4
])(new ClassType3()): 'bar');
(fp.match([
  class1RString,
  class2RClass2,
  class3RString,
  class4RClass4
])(new ClassType4()): ClassType4);
(fp.match([
  class1RString,
  class2RClass2,
  class3RString,
  class4RString
])(new ClassType4()): 'baz');
(fp.match([
  ['foo', (x => 'foo': (x: 'foo') => 'foo')],
  ['bar', (x => 'bar': (x: 'bar') => 'bar')],
  ['baz', (x => 'baz': (x: 'baz') => 'baz')],
  ['bam', (x => 'bam': (x: 'bam') => 'bam')]
])('bam'): 'bam');
(fp.match([
  [() => 'foo', (x => 'foo': (x: 'foo') => 'foo')],
  [() => 'bar', (x => 'bar': (x: 'bar') => 'bar')],
  [() => 'baz', (x => 'baz': (x: 'baz') => 'baz')],
  [() => 'bam', (x => 'bam': (x: 'bam') => 'bam')]
])('bar'): 'bar');
// 5 entries

(fp.match([
  class1RString,
  class2RClass2,
  class3RString,
  class4RClass4,
  class5RString
])(new ClassType1()): 'test');
(fp.match([
  class1RString,
  class2RClass2,
  class3RString,
  class4RClass4,
  class5RString
])(new ClassType2()): ClassType2);
(fp.match([
  class1RString,
  class2RClass2,
  class3RString,
  class4RClass4,
  class5RString
])(new ClassType3()): 'bar');
(fp.match([
  class1RString,
  class2RClass2,
  class3RString,
  class4RClass4,
  class5RString
])(new ClassType4()): ClassType4);
(fp.match([
  class1RString,
  class2RClass2,
  class3RString,
  class4RClass4,
  class5RString
])(new ClassType5()): 'bam');
(fp.match([
  class1RString,
  class2RClass2,
  class3RString,
  class4RClass4,
  class5RClass5
])(new ClassType5()): ClassType5);
(fp.match([
  ['foo', (x => 'foo': (x: 'foo') => 'foo')],
  ['bar', (x => 'bar': (x: 'bar') => 'bar')],
  ['baz', (x => 'baz': (x: 'baz') => 'baz')],
  ['bam', (x => 'bam': (x: 'bam') => 'bam')],
  ['jam', (x => 'jam': (x: 'jam') => 'jam')]
])('jam'): 'jam');
(fp.match([
  [() => 'foo', (x => 'foo': (x: 'foo') => 'foo')],
  [() => 'bar', (x => 'bar': (x: 'bar') => 'bar')],
  [() => 'baz', (x => 'baz': (x: 'baz') => 'baz')],
  [() => 'bam', (x => 'bam': (x: 'bam') => 'bam')],
  [() => 'jam', (x => 'jam': (x: 'jam') => 'jam')]
])('bar'): 'bar');
