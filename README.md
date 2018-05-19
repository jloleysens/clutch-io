# Overview

A very simple set of tools for writing server-side functionality based on actions and JSON documents (documents - which need to be validated).

This project is inspired by [redux-saga](https://github.com/redux-saga/redux-saga)'s implementation but strips out the store. Clutch uses state for configuring it's API. After which the focus is on writing pure, functional code.

# Concepts

**Generators**: Are a special kind of function used for making glorious testability given I/O effects. They essentially enable side-stepping effects which then enables you to test your logic the [riteway](https://github.com/ericelliott/riteway). This is also where the lib gets its name from; in a manual transmission car you can run the engine without it's intended side-effects (the wheels turning) if you've pushed the clutch in. Generators are one way of helping do this for your code. That's about the extent of the metaphor.

**Tasks**: This is a data-type that adheres to the [fantasy-land](https://github.com/fantasyland/fantasy-land) monad specification and is specifically a way of dealing with future values. In this library a specific version of this is shipped with helper methods that make it a bit clearer in the consuming code what is happening.

**Composability**: An FP principle that you can read more about [here](https://medium.com/javascript-scene/the-rise-and-fall-and-rise-of-functional-programming-composable-software-c2d91b424c8c). This lib tries to adhere to this idea and provide a piece of reusable, composable software.

# Code Examples

## TODO

# Additional Notes
At this time this is a living document and subject to frequent or infrequent change.