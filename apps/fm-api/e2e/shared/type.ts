import { AdSpaceVisibility } from "@repo/fm-domain";

// export interface LoginResponse {
//   accessToken: string;
// }

export interface AdSpaceResponse {
  id: string;
  name: string;
  type: string;
  visibility: AdSpaceVisibility;
  address: string;
}
