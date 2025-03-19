import { AdSpaceStatus, AdSpaceType, AdSpaceVisibility } from "./common";
import { UpdateAddressDto } from "./update-address.dto";

export interface UpdateAdSpaceDto {
  address?: UpdateAddressDto;
  name?: string;
  status?: AdSpaceStatus;
  type?: AdSpaceType;
  visibility?: AdSpaceVisibility;
}
