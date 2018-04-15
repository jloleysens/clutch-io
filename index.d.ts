declare module 'clutch-io' {
  export class Clutch {
    static create(): Clutch;
  }
  export function createDispatcher(clutch: Clutch): () => void;
  export function lift(fn: any, ...args: any[]): void;
  export function mockCommandParams(json: any): {logger: any, json: any, sb: any};
  export type ServiceBroker = {[key: string]: {initialize(): Promise<void>, [key: string]: any}}
}