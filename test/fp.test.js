// @flow

import * as fp from '../source/fp.js';
import * as maybe from '@iml/maybe';

import type { Maybe } from '@iml/maybe';

import { describe, beforeEach, it, expect, jasmine } from './jasmine';

import { Map, fromJS } from 'immutable';

describe('the fp module', () => {
  describe('has a curry method', () => {
    let toArray;

    beforeEach(() => {
      toArray = (...rest) => rest;
    });

    describe('with 3 args', () => {
      let curry3;

      beforeEach(() => {
        curry3 = fp.curry3(toArray);
      });

      it('should return a function if not satisfied', () => {
        expect(curry3(1, 2)).toEqual(jasmine.any(Function));
      });

      it('should be satisfied with one call', () => {
        expect(curry3(1, 2, 3)).toEqual([1, 2, 3]);
      });

      it('should be satisfied with two initial args', () => {
        expect(curry3(1, 2)(3)).toEqual([1, 2, 3]);
      });

      it('should be satisfied with one initial arg and two calls', () => {
        expect(curry3(1)(2)(3)).toEqual([1, 2, 3]);
      });
    });

    describe('with a placeholder', () => {
      let curry1;

      beforeEach(() => {
        curry1 = fp.curry2(toArray)(1);
      });

      it('should be immutable', () => {
        curry1(3);

        expect(curry1(2)).toEqual([1, 2]);
      });
    });
  });

  describe('has a map method', () => {
    let add1;

    beforeEach(() => {
      add1 = n => n + 1;
    });

    it('should exist on fp', () => {
      expect(fp.map).toEqual(jasmine.any(Function));
    });

    it('should be curried', () => {
      expect(fp.map(fp.identity)).toEqual(jasmine.any(Function));
    });

    it('should map a list', () => {
      expect(fp.map(add1, [1, 2, 3])).toEqual([2, 3, 4]);
    });

    it("should be unary'd", () => {
      const spy = jasmine.createSpy('unary');
      fp.map(spy, [1]);
      expect(spy).toHaveBeenCalledWith(1);
    });
  });

  describe('has a filter method', () => {
    it('should exist on fp', () => {
      expect(fp.filter).toEqual(jasmine.any(Function));
    });

    it('should filter a list', () => {
      expect(fp.filter(fp.eq(3), [1, 2, 3])).toEqual([3]);
    });

    it('should be curried', () => {
      expect(fp.filter(fp.eq(1))([1, 2, 3])).toEqual([1]);
    });
  });

  describe('has a reduce method', () => {
    it('should exist on fp', () => {
      expect(fp.reduce).toEqual(jasmine.any(Function));
    });

    it('should reduce a list', () => {
      const result: number = fp.reduce(0, (x, y) => x + y, [1, 2, 3]);

      expect(result).toEqual(6);
    });
  });

  describe('has a find method', () => {
    it('should exist on fp', () => {
      expect(fp.find).toEqual(jasmine.any(Function));
    });

    it('should find a value', () => {
      const result: Maybe<number> = fp.find(fp.eq(3), [1, 2, 3]);

      expect(maybe.from(result)).toBe(3);
    });

    it('should be curried', () => {
      const result: Maybe<number> = fp.find(fp.eq(1))([1, 2, 3]);

      expect(maybe.from(result)).toBe(1);
    });

    it('should return undefined on no match', () => {
      expect(maybe.from(fp.find(fp.eq(10), [1, 2, 3]))).toBe(undefined);
    });
  });

  describe('has a pluck method', () => {
    it('should exist on fp', () => {
      expect(fp.pluck).toEqual(jasmine.any(Function));
    });

    it('should pluck from a collection', () => {
      const result: string[] = fp.pluck('foo', [
        { foo: 'bar' },
        { foo: 'baz' }
      ]);

      expect(result).toEqual(['bar', 'baz']);
    });

    it('should be curried', () => {
      expect(fp.pluck('foo')).toEqual(jasmine.any(Function));
    });
  });

  describe('has an identity method', () => {
    it('should exist on fp', () => {
      expect(fp.identity).toEqual(jasmine.any(Function));
    });

    it("should return it's value", () => {
      expect(fp.identity(1)).toEqual(1);
    });
  });

  describe('has an always method', () => {
    it('should exist on fp', () => {
      expect(fp.always).toEqual(jasmine.any(Function));
    });

    it("should always return it's value", () => {
      expect(fp.always('foo')()).toEqual('foo');
    });
  });

  describe('has a True method', () => {
    it('should exist on fp', () => {
      expect(fp.True).toEqual(jasmine.any(Function));
    });

    it('should always return true', () => {
      expect(fp.True()).toBe(true);
    });
  });

  describe('has a False method', () => {
    it('should exist on fp', () => {
      expect(fp.False).toEqual(jasmine.any(Function));
    });

    it('should always return false', () => {
      expect(fp.False()).toBe(false);
    });
  });

  describe('has a flow method', () => {
    it('should exist on fp', () => {
      expect(fp.flow).toEqual(jasmine.any(Function));
    });

    it('should return a function', () => {
      expect(fp.flow(fp.identity)).toEqual(jasmine.any(Function));
    });

    it('should compose fns', () => {
      const add1 = x => x + 1;
      const mult2 = x => x * 2;

      expect(fp.flow(add1, mult2)(3)).toEqual(8);
    });
  });

  describe('has a compose method', () => {
    it('should exist on fp', () => {
      expect(fp.compose).toEqual(jasmine.any(Function));
    });

    it('should return a function', () => {
      expect(fp.compose(fp.identity)).toEqual(jasmine.any(Function));
    });

    it('should compose fns', () => {
      const add1 = x => x + 1;
      const mult2 = x => x * 2;

      expect(fp.compose(mult2, add1)(3)).toEqual(8);
    });
  });

  describe('has a difference method', () => {
    it('should exist on fp', () => {
      expect(fp.difference).toEqual(jasmine.any(Function));
    });

    it('should calculate differences', () => {
      const result = fp.difference([1, 2, 3], [1, 2]);

      expect(result).toEqual([3]);
    });

    it('should be curried', () => {
      expect(fp.difference([1, 2, 3])([1, 2])).toEqual([3]);
    });

    it('should work with empty arrays', () => {
      expect(fp.difference([], [])).toEqual([]);
    });

    it('should produce a set', () => {
      expect(fp.difference([1, 1, 2], [2])).toEqual([1]);
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
      expect(fp.differenceBy).toEqual(jasmine.any(Function));
    });

    it('should tell difference by id with results', () => {
      expect(fp.differenceBy(x => x.id, b, a)).toEqual([
        { id: 3, name: 'baz' },
        { id: 4, name: 'bap' }
      ]);
    });

    it('should tell difference by id with no results', () => {
      expect(fp.differenceBy(x => x.id, a, b)).toEqual([]);
    });

    it('should produce a set', () => {
      b.push({ id: 3, name: 'baz' });

      expect(fp.differenceBy(x => x.id, b, a)).toEqual([
        { id: 3, name: 'baz' },
        { id: 4, name: 'bap' }
      ]);
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
      expect(fp.intersectionBy).toEqual(jasmine.any(Function));
    });

    it('should tell intersection by id with results', () => {
      expect(fp.intersectionBy(x => x.id, a, b)).toEqual([
        { id: 1, name: 'foo' },
        { id: 2, name: 'bar' }
      ]);
    });

    it('should tell intersection by id with no results', () => {
      expect(fp.intersectionBy(x => x.id, a, [])).toEqual([]);
    });

    it('should produce a set', () => {
      b.push({ id: 1, name: 'foo' });

      expect(fp.intersectionBy(x => x.id, b, a)).toEqual([
        { id: 1, name: 'foo' },
        { id: 2, name: 'bar' }
      ]);
    });
  });

  describe('working with lenses', () => {
    let data, propLens, immutablePropLens;

    beforeEach(() => {
      propLens = prop => {
        return fp.lens(xs => xs[prop], (v, xs) => {
          const keys = Object.keys(xs);
          const container = Array.isArray(xs) ? [] : {};

          const out = keys.reduce(
            (container, key) => {
              container[key] = xs[key];
              return container;
            },
            container
          );

          if (typeof prop === 'string') prop = prop.toString();

          // $FlowIgnore: access is fine here
          out[prop] = v;

          return out;
        });
      };

      immutablePropLens = prop => {
        return fp.lens(xs => xs.get(prop), (v, xs) => xs.set(prop, v));
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
        expect(fp.lens).toEqual(jasmine.any(Function));
      });
    });

    describe('has a view method', () => {
      it('should exist on fp', () => {
        expect(fp.view).toEqual(jasmine.any(Function));
      });

      it('should resolve a shallow property', () => {
        expect(fp.view(propLens('name'), data)).toBe('Richie Rich');
      });

      describe('view deep property', () => {
        let result;

        beforeEach(() => {
          result = fp.view(fp.flow(propLens(0), propLens('addresses')), data);
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
        expect(fp.view(immutablePropLens('name'), fromJS(data))).toBe(
          'Richie Rich'
        );
      });

      it('should resolve a deep immutable property', () => {
        const result = fp.view(
          fp.flow(immutablePropLens(1), immutablePropLens('addresses')),
          fromJS(data)
        );

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
        let result;

        beforeEach(() => {
          result = fp.over(propLens('name'), name => `${name}ard!`, data);
        });

        it('should return data with a new name', () => {
          expect(result.name).toBe('Richie Richard!');
        });

        it('should not mutate the original data', () => {
          expect(data.name).toBe('Richie Rich');
        });
      });

      describe('over deep property', () => {
        let result;

        beforeEach(() => {
          result = fp.over(
            fp.flow(propLens('street'), propLens(1), propLens('addresses')),
            street => street.split('').reverse().join(''),
            data
          );
        });

        it('should return street reversed', () => {
          expect(result.addresses[1].street).toBe('evirD lainoloC tsaE 32');
        });

        it('should not mutate the original data', () => {
          expect(data.addresses[1].street).toBe('23 East Colonial Drive');
        });
      });

      it('should perform shallow updates over immutables', () => {
        const result = fp.over(
          immutablePropLens('name'),
          name => name + 'ard!',
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
        const result = fp.over(
          fp.flow(
            immutablePropLens('street'),
            immutablePropLens(1),
            immutablePropLens('addresses')
          ),
          street => street.split('').reverse().join(''),
          fromJS(data)
        );

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
        expect(fp.set).toEqual(jasmine.any(Function));
      });

      it('should set a shallow property', () => {
        expect(fp.set(propLens('name'), "Dude Mc' Rude", data)).toEqual({
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
        const result = fp.set(
          fp.flow(propLens('street'), propLens(0), propLens('addresses')),
          '456 Some Place',
          data
        );

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
        expect(
          fp
            .set(immutablePropLens('name'), "Dude Mc' Rude", fromJS(data))
            .toJS()
        ).toEqual({
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
        const result = fp.set(
          fp.flow(
            immutablePropLens('street'),
            immutablePropLens(0),
            immutablePropLens('addresses')
          ),
          '456 Some Place',
          fromJS(data)
        );

        expect(result.toJS()).toEqual({
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
          expect(fp.mapped).toEqual(jasmine.any(Function));
        });

        it('should map an array', () => {
          const result = fp.view(fp.compose(fp.mapped, fp.lensProp('name')), [
            { name: 'foo' },
            { name: 'bar' }
          ]);

          expect(result).toEqual(['foo', 'bar']);
        });

        it('should set array props', () => {
          const result = fp.set(
            fp.compose(fp.mapped, fp.lensProp('name')),
            'redacted',
            [{ name: 'foo' }, { name: 'bar' }]
          );

          expect(result).toEqual([{ name: 'redacted' }, { name: 'redacted' }]);
        });

        it('should transform array props', () => {
          const result = fp.over(
            fp.compose(fp.mapped, fp.lensProp('name')),
            x => x + 'd',
            [{ name: 'foo' }, { name: 'bar' }]
          );

          expect(result).toEqual([{ name: 'food' }, { name: 'bard' }]);
        });
      });

      describe('lensProp', () => {
        it('should exist on fp', () => {
          expect(fp.lensProp).toEqual(jasmine.any(Function));
        });

        it('should resolve a string', () => {
          expect(fp.view(fp.lensProp('name'), data)).toEqual('Richie Rich');
        });

        it('should resolve a number', () => {
          expect(fp.view(fp.lensProp(0), [9, 10, 11])).toBe(9);
        });

        it('should be composable', () => {
          const result = fp.view(
            fp.flow(fp.lensProp(0), fp.lensProp('addresses')),
            data
          );

          expect(result).toEqual({
            street: '123 Fake Street',
            city: 'Albuquerque',
            state: 'NM'
          });
        });

        it('should work with over', () => {
          expect(fp.over(fp.lensProp('name'), x => x + 'ard', data)).toEqual({
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
          expect(fp.set(fp.lensProp('name'), 'foo', data)).toEqual({
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
    let cond;

    beforeEach(() => {
      cond = fp.cond(
        [x => x === 0, fp.always('water freezes at 0°C')],
        [x => x === 100, fp.always('water boils at 100°C')],
        [fp.True, temp => `nothing special happens at ${temp}°C`]
      );
    });
    it('should exist on fp', () => {
      expect(fp.cond).toEqual(jasmine.any(Function));
    });
    it('should freeze at 0', () => {
      expect(cond(0)).toEqual('water freezes at 0°C');
    });
    it('should boil at 100', () => {
      expect(cond(100)).toEqual('water boils at 100°C');
    });
    it('should do nothing special at 50', () => {
      expect(cond(50)).toEqual('nothing special happens at 50°C');
    });
    describe('with a successful predicate and empty evaluation', () => {
      ['', 0, null, undefined, false].forEach(curVal => {
        // $FlowIgnore: this works fine
        it(`should return ${curVal}`, () => {
          const identityOrVal = fp.cond([fp.eq(undefined), fp.always(curVal)], [
            fp.True,
            fp.identity
          ]);
          expect(identityOrVal(undefined)).toEqual(curVal);
        });
      });
    });
  });
  describe('has a not method', () => {
    it('should exist on fp', () => {
      expect(fp.not).toEqual(jasmine.any(Function));
    });
    it('should negate a value', () => {
      expect(fp.not(true)).toEqual(false);
    });
  });
  describe('has an eq method', () => {
    it('should exist on fp', () => {
      expect(fp.eq).toEqual(jasmine.any(Function));
    });
    it('should check for equality', () => {
      expect(fp.eq(1, 1)).toBe(true);
    });
    it('should check by reference', () => {
      expect(fp.eq({}, {})).toBe(false);
    });
    it('should tell if two immutable values are the same', () => {
      expect(
        fp.eq(
          Map({
            '1': 2
          }),
          Map({
            '1': 2
          })
        )
      ).toBe(true);
    });
    it('should work with undefined', () => {
      expect(fp.eq(undefined, undefined)).toBe(true);
    });
  });
  describe('has an invoke method', () => {
    let spy;
    beforeEach(() => {
      spy = jasmine.createSpy('spy');
    });
    it('should exist on fp', () => {
      expect(fp.invoke).toEqual(jasmine.any(Function));
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
      fp.invoke(spy, items);
      expect(spy).toHaveBeenCalledOnceWith('some', 'array', 'of', 'items', 7, {
        key: 'val'
      });
    });
  });
  describe('has an eqFn method', () => {
    it('should exist on fp', () => {
      expect(fp.eqFn).toEqual(jasmine.any(Function));
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
      expect(fp.eqFn(l, fp.view(barLens), objA, objB)).toBe(true);
    });
  });
  describe('has a noop method', () => {
    it('should exist on fp', () => {
      expect(fp.noop).toEqual(jasmine.any(Function));
    });
    it('should return undefined', () => {
      expect(fp.noop()).toBe(undefined);
    });
  });
  describe('has an or method', () => {
    let is5Or6;
    beforeEach(() => {
      is5Or6 = fp.or([fp.eq(5), fp.eq(6)]);
      (is5Or6: (p: number) => boolean);
    });
    it('should exist on fp', () => {
      expect(fp.or).toEqual(jasmine.any(Function));
    });
    it('should return a function after seeding', () => {
      expect(is5Or6).toEqual(jasmine.any(Function));
    });
    [5, 6].forEach(val => {
      it(`should return true for ${val}`, () => {
        expect(is5Or6(val)).toBe(true);
      });
    });
    it('should return false if or is false', () => {
      expect(is5Or6(7)).toBe(false);
    });
  });
  describe('has an and method', () => {
    let isFooAnd3Chars;
    beforeEach(() => {
      isFooAnd3Chars = fp.and([
        fp.eq('foo'),
        fp.eqFn(fp.identity, fp.view(fp.lensProp('length')), 3)
      ]);
    });
    it('should exist on fp', () => {
      expect(fp.and).toEqual(jasmine.any(Function));
    });
    it('should return a function after seeding', () => {
      expect(isFooAnd3Chars).toEqual(jasmine.any(Function));
    });
    it('should return true if all true', () => {
      expect(isFooAnd3Chars('foo')).toBe(true);
    });
    it('should return false if any false', () => {
      expect(isFooAnd3Chars('zoo')).toBe(false);
    });
  });
  describe('has a bindMethod method', () => {
    let indexOf, indexOfABC;
    it('should exist on fp', () => {
      expect(fp.bindMethod).toEqual(jasmine.any(Function));
    });
    it('should be curried', () => {
      expect(fp.bindMethod('indexOf')).toEqual(jasmine.any(Function));
    });
    it('should return a bound method as a free floating function', () => {
      indexOf = fp.bindMethod('indexOf');
      indexOfABC = indexOf('abc');
      expect(indexOfABC('b')).toBe(1);
    });
  });
  describe('has an invokeMethod method', () => {
    it('should exist on fp', () => {
      expect(fp.invokeMethod).toEqual(jasmine.any(Function));
    });
    it('should be curried', () => {
      expect(fp.invokeMethod('foo')).toEqual(jasmine.any(Function));
    });
    it(
      'should return a function that is bound and invoke that function',
      () => {
        const indexOfB = fp.invokeMethod('indexOf', ['b']);
        expect(indexOfB('abc')).toBe(1);
      }
    );
  });
  describe('zipObject', () => {
    it('should exist on fp', () => {
      expect(fp.zipObject).toEqual(jasmine.any(Function));
    });
    it('should be curried', () => {
      expect(fp.zipObject(['name', 'age'])).toEqual(jasmine.any(Function));
    });
    it('should zip two arrays into a single object', () => {
      expect(fp.zipObject(['name', 'age'], ['foo', 27])).toEqual({
        name: 'foo',
        age: 27
      });
    });
    it('should ignore extra items on the second array', () => {
      expect(fp.zipObject('abc'.split(''), 'defghi'.split(''))).toEqual({
        a: 'd',
        b: 'e',
        c: 'f'
      });
    });
    it('should set missing values to undefined', () => {
      expect(fp.zipObject('abcdef'.split(''), 'ghi'.split(''))).toEqual({
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
      expect(fp.some).toEqual(jasmine.any(Function));
    });
    it('should tell if some passed', () => {
      const res = fp.some(fp.eq(1), [1, 2, 3]);
      expect(res).toBe(true);
    });
    it('should tell if all failed', () => {
      const res = fp.some(fp.eq(4), [1, 2, 3]);
      expect(res).toBe(false);
    });
  });
  describe('has an every method', () => {
    it('should exist on fp', () => {
      expect(fp.every).toEqual(jasmine.any(Function));
    });
    it('should tell if every failed', () => {
      const res = fp.every(fp.eq(1), [1, 2, 3]);
      expect(res).toBe(false);
    });
    it('should tell if every passed', () => {
      const res = fp.some(fp.eq(2), [2, 2, 2]);
      expect(res).toBe(true);
    });
  });
  describe('has an unwrap method', () => {
    it('should exist on fp', () => {
      expect(fp.unwrap).toEqual(jasmine.any(Function));
    });
    it('should unwrap a nested array', () => {
      expect(fp.unwrap([['a'], ['b'], ['c']])).toEqual(['a', 'b', 'c']);
    });
    it('should not unwrap deeply nested values', () => {
      expect(fp.unwrap(['a', ['b'], [['c']]])).toEqual(['a', 'b', ['c']]);
    });
    it('should unwrap a single value', () => {
      expect(fp.unwrap([['a']])).toEqual(['a']);
    });
  });
  describe('has a head method', () => {
    it('should exist on fp', () => {
      expect(fp.head).toEqual(jasmine.any(Function));
    });
    it('should pull the first value off an array', () => {
      expect(maybe.from(fp.head([1, 2, 3]))).toBe(1);
    });
    it('should return undefined if array is empty', () => {
      expect(maybe.from(fp.head([]))).toBe(undefined);
    });
    it('should work with a string', () => {
      expect(maybe.from(fp.head('foo'))).toBe('f');
    });
    it('should return undefined when called with an empty string', () => {
      expect(maybe.from(fp.head(''))).toBe(undefined);
    });
  });
  describe('has an arrayWrap method', () => {
    it('should exist on fp', () => {
      expect(fp.arrayWrap).toEqual(jasmine.any(Function));
    });
    it('should wrap a value in an array', () => {
      expect(fp.arrayWrap('foo')).toEqual(['foo']);
    });
  });
  describe('has a once method', () => {
    let spy;
    beforeEach(() => {
      spy = jasmine.createSpy('spy');
    });
    it('should exist on fp', () => {
      expect(fp.once).toEqual(jasmine.any(Function));
    });
    it('should return a function', () => {
      expect(fp.once(spy)).toEqual(jasmine.any(Function));
    });
    it('should not invoke the function passed in initially', () => {
      fp.once(spy);
      expect(spy).not.toHaveBeenCalled();
    });
    describe('invoking', () => {
      let once;
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
      expect(fp.either).toEqual(jasmine.any(Function));
    });
    describe('chaining', () => {
      let spy1, spy2, chain;
      beforeEach(() => {
        spy1 = jasmine.createSpy('spy1').and.callFake(fp.identity);
        spy2 = jasmine.createSpy('spy2').and.callFake(fp.identity);
        chain = fp.flow(fp.either(spy1), fp.either(spy2));
      });
      it('should pass errors', () => {
        expect(chain(new Error('boom!'))).toEqual(new Error('boom!'));
      });
      it('should not call spy1', () => {
        chain(new Error('boom!'));
        expect(spy1).not.toHaveBeenCalled();
      });
      it('should not call spy2', () => {
        chain(new Error('boom!'));
        expect(spy2).not.toHaveBeenCalled();
      });
      it('should pass values', () => {
        expect(chain('bar')).toBe('bar');
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
      let spy, result;
      beforeEach(() => {
        spy = jasmine.createSpy('spy');
        result = fp.either(spy, new Error('boom!'));
      });
      it('should treat an error instance as a left', () => {
        expect(result).toEqual(new Error('boom!'));
      });
      it('should not call fn', () => {
        expect(spy).not.toHaveBeenCalled();
      });
    });
    describe('non-error handling', () => {
      let spy, result;
      beforeEach(() => {
        spy = jasmine.createSpy('spy').and.callFake(fp.identity);
        result = fp.either(spy, 'foo');
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
      expect(fp.tail).toEqual(jasmine.any(Function));
    });
    it('should pull the rest of the list', () => {
      const items = [1, 2, 3];
      expect(fp.tail(items)).toEqual([2, 3]);
    });
    it('should return an empty list if list is empty', () => {
      expect(fp.tail([])).toEqual([]);
    });
    it('should work with a string', () => {
      expect(fp.tail('foo')).toBe('oo');
    });
    it('should return an empty string when called with an empty string', () => {
      expect(fp.tail('')).toBe('');
    });
  });
  describe('has a last method', () => {
    it('should exist on fp', () => {
      expect(fp.last).toEqual(jasmine.any(Function));
    });
    it('should pull the last element', () => {
      const items = [1, 2, 3];
      expect(maybe.from(fp.last(items))).toBe(3);
    });
    it('should return undefined if the list is empty', () => {
      expect(maybe.from(fp.last([]))).toBe(undefined);
    });
    it('should work with a string', () => {
      expect(maybe.from(fp.last('foo'))).toBe('o');
    });
    it('should return undefined when called with an empty string', () => {
      expect(maybe.from(fp.last(''))).toBe(undefined);
    });
  });
  describe('has a tap method', () => {
    let spy, result;
    beforeEach(() => {
      spy = jasmine.createSpy('spy');
      result = fp.tap(spy)([1]);
    });
    it('should exist on fp', () => {
      expect(fp.tap).toEqual(jasmine.any(Function));
    });
    it('should invoke the specified function with specified args', () => {
      expect(spy).toHaveBeenCalledOnceWith(1);
    });
    it('should carry the input through the tap', () => {
      expect(result).toEqual([1]);
    });
  });
  describe('has an mapFn method', () => {
    let spy1, spy2, spy3, args, result;
    beforeEach(() => {
      args = ['a', 1, false];
      spy1 = jasmine.createSpy('spy1').and.returnValue(1);
      spy2 = jasmine.createSpy('spy2').and.returnValue(2);
      spy3 = jasmine.createSpy('spy3').and.returnValue(3);
      result = fp.mapFn([spy1, spy2, spy3], args);
    });
    it('should exist on fp', () => {
      expect(fp.mapFn).toEqual(jasmine.any(Function));
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
      adder = fp.chainL((a, b) => a + b);
    });
    it('should exist on fp', () => {
      expect(fp.chainL).toEqual(jasmine.any(Function));
    });
    it('should reduce two values', () => {
      expect(adder([1, 2])).toBe(3);
    });
    it('should reduce 3 values', () => {
      expect(adder([1, 2, 3])).toBe(6);
    });
    it('should reduce 4 values', () => {
      expect(adder([1, 2, 3, 4])).toBe(10);
    });
  });
  describe('xProd', () => {
    it('should exist on fp', () => {
      expect(fp.xProd).toEqual(jasmine.any(Function));
    });
    it('should return the cross product of two arrays', () => {
      expect(fp.xProd([1, 2], [3, 4])).toEqual([
        [1, 3],
        [1, 4],
        [2, 3],
        [2, 4]
      ]);
    });
  });
  describe('anyPass', () => {
    let passes;
    beforeEach(() => {
      const gt = fp.curry2((x: number, y: number): boolean => y > x);
      passes = fp.anyPass(([gt(9), gt(4), gt(5)]: Array<(number) => boolean>));
    });
    it('should exist on fp', () => {
      expect(fp.anyPass).toEqual(jasmine.any(Function));
    });
    it('should return false if none pass', () => {
      expect(passes([3])).toBe(false);
    });
    it('should return true if any pass', () => {
      expect(passes([7])).toBe(true);
    });
  });
  describe('zipBy', () => {
    let spy1, spy2, spy3, result;
    describe('matching functions with single args', () => {
      beforeEach(() => {
        spy1 = jasmine.createSpy('spy1').and.callFake(fp.identity);
        spy2 = jasmine.createSpy('spy2').and.callFake(fp.identity);
        spy3 = jasmine.createSpy('spy3').and.callFake(fp.identity);
        result = fp.zipBy((a, b) => a(b), [spy1, spy2, spy3], [
          'dee',
          'doo',
          'da'
        ]);
      });
      it('should exist on fp', () => {
        expect(fp.zipBy).toEqual(jasmine.any(Function));
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
        beforeEach(() => {
          result = fp.zipBy((a, b) => a(b), [spy1, spy2], ['dee', 'doo', 'da']);
        });
        it('should return the result of the first two', () => {
          expect(result).toEqual(['dee', 'doo']);
        });
      });
      describe('with fewer right than left', () => {
        beforeEach(() => {
          result = fp.zipBy((a, b) => a(b), [spy1, spy2, spy3], ['dee', 'doo']);
        });
        it('should return the result of the first two', () => {
          expect(result).toEqual(['dee', 'doo']);
        });
      });
    });
    describe('concatenating strings', () => {
      beforeEach(() => {
        result = fp.zipBy((a, b) => a + b, ['cat', 'space', 'thunder'], [
          'amaran',
          ' balls',
          ' storm'
        ]);
      });
      it('should concat the results into a single array', () => {
        expect(result).toEqual(['catamaran', 'space balls', 'thunder storm']);
      });
    });
  });
  describe('memoize', () => {
    it('should exist on fp', () => {
      expect(fp.memoize).toEqual(jasmine.any(Function));
    });
    describe('working with cache', () => {
      let fn;
      beforeEach(() => {
        let count = 0;
        fn = fp.memoize(() => ++count);
      });
      it('should return the memoized result', () => {
        fn(1);
        expect(fn(1)).toBe(1);
      });
      it('should return new result on cache miss', () => {
        fn(1);
        fn(2);
        fn(3);
        expect(fn(4)).toBe(4);
      });
      it('should cache hit with multiple args', () => {
        fn(1, 2);
        expect(fn(1, 2)).toBe(1);
      });
      it('should cache miss with multiple args', () => {
        fn(1, 2, 3, 4);
        fn(1, 2, 3);
        expect(fn(1, 2)).toBe(3);
      });
      it('should cache miss with multiple args', () => {
        fn(1, 2, 3, 4);
        fn(1, 2, 3);
        expect(fn(1, 2)).toBe(3);
      });
      it('should cache miss with less invocation args', () => {
        fn(1, 2);
        fn(1, 2, 3);
        expect(fn(1, 2, 3, 4)).toBe(3);
      });
    });
  });
  describe('uniqBy', () => {
    it('should exist on fp', () => {
      expect(fp.uniqBy).toEqual(jasmine.any(Function));
    });
    it('should remove dups', () => {
      expect(
        fp.uniqBy(x => x.num, [
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
        ])
      ).toEqual([
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
      expect(fp.uniqBy(x => x, [])).toEqual([]);
    });
    it('should work with no dups', () => {
      expect(
        fp.uniqBy(x => x.num, [
          {
            num: 1
          },
          {
            num: 2
          },
          {
            num: 3
          }
        ])
      ).toEqual([
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
      expect(fp.times).toEqual(jasmine.any(Function));
    });
    it('should execute a fn n times', () => {
      const result = fp.times(x => x + 1, 5);
      expect(result).toEqual([1, 2, 3, 4, 5]);
    });
    it('should be curried', () => {
      const result = fp.times(x => x + 1)(5);
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
      class1RString = [ClassType1, () => 'foo'];
      class2RClass2 = [ClassType2, (x: ClassType2) => x];
      class2RString = [ClassType2, () => 'bar'];
      class3RClass3 = [ClassType3, (x: ClassType3) => x];
      class3RString = [ClassType3, () => 'baz'];
      class4RClass4 = [ClassType4, (x: ClassType4) => x];
      class4RString = [ClassType4, () => 'bam'];
      class5RClass5 = [ClassType5, (x: ClassType5) => x];
      class5RString = [ClassType5, () => 'jam'];
    });

    describe('with 2 entries', () => {
      it('should return "foo"', () => {
        expect(
          fp.match([class1RString, class2RString])(new ClassType1())
        ).toEqual('foo');
      });

      it('should return an instance of ClassType1', () => {
        expect(
          fp.match([class1RClass1, class2RString])(new ClassType1()) instanceof
            ClassType1
        ).toBe(true);
      });

      it('should return "bar"', () => {
        expect(
          fp.match([class1RString, class2RString])(new ClassType2())
        ).toEqual('bar');
      });

      it('should return an instance of ClassType2', () => {
        expect(
          fp.match([class1RString, class2RClass2])(new ClassType2()) instanceof
            ClassType2
        ).toBe(true);
      });

      it('should work with a primitive as the matcher', () => {
        expect(
          fp.match([
            ['foo', (() => 'foo': (x: 'foo') => 'foo')],
            ['bar', (() => 'bar': (x: 'bar') => 'bar')]
          ])('bar')
        ).toEqual('bar');
      });

      it('should work with a function as a matcher', () => {
        expect(
          fp.match([
            [() => 'foo', (() => 'foo': (x: 'foo') => 'foo')],
            [() => 'bar', (() => 'bar': (x: 'bar') => 'bar')]
          ])('bar')
        );
      });
    });

    describe('with 3 entries', () => {
      it('should return "foo"', () => {
        expect(
          fp.match([
            class1RString,
            class2RString,
            class3RString
          ])(new ClassType1())
        ).toEqual('foo');
      });

      it('should return "bar"', () => {
        expect(
          fp.match([
            class1RString,
            class2RString,
            class3RString
          ])(new ClassType2())
        ).toEqual('bar');
      });

      it('should return "baz"', () => {
        expect(
          fp.match([
            class1RString,
            class2RString,
            class3RString
          ])(new ClassType3())
        ).toEqual('baz');
      });

      it('should return an instance of ClassType3', () => {
        expect(
          fp.match([
            class1RString,
            class2RString,
            class3RClass3
          ])(new ClassType3()) instanceof ClassType3
        ).toBe(true);
      });

      it('should work with a primitive as the matcher', () => {
        expect(
          fp.match([
            ['foo', (() => 'foo': (x: 'foo') => 'foo')],
            ['bar', (() => 'bar': (x: 'bar') => 'bar')],
            ['baz', (() => 'baz': (x: 'baz') => 'baz')]
          ])('baz')
        ).toEqual('baz');
      });

      it('should work with a function as a matcher', () => {
        expect(
          fp.match([
            [() => 'foo', (() => 'foo': (x: 'foo') => 'foo')],
            [() => 'bar', (() => 'bar': (x: 'bar') => 'bar')],
            [() => 'baz', (() => 'baz': (x: 'baz') => 'baz')]
          ])('bar')
        );
      });
    });

    describe('with 4 entries', () => {
      it('should return "foo"', () => {
        expect(
          fp.match([
            class1RString,
            class2RString,
            class3RString,
            class4RString
          ])(new ClassType1())
        ).toEqual('foo');
      });

      it('should return "bar"', () => {
        expect(
          fp.match([
            class1RClass1,
            class2RString,
            class3RString,
            class4RString
          ])(new ClassType2())
        ).toEqual('bar');
      });

      it('should return "baz"', () => {
        expect(
          fp.match([
            class1RClass1,
            class2RClass2,
            class3RString,
            class4RString
          ])(new ClassType3())
        ).toEqual('baz');
      });

      it('should return "bam"', () => {
        expect(
          fp.match([
            class1RString,
            class2RString,
            class3RString,
            class4RString
          ])(new ClassType4())
        ).toEqual('bam');
      });

      it('should return an instance of ClassType4', () => {
        expect(
          fp.match([
            class1RString,
            class2RString,
            class3RString,
            class4RClass4
          ])(new ClassType4()) instanceof ClassType4
        ).toBe(true);
      });

      it('should work with a primitive as the matcher', () => {
        expect(
          fp.match([
            ['foo', (() => 'foo': (x: 'foo') => 'foo')],
            ['bar', (() => 'bar': (x: 'bar') => 'bar')],
            ['baz', (() => 'baz': (x: 'baz') => 'baz')],
            ['bam', (() => 'bam': (x: 'bam') => 'bam')]
          ])('bam')
        ).toEqual('bam');
      });

      it('should work with a function as a matcher', () => {
        expect(
          fp.match([
            [() => 'foo', (() => 'foo': (x: 'foo') => 'foo')],
            [() => 'bar', (() => 'bar': (x: 'bar') => 'bar')],
            [() => 'baz', (() => 'baz': (x: 'baz') => 'baz')],
            [() => 'bam', (() => 'bam': (x: 'bam') => 'bam')]
          ])('baz')
        );
      });
    });

    describe('with 5 entries', () => {
      it('should return "foo"', () => {
        expect(
          fp.match([
            class1RString,
            class2RString,
            class3RString,
            class4RString,
            class5RString
          ])(new ClassType1())
        ).toEqual('foo');
      });

      it('should return "bar"', () => {
        expect(
          fp.match([
            class1RClass1,
            class2RString,
            class3RString,
            class4RString,
            class5RString
          ])(new ClassType2())
        ).toEqual('bar');
      });

      it('should return "baz"', () => {
        expect(
          fp.match([
            class1RClass1,
            class2RClass2,
            class3RString,
            class4RString,
            class5RString
          ])(new ClassType3())
        ).toEqual('baz');
      });

      it('should return "bam"', () => {
        expect(
          fp.match([
            class1RString,
            class2RString,
            class3RString,
            class4RString,
            class5RString
          ])(new ClassType4())
        ).toEqual('bam');
      });

      it('should return "jam"', () => {
        expect(
          fp.match([
            class1RString,
            class2RString,
            class3RString,
            class4RString,
            class5RString
          ])(new ClassType5())
        ).toEqual('jam');
      });

      it('should return an instance of ClassType5', () => {
        expect(
          fp.match([
            class1RString,
            class2RString,
            class3RString,
            class4RClass4,
            class5RClass5
          ])(new ClassType5()) instanceof ClassType5
        ).toBe(true);
      });

      it('should work with a primitive as the matcher', () => {
        expect(
          fp.match([
            ['foo', (() => 'foo': (x: 'foo') => 'foo')],
            ['bar', (() => 'bar': (x: 'bar') => 'bar')],
            ['baz', (() => 'baz': (x: 'baz') => 'baz')],
            ['bam', (() => 'bam': (x: 'bam') => 'bam')],
            ['jam', (() => 'jam': (x: 'jam') => 'jam')]
          ])('bam')
        ).toEqual('bam');
      });

      it('should work with a function as a matcher', () => {
        expect(
          fp.match([
            [() => 'foo', (() => 'foo': (x: 'foo') => 'foo')],
            [() => 'bar', (() => 'bar': (x: 'bar') => 'bar')],
            [() => 'baz', (() => 'baz': (x: 'baz') => 'baz')],
            [() => 'bam', (() => 'bam': (x: 'bam') => 'bam')],
            [() => 'jam', (() => 'jam': (x: 'jam') => 'jam')]
          ])('bam')
        );
      });
    });
  });
});
