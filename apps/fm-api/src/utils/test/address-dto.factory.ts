import { AddressFakes } from "@repo/fm-mock-data";

import { AddressDto } from "../../api/adspace/dto";

export function createAddressDtoFake(): AddressDto {
  const fake = new AddressFakes();

  return {
    id: fake.id(),
    street: fake.street(),
    city: fake.city(),
    postalcode: fake.postalCode(),
    country: fake.country(),
    createdAt: fake.createdAt(),
    updatedAt: fake.updatedAt(),
  };
}
