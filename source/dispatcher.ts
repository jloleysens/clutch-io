import { exec } from './exec';
import { Clutch } from './Clutch';
import { CommandParams, Command } from './common';
import { InternalCommandInstructions, InternalCommand, createInternalCommand } from './internal';
import { ThrowReporter } from 'io-ts/lib/ThrowReporter';

export function createDispatcher(clutch: Clutch) {

  async function dispatch(fn, json) {
    const m: InternalCommandInstructions = createInternalCommand(fn, json);
    m._mappedCommand = clutch.getCommand(m.command);
    const vResult = m._mappedCommand.checker(json);
    ThrowReporter.report(vResult);
    const result = await exec(m._mappedCommand.fn, json, clutch.getServiceBroker());
    return result;
  }

  return dispatch;
}

