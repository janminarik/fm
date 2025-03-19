import { en, Faker } from "@faker-js/faker";

export class AddressFakes {
  private faker: Faker;

  constructor() {
    this.faker = new Faker({ locale: [en] });
  }

  street(): string {
    return this.faker.location.streetAddress();
  }

  city(): string {
    return this.faker.location.city();
  }

  postalCode(): string {
    return this.faker.location.zipCode();
  }

  country(): string {
    return this.faker.location.county();
  }
}
