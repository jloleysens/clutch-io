import {exec} from './exec';
import {Clutch} from './Clutch';
import {CommandParams} from './common';
import {InternalCommandInstructions, InternalCommand} from './internal';
import {reporter} from './internal/error-reporter';
import {is} from './utils';

export function createDispatcher(clutch: Clutch) {

  async function dispatch(fn: Function | string, ...args: any[]) {
    const _fn = clutch.getCommand(is.string(fn) ? fn : (fn as any).name);
    // TODO: Create a composable function for swapping out validation
    const vResult = _fn.checker(args[0]);
    reporter.check(vResult);
    //
    const result = await exec(_fn.fn, ...args);
    return result;
  }

  return dispatch;
}

