export const is = {
  string: val => typeof val == 'string',
  function: val => typeof val == 'function',
  promise: val => val && is.function(val.then),
  array: val => val && toString.call(val) == '[object Array]',
  nothing: val => val == null,
  task: val => val && is.function(val.fork),
}

export const pipe = (...fns) => val => fns.reduce((y, x) => x(y), val);
export const compose = (...fns) => pipe.apply(this, fns.reverse());