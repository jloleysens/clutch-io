export const is = {
  function: val => typeof val == 'function',
  promise: val => val && is.function(val.then),
}

const infiniObject = new Proxy({}, {get() {
  return infiniObject;
}});

export const mockCommandParams = (json) => ({
  json,
  sb: infiniObject,
  logger: {
    trace() {},
    debug() {},
    info() {},
    warn() {},
    error() {},
  }
});