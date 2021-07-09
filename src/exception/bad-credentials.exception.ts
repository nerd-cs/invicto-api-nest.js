export class BadCredentialsException extends Error {
  constructor() {
    super('Bad credentials');
  }
}
