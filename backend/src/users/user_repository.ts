export class UserRepository {
  private static instance: UserRepository | null = null;

  public static get Instance() {
    if (this.instance === null) this.instance = new UserRepository();
    return this.instance;
  }

  private constructor() {}
}
