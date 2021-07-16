export class EntityAlreadyExistsException extends Error {
  constructor(entity: any) {
    super(`Entity ${JSON.stringify(entity)} already exists`);
  }
}
