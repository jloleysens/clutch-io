import {CommandParams, Service, CommandGenerator} from './common';
import {InternalCommand} from './internal';
import {LIFT} from './symbols';
import {is} from './utils';
import * as t from 'io-ts';

import { NoCommandFoundError } from './errors';

type ServiceStates = 'not started' | 'started'  | 'ready';

export function lift(fn: any, ...args: any[]) {
  return {
    [LIFT]: true,
    fn,
    args
  }
}

interface Settings {
  timestamp: boolean;
}

export class Clutch {
  private _internalCommandStore: {[key: string]: InternalCommand} = Object.create(null);

  static create() {
    return new Clutch();
  }

  registerCommand<C extends InternalCommand>(fn: CommandGenerator, type: t.InterfaceType<any>) {
    this._internalCommandStore[fn.name] = {fn, checker: json => type.decode(json)};
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