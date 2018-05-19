import {is, noop} from './utils';
import {NoCommandFoundError, ClutchBaseError, InvalidArgsError} from './errors';

export type TaskGenerator = (...args: any[]) => IterableIterator<any>;

export interface GenericObject {
  [key: string]: any;
}

export * from './errors';

export class Task<V> {
  fork: (...args) => any;

  protected _json: {_fn: (...args) => any, _args: any[]};

  constructor(calc: (reject: (r) => any, resolve: (s) => void) => any) {
    this.fork = calc;
  }

  /**
   * @summary of:: Task f => a -> f a
   */
  static of<V>(value: V) {
    return new Task<V>(
      (rej, res) => {
        res(value);
      }
    );
  }

  /**
   * @summary map:: Task f => f a ~> (a -> b) -> f b
   */
  map<R>(fn:(v: V) => R): Task<R> {
    return this.__new(
      (rej, res) => {
        this.fork(
          r => rej(r),
          (s: V) => res(fn(s))
        )
      }
    );
  }

  /**
   * @summary ap:: Task f => f a ~> f (a -> b) -> f b
   */
  ap(that: Task<any>) {
    return this.__new((rej, res) => {
        let val, func;
        const sharedResolve = (isThat: boolean) => (x: any) => {
          if (isThat) val = x;
          else func = x;

          if (val && func) {
            return res(func(val));
          }
          return x;
        };
        const sharedReject = (e) => {
          throw e;
        }
        this.fork(sharedReject, sharedResolve(false));
        that.fork(sharedReject, sharedResolve(true));
      }
    );
  }

  /**
   * @summary flatMap:: Task m => m a ~> (a -> m b) -> m b
   */
  flatMap<R>(f: (...args) => Task<R>): Task<R> {
    return this.__new((rej, res) => {
        return this.fork(
          r => rej(r),
          s => f(s).fork(rej, res)
        )
      }
    );
  }

  /**
   * @summary empty :: Task m => () -> m
   */
  empty() {
    return Task.of<any>(noop);
  }

  /**
   * For testing
   */
  toJSON() {
    return this._json;
  }

  protected __new<R>(calc) {
    return Task._new<R>(calc, this._json);
  }

  protected static _new<R>(calc: (...args) => any, json) {
    const t = new Task<R>(calc);
    t._json = json;
    return t;
  }

  // Start of util functions
  // These functions also record the initial fn and arg values for testing purposes
  static callP<R>(fn: (...args) => Promise<any>, ...args): Task<R> {
    return Task._new((rej, res) => {
      fn.apply(null, args)
      .then(res)
      .catch(rej);
    },
    {
      fn,
      args,
    });
  }
}


// Impure
export default class Clutch {
  private _internalAvailableTaskStore: {[key: string]: { fn: TaskGenerator; validator(...args): any; }} = Object.create(null);

  constructor(public checker: (v) => string | string[] | null){}

  static create(checker: (v) => any = noop) {
    return new Clutch(checker);
  }

  registerTask(fn: TaskGenerator, validator: (...args) => any) {
    this._internalAvailableTaskStore[fn.name] = {fn, validator};
    return this;
  }

  listAvailableTasks() {
    return Object.keys(this._internalAvailableTaskStore);
  }

  getTask(fn: string | Function, record: any) {
    const name = is.string(fn) ? fn : (fn as any).name;
    const cmd = this._internalAvailableTaskStore[name];
    if (!cmd) throw new NoCommandFoundError(name);
    return new Task((reject, resolve) => {
      let it: Generator;
      const errors = this.checker(cmd.validator(record));
      if (errors != null && errors.length) {
        reject(new InvalidArgsError(is.array(errors) ? (errors as any).join(', ') : errors));
      } else {
        it = cmd.fn.call(null, record);
        next();
      }

      function next(r?: any, isError?: boolean) {
        let result: IteratorResult<any>;
        if (isError) {
          reject(r);
          return;
        } else {
          result = it.next(r);
        }
        if (!result.done) {
          /* Mechanism of recursion */
          io(result.value, next);
        } else {
          resolve(result.value);
        }
      }
    });
  }
}

function io(value: Task<any>, cb: (r: any, e?: boolean) => any) {
  if (value instanceof Task) {
    value.fork(
      e => cb(e, true),
      s => cb(s),
    )
  } else {
    return value;
  }
}

export { Clutch };