import { exec } from './exec';
import { Clutch } from './Clutch';
import { CommandParams } from './common';
import { InternalCommandInstructions, InternalCommand, createInternalCommandInstructions } from './internal';
import { ThrowReporter } from 'io-ts/lib/ThrowReporter';

export function createDispatcher(clutch: Clutch) {

  async function dispatch(fn, json) {
    const ci: InternalCommandInstructions = createInternalCommandInstructions(fn, json);
    if (clutch.timestamp) {
      ci.params.json.created = new Date();
    }
    ci._mappedCommand = clutch.getCommand(ci.fn);
    const vResult = ci._mappedCommand.checker(json);
    ThrowReporter.report(vResult);
    const result = await exec(ci._mappedCommand.fn, json, clutch.getServiceBroker());
    return result;
  }

  return dispatch;
}

