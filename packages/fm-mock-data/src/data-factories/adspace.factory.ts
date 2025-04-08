import { AdSpace } from "@repo/fm-domain";

import { AdSpaceFake } from "../fakes/adspace.fakes";
import { AddressFakes } from "../fakes/location.fakes";

export function generateCreateAdSpacePayload() {
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

export function createAdSpaceFake(): AdSpace {
  const fake = new AdSpaceFake();

  const adSpace = new AdSpace({
    id: fake.id(),
    name: fake.name(),
    type: fake.adSpaceType(),
    visibility: fake.adSpaceVisibility(),
    status: fake.adSpaceStatus(),
  });

  return adSpace;
}
