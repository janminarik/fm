import { en, Faker } from "@faker-js/faker";

import { BaseFake } from "./base.fake";

export class AddressFakes extends BaseFake {
  constructor() {
    super();
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
