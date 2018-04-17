import { exec } from './exec';
import { Clutch } from './Clutch';
import { CommandParams } from './common';
import { InternalCommandInstructions, InternalCommand } from './internal';
import { reporter } from './internal/error-reporter';

export function createDispatcher(clutch: Clutch) {

  async function dispatch(fn: Function | string, ...args: any[]) {
    const _fn = clutch.getCommand(typeof fn == 'string' ? fn : fn.name);
    // TODO: Make dispatch composable
    // TODO: Create a composable function for this
    if (clutch.timestamp) {
      args[0].created = new Date();
    }
    //
    // TODO: Create a composable function for this
    const vResult = _fn.checker(args[0]);
    reporter.check(vResult);
    //
    const result = await exec(_fn.fn, ...args);
    return result;
  }

  return dispatch;
}

