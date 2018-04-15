export class ClutchBaseError extends Error {
  constructor(message = 'ClutchBaseError') {
    super(message);
  }
}
export class NoJSONDocError extends ClutchBaseError {
  constructor(message) {
    super(message)
  }
}

export class InvalidJSONDocError extends ClutchBaseError {
  constructor(message) {
    super(message);
  }
}

export class NoCommandFoundError extends ClutchBaseError {
  constructor(name) {
    super(`Command: "${name}" not found.`)
  }
}