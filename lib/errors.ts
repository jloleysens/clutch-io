export class ClutchBaseError extends Error {
  constructor(message = 'ClutchBaseError') {
    super(message);
  }
}

export class InvalidArgsError extends ClutchBaseError {
  constructor(message) {
    super(message);
  }
}

export class NoCommandFoundError extends ClutchBaseError {
  constructor(name) {
    super(`Command: "${name}" not found.`)
  }
}