import { InvalidArgsError, InvalidDocumentError } from '../errors/common';
import { validate } from 'class-validator';

/**
 * Run sync validation against a given object
 * @param {object} doc An object with values to be checked against the required values
 */
export async function hasRequired<D>(doc: D) {
  if (doc == null) throw new InvalidDocumentError(`Doc was ${doc}, expected form object`);
  const errors = await validate(doc, {validationError: {target: false}});
  if (errors.length > 0) {
    throw new InvalidArgsError(errors);
  }
};
