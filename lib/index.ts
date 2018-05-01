import {DISPATCHER, InternalCommand} from './internal';
import {is} from './utils';
import {NoCommandFoundError, ClutchBaseError, InvalidArgsError} from './errors';

const noop = () => {};

export type CommandGenerator = (...args: any[]) => IterableIterator<any>;

export interface GenericObject {
  [key: string]: any;
}

export * from './errors';

export class Clutch {
  private _internalCommandStore: {[key: string]: InternalCommand} = Object.create(null);

  constructor(public checker: (v) => string | string[] | null){}

  /**
   * @summary create :: Clutch f => a -> f b
   */
  static create(checker: (v) => any = noop) {
    return new Clutch(checker);
  }

  /**
   * @summary registerCommand :: Clutch f => f a ~> (f, v) -> f b
   */
  registerCommand(fn: CommandGenerator, validator: (...args) => any) {
    this._internalCommandStore[fn.name] = {fn, validator};
    return this;
  }

  /**
   * @summary listCommands :: Clutch f => f a ~> () -> a
   */
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
  function dispatch(fn: Function | string, ...args: any[]): Promise<any> {
    let it: Generator, _t = new Task((outerReject, outerResolve) => {
      const _fn = clutch.getCommand(is.string(fn) ? fn : (fn as any).name);
      const errors = clutch.checker(_fn.validator(...args));
      if (errors != null && errors.length) {
        outerReject(new InvalidArgsError(is.array(errors) ? (errors as any).join(', ') : errors));
      } else {
        it = _fn.fn.call(null, ...args);
        next();
      }

      function next(r?: any, isError?: boolean) {
        let result: IteratorResult<any>;
        if (isError) {
          outerReject(r);
          return;
        } else {
          result = it.next(r);
        }
        if (!result.done) {
          /* Mechanism of recursion */
          io(result.value, next);
        } else {
          outerResolve(result.value);
        }
      }
    });

    return new Promise((res, rej) => {
      _t.fork(r => {
        rej(r);
      }, res);
    });
  }
  dispatch[DISPATCHER] = true;
  return dispatch;
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

export class Task<V> {
  fork: (...args) => any;

  protected _json: {_fn: (...args) => any, _args: any[]};

  constructor(calc?: (reject: (r) => any, resolve: (s) => void) => any) {
    this.fork = calc;
  }

  /**
   * @summary of:: T f => a -> f a
   */
  static of<R>(value: R) {
    return new Task<R>(
      (rej, res) => {
        res(value);
      }
    );
  }

  /**
   * @summary map:: T f => f a ~> (a -> b) -> f b
   */
  map<R>(fn:(v: any) => R): Task<R> {
    return this.__new<R>(
      (rej, res) => {
        this.fork(
          r => rej(r),
          s => res(fn(s))
        )
      }
    );
  }

  /**
   * @summary ap:: T f => f a ~> f (a -> b) -> f b
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
   * @summary flatMap:: T m => m a ~> (a -> m b) -> m b
   */
  flatMap<R>(f: (...args) => any): Task<R> {
    return this.__new((rej, res) => {
        return this.fork(
          r => rej(r),
          s => f(s).fork(rej, res)
        )
      }
    );
  }

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
    return Task._new(calc, this._json);
  }

  protected static _new<R>(calc: (...args) => any, json) {
    const t = new Task<R>(calc);
    t._json = json;
    return t;
  }

  // Start of util functions
  // These functions also record the initial fn and arg values for testing purposes
  static callP<R>(fn: (...args) => Promise<any>, ...args): Task<R> {
    return Task._new(
      (rej, res) => {
      fn.apply(null, args)
      .then(res)
      .catch(rej);
    },
    {
      fn,
      args,
    })
  }
}