export type Constructor<T = {}> = {new(...args: any[]): T};

export interface GenericObject {
  [key: string]: any;
}

export interface CommandInstruction {
  fn: (...args: any[]) => any,
  args: any[],
};

export abstract class Doc {
  static readonly _createdField = 'created';

  toJSON() {
    const createdToString = {};
    createdToString[Doc._createdField] = this[Doc._createdField].toString();
    return Object.assign({}, this, createdToString);
  }

  static fromJSON<T extends Doc>(ctor: Constructor, json: GenericObject): T {
    const instance = Object.create(ctor.prototype);
    return Object.assign(instance, json);
  }

  static createdStamp() {
    const propDesc = {};
    propDesc[Doc._createdField] = new Date();
    return propDesc;
  }
}

export function documentFactory<D extends Constructor<Doc>>(ctor: D) {
  return doc => new ctor(doc);
}

export interface Command {
  fn: GeneratorFunction;
  doc: Doc;
}

export interface Service {
  initialize(): Promise<void>;
}

export interface CommandParams {
  command: string;
  params: {document: any};
}

interface CommandOutput {
  result: any;
}