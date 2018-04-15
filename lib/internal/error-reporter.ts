import * as t from 'io-ts';
import { InvalidJSONDocError } from '../errors';
import { is } from '../utils';

const stringify = (v: any): string => {
  return is.function(v)
    ? v.name
    : JSON.stringify(v);
}

const getContextPath = (c: t.Context) => c.map(({ key, type }) => `${key}: ${type.name}`).join('/');

const generateMessage = (v, e, i) => `${i}) Invalid value ${stringify(v)} supplied to ${getContextPath(e)}`;

const f = (es: t.ValidationError[]) => {
  return es.map((e, idx) => generateMessage(e.value, e.context, idx + 1));
}
const s = (): any => {};

export const reporter = {
    check(validationResult: t.Validation<any>) {
        if (validationResult.isLeft()) {
            throw new InvalidJSONDocError(validationResult.fold(f, s));
        }
    }
};