import { CommandParams, CommandGenerator } from '../common';

export const createInternalCommandInstructions = (fn, json) => ({fn: `${fn.name}`, params: {json}});

export interface InternalCommand {
    fn: CommandGenerator;
    checker(doc): any;
    logger?: any;
}

export interface InternalCommandInstructions extends CommandParams {
    _mappedCommand?: InternalCommand;
    errors?: Error[];
}