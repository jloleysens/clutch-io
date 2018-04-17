# Overview

A very simple set of tools for writing server-side functionality based on actions and documents (documents - which need to be validated).

This project is inspired and draws from [redux-saga](https://github.com/redux-saga/redux-saga)'s implementation but strips out the store and replaces it with a class against which commands can be registered that ultimately forms the API of your server/service/bot/whatever else you are building.

The reasoning is that front-end logic in JS/TS has implemented some extremely interesting mechanisms that show a lot of value for the backend. An interesting [gist](https://gist.github.com/wmertens/a408e15a08301081ebad) expresses some of this thinking.

# Concepts

**Generators**: Are a special kind of function are used for making glorious testability of functions with I/O side-effects by essentially side-stepping them and enabling you to test your logic the [riteway](https://github.com/ericelliott/riteway).

**Command**: A set of instructions that probably contains some I/O effects. In `clutch-io`, like in `redux-saga`, commands are implemented using generators, or constructs that implement the iterator interface.

**Dispatcher**: This is a function that closes over some state, i.e., your collection of commands, and then takes calls to it as signals that it has to execute a command inside of the Command Interpreter Environment™† ([here](./lib/exec.ts))

**Composability**: This is an FP principle that you can read more about [here](https://medium.com/javascript-scene/the-rise-and-fall-and-rise-of-functional-programming-composable-software-c2d91b424c8c). This lib tries to adhere to that and provide a piece of reusable, composable software to, ultimately, make the devs life easier.

† Ironic use of ™

# Additional Notes
At this time this is a living document and subject to frequent or infrequent change.