import { Faker } from "@faker-js/faker";
import { v4 as uuid4 } from "uuid";

export abstract class BaseFake {
  protected faker: Faker;

  id(): string {
    return uuid4();
  }

  createdAt(): Date {
    return this.faker.date.past({ years: 2 });
  }

  updatedAt(): Date {
    return this.faker.date.past({ years: 1 });
  }
}
