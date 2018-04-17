
declare module 'clutch-io' {
  import * as t from 'io-ts';
  export class Clutch {
    static create(): Clutch;
    registerCommand(fn: Function, type: t.Type<any>): Clutch;
  }
  export function createDispatcher(clutch: Clutch): (fn: string, json: any) => Promise<any>;
  export function lift(fn: any, ...args: any[]): void;

  export class ClutchBaseError extends Error {}
  export class NoCommandFoundError extends Error {}
  export class NoJSONDocError extends Error {}
}