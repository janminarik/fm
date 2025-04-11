import { AdSpace } from "@repo/fm-domain";

import { AdSpaceFake } from "../fakes/adspace.fakes";
import { AddressFakes } from "../fakes/location.fakes";

export function createAdSpacePayloadFake() {
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

export function updateAdSpacePayloadFake() {
  const fake = new AdSpaceFake();

  const adSpace = {
    name: fake.name(),
    type: fake.adSpaceType(),
    status: fake.adSpaceStatus(),
    visibility: fake.adSpaceVisibility(),
  };

  return adSpace;
}

export function createAdSpaceFake(id?: string, name?: string): AdSpace {
  const fake = new AdSpaceFake();

  const adSpace = new AdSpace({
    id: id ?? fake.id(),
    name: name ?? fake.name(),
    type: fake.adSpaceType(),
    visibility: fake.adSpaceVisibility(),
    status: fake.adSpaceStatus(),
  });

  return adSpace;
}
