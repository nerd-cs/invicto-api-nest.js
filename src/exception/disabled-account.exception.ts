export class DisabledAccountException extends Error {
  constructor() {
    super('This account is disabled');
  }
}
