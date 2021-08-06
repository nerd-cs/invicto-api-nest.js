export class PendingInvitationException extends Error {
  constructor() {
    super('Email not confirmed');
  }
}
