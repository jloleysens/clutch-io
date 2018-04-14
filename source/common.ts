import * as t from 'io-ts';
export type CommandGenerator = (json: any, services: any, logger: any) => IterableIterator<any>;

export interface GenericObject {
  [key: string]: any;
}

export interface CommandInstruction {
  fn: (...args: any[]) => any,
  args: any[],
};

export interface Command {
  fn: GeneratorFunction;
  doc: GenericObject;
}
export interface CommandResult {
  success: boolean;
  doc: GenericObject;
}
export interface Service {
  initialize(): Promise<void>;
}

export interface CommandParams {
  command: string;
  params: {json: any};
}

interface CommandOutput {
  result: any;
}