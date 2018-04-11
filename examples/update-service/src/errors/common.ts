import { ValidationError } from "class-validator";

export class InvalidDocumentError extends Error {}

export class InvalidArgsError extends InvalidDocumentError {
  constructor(validationErrors: ValidationError[]) {
    const reduceValidationErrorMessage = vErrs => {
      return vErrs.reduce((acc, ve: ValidationError) => {
        let subAcc = [];

        if (ve.constraints) {
          subAcc = subAcc.concat(Object.keys(ve.constraints).map(k => ve.constraints[k]))
        }

        if (ve.children && ve.children.length) {
          subAcc = subAcc.concat(reduceValidationErrorMessage(ve.children));
        }

        return acc.concat(subAcc);
      }, []);
    };

    super(
      reduceValidationErrorMessage(validationErrors).join(', ')
    );
  }
}
export class AuthenticationFailedError extends Error {
  constructor(message = 'App authentication was unsuccessful') {
    super(message);
  }
}
export class NoDocumentProvided extends Error {}
export class MalformedDocumentError extends Error {}
