export class ConstraintViolationException extends Error {
  constructor(message: string) {
    super(message);
  }
}
