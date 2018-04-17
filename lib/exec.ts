import { CommandInstruction, CommandResult, CommandGenerator } from './common';
import { is } from './utils';

async function io(instr: CommandInstruction, cb: (r: any, e?: boolean) => CommandResult) {
  // TODO map to a particular command
  const { args, fn } = instr;
  const inter = fn.call(null, ...args);
  if (is.promise(inter)) {
    try {
      const result = await inter;
      return cb(result);
    } catch (e) {
      return cb(e, true);
    }
  } else {
    return inter;
  }
}

export async function exec(g: CommandGenerator, ...args: any[]): Promise<CommandResult> {
  const it: Generator = g.apply(null, args);
  return next();
  async function next(r?: any, isError?: boolean) {
    let result: IteratorResult<any>;
    if (isError) {
      result = it.throw(r);
    } else {
      result = it.next(r);
    }
    if (!result.done) {
      /* Mechanism of recursion */
      return await io(result.value, next);
    }
    return result.value;
  }
}