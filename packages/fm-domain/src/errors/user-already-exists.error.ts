import { DomainError } from "./domain.error";

export class UserAlreadyExistError extends DomainError {
  constructor(message?: string) {
    super(message ?? "User with provided email already exists");
    this.name = UserAlreadyExistError.name;
  }
}
