import { AdSpaceFake } from "@repo/fm-mock-data";

import { createAddressDtoFake } from "./address-dto.factory";
import { AdSpaceDto } from "../../api/adspace/dto";

export function createAdSpaceDtoFake(): AdSpaceDto {
  const fake = new AdSpaceFake();
  return {
    id: fake.id(),
    name: fake.name(),
    type: fake.adSpaceType(),
    visibility: fake.adSpaceVisibility(),
    status: fake.adSpaceStatus(),
    address: createAddressDtoFake(),
    createdAt: fake.createdAt(),
    updatedAt: fake.updatedAt(),
  };
}
