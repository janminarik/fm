import { User } from "../entities";
import { IBaseEntityRepository } from "./base/base-entity-repository";

// export type CreateUser = PartialDeep<User> &
//   Pick<User, "email" | "firstName" | "lastName" | : | "passwordHash">;

export interface IUserRepository extends IBaseEntityRepository<User> {
  // create(user: CreateUser): Promise<User>;
  findUserByEmail(email: string): Promise<User | null>;
}

export const USER_REPOSITORY = Symbol("USER_REPOSITORY");
