// @flow

import '@iml/jasmine-n-matchers';

import * as fp from '../source/fp.js';
import * as maybe from '@iml/maybe';

import type { Maybe } from '@iml/maybe';
import type { Fn1 } from '../source/fp.js';

import { describe, beforeEach, it, expect, jasmine } from './jasmine';

import { Map, fromJS } from 'immutable';

type idArrayT = Array<{ id: number, name: string }>;

describe('the fp module', () => {
  describe('has a map method', () => {
    let add1;

    beforeEach(() => {
      add1 = n => n + 1;
    });

    it('should exist on fp', () => {
      const result: ((x: number) => number) => (x: number[]) => number[] =
        fp.map;
      expect(result).toEqual(jasmine.any(Function));
    });

    it('should be a higher order function', () => {
      const result: (xs: Array<number>) => Array<number> = fp.map(fp.identity);
      expect(result).toEqual(jasmine.any(Function));
    });

    it('should map a list', () => {
      const result: Array<number> = fp.map(add1)([1, 2, 3]);
      expect(result).toEqual([2, 3, 4]);
    });

    it("should be unary'd", () => {
      const spy = (jasmine.createSpy('unary'): (x: number) => number);
      fp.map(spy)([1]);
      expect(spy).toHaveBeenCalledWith(1);
    });
  });

  describe('has a filter method', () => {
    it('should exist on fp', () => {
      const result: (fn: (a: number) => boolean) => (a: number[]) => number[] =
        fp.filter;
      expect(result).toEqual(jasmine.any(Function));
    });

    it('should filter a list', () => {
      const result: Array<number> = fp.filter(fp.eq(3))([1, 2, 3]);
      expect(result).toEqual([3]);
    });

    it('should be a higher order function', () => {
      const result: Array<number> = fp.filter(fp.eq(1))([1, 2, 3]);
      expect(result).toEqual([1]);
    });
  });

  describe('has a reduce method', () => {
    it('should exist on fp', () => {
      const result: (
        a: number
      ) => ((a: number, b: number) => number) => (x: number[]) => number =
        fp.reduce;
      expect(result).toEqual(jasmine.any(Function));
    });

    it('should reduce a list', () => {
      const result: number = fp.reduce(0)((x, y) => x + y)([1, 2, 3]);
      expect(result).toEqual(6);
    });
  });

  describe('has a find method', () => {
    it('should exist on fp', () => {
      const result: ((x: number) => boolean) => (a: number[]) => Maybe<number> =
        fp.find;
      expect(result).toEqual(jasmine.any(Function));
    });

    it('should find a value', () => {
      const result: Maybe<number> = fp.find(fp.eq(3))([1, 2, 3]);
      const val: ?number = maybe.from(result);
      expect(val).toBe(3);
    });

    it('should be a higher order function', () => {
      const result: Maybe<number> = fp.find(fp.eq(1))([1, 2, 3]);
      const val: ?number = maybe.from(result);
      expect(val).toBe(1);
    });

    it('should return null on no match', () => {
      const result: Maybe<number> = fp.find(fp.eq(10))([1, 2, 3]);
      const val: ?number = maybe.from(result);
      expect(val).toBe(null);
    });
  });

  describe('has a pluck method', () => {
    it('should exist on fp', () => {
      const result: (
        key: string | number
      ) => (a: { foo: 'string' }[]) => string[] =
        fp.pluck;
      expect(result).toEqual(jasmine.any(Function));
    });

    it('should pluck from a collection', () => {
      const plucked: Fn1<
        {
          foo: string
        }[],
        string[]
      > = fp.pluck('foo');
      const result: string[] = plucked([{ foo: 'bar' }, { foo: 'baz' }]);

      expect(result).toEqual(['bar', 'baz']);
    });

    it('should be a higher order function', () => {
      const result: Fn1<Object[], string[]> = fp.pluck('foo');
      expect(result).toEqual(jasmine.any(Function));
    });
  });

  describe('has an identity method', () => {
    it('should exist on fp', () => {
      const result: (x: number) => number = fp.identity;
      expect(result).toEqual(jasmine.any(Function));
    });

    it("should return it's value", () => {
      const result: number = fp.identity(1);
      expect(result).toEqual(1);
    });
  });

  describe('has an always method', () => {
    it('should exist on fp', () => {
      const result: (
        x: string
      ) => (a: number, b: boolean, c: string) => string =
        fp.always;
      expect(result).toEqual(jasmine.any(Function));
    });

    it("should always return it's value", () => {
      const result: 'foo' = fp.always('foo')();
      expect(result).toEqual('foo');
    });
  });

  describe('has a True method', () => {
    it('should exist on fp', () => {
      const result: (x: string) => true = fp.True;
      expect(result).toEqual(jasmine.any(Function));
    });

    it('should always return true', () => {
      const result: true = fp.True();
      expect(result).toBe(true);
    });
  });

  describe('has a False method', () => {
    it('should exist on fp', () => {
      const result: (x: string) => false = fp.False;
      expect(result).toEqual(jasmine.any(Function));
    });

    it('should always return false', () => {
      const result: false = fp.False();
      expect(result).toBe(false);
    });
  });

  describe('has a flow method', () => {
    it('should exist on fp', () => {
      const result: (a: Fn1<string, number>) => Fn1<string, number> = fp.flow;
      expect(result).toEqual(jasmine.any(Function));
    });

    it('should return a function', () => {
      const result: Fn1<number, number> = fp.flow(fp.identity);
      expect(result).toEqual(jasmine.any(Function));
    });

    it('should compose fns', () => {
      const add1 = (x: number) => x + 1;
      const mult2 = (x: number) => x * 2;
      const result: number = fp.flow(add1, mult2)(3);
      expect(result).toEqual(8);
    });
  });

  describe('has a compose method', () => {
    it('should exist on fp', () => {
      const result: (fn: Fn1<string, number>) => Fn1<string, number> =
        fp.compose;
      expect(result).toEqual(jasmine.any(Function));
    });

    it('should return a function', () => {
      const result: Fn1<string, string> = fp.compose(fp.identity);
      expect(result).toEqual(jasmine.any(Function));
    });

    it('should compose fns', () => {
      const add1 = (x: number) => x + 1;
      const mult2 = (x: number) => x * 2;
      const result: number = fp.compose(mult2, add1)(3);
      expect(result).toEqual(8);
    });
  });

  describe('has a difference method', () => {
    it('should exist on fp', () => {
      const result: (xs: number[]) => (xs: number[]) => number[] =
        fp.difference;
      expect(result).toEqual(jasmine.any(Function));
    });

    it('should calculate differences', () => {
      const result: Array<number> = fp.difference([1, 2, 3])([1, 2]);

      expect(result).toEqual([3]);
    });

    it('should be curried', () => {
      const result: Array<number> = fp.difference([1, 2, 3])([1, 2]);
      expect(result).toEqual([3]);
    });

    it('should work with empty arrays', () => {
      const result: Array<number> = fp.difference([])([]);
      expect(result).toEqual([]);
    });

    it('should produce a set', () => {
      const result: Array<number> = fp.difference([1, 1, 2])([2]);
      expect(result).toEqual([1]);
    });
  });

  describe('has a differenceBy method', () => {
    let a, b;

    beforeEach(() => {
      a = [{ id: 1, name: 'foo' }, { id: 2, name: 'bar' }];

      b = [
        { id: 1, name: 'foo' },
        { id: 2, name: 'bar' },
        { id: 3, name: 'baz' },
        { id: 4, name: 'bap' }
      ];
    });

    it('should exist on fp', () => {
      const result: (
        (x: { id: number }) => number
      ) => (
        { id: number }[]
      ) => (
        { id: number }[]
      ) => {
        id: number
      }[] =
        fp.differenceBy;
      expect(result).toEqual(jasmine.any(Function));
    });

    it('should tell difference by id with results', () => {
      const result: idArrayT = fp.differenceBy(x => x.id)(b)(a);
      expect(result).toEqual([{ id: 3, name: 'baz' }, { id: 4, name: 'bap' }]);
    });

    it('should tell difference by id with no results', () => {
      const result: idArrayT = fp.differenceBy(x => x.id)(a)(b);
      expect(result).toEqual([]);
    });

    it('should produce a set', () => {
      b.push({ id: 3, name: 'baz' });
      const result: idArrayT = fp.differenceBy(x => x.id)(b)(a);
      expect(result).toEqual([{ id: 3, name: 'baz' }, { id: 4, name: 'bap' }]);
    });
  });

  describe('has a intersectionBy method', () => {
    let a, b;

    beforeEach(() => {
      a = [{ id: 1, name: 'foo' }, { id: 2, name: 'bar' }];

      b = [
        { id: 1, name: 'foo' },
        { id: 2, name: 'bar' },
        { id: 3, name: 'baz' },
        { id: 4, name: 'bap' }
      ];
    });

    it('should exist on fp', () => {
      const result: (
        a: ({ id: number }) => number
      ) => (a: idArrayT) => (a: idArrayT) => idArrayT =
        fp.intersectionBy;
      expect(result).toEqual(jasmine.any(Function));
    });

    it('should tell intersection by id with results', () => {
      const result: idArrayT = fp.intersectionBy(x => x.id)(a)(b);
      expect(result).toEqual([{ id: 1, name: 'foo' }, { id: 2, name: 'bar' }]);
    });

    it('should tell intersection by id with no results', () => {
      const result: idArrayT = fp.intersectionBy(x => x.id)(a)([]);
      expect(result).toEqual([]);
    });

    it('should produce a set', () => {
      b.push({ id: 1, name: 'foo' });
      const result: idArrayT = fp.intersectionBy(x => x.id)(b)(a);

      expect(result).toEqual([{ id: 1, name: 'foo' }, { id: 2, name: 'bar' }]);
    });
  });

  describe('working with lenses', () => {
    let data, propLens, immutablePropLens;
    type dataT = {
      name: string,
      addresses: Array<{
        street: string,
        city: string,
        state: string
      }>
    };

    beforeEach(() => {
      propLens = prop => {
        return fp.lens(xs => xs[prop])((v, xs) => {
          const keys = Object.keys(xs);
          const container = Array.isArray(xs) ? [] : {};

          const out = keys.reduce((container, key) => {
            container[key] = xs[key];
            return container;
          }, container);

          if (typeof prop === 'string') prop = prop.toString();

          // $FlowIgnore: access is fine here
          out[prop] = v;

          return out;
        });
      };

      immutablePropLens = prop => {
        return fp.lens(xs => xs.get(prop))((v, xs) => xs.set(prop, v));
      };

      data = {
        name: 'Richie Rich',
        addresses: [
          {
            street: '123 Fake Street',
            city: 'Albuquerque',
            state: 'NM'
          },
          {
            street: '23 East Colonial Drive',
            city: 'Orlando',
            state: 'Fl'
          }
        ]
      };
    });

    describe('has a lens method', () => {
      it('should exist on fp', () => {
        const result: Function = fp.lens;
        expect(result).toEqual(jasmine.any(Function));
      });
    });

    describe('has a view method', () => {
      it('should exist on fp', () => {
        const result: Function = fp.view;
        expect(result).toEqual(jasmine.any(Function));
      });

      it('should resolve a shallow property', () => {
        const nameLens = (propLens('name'): (x: dataT) => string);
        const result: string = fp.view(nameLens)(data);
        expect(result).toBe('Richie Rich');
      });

      describe('view deep property', () => {
        let result: Array<Object>;

        beforeEach(() => {
          result = fp.view(fp.flow(propLens(0), propLens('addresses')))(data);
        });

        it('should resolve to a value', () => {
          expect(result).toEqual({
            street: '123 Fake Street',
            city: 'Albuquerque',
            state: 'NM'
          });
        });

        it('should not clone the value', () => {
          expect(result).toBe(data.addresses[0]);
        });
      });

      it('should resolve a shallow immutable property', () => {
        const result: 'Richie Rich' = fp.view(immutablePropLens('name'))(
          fromJS(data)
        );
        expect(result).toBe('Richie Rich');
      });

      it('should resolve a deep immutable property', () => {
        const result: {
          toJS: () => {
            street: string,
            city: string,
            state: string
          }
        } = fp.view(
          fp.flow(immutablePropLens('1'), immutablePropLens('addresses'))
        )(fromJS(data));

        expect(result.toJS()).toEqual({
          street: '23 East Colonial Drive',
          city: 'Orlando',
          state: 'Fl'
        });
      });
    });

    describe('has an over method', () => {
      it('should exist on fp', () => {
        expect(fp.over).toEqual(jasmine.any(Function));
      });

      describe('over shallow property', () => {
        let result: dataT;

        beforeEach(() => {
          const over1 = fp.over(propLens('name'));
          const over2 = over1(name => `${name}ard!`);
          result = over2(data);
        });

        it('should return data with a new name', () => {
          expect(result.name).toBe('Richie Richard!');
        });

        it('should not mutate the original data', () => {
          expect(data.name).toBe('Richie Rich');
        });
      });

      describe('over deep property', () => {
        let result: dataT;

        beforeEach(() => {
          const over1 = fp.over(
            fp.flow(propLens('street'), propLens('1'), propLens('addresses'))
          );
          const over2 = over1(street => street.split('').reverse().join(''));
          result = over2(data);
        });

        it('should return street reversed', () => {
          expect(result.addresses[1].street).toBe('evirD lainoloC tsaE 32');
        });

        it('should not mutate the original data', () => {
          expect(data.addresses[1].street).toBe('23 East Colonial Drive');
        });
      });

      it('should perform shallow updates over immutables', () => {
        const result: {
          toJS: () => {
            'name': 'Richie Richard!',
            'addresses': [
              {
                'street': '123 Fake Street',
                'city': 'Albuquerque',
                'state': 'NM'
              },
              {
                'street': '23 East Colonial Drive',
                'city': 'Orlando',
                'state': 'Fl'
              }
            ]
          }
        } = fp.over(immutablePropLens('name'))(name => name + 'ard!')(
          fromJS(data)
        );

        expect(result.toJS()).toEqual({
          name: 'Richie Richard!',
          addresses: [
            {
              street: '123 Fake Street',
              city: 'Albuquerque',
              state: 'NM'
            },
            {
              street: '23 East Colonial Drive',
              city: 'Orlando',
              state: 'Fl'
            }
          ]
        });
      });

      it('should perform deep updates over immutables', () => {
        const result: {
          toJS: () => {
            name: 'Richie Rich',
            addresses: [
              {
                street: '123 Fake Street',
                city: 'Albuquerque',
                state: 'NM'
              },
              {
                street: 'evirD lainoloC tsaE 32',
                city: 'Orlando',
                state: 'Fl'
              }
            ]
          }
        } = fp.over(
          fp.flow(
            immutablePropLens('street'),
            immutablePropLens('1'),
            immutablePropLens('addresses')
          )
        )(street => street.split('').reverse().join(''))(fromJS(data));

        expect(result.toJS()).toEqual({
          name: 'Richie Rich',
          addresses: [
            {
              street: '123 Fake Street',
              city: 'Albuquerque',
              state: 'NM'
            },
            {
              street: 'evirD lainoloC tsaE 32',
              city: 'Orlando',
              state: 'Fl'
            }
          ]
        });
      });
    });

    describe('has a set method', () => {
      it('should exist on fp', () => {
        const result: Function = fp.set;
        expect(result).toEqual(jasmine.any(Function));
      });

      it('should set a shallow property', () => {
        const result: dataT = fp.set(propLens('name'))("Dude Mc' Rude")(data);
        expect(result).toEqual({
          name: "Dude Mc' Rude",
          addresses: [
            {
              street: '123 Fake Street',
              city: 'Albuquerque',
              state: 'NM'
            },
            {
              street: '23 East Colonial Drive',
              city: 'Orlando',
              state: 'Fl'
            }
          ]
        });
      });

      it('should set a deep property', () => {
        const result: dataT = fp.set(
          fp.flow(propLens('street'), propLens('0'), propLens('addresses'))
        )('456 Some Place')(data);

        expect(result).toEqual({
          name: 'Richie Rich',
          addresses: [
            {
              street: '456 Some Place',
              city: 'Albuquerque',
              state: 'NM'
            },
            {
              street: '23 East Colonial Drive',
              city: 'Orlando',
              state: 'Fl'
            }
          ]
        });
      });

      it('should set a shallow immutable property', () => {
        const result: dataT = fp
          .set(immutablePropLens('name'))("Dude Mc' Rude")(fromJS(data))
          .toJS();
        expect(result).toEqual({
          name: "Dude Mc' Rude",
          addresses: [
            {
              street: '123 Fake Street',
              city: 'Albuquerque',
              state: 'NM'
            },
            {
              street: '23 East Colonial Drive',
              city: 'Orlando',
              state: 'Fl'
            }
          ]
        });
      });

      it('should set a deep immutable property', () => {
        const result: dataT = fp
          .set(
            fp.flow(
              immutablePropLens('street'),
              immutablePropLens('0'),
              immutablePropLens('addresses')
            )
          )('456 Some Place')(fromJS(data))
          .toJS();

        expect(result).toEqual({
          name: 'Richie Rich',
          addresses: [
            {
              street: '456 Some Place',
              city: 'Albuquerque',
              state: 'NM'
            },
            {
              street: '23 East Colonial Drive',
              city: 'Orlando',
              state: 'Fl'
            }
          ]
        });
      });

      describe('mapped', () => {
        it('should exist on fp', () => {
          const result: Function = fp.mapped;
          expect(result).toEqual(jasmine.any(Function));
        });

        it('should map an array', () => {
          const lens = fp.compose(
            (fp.mapped: ((x: any) => string) => (x: any) => string[]),
            (fp.lensProp('name'): (s: { name: string }[]) => Function)
          );
          const result: string[] = fp.view(lens)([
            { name: 'foo' },
            { name: 'bar' }
          ]);

          expect(result).toEqual(['foo', 'bar']);
        });

        it('should set array props', () => {
          const result: { name: string }[] = fp.set(
            fp.compose(fp.mapped, fp.lensProp('name'))
          )('redacted')([{ name: 'foo' }, { name: 'bar' }]);

          expect(result).toEqual([{ name: 'redacted' }, { name: 'redacted' }]);
        });

        it('should transform array props', () => {
          const result: { name: string }[] = fp.over(
            fp.compose(fp.mapped, fp.lensProp('name'))
          )(x => x + 'd')([{ name: 'foo' }, { name: 'bar' }]);

          expect(result).toEqual([{ name: 'food' }, { name: 'bard' }]);
        });
      });

      describe('lensProp', () => {
        it('should exist on fp', () => {
          expect(fp.lensProp).toEqual(jasmine.any(Function));
        });

        it('should resolve a string', () => {
          const result: 'Richie Rich' = fp.view(fp.lensProp('name'))(data);
          expect(result).toEqual('Richie Rich');
        });

        it('should resolve a number', () => {
          const result: number = fp.view(fp.lensProp(0))([9, 10, 11]);
          expect(result).toBe(9);
        });

        it('should be composable', () => {
          const result: {
            street: string,
            city: string,
            state: string
          } = fp.view(fp.flow(fp.lensProp(0), fp.lensProp('addresses')))(data);

          expect(result).toEqual({
            street: '123 Fake Street',
            city: 'Albuquerque',
            state: 'NM'
          });
        });

        it('should work with over', () => {
          const result: dataT = fp.over(fp.lensProp('name'))(x => x + 'ard')(
            data
          );
          expect(result).toEqual({
            name: 'Richie Richard',
            addresses: [
              {
                street: '123 Fake Street',
                city: 'Albuquerque',
                state: 'NM'
              },
              {
                street: '23 East Colonial Drive',
                city: 'Orlando',
                state: 'Fl'
              }
            ]
          });
        });

        it('should work with set', () => {
          const result: dataT = fp.set(fp.lensProp('name'))('foo')(data);
          expect(result).toEqual({
            name: 'foo',
            addresses: [
              {
                street: '123 Fake Street',
                city: 'Albuquerque',
                state: 'NM'
              },
              {
                street: '23 East Colonial Drive',
                city: 'Orlando',
                state: 'Fl'
              }
            ]
          });
        });
      });
    });
  });

  describe('has a cond method', () => {
    let cond: (x: number) => string;

    beforeEach(() => {
      cond = fp.cond(
        [x => x === 0, fp.always('water freezes at 0°C')],
        [x => x === 100, fp.always('water boils at 100°C')],
        [fp.True, temp => `nothing special happens at ${temp}°C`]
      );
    });
    it('should exist on fp', () => {
      const result: (
        ...conditions: [Fn1<number, boolean>, Fn1<number, string>][]
      ) => (x: number) => string =
        fp.cond;
      expect(result).toEqual(jasmine.any(Function));
    });
    it('should freeze at 0', () => {
      const result: string = cond(0);
      expect(result).toEqual('water freezes at 0°C');
    });
    it('should boil at 100', () => {
      const result: string = cond(100);
      expect(result).toEqual('water boils at 100°C');
    });
    it('should do nothing special at 50', () => {
      const result: string = cond(50);
      expect(result).toEqual('nothing special happens at 50°C');
    });
    describe('with a successful predicate and empty evaluation', () => {
      type emptyT = '' | 0 | null | void | false;
      ['', 0, null, undefined, false].forEach(curVal => {
        // $FlowIgnore: this works fine
        it(`should return ${curVal}`, () => {
          const identityOrVal: (x: emptyT) => emptyT = fp.cond(
            [fp.eq(undefined), fp.always(curVal)],
            [fp.True, fp.identity]
          );
          expect(identityOrVal(undefined)).toEqual(curVal);
        });
      });
    });
  });
  describe('has a not method', () => {
    it('should exist on fp', () => {
      const result: (x: true) => boolean = fp.not;
      expect(result).toEqual(jasmine.any(Function));
    });
    it('should negate a value', () => {
      const result: boolean = fp.not(true);
      expect(result).toEqual(false);
    });
  });
  describe('has an eq method', () => {
    it('should exist on fp', () => {
      const result: (a: number) => (b: number) => boolean = fp.eq;
      expect(result).toEqual(jasmine.any(Function));
    });
    it('should check for equality', () => {
      const result: boolean = fp.eq(1)(1);
      expect(result).toBe(true);
    });
    it('should check by reference', () => {
      const result: boolean = fp.eq({})({});
      expect(result).toBe(false);
    });
    it('should tell if two immutable values are the same', () => {
      const result: boolean = fp.eq(
        Map({
          '1': 2
        })
      )(
        Map({
          '1': 2
        })
      );
      expect(result).toBe(true);
    });
    it('should work with undefined', () => {
      const result: boolean = fp.eq(undefined)(undefined);
      expect(result).toBe(true);
    });
  });
  describe('has an invoke method', () => {
    let spy: () => number;
    beforeEach(() => {
      spy = jasmine.createSpy('spy').and.returnValue(7);
    });
    it('should exist on fp', () => {
      const result: ((...rest: mixed) => number) => (x: string) => number =
        fp.invoke;
      expect(result).toEqual(jasmine.any(Function));
    });
    it('should invoke the function with an array of items', () => {
      const items = [
        'some',
        'array',
        'of',
        'items',
        7,
        {
          key: 'val'
        }
      ];
      fp.invoke(spy)(items);
      expect(spy).toHaveBeenCalledOnceWith('some', 'array', 'of', 'items', 7, {
        key: 'val'
      });
    });
  });
  describe('has an eqFn method', () => {
    it('should exist on fp', () => {
      const result: Function = fp.eqFn;
      expect(result).toEqual(jasmine.any(Function));
    });
    it('should allow for custom methods to determine equality', () => {
      const objA = {
        foo: {
          bar: 'baz'
        }
      };
      const objB = {
        bar: 'baz'
      };
      const fooLens = fp.lensProp('foo');
      const barLens = fp.lensProp('bar');
      const l = fp.view(fp.flow(barLens, fooLens));
      const result: boolean = fp.eqFn(l)(fp.view(barLens))(objA)(objB);
      expect(result).toBe(true);
    });
  });
  describe('has a noop method', () => {
    it('should exist on fp', () => {
      const result: Function = fp.noop;
      expect(result).toEqual(jasmine.any(Function));
    });
    it('should return undefined', () => {
      const result: void = fp.noop();
      expect(result).toBe(undefined);
    });
  });
  describe('has an or method', () => {
    let is5Or6: (x: number) => boolean;
    beforeEach(() => {
      is5Or6 = fp.or([fp.eq(5), fp.eq(6)]);
      (is5Or6: (p: number) => boolean);
    });
    it('should exist on fp', () => {
      const result: Function = fp.or;
      expect(result).toEqual(jasmine.any(Function));
    });
    it('should return a function after seeding', () => {
      const result: (x: number) => boolean = is5Or6;
      expect(result).toEqual(jasmine.any(Function));
    });
    [5, 6].forEach(val => {
      it(`should return true for ${val}`, () => {
        const result: boolean = is5Or6(val);
        expect(result).toBe(true);
      });
    });
    it('should return false if or is false', () => {
      const result: boolean = is5Or6(7);
      expect(result).toBe(false);
    });
  });
  describe('has an and method', () => {
    let isFooAnd3Chars: (x: string) => boolean;
    beforeEach(() => {
      isFooAnd3Chars = fp.and([
        fp.eq('foo'),
        fp.eqFn(fp.identity)(fp.view(fp.lensProp('length')))(3)
      ]);
    });
    it('should exist on fp', () => {
      const result: Function = fp.and;
      expect(result).toEqual(jasmine.any(Function));
    });
    it('should return a function after seeding', () => {
      const result: (x: string) => boolean = isFooAnd3Chars;
      expect(result).toEqual(jasmine.any(Function));
    });
    it('should return true if all true', () => {
      const result: boolean = isFooAnd3Chars('foo');
      expect(result).toBe(true);
    });
    it('should return false if any false', () => {
      const result: boolean = isFooAnd3Chars('zoo');
      expect(result).toBe(false);
    });
  });
  describe('has a bindMethod method', () => {
    let indexOf, indexOfABC: (str: string) => number;
    it('should exist on fp', () => {
      const result: Function = fp.bindMethod;
      expect(result).toEqual(jasmine.any(Function));
    });
    it('should be curried', () => {
      const result: Function = fp.bindMethod('indexOf');
      expect(result).toEqual(jasmine.any(Function));
    });
    it('should return a bound method as a free floating function', () => {
      indexOf = fp.bindMethod('indexOf');
      indexOfABC = (indexOf('abc'): (str: string) => number);
      const result: number = indexOfABC('b');
      expect(result).toBe(1);
    });
  });
  describe('has an invokeMethod method', () => {
    it('should exist on fp', () => {
      const result: Function = fp.invokeMethod;
      expect(result).toEqual(jasmine.any(Function));
    });
    it('should be curried', () => {
      const result: Function = fp.invokeMethod('foo');
      expect(result).toEqual(jasmine.any(Function));
    });
    it('should return a function that is bound and invoke that function', () => {
      const indexOfB: (str: string) => number = (fp.invokeMethod('indexOf')([
        'b'
      ]): (str: string) => number);
      const result: number = indexOfB('abc');
      expect(result).toBe(1);
    });
  });
  describe('zipObject', () => {
    it('should exist on fp', () => {
      const result: Function = fp.zipObject;
      expect(result).toEqual(jasmine.any(Function));
    });
    it('should be curried', () => {
      const result: Function = fp.zipObject(['name', 'age']);
      expect(result).toEqual(jasmine.any(Function));
    });
    it('should zip two arrays into a single object', () => {
      const result: Object = fp.zipObject(['name', 'age'])(['foo', 27]);
      expect(result).toEqual({
        name: 'foo',
        age: 27
      });
    });
    it('should ignore extra items on the second array', () => {
      const result: Object = fp.zipObject('abc'.split(''))('defghi'.split(''));
      expect(result).toEqual({
        a: 'd',
        b: 'e',
        c: 'f'
      });
    });
    it('should set missing values to undefined', () => {
      const result: Object = fp.zipObject('abcdef'.split(''))('ghi'.split(''));
      expect(result).toEqual({
        a: 'g',
        b: 'h',
        c: 'i',
        d: undefined,
        e: undefined,
        f: undefined
      });
    });
  });
  describe('has a some method', () => {
    it('should exist on fp', () => {
      const result: Function = fp.some;
      expect(result).toEqual(jasmine.any(Function));
    });
    it('should tell if some passed', () => {
      const res: boolean = fp.some(fp.eq(1))([1, 2, 3]);
      expect(res).toBe(true);
    });
    it('should tell if all failed', () => {
      const res: boolean = fp.some(fp.eq(4))([1, 2, 3]);
      expect(res).toBe(false);
    });
  });
  describe('has an every method', () => {
    it('should exist on fp', () => {
      const result: Function = fp.every;
      expect(result).toEqual(jasmine.any(Function));
    });
    it('should tell if every failed', () => {
      const res: boolean = fp.every(fp.eq(1))([1, 2, 3]);
      expect(res).toBe(false);
    });
    it('should tell if every passed', () => {
      const res: boolean = fp.some(fp.eq(2))([2, 2, 2]);
      expect(res).toBe(true);
    });
  });
  describe('has an unwrap method', () => {
    it('should exist on fp', () => {
      const result: Function = fp.unwrap;
      expect(result).toEqual(jasmine.any(Function));
    });
    it('should unwrap a nested array', () => {
      const result: Array<mixed> = fp.unwrap([['a'], [1], ['c']]);
      expect(result).toEqual(['a', 1, 'c']);
    });
    it('should not unwrap deeply nested values', () => {
      const result: Array<mixed> = fp.unwrap(['a', ['b'], [['c']]]);
      expect(result).toEqual(['a', 'b', ['c']]);
    });
    it('should unwrap a single value', () => {
      const result: Array<mixed> = fp.unwrap([['a']]);
      expect(result).toEqual(['a']);
    });
  });
  describe('has a head method', () => {
    it('should exist on fp', () => {
      const result: Function = fp.head;
      expect(result).toEqual(jasmine.any(Function));
    });
    it('should pull the first value off an array', () => {
      const result: ?number = maybe.from(fp.head([1, 2, 3]));
      expect(result).toBe(1);
    });
    it('should return null if array is empty', () => {
      const result: ?string = maybe.from(fp.head([]));
      expect(result).toBe(null);
    });
    it('should work with a string', () => {
      const result: ?string = maybe.from(fp.head('foo'));
      expect(result).toBe('f');
    });
    it('should return null when called with an empty string', () => {
      const result: ?string = maybe.from(fp.head(''));
      expect(result).toBe(null);
    });
  });
  describe('has an arrayWrap method', () => {
    it('should exist on fp', () => {
      const result: Function = fp.arrayWrap;
      expect(result).toEqual(jasmine.any(Function));
    });
    it('should wrap a value in an array', () => {
      const result: Array<string> = fp.arrayWrap('foo');
      expect(result).toEqual(['foo']);
    });
  });
  describe('has a once method', () => {
    let spy: Function;
    beforeEach(() => {
      spy = jasmine.createSpy('spy');
    });
    it('should exist on fp', () => {
      const result: Function = fp.once;
      expect(result).toEqual(jasmine.any(Function));
    });
    it('should return a function', () => {
      const result: Function = fp.once(spy);
      expect(result).toEqual(jasmine.any(Function));
    });
    it('should not invoke the function passed in initially', () => {
      fp.once(spy);
      expect(spy).not.toHaveBeenCalled();
    });
    describe('invoking', () => {
      let once: () => void;
      beforeEach(() => {
        once = fp.once(spy);
        once('a', 'b', 'c');
        once('d', 'e', 'f');
      });
      it('should call one time with expected args', () => {
        expect(spy).toHaveBeenCalledOnceWith('a', 'b', 'c');
      });
      it('should call one time', () => {
        expect(spy).toHaveBeenCalledOnce();
      });
    });
  });
  describe('has an either method', () => {
    it('should exist on fp', () => {
      const result: Function = fp.either;
      expect(result).toEqual(jasmine.any(Function));
    });
    describe('chaining', () => {
      let spy1,
        spy2,
        spy1Error,
        spy2Error,
        chain: (x: 'bar') => 'bar' | Error,
        chainError;
      beforeEach(() => {
        spy1 = (jasmine.createSpy('spy1').and.callFake(fp.identity): (
          x: 'bar'
        ) => 'bar');
        spy2 = (jasmine.createSpy('spy2').and.callFake(fp.identity): (
          x: 'bar' | Error
        ) => 'bar');
        spy1Error = (jasmine.createSpy('spy1').and.callFake(fp.identity): (
          x: Error
        ) => Error);
        spy2Error = (jasmine.createSpy('spy2').and.callFake(fp.identity): (
          x: Error
        ) => Error);
        const stringSpy1 = fp.either(spy1);
        const stringSpy2 = fp.either(spy2);
        const errorSpy1 = fp.either(spy1Error);
        const errorSpy2 = fp.either(spy2Error);
        chain = fp.flow(stringSpy1, stringSpy2);
        chainError = fp.flow(errorSpy1, errorSpy2);
      });
      it('should pass errors', () => {
        const result: Error = chainError(new Error('boom!'));
        expect(result).toEqual(new Error('boom!'));
      });
      it('should not call spy1', () => {
        chainError(new Error('boom!'));
        expect(spy1Error).not.toHaveBeenCalled();
      });
      it('should not call spy2', () => {
        chainError(new Error('boom!'));
        expect(spy2Error).not.toHaveBeenCalled();
      });
      it('should pass values', () => {
        const result: string | Error = chain('bar');
        expect(result).toBe('bar');
      });
      it('should call spy1', () => {
        chain('bar');
        expect(spy1).toHaveBeenCalledOnceWith('bar');
      });
      it('should call spy2', () => {
        chain('bar');
        expect(spy2).toHaveBeenCalledOnceWith('bar');
      });
    });
    describe('error handling', () => {
      let spy, result: Error;
      beforeEach(() => {
        spy = (jasmine.createSpy('spy'): (e: Error) => Error);
        result = fp.either(spy)(new Error('boom!'));
      });
      it('should treat an error instance as a left', () => {
        expect(result).toEqual(new Error('boom!'));
      });
      it('should not call fn', () => {
        expect(spy).not.toHaveBeenCalled();
      });
    });
    describe('non-error handling', () => {
      let spy: Function, result: 'foo' | Error;
      beforeEach(() => {
        spy = (jasmine.createSpy('spy').and.callFake(fp.identity): (
          x: 'foo'
        ) => 'foo');
        result = fp.either(spy)('foo');
      });
      it('should treat non-errors as a right', () => {
        expect(result).toEqual('foo');
      });
      it('should call fn', () => {
        expect(spy).toHaveBeenCalledOnceWith('foo');
      });
    });
  });
  describe('has a tail method', () => {
    it('should exist on fp', () => {
      const result: Function = fp.tail;
      expect(result).toEqual(jasmine.any(Function));
    });
    it('should pull the rest of the list', () => {
      const items = [1, 2, 3];
      const result: Array<number> = fp.tail(items);
      expect(result).toEqual([2, 3]);
    });
    it('should return an empty list if list is empty', () => {
      const result: Array<number> = fp.tail([]);
      expect(result).toEqual([]);
    });
    it('should work with a string', () => {
      const result: string = fp.tail('foo');
      expect(result).toBe('oo');
    });
    it('should return an empty string when called with an empty string', () => {
      const result: string = fp.tail('');
      expect(result).toBe('');
    });
  });
  describe('has a last method', () => {
    it('should exist on fp', () => {
      const result: Function = fp.last;
      expect(result).toEqual(jasmine.any(Function));
    });
    it('should pull the last element', () => {
      const items = [1, 2, 3];
      const result: ?number = maybe.from(fp.last(items));
      expect(result).toBe(3);
    });
    it('should return null if the list is empty', () => {
      const result: ?number = maybe.from(fp.last([]));
      expect(result).toBe(null);
    });
    it('should work with a string', () => {
      const result: ?string = maybe.from(fp.last('foo'));
      expect(result).toBe('o');
    });
    it('should return null when called with an empty string', () => {
      const result: ?string = maybe.from(fp.last(''));
      expect(result).toBe(null);
    });
  });
  describe('has a tap method', () => {
    let spy, result: Array<1>;
    beforeEach(() => {
      spy = (jasmine.createSpy('spy'): (x: 1) => void);
      result = fp.tap(spy)([1]);
    });
    it('should exist on fp', () => {
      const tap: Function = fp.tap;
      expect(tap).toEqual(jasmine.any(Function));
    });
    it('should invoke the specified function with specified args', () => {
      expect(spy).toHaveBeenCalledOnceWith(1);
    });
    it('should carry the input through the tap', () => {
      expect(result).toEqual([1]);
    });
  });
  describe('has an mapFn method', () => {
    let spy1, spy2, spy3, args, result: Array<number>;
    beforeEach(() => {
      args = ['a', 1, false];
      spy1 = (jasmine.createSpy('spy1').and.returnValue(1): (
        a: 'a',
        b: 1,
        c: false
      ) => 1);
      spy2 = (jasmine.createSpy('spy2').and.returnValue(2): (
        a: 'a',
        b: 1,
        c: false
      ) => 2);
      spy3 = (jasmine.createSpy('spy3').and.returnValue(3): (
        a: 'a',
        b: 1,
        c: false
      ) => 3);
      result = fp.mapFn([spy1, spy2, spy3])(args);
    });
    it('should exist on fp', () => {
      const mapFn: Function = fp.mapFn;
      expect(mapFn).toEqual(jasmine.any(Function));
    });
    it('should invoke spy1 with (a, 1, false).', () => {
      expect(spy1).toHaveBeenCalledOnceWith('a', 1, false);
    });
    it('should invoke spy2 with (a, 1, false).', () => {
      expect(spy2).toHaveBeenCalledOnceWith('a', 1, false);
    });
    it('should invoke spy3 with (a, 1, false).', () => {
      expect(spy3).toHaveBeenCalledOnceWith('a', 1, false);
    });
    it('should return an array of mapped invoked values', () => {
      expect(result).toEqual([1, 2, 3]);
    });
  });
  describe('has a chainL method', () => {
    let adder;
    beforeEach(() => {
      adder = fp.chainL((a: number, b: number) => a + b);
    });
    it('should exist on fp', () => {
      const result: Function = fp.chainL;
      expect(result).toEqual(jasmine.any(Function));
    });
    it('should reduce two values', () => {
      const result: number = adder([1, 2]);
      expect(result).toBe(3);
    });
    it('should reduce 3 values', () => {
      const result: number = adder([1, 2, 3]);
      expect(result).toBe(6);
    });
    it('should reduce 4 values', () => {
      const result: number = adder([1, 2, 3, 4]);
      expect(result).toBe(10);
    });
  });
  describe('xProd', () => {
    it('should exist on fp', () => {
      const result: Function = fp.xProd;
      expect(result).toEqual(jasmine.any(Function));
    });
    it('should return the cross product of two arrays', () => {
      const result: Array<Array<any>> = fp.xProd([1, 2])([3, 4]);
      expect(result).toEqual([[1, 3], [1, 4], [2, 3], [2, 4]]);
    });
  });
  describe('anyPass', () => {
    let passes;
    beforeEach(() => {
      const gt = (x: number) => (y: number): boolean => y > x;
      passes = fp.anyPass(([gt(9), gt(4), gt(5)]: Array<(number) => boolean>));
    });
    it('should exist on fp', () => {
      const result: Function = fp.anyPass;
      expect(result).toEqual(jasmine.any(Function));
    });
    it('should return false if none pass', () => {
      const result: boolean = passes([3]);
      expect(result).toBe(false);
    });
    it('should return true if any pass', () => {
      const result: boolean = passes([7]);
      expect(result).toBe(true);
    });
  });
  describe('zipBy', () => {
    let spy1: Function, spy2: Function, spy3: Function, result: Array<string>;
    describe('matching functions with single args', () => {
      beforeEach(() => {
        spy1 = (jasmine.createSpy('spy1').and.callFake(fp.identity): (
          x: string
        ) => string);
        spy2 = (jasmine.createSpy('spy2').and.callFake(fp.identity): (
          x: string
        ) => string);
        spy3 = (jasmine.createSpy('spy3').and.callFake(fp.identity): (
          x: string
        ) => string);
        result = fp.zipBy((a: (x: string) => string, b: string) => a(b))([
          spy1,
          spy2,
          spy3
        ])(['dee', 'doo', 'da']);
      });
      it('should exist on fp', () => {
        const zipBy: Function = fp.zipBy;
        expect(zipBy).toEqual(jasmine.any(Function));
      });
      it('should invoke spy1 with dee', () => {
        expect(spy1).toHaveBeenCalledWith('dee');
      });
      it('should invoke spy2 with doo', () => {
        expect(spy2).toHaveBeenCalledWith('doo');
      });
      it('should invoke spy3 with da', () => {
        expect(spy3).toHaveBeenCalledWith('da');
      });
      it('should return the result of each call as an array', () => {
        expect(result).toEqual(['dee', 'doo', 'da']);
      });
      describe('with fewer left than right', () => {
        it('should return the result of the first two', () => {
          const result: Array<
            string
          > = fp.zipBy((a: (x: string) => string, b: string) => a(b))([
            spy1,
            spy2
          ])(['dee', 'doo', 'da']);
          expect(result).toEqual(['dee', 'doo']);
        });
      });
      describe('with fewer right than left', () => {
        it('should return the result of the first two', () => {
          const result: Array<
            string
          > = fp.zipBy((a: (x: string) => string, b: string) => a(b))([
            spy1,
            spy2,
            spy3
          ])(['dee', 'doo']);
          expect(result).toEqual(['dee', 'doo']);
        });
      });
    });
    describe('concatenating strings', () => {
      it('should concat the results into a single array', () => {
        const result: Array<string> = fp.zipBy((a, b) => a + b)([
          'cat',
          'space',
          'thunder'
        ])(['amaran', ' balls', ' storm']);
        expect(result).toEqual(['catamaran', 'space balls', 'thunder storm']);
      });
    });
  });
  describe('memoize', () => {
    it('should exist on fp', () => {
      const result: Function = fp.memoize;
      expect(result).toEqual(jasmine.any(Function));
    });
    describe('working with cache', () => {
      let fn;
      beforeEach(() => {
        let count = 0;
        fn = fp.memoize(() => ++count);
      });
      it('should return the memoized result', () => {
        fn(1);
        const result: number = fn(1);
        expect(result).toBe(1);
      });
      it('should return new result on cache miss', () => {
        fn(1);
        fn(2);
        fn(3);
        const result: number = fn(4);
        expect(result).toBe(4);
      });
      it('should cache hit with multiple args', () => {
        fn(1, 2);
        const result: number = fn(1, 2);
        expect(result).toBe(1);
      });
      it('should cache miss with multiple args', () => {
        fn(1, 2, 3, 4);
        fn(1, 2, 3);
        const result: number = fn(1, 2);
        expect(result).toBe(3);
      });
      it('should cache miss with less invocation args', () => {
        fn(1, 2);
        fn(1, 2, 3);
        const result: number = fn(1, 2, 3, 4);
        expect(result).toBe(3);
      });
    });
  });
  describe('uniqBy', () => {
    type arrayOfNumT = Array<{
      num: number
    }>;
    it('should exist on fp', () => {
      const result: Function = fp.uniqBy;
      expect(result).toEqual(jasmine.any(Function));
    });
    it('should remove dups', () => {
      const result: arrayOfNumT = fp.uniqBy(x => x.num)([
        {
          num: 1
        },
        {
          num: 2
        },
        {
          num: 3
        },
        {
          num: 2
        },
        {
          num: 1
        }
      ]);
      expect(result).toEqual([
        {
          num: 1
        },
        {
          num: 2
        },
        {
          num: 3
        }
      ]);
    });
    it('should work with an empty array', () => {
      const result: arrayOfNumT = fp.uniqBy((x: ?{ num: number }) => x)([]);
      expect(result).toEqual([]);
    });
    it('should work with no dups', () => {
      const result: arrayOfNumT = fp.uniqBy(x => x.num)([
        {
          num: 1
        },
        {
          num: 2
        },
        {
          num: 3
        }
      ]);
      expect(result).toEqual([
        {
          num: 1
        },
        {
          num: 2
        },
        {
          num: 3
        }
      ]);
    });
  });
  describe('times', () => {
    it('should exist on fp', () => {
      const result: Function = fp.times;
      expect(result).toEqual(jasmine.any(Function));
    });
    it('should execute a fn n times', () => {
      const result: Array<number> = fp.times(x => x + 1)(5);
      expect(result).toEqual([1, 2, 3, 4, 5]);
    });
  });
  describe('match', () => {
    class ClassType1 {}
    class ClassType2 {}
    class ClassType3 {}
    class ClassType4 {}
    class ClassType5 {}
    let class1RClass1,
      class1RString,
      class2RClass2,
      class2RString,
      class3RClass3,
      class3RString,
      class4RClass4,
      class4RString,
      class5RClass5,
      class5RString;
    beforeEach(() => {
      class1RClass1 = [ClassType1, (x: ClassType1) => x];
      class1RString = [ClassType1, (() => 'foo': (x: ClassType1) => 'foo')];
      class2RClass2 = [ClassType2, (x: ClassType2) => x];
      class2RString = [ClassType2, (() => 'bar': (x: ClassType2) => 'bar')];
      class3RClass3 = [ClassType3, (x: ClassType3) => x];
      class3RString = [ClassType3, (() => 'baz': (x: ClassType3) => 'baz')];
      class4RClass4 = [ClassType4, (x: ClassType4) => x];
      class4RString = [ClassType4, (() => 'bam': (x: ClassType4) => 'bam')];
      class5RClass5 = [ClassType5, (x: ClassType5) => x];
      class5RString = [ClassType5, (() => 'jam': (x: ClassType5) => 'jam')];
    });
    describe('with 2 entries', () => {
      it('should return "foo"', () => {
        const r: 'foo' = fp.match([class1RString, class2RString])(
          new ClassType1()
        );
        expect(r).toEqual('foo');
      });
      it('should return an instance of ClassType1', () => {
        const r: boolean =
          fp.match([class1RClass1, class2RString])(new ClassType1()) instanceof
          ClassType1;
        expect(r).toBe(true);
      });
      it('should return "bar"', () => {
        const r: 'bar' = fp.match([class1RString, class2RString])(
          new ClassType2()
        );
        expect(r).toEqual('bar');
      });
      it('should return an instance of ClassType2', () => {
        const r: boolean =
          fp.match([class1RString, class2RClass2])(new ClassType2()) instanceof
          ClassType2;
        expect(r).toBe(true);
      });
      it('should work with a primitive as the matcher', () => {
        const r: 'bar' = fp.match([
          ['foo', (() => 'foo': (x: 'foo') => 'foo')],
          ['bar', (() => 'bar': (x: 'bar') => 'bar')]
        ])('bar');
        expect(r).toEqual('bar');
      });
      it('should work with a function as a matcher', () => {
        const r: 'bar' = fp.match([
          [() => 'foo', (() => 'foo': (x: 'foo') => 'foo')],
          [() => 'bar', (() => 'bar': (x: 'bar') => 'bar')]
        ])('bar');
        expect(r).toEqual('bar');
      });
    });
    describe('with 3 entries', () => {
      it('should return "foo"', () => {
        const r: 'foo' = fp.match([
          class1RString,
          class2RString,
          class3RString
        ])(new ClassType1());
        expect(r).toEqual('foo');
      });
      it('should return "bar"', () => {
        const r: 'bar' = fp.match([
          class1RString,
          class2RString,
          class3RString
        ])(new ClassType2());
        expect(r).toEqual('bar');
      });
      it('should return "baz"', () => {
        const r: 'baz' = fp.match([
          class1RString,
          class2RString,
          class3RString
        ])(new ClassType3());
        expect(r).toEqual('baz');
      });
      it('should return an instance of ClassType3', () => {
        const r: boolean =
          fp.match([class1RString, class2RString, class3RClass3])(
            new ClassType3()
          ) instanceof ClassType3;
        expect(r).toBe(true);
      });
      it('should work with a primitive as the matcher', () => {
        const r: 'baz' = fp.match([
          ['foo', (() => 'foo': (x: 'foo') => 'foo')],
          ['bar', (() => 'bar': (x: 'bar') => 'bar')],
          ['baz', (() => 'baz': (x: 'baz') => 'baz')]
        ])('baz');
        expect(r).toEqual('baz');
      });
      it('should work with a function as a matcher', () => {
        const r: 'bar' = fp.match([
          [() => 'foo', (() => 'foo': (x: 'foo') => 'foo')],
          [() => 'bar', (() => 'bar': (x: 'bar') => 'bar')],
          [() => 'baz', (() => 'baz': (x: 'baz') => 'baz')]
        ])('bar');
        expect(r).toEqual('bar');
      });
    });
    describe('with 4 entries', () => {
      it('should return "foo"', () => {
        const r: 'foo' = fp.match([
          class1RString,
          class2RString,
          class3RString,
          class4RString
        ])(new ClassType1());
        expect(r).toEqual('foo');
      });
      it('should return "bar"', () => {
        const r: 'bar' = fp.match([
          class1RClass1,
          class2RString,
          class3RString,
          class4RString
        ])(new ClassType2());
        expect(r).toEqual('bar');
      });
      it('should return "baz"', () => {
        const r: 'baz' = fp.match([
          class1RClass1,
          class2RClass2,
          class3RString,
          class4RString
        ])(new ClassType3());
        expect(r).toEqual('baz');
      });
      it('should return "bam"', () => {
        const r: 'bam' = fp.match([
          class1RString,
          class2RString,
          class3RString,
          class4RString
        ])(new ClassType4());
        expect(r).toEqual('bam');
      });
      it('should return an instance of ClassType4', () => {
        const r: boolean =
          fp.match([
            class1RString,
            class2RString,
            class3RString,
            class4RClass4
          ])(new ClassType4()) instanceof ClassType4;
        expect(r).toBe(true);
      });
      it('should work with a primitive as the matcher', () => {
        const r: 'bam' = fp.match([
          ['foo', (() => 'foo': (x: 'foo') => 'foo')],
          ['bar', (() => 'bar': (x: 'bar') => 'bar')],
          ['baz', (() => 'baz': (x: 'baz') => 'baz')],
          ['bam', (() => 'bam': (x: 'bam') => 'bam')]
        ])('bam');
        expect(r).toEqual('bam');
      });
      it('should work with a function as a matcher', () => {
        const r: 'baz' = fp.match([
          [() => 'foo', (() => 'foo': (x: 'foo') => 'foo')],
          [() => 'bar', (() => 'bar': (x: 'bar') => 'bar')],
          [() => 'baz', (() => 'baz': (x: 'baz') => 'baz')],
          [() => 'bam', (() => 'bam': (x: 'bam') => 'bam')]
        ])('baz');
        expect(r).toEqual('baz');
      });
    });
    describe('with 5 entries', () => {
      it('should return "foo"', () => {
        const r: 'foo' = fp.match([
          class1RString,
          class2RString,
          class3RString,
          class4RString,
          class5RString
        ])(new ClassType1());
        expect(r).toEqual('foo');
      });
      it('should return "bar"', () => {
        const r: 'bar' = fp.match([
          class1RClass1,
          class2RString,
          class3RString,
          class4RString,
          class5RString
        ])(new ClassType2());
        expect(r).toEqual('bar');
      });
      it('should return "baz"', () => {
        const r: 'baz' = fp.match([
          class1RClass1,
          class2RClass2,
          class3RString,
          class4RString,
          class5RString
        ])(new ClassType3());
        expect(r).toEqual('baz');
      });
      it('should return "bam"', () => {
        const r: 'bam' = fp.match([
          class1RString,
          class2RString,
          class3RString,
          class4RString,
          class5RString
        ])(new ClassType4());
        expect(r).toEqual('bam');
      });
      it('should return "jam"', () => {
        const r: 'jam' = fp.match([
          class1RString,
          class2RString,
          class3RString,
          class4RString,
          class5RString
        ])(new ClassType5());
        expect(r).toEqual('jam');
      });
      it('should return an instance of ClassType5', () => {
        const r: boolean =
          fp.match([
            class1RString,
            class2RString,
            class3RString,
            class4RClass4,
            class5RClass5
          ])(new ClassType5()) instanceof ClassType5;
        expect(r).toBe(true);
      });
      it('should work with a primitive as the matcher', () => {
        const r: 'jam' = fp.match([
          ['foo', (() => 'foo': (x: 'foo') => 'foo')],
          ['bar', (() => 'bar': (x: 'bar') => 'bar')],
          ['baz', (() => 'baz': (x: 'baz') => 'baz')],
          ['bam', (() => 'bam': (x: 'bam') => 'bam')],
          ['jam', (() => 'jam': (x: 'jam') => 'jam')]
        ])('jam');
        expect(r).toEqual('jam');
      });
      it('should work with a function as a matcher', () => {
        const r: 'bam' = fp.match([
          [() => 'foo', (() => 'foo': (x: 'foo') => 'foo')],
          [() => 'bar', (() => 'bar': (x: 'bar') => 'bar')],
          [() => 'baz', (() => 'baz': (x: 'baz') => 'baz')],
          [() => 'bam', (() => 'bam': (x: 'bam') => 'bam')],
          [() => 'jam', (() => 'jam': (x: 'jam') => 'jam')]
        ])('bam');
        expect(r).toEqual('bam');
      });
    });
  });
});
