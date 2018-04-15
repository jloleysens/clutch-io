export type CommandGenerator = (json: any, services: any, logger: any) => IterableIterator<any>;

export interface GenericObject {
  [key: string]: any;
}

export interface ServiceBroker {
  [key: string]: Service;
}

export interface CommandInstruction {
  fn: (...args: any[]) => any,
  args: any[],
};

export interface CommandResult {
  success: boolean;
  result?: GenericObject;
}
export interface Service {
  initialize(): Promise<void>;
}

export interface CommandParams {
  fn: string;
  params: {json: any};
}

interface CommandOutput {
  result: any;
}