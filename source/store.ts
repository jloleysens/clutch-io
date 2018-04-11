import { CommandParams, Service, Command, Doc, Constructor, documentFactory } from './common';
import { InternalCommand } from './internal';

export class Store {
  private _internalCommandStore: {[key: string]: InternalCommand} = Object.create(null);
  private _internalServiceStore: {[key: string]: Service} = Object.create(null);

  registerService<S extends Service>(name: string, object: S) {
    this._internalServiceStore[name + 'Service'] = object;
    return this;
  }

  registerCommand<C extends InternalCommand, D extends Constructor<Doc>>(name: string, fn: GeneratorFunction, doc: D) {
    this._internalCommandStore[name + 'Command'] = {fn, docFac: documentFactory(doc)};
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
    const serviceNames = Object.keys(this._internalServiceStore);
    for (const sn of serviceNames) {
      await this._internalServiceStore[sn].initialize();
    }
  }
}

export function createStore() {
  return new Store();
}