import { Address } from "./address";
import { AdSpaceStatus, AdSpaceType, AdSpaceVisibility } from "./common";

export interface AdSpace {
  address: Address;
  id: string;
  name: string;
  status: AdSpaceStatus;
  type: AdSpaceType;
  visibility: AdSpaceVisibility;
}
