import { en, Faker } from "@faker-js/faker";

export class UserFakes {
  private faker: Faker;

  constructor() {
    this.faker = new Faker({ locale: [en] });
  }

  public email(): string {
    return this.faker.internet.email();
  }

  public firstName(): string {
    return this.faker.person.firstName();
  }

  public lastName(): string {
    return this.faker.person.lastName();
  }

  public userName(): string {
    return this.faker.internet.username();
  }
}
