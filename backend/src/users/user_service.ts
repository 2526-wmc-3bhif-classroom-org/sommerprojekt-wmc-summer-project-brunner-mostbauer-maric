import { UserRepository } from "./user_repository";

export class UserService {
  private static instance: UserService | null = null;

  public static get Instance() {
    if (this.instance === null)
      this.instance = new UserService(UserRepository.Instance);
    return this.instance;
  }

  private constructor(private UserRepo: UserRepository) {}

}
