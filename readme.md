## Functional Programming

[![Build Status](https://travis-ci.org/intel-hpdd/fp.svg?branch=master)](https://travis-ci.org/intel-hpdd/fp)

#### Functional Composition, starting à la carte.

A core concept of functional programming is composition. [Wikipedia](https://en.wikipedia.org/wiki/Function_composition_(computer_science)) defines function composition as follows:

> In computer science, function composition (not to be confused with object composition) is an act or mechanism to combine simple functions to build more complicated ones.
Like the usual composition of functions in mathematics, the result of each function is passed as the argument of the next, and the result of the last one is the result of the whole.

So, composition is a mechanism to assemble simple reusable behaviors into more complex ones via functions. Let's examine this with an example:

```
function add1 (x) {
  return x + 1;
}

function times2 (x) {
  return x * 2;
}

function minus3 (x) {
  return x - 3;
}
```

Here we have just defined 3 unary functions. Being unary (only taking one argument) is a key concept of functional composition. We can now assemble these functions to create mathematical expressions using `+`, `*`, and `-`:

```
  add1(times2(minus3(4))) // 3
```

This expression is the same as doing `(((4 - 3) * 2) + 1)`. Notice how the parenthesis mirror the function calls as we work our way inside-out.

If we were to visualize the order of function calls as the number 4 flows through the composition, it would look something like this:

`4 -> minus3 -> times2 -> add1 -> 3`

A key thing to notice here is that function composition flows right to left in code, where we naturally want to express it left to right.
That is, if were to expand the code example above to mirror our code structure we would see:

`3 <- add1 <- times2 <- minus3 <- 4`

Since left to right expressions feel more natural to us who read left to right, we can build a construct that does roughly the same. More on that later.



Let's try another one:

```
  minus3(times2(add1(4)); // 7
```

This expression is the same as `(((4 + 1) * 2) - 3)`. Parenthesis here serve as a visual aid, they may not be necessary depending on the order of operations.

So far we have demonstrated that we can define simple functions and use something called function composition to combine them into slightly more complex expressions.

*However*, this approach comes with lots of baggage. Whenever we want to `add1`, `times2`, or `minus3`, we have to carry around all our small functions and assemble them into a custom expression whenever we get to our call site.

This is a bit like ordering a hamburger from *Insert Fast-Food Chain Here* and getting a pile of ingredients on a tray.
We know that we want a hamburger, and we know how to assemble one, we just wish someone had done it for us and put it in a nice wrapper.

Let's see if there is anything we can do to assemble our functions before hand and save ourselves from a messy tray.

#### Functional Composition, wrapping it up.

Building on our hamburger example, let's say we have a composition we use quite a bit. We need to build an ascii art hamburger for people.
Lot's of people. It would be great if we could just have a function called `hambuger()` that we invoke whenever we need a new one.
However all we have are these three functions: `topBun`, `beefPatty`, `bottomBun`.

```
const topBun = (x) => x + `
        _....----"""----...._
     .-'  o    o    o    o   '-.
    /  o    o    o         o    \\
 __/__o___o_ _ o___ _ o_ o_ _ _o_\\__
`

const beefPatty = (x) => x + `
▩▩▩▩▩▩▩▩▩▩▩▩▩▩▩▩▩▩▩▩▩▩▩▩▩▩▩▩▩▩▩▩▩▩▩▩
▩▩▩▩▩▩▩▩▩▩▩▩▩▩▩▩▩▩▩▩▩▩▩▩▩▩▩▩▩▩▩▩▩▩▩▩
`

const bottomBun = (x) => x + `
  \\~---.__.--~-._.~---~.-~.__.~---/
   \\                             /
    .-._______________________.-'
`
```

When we want to create a hamburger, we have to go to the customer's table with all the ingredients and assemble it there:

`bottomBun(beefPatty(topBun('')))`

What if we could wrap up hambuger creation? Let's start by defining a function:

```
function hamburger (x) {
  return bottomBun(beefPatty(topBun(x)));
}
```

Now, whenever someone wants a hamburger, we can bring the whole thing:

`hamburger('')`

That's much cleaner as we don't have to carry all the small pieces around.
When someone wants a hamburger, we provide them the whole thing in a nice wrapper; itself a function.

However, inside that wrapper, we are still doing the same right to left composition, which is verbose and could be confusing to some.
We also have to create a new wrapper function. Since composition is a key pillar of functional programming, we should have a simple way to express it.

##### Introducting flow

Instead of composing the hamburger inside the wrapper function, what if we simply listed the ingredients and expected a hamburger back? We can introduce a function `flow` that does exactly that. Here's how it looks:

`const hamburger = flow(topBun, burger, bottomBun);`

`flow` can be roughly defined like:

```
function flow () {
    const args = Array.from(arguments);

    return function flowInner (xs) {
      return args.reduce(function reducer (xs, fn) {
        return fn(xs);
      }, xs);
    };
  }
```

Now whenever we want a hamburger we do:

`hamburger('')`

Same as before, but the specification of how to make a hamburger is much more consice; we simply describe our intent with minimal boilerplate.
Let's compare the flow definition to the function definition from before.

```
function hamburger () {
  return bottomBun(beefPatty(topBun()));
}

//vs

const hamburgerFlow = flow(topBun, beefPatty, bottomBun);
```

What are the differences? The most immediate thing is `hamburgerFlow` is one line of code, while `hamburger` is three.
`hamburger` also invokes it's ingredients the same as before. `hamburgerFlow` just lists them, knowing they will be invoked when the time is right.
Finally, `hamburgerFlow` lists ingredients left to right, which for most non-mathematicians is more intuitive to derive meaning from.

Using `flow` makes for something that is concise, compact, and easy to read. It is also declaritive. We are describing the ingredients of a burger, and leaving it up to the wrapper to assemble them for us when we invoke `hamburgerFlow`.

This style of programming is called tacit, or points-free. It is called this because points (arguments) are omitted as we compose functions together. Like anything in programming it has it's proponents and detractors.

We have demonstrated that `flow` can be used to create declarative functional compositions. We can wrap up behaviors without having lots of boilerplate. However, we have another problem. Hamburgers are not as popular as they once were. The kids today are asking for healthier choices and many are requesting veggie burgers instead.

The recipe for a veggie burger calls for the same buns, with a different patty.

```
const veggiePatty = (x) => x + `
▥▥▥▥▥▥▥▥▥▥▥▥▥▥▥▥▥▥▥▥▥▥▥▥▥▥▥▥▥▥▥▥▥▥▥▥
▥▥▥▥▥▥▥▥▥▥▥▥▥▥▥▥▥▥▥▥▥▥▥▥▥▥▥▥▥▥▥▥▥▥▥▥
`
```

Now that were adding new items, we better make a menu as well.

`const menu = {};`

Our menu is a simple object literal. After all, at our humble fast food restaurant, there is no need for much ceremony.

Let's add our items. We'll start by doing so in a pointful style:

```
const menu = {
  hamburger: function hamburger () {
    return bottomBun(beefPatty(topBun()));
  },
  veggieburger: function veggieburger () {
    return bottomBun(veggiePatty(topBun()));
  }
};
```

not bad, but could be more compact. Let's try points-free:

```
const menu = {
  hamburger: flow(topBun, burger, bottomBun),
  veggieburger: flow(topBun, veggie, bottomBun)
};
```

That looks better, but is still not great. We have two assembly lines to create mostly the same product. Also, grilling a `beefPatty` and `veggiePatty` are mostly the same.
Why do we need two different functions to represent them? Is there a way to regain operational efficiency while expanding our menu?

##### A side of curry

Functional composition relies on unary functions, each one passing it's result into the next. Sometimes though, we need to customize our functions.

Going back to the burger example, we would like to grill both `beefPatty`s and `veggiePatty`s. The only difference is the ingredients. Let's create a `grillPatty` function that can take different ingredients:

`const grillPatty = (ingredients, x) => x + ingredients.repeat(36) + '\n' + ingredients.repeat(36);`

Now we have a way to create different patties from ingredients. Let's try it:

```
const veggieMix = '▥';
console.log(grillPatty(veggieMix, ''));
/*
▥▥▥▥▥▥▥▥▥▥▥▥▥▥▥▥▥▥▥▥▥▥▥▥▥▥▥▥▥▥▥▥▥▥▥▥
▥▥▥▥▥▥▥▥▥▥▥▥▥▥▥▥▥▥▥▥▥▥▥▥▥▥▥▥▥▥▥▥▥▥▥▥
*/

const beef = '▩';
console.log(grillPatty(beef, ''));
/*
▩▩▩▩▩▩▩▩▩▩▩▩▩▩▩▩▩▩▩▩▩▩▩▩▩▩▩▩▩▩▩▩▩▩▩▩
▩▩▩▩▩▩▩▩▩▩▩▩▩▩▩▩▩▩▩▩▩▩▩▩▩▩▩▩▩▩▩▩▩▩▩▩
*/
```

Let's try to use these patties in our menu:

```
const beef = '▩';
const veggieMix = '▥';

const menu = {
  hamburger: flow(topBun, grillPatty(beef, ''), bottomBun),
  veggieburger: flow(topBun, grillPatty(veggieMix, ''), bottomBun)
};

hamburger(); //Throws: Uncaught TypeError: fn is not a function
veggieburger(); //Throws: Uncaught TypeError: fn is not a function
```

Uh-oh. We tried to create burgers, but we have a problem.

`grillPatty` is a binary function (it takes two arguments). Because we need to specify the ingredients to `grillPatty` beforehand,
we invoked it out of order in the assembly line. When it's time to compose the patty, there is nothing to call. The patty has already been grilled and is now cold.

What we really want is to define our ingredients, much like we define a burger, but not actually cook it until exactly the right moment.

To do this, we can use a function called `curry`.

[Wikipedia](https://en.wikipedia.org/wiki/Currying) defines curry as follows:

> In mathematics and computer science, currying is the technique of translating the evaluation of a function that takes multiple arguments (or a tuple of arguments)
into evaluating a sequence of functions, each with a single argument. It was introduced by Moses Schönfinkel and later developed by Haskell Curry.

In other words, `curry` takes a function and the number of arguments in that function. It returns back a function that
is not called until all arguments have been provided. Let's look at an example using `grillPatty`:

```
const grillPatty = curry(2, (ingredients, x) => x + ingredients.repeat(36) + '\n' + ingredients.repeat(36));
```

We have now curried the `grillPatty` function. The original function will not be called until it has recieved two arguments.
`curry` is special in that it remembers all arguments that have been provided to it. The arguments can be provided at
different points in time, and `curry` will keep track. Let's see how we can create our patty types using the curried `grillPatty`:

```
const veggieMix = '▥';
const veggiePatty = grillPatty(veggieMix);

const beef = '▩';
const beefPatty = grillPatty(beef);
```

Because `curry` was expecting two args in this case, it returns back a function that is expecting one more arg.
This allows us to save our grilling recipes to variables and delay invocation until an order comes through the assembly line.
Not only does `curry` remember how many args it needs, it also will keep returning a function and not grill the patty until it gets all of it's args:

```
typeof veggiePatty() === 'function'; //true
typeof veggiePatty() === 'function'; //true
typeof veggiePatty() === 'function'; //true
typeof veggiePatty() === 'function'; //true
```

It doesn't matter how many times it gets called, just that it's called with one more arg. This concept is very powerful.
It means we can define specificity of any curried function one arg at a time. Let's add the patties to our menu:

```
const beef = '▩';
const veggieMix = '▥';
const grillPatty = curry(2, (ingredients, x) => x + ingredients.repeat(36) + '\n' + ingredients.repeat(36));

const menu = {
  hamburger: flow(topBun, grillPatty(beef), bottomBun),
  veggieburger: flow(topBun, grillPatty(veggieMix), bottomBun)
};

console.log(menu.hamburger());
/*
        _....----"""----...._
     .-'  o    o    o    o   '-.
    /  o    o    o         o    \
 __/__o___o_ _ o___ _ o_ o_ _ _o_\__
▩▩▩▩▩▩▩▩▩▩▩▩▩▩▩▩▩▩▩▩▩▩▩▩▩▩▩▩▩▩▩▩▩▩▩▩
▩▩▩▩▩▩▩▩▩▩▩▩▩▩▩▩▩▩▩▩▩▩▩▩▩▩▩▩▩▩▩▩▩▩▩▩
  \~---.__.--~-._.~---~.-~.__.~---/
   \                             /
    .-._______________________.-'
*/
console.log(menu.veggieburger());
/*
        _....----"""----...._
     .-'  o    o    o    o   '-.
    /  o    o    o         o    \
 __/__o___o_ _ o___ _ o_ o_ _ _o_\__
▥▥▥▥▥▥▥▥▥▥▥▥▥▥▥▥▥▥▥▥▥▥▥▥▥▥▥▥▥▥▥▥▥▥▥▥
▥▥▥▥▥▥▥▥▥▥▥▥▥▥▥▥▥▥▥▥▥▥▥▥▥▥▥▥▥▥▥▥▥▥▥▥
  \~---.__.--~-._.~---~.-~.__.~---/
   \                             /
    .-._______________________.-'
*/
```

Delicious.

We are now sharing the same grill, but we still have two assembly lines to create the items.
Since we're using the same buns, why not share the whole line? We can with `curry`. Let's try it:

```
const beef = '▩';
const veggieMix = '▥';
const grillPatty = curry(2, (ingredients, x) => x + ingredients.repeat(36) + '\n' + ingredients.repeat(36));
const assembleBurger = curry(3, flow)(topBun, __, bottomBun);

const menu = {
  hamburger: assembleBurger(grillPatty(beef)),
  veggieburger: assembleBurger(grillPatty(veggieMix))
};

```

We added a new function `assembleBurger`, which itself is curried over `flow`. This means we are expecting a composition with 3 arguments.
We already know we need the same buns, so we specify them to `assembleBurger` before hand. In the middle of the invocation there is `__`. What is that?

`__` is called a placeholder. Placeholders allow you to specify arguments to curried functions while skipping over ones you intend to fill in later.
In this case, we leave the gap, so we can add the instruction for grilling different burgers. This is quite flexible.
We now have the ability to add any new burger we wish just by specifying the ingredients to grill in the assembly line.

Let's try our new assembly line:

```
console.log(menu.hamburger());
/*
        _....----"""----...._
     .-'  o    o    o    o   '-.
    /  o    o    o         o    \
 __/__o___o_ _ o___ _ o_ o_ _ _o_\__
▩▩▩▩▩▩▩▩▩▩▩▩▩▩▩▩▩▩▩▩▩▩▩▩▩▩▩▩▩▩▩▩▩▩▩▩
▩▩▩▩▩▩▩▩▩▩▩▩▩▩▩▩▩▩▩▩▩▩▩▩▩▩▩▩▩▩▩▩▩▩▩▩
  \~---.__.--~-._.~---~.-~.__.~---/
   \                             /
    .-._______________________.-'
*/
console.log(menu.veggieburger());
/*
        _....----"""----...._
     .-'  o    o    o    o   '-.
    /  o    o    o         o    \
 __/__o___o_ _ o___ _ o_ o_ _ _o_\__
▥▥▥▥▥▥▥▥▥▥▥▥▥▥▥▥▥▥▥▥▥▥▥▥▥▥▥▥▥▥▥▥▥▥▥▥
▥▥▥▥▥▥▥▥▥▥▥▥▥▥▥▥▥▥▥▥▥▥▥▥▥▥▥▥▥▥▥▥▥▥▥▥
  \~---.__.--~-._.~---~.-~.__.~---/
   \                             /
    .-._______________________.-'
*/
```

Still delicious.

These functions and more can be found in an internal MFL developed library called [fp](https://github.com/intel-hpdd/fp)


## References

[Mostly Adequeate Guide (Quite good till it goes to Fantasy Land)](https://drboolean.gitbooks.io/mostly-adequate-guide/content/)

[fp (Our in-house JavaScript functional programming library)](https://github.com/intel-hpdd/fp)
