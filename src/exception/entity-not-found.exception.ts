export class EntityNotFoundException extends Error {
  constructor(entity: any) {
    super(`Entity ${JSON.stringify(entity)} not found`);
  }
}
