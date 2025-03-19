import { DomainError } from "./domain.error";

export class AdSpaceNotFoundError extends DomainError {
  constructor(message?: string) {
    super(message || "Ad space not found");

    this.name = AdSpaceNotFoundError.name;
  }
}
