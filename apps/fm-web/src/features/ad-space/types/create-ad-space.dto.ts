import { AdSpaceStatus, AdSpaceType, AdSpaceVisibility } from "./common";
import { CreateAddressDto } from "./create-address.dto";

export interface CreateAdSpaceDto {
  address: CreateAddressDto;
  name: string;
  status: AdSpaceStatus;
  type: AdSpaceType;
  visibility: AdSpaceVisibility;
}
