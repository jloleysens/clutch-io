import { isCallExpression } from "typescript";

declare module 'clutch-io' {
  export class Clutch {
    static create(checker: (...args) => string | string[] | null): Clutch;
    registerCommand(fn: Function, type: (...args: any[]) => any): Clutch;
  }
  export function createDispatcher(clutch: Clutch): (fn: string, json: any) => Promise<any>;

  export class Task<V> {
    fork: (...args) => any;
    static of<R>(value: any): Task<R>;
    map<R>(fn: (v: any) => R): Task<R>;
    ap<R>(m: Task<any>): Task<R>;
    flatMap<R>(): Task<R>
    empty(): Task<() => {}>
    toJSON(): {fn: any, args: any};
    static callP<R>(fn: (...args) => R, ...args): Task<R>;
  }

  export class ClutchBaseError extends Error {}
  export class NoCommandFoundError extends Error {}
}