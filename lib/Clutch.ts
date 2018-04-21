import {CommandGenerator} from './common';
import {InternalCommand, DISPATCHER} from './internal';
import {LIFT} from './symbols';
import {is} from './utils';

import { NoCommandFoundError, ClutchBaseError } from './errors';

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