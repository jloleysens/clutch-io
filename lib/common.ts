export type CommandGenerator = (...args: any[]) => IterableIterator<any>;

export interface GenericObject {
  [key: string]: any;
}

export interface CommandInstruction {
  fn: (...args: any[]) => any,
  args: any[],
};

export interface CommandResult {
  success: boolean;
  result?: GenericObject;
}
export interface CommandParams {
  fn: string;
  params: {json: any};
}

interface CommandOutput {
  result: any;
}