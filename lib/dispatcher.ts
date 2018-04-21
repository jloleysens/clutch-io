import {exec} from './exec';
import {Clutch} from './Clutch';
import {is} from './utils';
import {InvalidJSONDocError} from './errors';
import {DISPATCHER} from './internal';

export function createDispatcher(clutch: Clutch) {
  async function dispatch(fn: Function | string, ...args: any[]) {
    const _fn = clutch.getCommand(is.string(fn) ? fn : (fn as any).name);
    const errors = clutch.checker(_fn.validator(args[0]));
    if (errors != null && errors.length) {
      throw new InvalidJSONDocError(is.array(errors) ? (errors as any).join(', ') : errors);
    }
    const result = await exec(_fn.fn, ...args);
    return result;
  }
  dispatch[DISPATCHER] = true;
  return dispatch;
}

