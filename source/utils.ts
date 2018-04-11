export const is = {
    function: val => typeof val == 'function',
    promise: val => val && is.function(val),
}
