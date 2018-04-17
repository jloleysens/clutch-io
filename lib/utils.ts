export const is = {
  function: val => typeof val == 'function',
  promise: val => val && is.function(val.then),
}

const infiniObject = new Proxy({}, {get() {
  return infiniObject;
}});
