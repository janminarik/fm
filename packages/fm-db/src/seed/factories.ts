import { Faker } from "@faker-js/faker";
import {
  AdContentType,
  Address,
  AdSpaceStatus,
  AdSpaceType,
  AdSpaceVisibility,
  DigitalContent,
  Maintenance,
  Prisma,
} from "@prisma/client";

export class DataFactory {
  defaultUserPassword: string = "H3slo123456*";

  private countryByLocale = {
    de: "Germany",
    pl: "Poland",
    en: "USA",
  };

  constructor(
    private faker: Faker,
    private locale: string,
  ) {}

  getDefaultUser = (): Prisma.UserCreateInput => {
    const user: Prisma.UserCreateInput = {
      email: "jozef@mak.sk",
      passwordHash: this.defaultUserPassword,
      firstName: "Jozef",
      lastName: "Mak",
      disabled: false,
      verified: false,
    };
    return user;
  };

  createUser = (email?: string, password?: string) => {
    return {
      email: email ?? this.faker.internet.email(),
      password: password ?? this.defaultUserPassword,
      firstName: this.faker.person.firstName(),
      lastName: this.faker.person.lastName(),
      disabled: false,
      verified: false,
    };
  };

  createAddress = (): Omit<Address, "id" | "createdAt" | "updatedAt"> => {
    const address: Omit<Address, "id" | "createdAt" | "updatedAt"> = {
      street: this.faker.location.streetAddress(),
      city: this.faker.location.city(),
      postalcode: this.faker.location.zipCode(),
      //country: this.countryByLocale[this.locale] ?? "en",
      country: "en",
    };

    return address;
  };

  createContent = (): Omit<
    DigitalContent,
    "id" | "createdAt" | "updatedAt" | "adSpaceId"
  > => {
    const contentType = Object.values(AdContentType);

    const content: Omit<
      DigitalContent,
      "id" | "createdAt" | "updatedAt" | "adSpaceId"
    > = {
      type: this.faker.helpers.arrayElement(contentType),
      url: this.faker.internet.url(),
      isActive: this.faker.datatype.boolean(),
    };

    return content;
  };

  createMaintenance = (): Omit<
    Maintenance,
    "id" | "createdAt" | "updatedAt" | "adSpaceId"
  > => {
    const maintenance: Omit<
      Maintenance,
      "id" | "createdAt" | "updatedAt" | "adSpaceId"
    > = {
      description: this.faker.lorem.sentence(),
    };
    return maintenance;
  };

  createAdSpaceWithRelationData = (
    type?: AdSpaceType,
  ): Prisma.AdSpaceCreateInput => {
    const adSpaceType = Object.values(AdSpaceType);
    const adSpaceVisibility = Object.values(AdSpaceVisibility);
    const adSpaceStatus = Object.values(AdSpaceStatus);

    const adSpaceAddress = this.createAddress();

    const adSpace: Prisma.AdSpaceCreateInput = {
      name: `WS-${adSpaceAddress.city.slice(0, 3).toUpperCase()}-${this.faker.number.int(999)}`,
      type: this.faker.helpers.arrayElement(adSpaceType),
      visibility: this.faker.helpers.arrayElement(adSpaceVisibility),
      status: this.faker.helpers.arrayElement(adSpaceStatus),

      address: {
        create: adSpaceAddress,
      },

      contents: {
        create: [
          this.createContent(),
          this.createContent(),
          this.createContent(),
        ],
      },

      maintenance: {
        create: [this.createMaintenance(), this.createMaintenance()],
      },
    };

    if (type) adSpace.type = type;

    return adSpace;
  };

  createAdSpace = (): Omit<Prisma.AdSpaceCreateInput, "address"> => {
    const adSpaceType = Object.values(AdSpaceType);
    const adSpaceVisibility = Object.values(AdSpaceVisibility);
    const adSpaceStatus = Object.values(AdSpaceStatus);

    const adSpaceAddress = this.createAddress();

    const adSpace = {
      name: `WS-${adSpaceAddress.city.slice(0, 3).toUpperCase()}-${this.faker.number.int(999)}`,
      type: this.faker.helpers.arrayElement(adSpaceType),
      visibility: this.faker.helpers.arrayElement(adSpaceVisibility),
      status: this.faker.helpers.arrayElement(adSpaceStatus),
    };

    return adSpace;
  };
}
