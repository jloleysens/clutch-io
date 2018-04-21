import {DISPATCHER, InternalCommand, InternalCommandInstructions} from './internal';
import {LIFT} from './symbols';
import {is} from './utils'
import {NoCommandFoundError, ClutchBaseError, InvalidJSONDocError} from './errors';


export type CommandGenerator = (...args: any[]) => IterableIterator<any>;

export interface GenericObject {
  [key: string]: any;
}

export interface CommandInstruction {
  fn: (...args: any[]) => any,
  args: any[],
};

export interface CommandResult {
  success: boolean;
  result?: GenericObject;
}
export interface CommandParams {
  fn: string;
  params: {json: any};
}

interface CommandOutput {
  result: any;
}


export function lift(fn: any, ...args: any[]) {
  return {
    [LIFT]: true,
    fn,
    args
  }
}

const noop = () => {};

export class Clutch {
  private _internalCommandStore: {[key: string]: InternalCommand} = Object.create(null);
  private _middlewares = [];

  constructor(public checker: (v) => string | string[] | null){}

  static create(checker: (v) => any = noop) {
    return new Clutch(checker);
  }

  use(middlewares: any[]) {
    if (!is.array(middlewares)) throw new ClutchBaseError('Middlewares must be in an array');
    if (!middlewares.every(is.function)) throw new ClutchBaseError('All middlewares must be functions');
    this._middlewares = middlewares;
    if (!middlewares.some(fn => fn[DISPATCHER])) {
      const token = () => {};
      token[DISPATCHER] = true;
      this._middlewares.push(token);
    }
  }

  registerCommand(fn: CommandGenerator, validator: (...args) => any) {
    this._internalCommandStore[fn.name] = {fn, validator};
    return this;
  }

  listCommands() {
    return Object.keys(this._internalCommandStore);
  }

  getCommand<C extends InternalCommand>(fn: string | Function) {
    const name = is.string(fn) ? fn : (fn as any).name;
    const cmd = this._internalCommandStore[name] as C;
    if (!cmd) throw new NoCommandFoundError(name);
    return cmd;
  }
}

export function createDispatcher(clutch: Clutch) {
  async function dispatch(fn: Function | string, ...args: any[]) {
    const _fn = clutch.getCommand(is.string(fn) ? fn : (fn as any).name);
    const errors = clutch.checker(_fn.validator(args[0]));
    if (errors != null && errors.length) {
      throw new InvalidJSONDocError(is.array(errors) ? (errors as any).join(', ') : errors);
    }
    const result = await exec(_fn.fn, ...args);
    return result;
  }
  dispatch[DISPATCHER] = true;
  return dispatch;
}

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
    if (!result.done && result.value[LIFT]) {
      /* Mechanism of recursion */
      return await io(result.value, next);
    }
    return result.value;
  }
}

export * from './errors';