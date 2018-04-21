
declare module 'clutch-io' {
  export class Clutch {
    static create(checker: (v) => string | string[] | null): Clutch;
    registerCommand(fn: Function, type: (...args: any[]) => any): Clutch;
  }
  export function createDispatcher(clutch: Clutch): (fn: string, json: any) => Promise<any>;
  export function lift(fn: any, ...args: any[]): void;

  export class ClutchBaseError extends Error {}
  export class NoCommandFoundError extends Error {}
  export class NoJSONDocError extends Error {}
}