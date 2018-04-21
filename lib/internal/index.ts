import { CommandParams, CommandGenerator } from '../index';

export interface InternalCommand {
    fn: CommandGenerator;
    validator(doc): any;
    logger?: any;
}

export interface InternalCommandInstructions extends CommandParams {
    _mappedCommand?: InternalCommand;
    errors?: Error[];
    logger?: any;
}

export const DISPATCHER = Symbol.for('DISPATCHER');