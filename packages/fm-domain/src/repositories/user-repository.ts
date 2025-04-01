import { User } from "../entities";
import { IBaseEntityRepository } from "./base/base-entity-repository";

export type CreateUser = {
  email: string;
  passwordHash: string;
  firstName: string;
  lastName: string;
  userName: string;
  verified?: boolean;
  disabled?: boolean;
};

export interface IUserRepository
  extends IBaseEntityRepository<User, CreateUser> {
  findUserByEmail(email: string): Promise<User | null>;
}

export const USER_REPOSITORY = Symbol("USER_REPOSITORY");
