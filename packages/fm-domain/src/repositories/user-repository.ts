import { User } from "../entities";
import { IBaseEntityRepository } from "./base/base-entity-repository";

export interface IUserRepository extends IBaseEntityRepository<User> {
  findUserByEmail(email: string): Promise<User>;
}

export const USER_REPOSITORY = Symbol("USER_REPOSITORY");
