import { CommandParams, Service, CommandGenerator } from './common';
import { InternalCommand } from './internal';
import { LIFT } from './symbols';
import { GenericObject } from './common';
import { provisionLogger } from './provisionLogger';
import * as t from 'io-ts';

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
  private _internalServiceStore: {[key: string]: Service} = Object.create(null);
  private _serviceState: ServiceStates = 'not started';

  constructor(public timestamp: boolean) {}

  static create({timestamp = false}) {
    return new Clutch(timestamp);
  }

  registerService<S extends Service>(name: string, object: S) {
    this._internalServiceStore[name + 'Service'] = object;
    return this;
  }

  registerCommand<C extends InternalCommand>(fn: CommandGenerator, type: t.InterfaceType<any>) {
    this._internalCommandStore[fn.name] = {fn, checker: json => type.decode(json), logger: provisionLogger(fn.name)};
    return this;
  }

  getServiceBroker() {
    return Object.assign({}, this._internalServiceStore);
  }

  listCommands() {
    return Object.keys(this._internalCommandStore);
  }

  getCommand<C extends InternalCommand>(name: string) {
    return this._internalCommandStore[name] as C;
  }

  async initializeServices() {
    if (this._serviceState != 'not started') {
      this._serviceState = 'started';
      const serviceNames = Object.keys(this._internalServiceStore);
      for (const sn of serviceNames) {
        await this._internalServiceStore[sn].initialize();
      }
      this._serviceState = 'ready';
    }
  }
}