# classify.js

Turn a string into a class!

The syntax of the format classify.js takes is very easy to learn.

The format goes something like this:

```
ClassName [constructor parameters]
    javascript code for the constructor

property = value

method [method parameters]
    javascript code for the method

...
```

classify.js will ignore anything that it can't understand.

Want a static property or method? Simply prefix the property or method with `+`. What about asynchronous methods? Prefix the method with `=`.

The `=` must go AFTER the `+` for it to work.

Parameters are separated by spaces inside the square brackets.

Here is an example using everything that was mentioned:

```js
classify`
Person [name age]
    this.name = name;
    this.age = age;

sayHi []
    console.log(this.name);

+people = [];

getOlder []
    this.age++;

+=fetchData []
    return fetch("a url");
`;
```

This will produce the following class:

```js
class Person {
    constructor (name age) {
        this.name = name;
        this.age = age;
    }

    sayHi () {
        console.log(this.name);
    }

    static people = [];

    getOlder () {
       this.age++;
    }

    static async fetchData () {
        return fetch("a url");
    }
}
```
