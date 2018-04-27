import {CommandGenerator} from '../index';

export interface InternalCommand {
  fn: CommandGenerator;
  validator(...args): any;
}

export interface InternalInstruction {

}

export const DISPATCHER = Symbol.for('DISPATCHER');