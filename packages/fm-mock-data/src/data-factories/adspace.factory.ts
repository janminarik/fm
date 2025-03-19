import { AdSpaceFake } from "../fakes/adspace.fakes";
import { AddressFakes } from "../fakes/location.fakes";

export function createAdSpace() {
  const fake = new AdSpaceFake();
  const locationFake = new AddressFakes();

  const adSpace = {
    name: fake.name(),
    type: fake.adSpaceType(),
    status: fake.adSpaceStatus(),
    visibility: fake.adSpaceVisibility(),
    address: {
      street: locationFake.street(),
      city: locationFake.city(),
      postalcode: locationFake.postalCode(),
      country: locationFake.country(),
    },
  };

  return adSpace;
}
