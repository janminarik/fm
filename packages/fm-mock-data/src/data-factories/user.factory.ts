import { User } from "@repo/fm-domain";
import { v4 as uuid4 } from "uuid";

import { UserFakes } from "../fakes/user.fakes";

export const TEST_DEFAULT_USER = "jozef@mak.sk";
export const TEST_DEFAULT_PASSWORD = "H3slo123456*";

export function createUserPayloadFake() {
  const fakes = new UserFakes();

  return {
    email: fakes.email(),
    password: TEST_DEFAULT_PASSWORD,
    userName: fakes.userName(),
    firstName: fakes.firstName(),
    lastName: fakes.lastName(),
  };
}

export interface CreateUserProps {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  userName: string;
  verified?: boolean;
  disabled?: boolean;
}

export function createUserDbFake(): CreateUserProps {
  const fakes = new UserFakes();
  return {
    email: fakes.email(),
    password: TEST_DEFAULT_PASSWORD,
    userName: fakes.userName(),
    firstName: fakes.firstName(),
    lastName: fakes.lastName(),
  };
}

export function createUserFake(id?: string): User {
  const fakes = new UserFakes();

  return new User({
    id: id ?? uuid4(),
    createdAt: fakes.createdAt(),
    updatedAt: fakes.updatedAt(),
    email: fakes.email(),
    passwordHash: TEST_DEFAULT_PASSWORD,
    firstName: fakes.firstName(),
    lastName: fakes.lastName(),
  });
}
