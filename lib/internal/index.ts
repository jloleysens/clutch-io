import { CommandParams, CommandGenerator } from '../common';

export interface InternalCommand {
    fn: CommandGenerator;
    checker(doc): any;
    logger?: any;
}

export interface InternalCommandInstructions extends CommandParams {
    _mappedCommand?: InternalCommand;
    errors?: Error[];
    logger?: any;
}