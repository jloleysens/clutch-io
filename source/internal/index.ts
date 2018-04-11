import { Doc, CommandParams } from '../common';

export interface InternalCommand {
    fn: GeneratorFunction;
    docFac: (doc) => Doc;
}

export interface InternalCommandParams extends CommandParams {
    _mappedCommand?: InternalCommand;
    _mappedDocument?: Doc;
    resolve?: any;
    errors?: Error[];
}