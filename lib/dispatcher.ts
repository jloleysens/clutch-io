import { exec } from './exec';
import { Clutch } from './Clutch';
import { CommandParams } from './common';
import { InternalCommandInstructions, InternalCommand } from './internal';
import { reporter } from './internal/error-reporter';

export function createDispatcher(clutch: Clutch) {

  async function dispatch(fn: Function | string, json: any) {
    // TODO: Create a composable function for this
    if (clutch.timestamp) {
      json.created = new Date();
    }
    const _fn = clutch.getCommand(typeof fn == 'string' ? fn : fn.name);
    const vResult = _fn.checker(json);
    reporter.check(vResult);
    const result = await exec(_fn.fn, json, _fn.logger);
    return result;
  }

  return dispatch;
}

