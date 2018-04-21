export const is = {
  string: val => typeof val == 'string',
  function: val => typeof val == 'function',
  promise: val => val && is.function(val.then),
  array: val => val && toString.call(val) == '[object Array]',
}
