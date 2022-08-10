export abstract class ControllerError<Context> extends Error {
  abstract code: string;
  context: Context;

  constructor(context: Context) {
    super();

    this.context = context;

    Object.setPrototypeOf(this, ControllerError.prototype);
  }
}

export class ValidationError extends ControllerError<{ errors: unknown[] }> {
  code = 'validation-error';
}

export class AuthenticationError extends ControllerError<void> {
  code = 'authentication-error';
}

export class ExistingEntityError extends ControllerError<{
  entity: string;
  keys: string[];
}> {
  code = 'existing-entity-error';
}

export class MissingEntityError extends ControllerError<{
  entity: string;
  keys: string[];
}> {
  code = 'missing-entity-error';
}

export class UnknownError extends ControllerError<void> {
  code = 'unknown-error';
}
