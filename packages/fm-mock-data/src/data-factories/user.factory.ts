import { UserFakes } from "../fakes/user.fakes";

const TEST_DEFAULT_PASSWORD = "H3slo123456*";

export function createUserPayload() {
  const fakes = new UserFakes();

  return {
    email: fakes.email(),
    password: TEST_DEFAULT_PASSWORD,
    userName: fakes.userName(),
    firstName: fakes.firstName(),
    lastName: fakes.lastName(),
  };
}
