# Overview

A very simple set of tools for writing server-side functionality based on actions and JSON documents (documents - which need to be validated).

This project is inspired and draws from [redux-saga](https://github.com/redux-saga/redux-saga)'s implementation but strips out the store and replaces it with a class against which commands can be registered that ultimately forms the API of your server/service/bot/whatever else you are building.

The reasoning is that typically front-end tech in JS/TS has implemented some extremely interesting mechanisms that show a lot of promise for the backend/Node environemnt. An interesting [gist](https://gist.github.com/wmertens/a408e15a08301081ebad) expresses more of this sentiment.

# Concepts

**Generators**: Are a special kind of function used for making glorious testability given I/O effects. They essentially enable side-stepping effects which then enables you to test your logic the [riteway](https://github.com/ericelliott/riteway). This is also where the lib gets its name from; in a manual transmission car you can run the engine without it's intended side-effects (the wheels turning) if you've pushed the clutch in. Generators are one way of helping do this for your code. That's about the extent of the metaphor.

**Dispatcher**: This is a function that closes over some state, i.e., your collection of commands, and then takes calls to it as signals that it has to execute a command inside of the Command Interpreter Environment™† ([here](./lib/index.ts))

**Tasks**: This is a data-type that adheres to the [fantasy-land](https://github.com/fantasyland/fantasy-land) monad specification and is specifically a way of dealing with future values. In this library a specific version of this is shipped with helper methods that make it a bit clearer in the consuming code what is happening.

**Composability**: An FP principle that you can read more about [here](https://medium.com/javascript-scene/the-rise-and-fall-and-rise-of-functional-programming-composable-software-c2d91b424c8c). This lib tries to adhere to this idea and provide a piece of reusable, composable software.

## Additional concepts

The following are concepts pertaining to implementation details when using `clutch-io` but should not be viewed as the only way to think of the parts in your program.

**Command**: A set of instructions that probably contain some I/O effects. In `clutch-io` (like in `redux-saga`) commands are implemented using generators or constructs that implement the iterator interface and are iterator-like.

**Validation**: Ensuring that what comes in from the outside world is in an acceptable form and taking appropriate action when it is not. In imperative coding style this usually takes the form of nested `if else` statements. `io-ts` is a strongly recommended peer for `clutch-io`. Giving you the tools to keep your validation as declarative as possible. This also makes it easier to reason about and change. More about `io-ts` [here](https://github.com/gcanti/io-ts).

**Documents**: Hashes, objects, good ol' JSON, whatever you choose to call them these are considered the medium for transmitting inputs to commands. As long as it takes the form `{"something": true}` and gets passed into a command it's referred to as a document.

† Ironic use of ™

# Code Examples

## TODO

# Additional Notes
At this time this is a living document and subject to frequent or infrequent change.