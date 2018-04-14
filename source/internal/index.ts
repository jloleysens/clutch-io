import { CommandParams, CommandGenerator } from '../common';

export const createInternalCommand = (fn, json) => ({command: `${fn.name}Command`, params: {json}});

export interface InternalCommand {
    fn: CommandGenerator;
    checker(doc): any;
}

export interface InternalCommandInstructions extends CommandParams {
    _mappedCommand?: InternalCommand;
    errors?: Error[];
}