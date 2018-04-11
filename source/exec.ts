import { CommandInstruction } from './common';
import { is } from './utils';

function io(instr: CommandInstruction, cb: (r: any, e: boolean) => void) {
  // TODO map to a particular command
  const { args } = instr;
  const result = instr.fn.apply(null, ...args);
  if (is.promise(result)) {
    result.then(cb).catch(err => cb(err, true));
  }
}

export function exec(g: GeneratorFunction, ...args: any[]) {
  if (g.constructor.name == 'GeneratorFunction') throw Error(`Must provide a generator, ${g} is not a generator`);

  const it: Generator = g.apply(null, args);

  return next();

  function next(r?: any, isError?: boolean) {
    let result: IteratorResult<any>;
    if (isError) {
      result = it.throw(r);
    } else {
      result = it.next(r);
    }

    if (!result.done) {
      return io(result.value, next);
    }
    return result.value;
  }
}