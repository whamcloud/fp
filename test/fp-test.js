// @flow

import {describe, beforeEach, it, expect, jasmine} from './jasmine';

import * as fp from '../fp';
const _ = fp.__;

import {Map, fromJS} from 'immutable';

describe('the fp module', () => {
  describe('has a curry method', () => {
    var toArray;

    beforeEach(() => {
      toArray = function toArray () {
        return [].slice.call(arguments);
      };
    });

    it('should exist on fp', () => {
      expect(fp.curry).toEqual(jasmine.any(Function));
    });

    describe('with 0 args', () => {
      var curry0;

      beforeEach(() => {
        curry0 = fp.curry(0, toArray);
      });

      it('should return the value', () => {
        expect(curry0()).toEqual([]);
      });

      it('should ignore placeholders', () => {
        expect(curry0(_, _, _)).toEqual([]);
      });
    });

    describe('with 1 arg', () => {
      var curry1;

      beforeEach(() => {
        curry1 = fp.curry(1, toArray);
      });

      it('should return a function if not satisfied', () => {
        expect(curry1()).toEqual(jasmine.any(Function));
      });

      it('should return the value', () => {
        expect(curry1(1)).toEqual([1]);
      });

      it('should work with placeholders', () => {
        expect(curry1(_)(1)).toEqual([1]);
      });
    });

    describe('with 3 args', () => {
      var curry3;

      beforeEach(() => {
        curry3 = fp.curry(3, toArray);
      });

      it('should return a function if not satisfied', () => {
        expect(curry3(1, 2)).toEqual(jasmine.any(Function));
      });

      it('should be satisfied with all placeholders', () => {
        expect(curry3(_, _, _)(1, 2, 3)).toEqual([1, 2, 3]);
      });

      it('should be satisfied with one call', () => {
        expect(curry3(1, 2, 3)).toEqual([1, 2, 3]);
      });

      it('should be satisfied with a starting placeholder', () => {
        expect(curry3(_, 2, 3)(1)).toEqual([1, 2, 3]);
      });

      it('should be satisfied with two placeholders', () => {
        expect(curry3(_, _, 3)(1)(2)).toEqual([1, 2, 3]);
      });

      it('should be satisfied with two placeholders and two calls', () => {
        expect(curry3(_, _, 3)(1, 2)).toEqual([1, 2, 3]);
      });

      it('should be satisfied with start and end placeholders', () => {
        expect(curry3(_, 2, _)(1, 3)).toEqual([1, 2, 3]);
      });

      it('should be satisfied with two initial args', () => {
        expect(curry3(_, 2)(1)(3)).toEqual([1, 2, 3]);
      });

      it('should be satisfied with two initial args and two calls', () => {
        expect(curry3(_, 2)(1, 3)).toEqual([1, 2, 3]);
      });

      it('should be satisfied with placeholders in later calls', () => {
        expect(curry3(_, 2)(_, 3)(1)).toEqual([1, 2, 3]);
      });
    });

    describe('with a placeholder', () => {
      var curry1;

      beforeEach(() => {
        curry1 = fp.curry(2, toArray)(_, 2);
      });

      it('should be immutable', () => {
        curry1(3);

        expect(curry1(1)).toEqual([1, 2]);
      });

      it('should be immutable with a right placeholder', () => {
        curry1 = fp.curry(2, toArray)(1, _);

        curry1(4);
        curry1(5);

        expect(curry1(2)).toEqual([1, 2]);
      });
    });
  });

  describe('has a partial method', () => {
    var spy;

    beforeEach(() => {
      spy = jasmine.createSpy('spy');
    });

    it('should exist on fp', () => {
      expect(fp.partial)
        .toEqual(jasmine.any(Function));
    });

    it('should be curried', () => {
      expect(fp.partial(_, _, _)).toEqual(jasmine.any(Function));
    });

    it('should partially apply a function', () => {
      fp.partial(2, spy, [1, 2])(3, 4);

      expect(spy)
        .toHaveBeenCalledOnceWith(1, 2, 3, 4);
    });

    it('should work as a nullary function', () => {
      fp.partial(0, spy, [1, 2])(3, 4);

      expect(spy)
        .toHaveBeenCalledOnceWith(1, 2);
    });
  });

  describe('has a map method', () => {
    var add1;

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

    it('should map a value', () => {
      expect(fp.map(add1, 1)).toEqual(2);
    });

    it('should work with a placeholder', () => {
      expect(fp.map(_, 1)(add1)).toEqual(2);
    });

    it('should be unary\'d', () => {
      var spy = jasmine.createSpy('unary');
      fp.map(spy, [1]);
      expect(spy).toHaveBeenCalledWith(1);
    });
  });

  describe('has a filter method', () => {
    it('should exist on fp', () => {
      expect(fp.filter).toEqual(jasmine.any(Function));
    });

    it('should filter a list', () => {
      expect(fp.filter(fp.eq(3), [1, 2, 3]))
        .toEqual([3]);
    });

    it('should be curried', () => {
      expect(fp.filter(fp.eq(1))([1, 2, 3]))
        .toEqual([1]);
    });

    it('should take placeholders', () => {
      expect(fp.filter(_, [1, 2, 3])(fp.eq(2)))
        .toEqual([2]);
    });
  });

  describe('has a reduce method', () => {
    it('should exist on fp', () => {
      expect(fp.reduce).toEqual(jasmine.any(Function));
    });

    it('should be curried', () => {
      expect(fp.reduce(fp.__, fp.__)).toEqual(jasmine.any(Function));
    });

    it('should reduce a list', () => {
      expect(fp.reduce(0, (x, y) => x + y, [1, 2, 3]))
        .toEqual(6);
    });

    it('should delegate to a reduce method', () => {
      var obj = {
        reduce: jasmine.createSpy('reducer')
      };

      fp.reduce(0, fp.noop, obj);

      expect(obj.reduce).toHaveBeenCalledOnceWith(0, jasmine.any(Function));
    });

    it('should reduce a singular value', () => {
      expect(fp.reduce(2, (x, y) => x * y, 3))
        .toEqual(6);
    });

    it('should take an accumulator function', () => {
      expect(fp.reduce(fp.always(5), (x, y) => x + y, 6))
        .toEqual(11);
    });
  });

  describe('has a find method', () => {
    it('should exist on fp', () => {
      expect(fp.find).toEqual(jasmine.any(Function));
    });

    it('should find a value', () => {
      expect(fp.find(fp.eq(3), [1, 2, 3]))
        .toEqual(3);
    });

    it('should be curried', () => {
      expect(fp.find(fp.eq(1))([1, 2, 3]))
        .toEqual(1);
    });

    it('should take placeholders', () => {
      expect(fp.find(_, [1, 2, 3])(fp.eq(2)))
        .toEqual(2);
    });

    it('should return undefined on no match', () => {
      expect(fp.find(fp.eq(10), [1, 2, 3]))
        .toBe(undefined);
    });
  });

  describe('has a pluck method', () => {
    it('should exist on fp', () => {
      expect(fp.pluck).toEqual(jasmine.any(Function));
    });

    it('should pluck from a collection', () => {
      expect(fp.pluck('foo', [{ foo: 'bar' }, { foo: 'baz' }])).toEqual(['bar', 'baz']);
    });

    it('should pluck from a value', () => {
      expect(fp.pluck('foo', { foo: 'bar' })).toEqual('bar');
    });

    it('should be curried', () => {
      expect(fp.pluck('foo')).toEqual(jasmine.any(Function));
    });

    it('should work with a placeholder', () => {
      expect(fp.pluck(_, { foo: 'bar' })('foo')).toEqual('bar');
    });
  });

  describe('has an identity method', () => {
    it('should exist on fp', () => {
      expect(fp.identity).toEqual(jasmine.any(Function));
    });

    it('should return it\'s value', () => {
      expect(fp.identity(1)).toEqual(1);
    });
  });

  describe('has an always method', () => {
    it('should exist on fp', () => {
      expect(fp.always).toEqual(jasmine.any(Function));
    });

    it('should always return it\'s value', () => {
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
      const add1 = x =>  x + 1;
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

      // mult2(add1(3))
      expect(fp.compose(mult2, add1)(3)).toEqual(8);
    });
  });

  describe('has a flowN method', () => {
    var adder, times2;
    beforeEach(() => {
      adder = (x, y) => {
        return x + y;
      };
      times2 = (x) => {
        return x * 2;
      };
    });
    it('should exist on fp', () => {
      expect(fp.flowN).toEqual(jasmine.any(Function));
    });

    it('should be curried', () => {
      var curriedFlowN = fp.flowN(fp.__, [adder, times2]);
      expect(curriedFlowN(2)(3, 4)).toEqual(14);
    });

    it('should provide a function with a forced arity', () => {
      expect(fp.flowN(2, [adder, times2])(3)).toEqual(jasmine.any(Function));
    });

    it('should invoke a function with a forced arity when the arity is satisfied', () => {
      const bang = x => x + '!';

      expect(fp.flowN(2, [adder, times2, bang])(3, 4)).toEqual('14!');
    });

    it('should support gaps', () => {
      var gappedFlown = fp.flowN(2, [adder, times2])(fp.__, 4);
      expect(gappedFlown(3)).toEqual(14);
    });
  });

  describe('has a difference method', () => {
    it('should exist on fp', () => {
      expect(fp.difference).toEqual(jasmine.any(Function));
    });

    it('should calculate differences', () => {
      expect(fp.difference([1, 2, 3], [1, 2])).toEqual([3]);
    });

    it('should work with placeholders', () => {
      expect(fp.difference(_, [1, 2])([1, 2, 3, 4])).toEqual([3, 4]);
    });

    it('should be curried', () => {
      expect(fp.difference([1, 2, 3])([1, 2])).toEqual([3]);
    });

    it('should work with empty arrays', () => {
      expect(fp.difference([], [])).toEqual([]);
    });
  });



  describe('working with lenses', () => {
    var data, propLens, immutablePropLens;

    beforeEach(() => {
      propLens = (prop) => {
        return fp.lens((xs) => xs[prop], (v, xs) => {
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

      immutablePropLens = (prop) => {
        return fp.lens((xs) => xs.get(prop), (v, xs) => xs.set(prop, v));
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


      it('should be curried', () => {
        expect(fp.lens(_, _)).toEqual(jasmine.any(Function));
      });
    });

    describe('has a view method', () => {
      it('should exist on fp', () => {
        expect(fp.view).toEqual(jasmine.any(Function));
      });

      it('should be curried', () => {
        expect(fp.view(_, _)).toEqual(jasmine.any(Function));
      });

      it('should resolve a shallow property', () => {
        expect(fp.view(propLens('name'), data))
          .toBe('Richie Rich');
      });

      describe('view deep property', () => {
        var result;

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
        expect(fp.view(immutablePropLens('name'), fromJS(data))).toBe('Richie Rich');
      });

      it('should resolve a deep immutable property', () => {
        const result = fp.view(fp.flow(
          immutablePropLens(1),
          immutablePropLens('addresses')
        ), fromJS(data));

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

      it('should be curried', () => {
        expect(fp.over(_, _, _)).toEqual(jasmine.any(Function));
      });

      describe('over shallow property', () => {
        var result;

        beforeEach(() => {
          result = fp.over(propLens('name'), (name) => name + 'ard!', data);
        });

        it('should return data with a new name', () => {
          expect(result.name).toBe('Richie Richard!');
        });

        it('should not mutate the original data', () => {
          expect(data.name).toBe('Richie Rich');
        });
      });

      describe('over deep property', () => {
        var result;

        beforeEach(() => {
          result = fp.over(
            fp.flow(propLens('street'), propLens(1), propLens('addresses')),
            (street) => street.split('').reverse().join(''),
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
        const result = fp.over(immutablePropLens('name'), (name) => name + 'ard!', fromJS(data));

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
          (street) => street.split('').reverse().join(''),
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

      it('should be curried', () => {
        expect(fp.set(_, _, _)).toEqual(jasmine.any(Function));
      });

      it('should set a shallow property', () => {
        expect(fp.set(propLens('name'), 'Dude Mc\' Rude', data))
          .toEqual({
            name: 'Dude Mc\' Rude',
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

        expect(result)
          .toEqual({
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
        expect(fp.set(immutablePropLens('name'), 'Dude Mc\' Rude', fromJS(data)).toJS())
          .toEqual({
            name: 'Dude Mc\' Rude',
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
          fp.flow(immutablePropLens('street'), immutablePropLens(0), immutablePropLens('addresses')),
          '456 Some Place',
          fromJS(data)
        );

        expect(result.toJS())
          .toEqual({
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

        it('should be curried', () => {
          expect(fp.mapped(_, _)).toEqual(jasmine.any(Function));
        });

        it('should map an array', () => {
          const result = fp.view(fp.compose(fp.mapped, fp.lensProp('name')), [
            {name: 'foo'},
            {name: 'bar'}
          ]);

          expect(result).toEqual(['foo', 'bar']);
        });

        it('should set array props', () => {
          const result = fp.set(fp.compose(fp.mapped, fp.lensProp('name')), 'redacted', [
            {name: 'foo'},
            {name: 'bar'}
          ]);

          expect(result).toEqual([
            {name: 'redacted'},
            {name: 'redacted'}
          ]);
        });

        it('should transform array props', () => {
          const result = fp.over(fp.compose(fp.mapped, fp.lensProp('name')), (x) => x + 'd', [
            {name: 'foo'},
            {name: 'bar'}
          ]);

          expect(result).toEqual([
            {name: 'food'},
            {name: 'bard'}
          ]);
        });
      });


      describe('lensProp', () => {
        it('should exist on fp', () => {
          expect(fp.lensProp).toEqual(jasmine.any(Function));
        });

        it('should resolve a string', () => {
          expect(fp.view(fp.lensProp('name'), data))
            .toEqual('Richie Rich');
        });

        it('should resolve a number', () => {
          expect(fp.view(fp.lensProp(0), [9, 10, 11])).toBe(9);
        });

        it('should be composable', () => {
          const result = fp.view(fp.flow(
            fp.lensProp(0),
            fp.lensProp('addresses')
          ), data);

          expect(result)
            .toEqual({
              street: '123 Fake Street',
              city: 'Albuquerque',
              state: 'NM'
            });
        });

        it('should work with over', () => {
          expect(fp.over(fp.lensProp('name'), x => x + 'ard', data))
            .toEqual({
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
          expect(fp.set(fp.lensProp('name'), 'foo', data))
            .toEqual({
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
    var cond;

    beforeEach(() => {
      cond = fp.cond(
        [(x) => {
          return x === 0;
        }, fp.always('water freezes at 0°C')
        ],
        [(x) => {
          return x === 100;
        }, fp.always('water boils at 100°C')
        ],
        [fp.True, (temp) => {
          return 'nothing special happens at ' + temp + '°C';
        }
        ]
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
      ['', 0, null, undefined, false].forEach((curVal) => {
        it(`should return ${curVal}`, () => {
          const identityOrVal = fp.cond(
            [fp.eq(undefined), fp.always(curVal)],
            [fp.True, fp.identity]
          );
          expect(identityOrVal(undefined)).toEqual(curVal);
        });
      });
    });
  });

  describe('has a shallow clone method', () => {
    it('should exist on fp', () => {
      expect(fp.shallowClone).toEqual(jasmine.any(Function));
    });

    it('should clone an object', () => {
      expect(fp.shallowClone({
        x: 'foo',
        y: ['bar']
      }))
        .toEqual({
          x: 'foo',
          y: ['bar']
        });
    });

    it('should clone an array', () => {
      expect(fp.shallowClone(['foo', 'bar']))
        .toEqual(['foo', 'bar']);
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
      expect(fp.eq(Map({ '1': 2 }), Map({ '1': 2 }))).toBe(true);
    });

    it('should work with undefined', () => {
      expect(fp.eq(undefined, undefined)).toBe(true);
    });
  });

  describe('has an invoke method', () => {
    var spy, error;
    beforeEach(() => {
      spy = jasmine.createSpy('spy');
      error = new Error('Error in fp.invoke - Cannot call invoke with non-array');
    });

    it('should exist on fp', () => {
      expect(fp.invoke).toEqual(jasmine.any(Function));
    });

    it('should throw if args are null', () => {
      expect(() => {
        fp.invoke(spy, null);
      }).toThrow(error);
    });

    it('should throw an error if a non array is passed in', () => {
      expect(() => {
        fp.invoke(spy, 'some items');
      }).toThrow(error);
    });

    it('should invoke the function with an array of items', () => {
      const items = ['some', 'array', 'of', 'items', 7, { key: 'val' }];
      fp.invoke(spy, items);

      expect(spy).toHaveBeenCalledOnceWith('some', 'array', 'of', 'items', 7, { key: 'val' });
    });

    it('should invoke with a placeholder', () => {
      const spy1 = jasmine.createSpy('spy1');
      const spy2 = jasmine.createSpy('spy2');
      const x = {
        fn: spy1
      };
      const y = {
        fn: spy2
      };

      fp.pluck('fn', [x, y])
        .forEach(fp.invoke(_, ['arg1', 2]));

      expect(spy1).toHaveBeenCalledOnceWith('arg1', 2);
      expect(spy2).toHaveBeenCalledOnceWith('arg1', 2);
    });
  });

  describe('has a safe method', () => {
    var spy;

    beforeEach(() => {
      spy = jasmine.createSpy('spy');
    });

    it('should exist on fp', () => {
      expect(fp.safe).toEqual(jasmine.any(Function));
    });

    it('should return the default if unsafe', () => {
      expect(fp.safe(1, spy, {})(null))
        .toEqual({});
    });

    it('should call the fn if safe', () => {
      fp.safe(1, spy, {})('bar');

      expect(spy)
        .toHaveBeenCalledWith('bar');
    });

    it('should call the fn with multiple args', () => {
      fp.safe(2, spy, {})('foo', 'bar');

      expect(spy)
        .toHaveBeenCalledWith('foo', 'bar');
    });

    it('should call the default if any args are unsafe', () => {
      expect(fp.safe(2, spy, {})('foo', null))
        .toEqual({});
    });
  });

  describe('has a eqFn method', () => {
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

      const l = fp.view(
        fp.flow(barLens, fooLens)
      );

      expect(fp.eqFn(l, fp.view(barLens), objA, objB))
        .toBe(true);
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
    var is5Or6;

    beforeEach(() => {
      is5Or6 = fp.or([
        fp.eq(5),
        fp.eq(6)
      ]);
    });

    it('should exist on fp', () => {
      expect(fp.or).toEqual(jasmine.any(Function));
    });

    it('should return a function after seeding', () => {
      expect(is5Or6).toEqual(jasmine.any(Function));
    });

    it('should work with gaps', () => {
      const baap = 'baap';
      const isNoWayOr4Chars = fp.or(_, baap);
      expect(isNoWayOr4Chars([
        fp.eq('no way'),
        fp.eqFn(fp.identity, fp.view(fp.lensProp('length')), 4)
      ])).toBe(true);
    });

    [5, 6].forEach((val) => {
      it('should return true for ' + val, () => {
        expect(is5Or6(val)).toBe(true);
      });
    });

    it('should return false if or is false', () => {
      expect(is5Or6(7)).toBe(false);
    });
  });

  describe('has an and method', () => {
    var isFooAnd3Chars;

    beforeEach(() => {
      isFooAnd3Chars = fp.and([
        fp.eq('foo'),
        fp.eqFn(fp.view(fp.lensProp('length')), fp.identity, _, 3)
      ]);
    });

    it('should exist on fp', () => {
      expect(fp.and).toEqual(jasmine.any(Function));
    });

    it('should return a function after seeding', () => {
      expect(isFooAnd3Chars).toEqual(jasmine.any(Function));
    });

    it('should work with gaps', () => {
      const baap = 'baap';
      const isBaapAnd4Chars = fp.and(_, baap);
      expect(isBaapAnd4Chars([
        fp.eq(baap),
        fp.eqFn(fp.identity, fp.view(fp.lensProp('length')), 4)
      ])).toBe(true);
    });

    it('should return true if all true', () => {
      expect(isFooAnd3Chars('foo')).toBe(true);
    });

    it('should return false if any false', () => {
      expect(isFooAnd3Chars('zoo')).toBe(false);
    });
  });

  describe('has a bindMethod method', () => {
    var indexOf, indexOfABC;

    it('should exist on fp', () => {
      expect(fp.bindMethod).toEqual(jasmine.any(Function));
    });

    it('should be curried', () => {
      expect(fp.bindMethod(fp.identity)).toEqual(jasmine.any(Function));
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
      expect(fp.invokeMethod(fp.identity)).toEqual(jasmine.any(Function));
    });

    it('should return a function that is bound and invoke that function', () => {
      const indexOfB = fp.invokeMethod('indexOf', ['b']);
      expect(indexOfB('abc')).toBe(1);
    });
  });

  describe('has an invokeMethodN method', () => {
    it('should exist on fp', () => {
      expect(fp.invokeMethodN)
        .toEqual(jasmine.any(Function));
    });

    it('should be curried', () => {
      expect(fp.invokeMethodN(_, _, _))
        .toEqual(jasmine.any(Function));
    });

    it('should return a function that is bound and invoke that function', () => {
      const indexOf = fp.invokeMethodN(1, 'indexOf', 'abc');
      expect(indexOf('b')).toBe(1);
    });

    it('should compose nicely with flow', () => {
      const tests = ['', 'routes', 'lib', 'middleware', 'validators']
        .map(fp.flow(
          (p) => new RegExp(`${p}/[\\w-_]+\\.js$`),
          fp.invokeMethodN(1, 'test')
        ));

      const paths = [
        'path/foo.elm',
        'routes/some-route.js',
        'middleware/middle-ware.js',
        'bar/baz.coffee'
      ]
        .filter(fp.anyPass(tests));

      expect(paths).toEqual([
        'routes/some-route.js',
        'middleware/middle-ware.js'
      ]);
    });
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

    it('should throw an error if the keys are not an Array', () => {
      expect(() => {
        fp.zipObject({ key: 'val' }, 'test'.split(''));
      })
        .toThrowError(TypeError, 'zipObject keys must be an Array. Got: Object');
    });

    it('should throw an error if the values are not an Array', () => {
      expect(() => {
        fp.zipObject('abc'.split(''), { key: 'val' });
      })
        .toThrowError(TypeError, 'zipObject values must be an Array. Got: Object');
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

    it('should work with a non-array', () => {
      const gt15 = fp.some(x => x > 15);
      expect(gt15(16)).toEqual(true);
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

    it('should work with a non-array', () => {
      const gt15 = fp.every(x => x > 15);
      expect(gt15(16)).toEqual(true);
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
      expect(fp.head([1, 2, 3])).toBe(1);
    });

    it('should return undefined if array is empty', () => {
      expect(fp.head([])).toBe(undefined);
    });

    it('should work with a string', () => {
      expect(fp.head('foo')).toBe('f');
    });

    it('should return undefined when called with an empty string', () => {
      expect(fp.head('')).toBe(undefined);
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
    var spy;

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
      var once;

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

    it('should be curried', () => {
      expect(fp.either(fp.__)).toEqual(jasmine.any(Function));
    });

    describe('chaining', () => {
      var spy1, spy2, chain;

      beforeEach(() => {
        spy1 = jasmine.createSpy('spy1').and.callFake(fp.identity);
        spy2 = jasmine.createSpy('spy2').and.callFake(fp.identity);
        chain = fp.flow.apply(null, fp.map(fp.either, [spy1, spy2]));
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
      var spy, result;

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
      var spy, result;

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

  describe('has a maybe method', () => {
    it('should exist on fp', () => {
      expect(fp.maybe).toEqual(jasmine.any(Function));
    });

    it('should be curried', () => {
      expect(fp.maybe(fp.__, fp.__)).toEqual(jasmine.any(Function));
    });

    describe('null handling', () => {
      var spy;

      beforeEach(() => {
        spy = jasmine.createSpy('spy').and.callFake(x => x + 1);
      });

      it('should not invoke with a null token', () => {
        fp.maybe(spy, null);

        expect(spy).not.toHaveBeenCalled();
      });

      it('should return the result of the the invocation', () => {
        const result = [1, 2, null]
          .map(fp.maybe(spy));

        expect(result).toEqual([2, 3, null]);
      });
    });
  });

  describe('has an unsafe method', () => {
    it('should exist on fp', () => {
      expect(fp.unsafe).toEqual(jasmine.any(Function));
    });

    it('should be curried', () => {
      expect(fp.unsafe(fp.__)).toEqual(jasmine.any(Function));
    });

    describe('error handling', () => {
      var spy1, spy2, chain;

      beforeEach(() => {
        spy1 = jasmine.createSpy('spy1').and.callFake(fp.identity);
        spy2 = jasmine.createSpy('spy2').and.callFake(fp.identity);
        chain = fp.flow.apply(null, fp.map(fp.unsafe, [spy1, spy2]));
      });

      it('should call spy1', () => {
        chain(new Error('boom!'));
        expect(spy1).toHaveBeenCalledOnceWith(new Error('boom!'));
      });

      it('should call spy2', () => {
        chain(new Error('boom!'));
        expect(spy2).toHaveBeenCalledOnceWith(new Error('boom!'));
      });

      it('should pass errors', () => {
        expect(chain(new Error('boom!'))).toEqual(new Error('boom!'));
      });
    });

    describe('non-error handling', () => {
      var spy, result;

      beforeEach(() => {
        spy = jasmine.createSpy('spy').and.callFake(fp.identity);

        result = fp.unsafe(spy, 'foo');
      });

      it('should treat non-errors as a right', () => {
        expect(result).toBe('foo');
      });

      it('should not call fn', () => {
        expect(spy).not.toHaveBeenCalled();
      });
    });
  });

  describe('has a tail method', () => {
    it('should exist on fp', () => {
      expect(fp.tail).toEqual(jasmine.any(Function));
    });

    it('should pull the last item from a list', () => {
      const items = [1, 2, 3];
      expect(fp.tail(items)).toEqual(3);
    });

    it('should return undefined if array is empty', () => {
      expect(fp.tail([])).toBe(undefined);
    });

    it('should work with a string', () => {
      expect(fp.tail('foo')).toBe('o');
    });

    it('should return undefined when called with an empty string', () => {
      expect(fp.tail('')).toBe(undefined);
    });
  });

  describe('has a tap method', () => {
    var spy, result;
    beforeEach(() => {
      spy = jasmine.createSpy('spy');
      result = fp.flow(fp.tap(spy), fp.invokeMethod('split', [',']))('1,2,3');
    });

    it('should exist on fp', () => {
      expect(fp.tap).toEqual(jasmine.any(Function));
    });

    it('should be curried', () => {
      expect(fp.tap(fp.__, spy)).toEqual(jasmine.any(Function));
    });

    it('should invoke the specified function with specified args', () => {
      expect(spy).toHaveBeenCalledOnceWith('1,2,3');
    });

    it('should carry the input through the tap', () => {
      expect(result).toEqual(['1', '2', '3']);
    });
  });

  describe('has an mapFn method', () => {
    var spy1, spy2, spy3, args, result;

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

    it('should be curried', () => {
      expect(fp.mapFn(fp.__, [spy1])).toEqual(jasmine.any(Function));
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
    var adder;
    beforeEach(() => {
      adder = fp.chainL((a, b) => {
        return a + b;
      });
    });

    it('should exist on fp', () => {
      expect(fp.chainL).toEqual(jasmine.any(Function));
    });

    it('should be curried', () => {
      expect(fp.chainL(_)).toEqual(jasmine.any(Function));
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

  describe('has a wrapArgs method', () => {
    it('should exist on fp', () => {
      expect(fp.wrapArgs).toEqual(jasmine.any(Function));
    });

    it('should invoke spy with an array of all arguments that were passed to the flow', () => {
      const spy = jasmine.createSpy('spy');
      fp.wrapArgs(fp.flow(spy))(1, 2, 3);
      expect(spy).toHaveBeenCalledWith([1, 2, 3]);
    });
  });

  describe('xProd', () => {
    it('should exist on fp', () => {
      expect(fp.xProd).toEqual(jasmine.any(Function));
    });

    it('should return the cross product of two arrays', () => {
      expect(fp.xProd([1, 2], [3, 4]))
        .toEqual([[1, 3], [1, 4], [2, 3], [2, 4]]);
    });
  });

  describe('flip', () => {
    it('should exist on fp', () => {
      expect(fp.flip).toEqual(jasmine.any(Function));
    });

    it('should be curried', () => {
      expect(fp.flip(fp.__, fp.__)).toEqual(jasmine.any(Function));
    });

    it('should return a function', () => {
      expect(fp.flip(2, fp.identity)).toEqual(jasmine.any(Function));
    });

    it('should curry the returned function', () => {
      const flipper = fp.flip(2, fp.identity);
      expect(flipper(fp.__, fp.__))
        .toEqual(jasmine.any(Function));
    });

    it('should reverse args', () => {
      const spy = jasmine.createSpy('spy');
      fp.flip(4, spy)('d', 'c', 'b', 'a');

      expect(spy).toHaveBeenCalledOnceWith('a', 'b', 'c', 'd');
    });
  });

  describe('anyPass', () => {
    var passes;

    beforeEach(() => {
      const gt = fp.curry(2, (x, y) => y > x);

      passes = fp.anyPass([gt(9), gt(4), gt(5)]);
    });

    it('should exist on fp', () => {
      expect(fp.anyPass).toEqual(jasmine.any(Function));
    });

    it('should be curried', () => {
      expect(fp.anyPass(fp.__, fp.__)).toEqual(jasmine.any(Function));
    });

    it('should return false if none pass', () => {
      expect(passes(3)).toBe(false);
    });

    it('should return true if any pass', () => {
      expect(passes(7)).toBe(true);
    });
  });

  describe('zipBy', () => {
    var spy1, spy2, spy3, result;
    describe('matching functions with single args', () => {

      beforeEach(() => {
        spy1 = jasmine.createSpy('spy1').and.callFake(fp.identity);
        spy2 = jasmine.createSpy('spy2').and.callFake(fp.identity);
        spy3 = jasmine.createSpy('spy3').and.callFake(fp.identity);
        result = fp.zipBy((a, b) => a(b), [spy1, spy2, spy3], ['dee', 'doo', 'da']);
      });

      it('should exist on fp', () => {
        expect(fp.zipBy).toEqual(jasmine.any(Function));
      });

      it('should be curried', () => {
        expect(fp.zipBy(fp.__, fp.__, fp.__)).toEqual(jasmine.any(Function));
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
        result = fp.zipBy((a, b) => a + b, ['cat', 'space', 'thunder'], ['amaran', ' balls', ' storm']);
      });

      it('should concat the results into a single array', () => {
        expect(result).toEqual(['catamaran', 'space balls', 'thunder storm']);
      });
    });
  });
});
